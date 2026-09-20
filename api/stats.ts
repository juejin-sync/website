/**
 * 文章摆渡 (ArtFerry) 私有数据中心汇总接口
 * 带有密码口令鉴权，只有站长能查看
 * 支持总览、日走势、渠道来源、浏览器分布、热门文档与实时活动流
 */

export const config = {
  runtime: 'edge'
}

function getRecentDates(days = 14): string[] {
  const dates: string[] = []
  const now = new Date()
  const bjNow = new Date(now.getTime() + (8 * 60 + now.getTimezoneOffset()) * 60000)

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(bjNow)
    d.setDate(d.getDate() - i)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    dates.push(`${y}-${m}-${day}`)
  }
  return dates
}

function parseHashResult(res: any): Record<string, any> {
  if (!res) return {}
  if (Array.isArray(res)) {
    const obj: Record<string, any> = {}
    for (let i = 0; i < res.length; i += 2) {
      obj[res[i]] = res[i + 1]
    }
    return obj
  }
  if (typeof res === 'object') return res
  return {}
}

async function runRedisPipeline(commands: any[][]): Promise<any[]> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN

  if (!redisUrl || !redisToken) {
    return []
  }

  try {
    const res = await fetch(`${redisUrl}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${redisToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commands)
    })
    if (!res.ok) return []
    const json = await res.json()
    return Array.isArray(json) ? json.map(item => item.result) : []
  } catch (err) {
    console.error('Redis fetch error:', err)
    return []
  }
}

export default async function handler(req: Request) {
  // CORS 预检
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Stats-Key'
      }
    })
  }

  const url = new URL(req.url)
  const clientKey =
    req.headers.get('x-stats-key') ||
    req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
    url.searchParams.get('key') ||
    ''

  const expectedKey = process.env.STATS_SECRET_KEY || 'REMOVED_LEGACY_SECRET'

  // 口令验证
  if (!clientKey || clientKey.trim() !== expectedKey.trim()) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: '口令不正确或未授权，只有管理员可查看。'
      }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const isConfigured = Boolean(redisUrl)
  const recentDates = getRecentDates(14)

  if (!isConfigured) {
    return new Response(
      JSON.stringify({
        ok: true,
        isConfigured: false,
        total: { pv: 0, uv: 0, downloads: 0 },
        today: { pv: 0, uv: 0, downloads: 0 },
        daily: recentDates.map(date => ({ date, pv: 0, uv: 0, downloads: 0 })),
        assets: {},
        channels: {},
        browsers: {},
        pages: {},
        events: []
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }

  // 批量构造查询
  const today = recentDates[recentDates.length - 1]
  const commands: any[][] = [
    ['HGETALL', 'artferry:stats'],
    ['PFCOUNT', 'artferry:uv_hll:total'],
    ['HGETALL', `artferry:daily:${today}`],
    ['PFCOUNT', `artferry:uv_hll:${today}`],
    ['HGETALL', 'artferry:assets']
  ]

  // 查询最近 14 天各天 PV/UV/DL
  for (const date of recentDates) {
    commands.push(['HGETALL', `artferry:daily:${date}`])
    commands.push(['PFCOUNT', `artferry:uv_hll:${date}`])
  }

  // 查询渠道、浏览器、活动事件流
  commands.push(['HGETALL', 'artferry:channels'])
  commands.push(['HGETALL', 'artferry:browsers'])
  commands.push(['LRANGE', 'artferry:events', 0, 29])

  const results = await runRedisPipeline(commands)

  // 1. 解析总览
  const rawTotalStats = parseHashResult(results[0])
  const totalPv = Number(rawTotalStats.pv_total || 0)
  const totalDownloads = Number(rawTotalStats.download_total || 0)
  const totalUv = Number(results[1] || 0)

  // 2. 解析今日
  const rawTodayStats = parseHashResult(results[2])
  const todayPv = Number(rawTodayStats.pv || 0)
  const todayDownloads = Number(rawTodayStats.download || 0)
  const todayUv = Number(results[3] || 0)

  // 3. 解析资产
  const rawAssets = parseHashResult(results[4])

  // 4. 解析过去 14 天序列
  const dailyData: Array<{ date: string; pv: number; uv: number; downloads: number }> = []
  let offset = 5
  for (const date of recentDates) {
    const dayStats = parseHashResult(results[offset])
    const dayUv = Number(results[offset + 1] || 0)
    dailyData.push({
      date,
      pv: Number(dayStats.pv || 0),
      uv: dayUv,
      downloads: Number(dayStats.download || 0)
    })
    offset += 2
  }

  // 5. 解析扩展受众数据
  const rawChannels = parseHashResult(results[offset++])
  const rawBrowsers = parseHashResult(results[offset++])
  const rawEventsList = results[offset] || []
  const parsedEvents = Array.isArray(rawEventsList)
    ? rawEventsList
        .map((item: any) => {
          try {
            return typeof item === 'string' ? JSON.parse(item) : item
          } catch {
            return null
          }
        })
        .filter(Boolean)
    : []

  return new Response(
    JSON.stringify({
      ok: true,
      isConfigured: true,
      total: {
        pv: totalPv,
        uv: totalUv,
        downloads: totalDownloads
      },
      today: {
        pv: todayPv,
        uv: todayUv,
        downloads: todayDownloads
      },
      daily: dailyData,
      assets: rawAssets,
      channels: rawChannels,
      browsers: rawBrowsers,
      events: parsedEvents
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  )
}
