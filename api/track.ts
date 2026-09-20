/**
 * 文章摆渡 (ArtFerry) 数据遥测上报 Serverless 接口
 * 接收来自官网的 PV (访问) 与 Download (离线包下载) 信号
 * 包含渠道归因、浏览器识别、页面热度与活动流记录
 */

export const config = {
  runtime: 'edge' // Edge Runtime，全球极速响应
}

function getTodayString(): string {
  const d = new Date()
  const bjTime = new Date(d.getTime() + (8 * 60 + d.getTimezoneOffset()) * 60000)
  const y = bjTime.getFullYear()
  const m = String(bjTime.getMonth() + 1).padStart(2, '0')
  const day = String(bjTime.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function classifyReferrer(referrer: string): string {
  if (!referrer) return '直接输入网址 / 微信分享 / 收藏夹'
  try {
    const url = new URL(referrer)
    const host = url.hostname.toLowerCase()
    if (host.includes('juejin.cn')) return '掘金社区'
    if (host.includes('github.com')) return 'GitHub'
    if (host.includes('google.')) return 'Google 搜索'
    if (host.includes('baidu.com')) return '百度搜索'
    if (host.includes('csdn.net')) return 'CSDN'
    if (host.includes('zhihu.com')) return '知乎'
    if (host.includes('bing.com')) return '必应搜索'
    if (host.includes('v2ex.com')) return 'V2EX'
    if (host.includes('artferry') || host === 'localhost' || host === '127.0.0.1') return '直接输入网址 / 站内浏览'
    return host.replace(/^www\./, '')
  } catch {
    return '其他外链'
  }
}

function classifyBrowser(ua: string): string {
  if (!ua) return '未知浏览器'
  const lower = ua.toLowerCase()
  if (lower.includes('micromessenger')) return '微信客户端'
  if (lower.includes('edg/') || lower.includes('edge/')) return 'Edge'
  if (lower.includes('arc/')) return 'Arc'
  if (lower.includes('brave')) return 'Brave'
  if (lower.includes('360se') || lower.includes('360ee')) return '360 极速'
  if (lower.includes('qqbrowser')) return 'QQ 浏览器'
  if (lower.includes('chrome') && !lower.includes('chromium')) return 'Chrome'
  if (lower.includes('safari') && !lower.includes('chrome')) return 'Safari'
  if (lower.includes('firefox')) return 'Firefox'
  if (lower.includes('chromium')) return 'Chromium 内核'
  return '其他'
}

async function executeRedisCommands(commands: any[][]): Promise<boolean> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN

  if (!redisUrl || !redisToken) {
    return false
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
    return res.ok
  } catch (err) {
    console.error('Redis pipeline error:', err)
    return false
  }
}

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const event = body.event || 'pv'
    const vid = body.vid || 'anon'
    const today = getTodayString()
    const path = body.path || '/'
    const channel = classifyReferrer(body.referrer || '')
    const browser = classifyBrowser(body.userAgent || req.headers.get('user-agent') || '')

    const commands: any[][] = []

    if (event === 'pv') {
      // 1. 累计官网总浏览量 PV 与今日 PV
      commands.push(['HINCRBY', 'artferry:stats', 'pv_total', 1])
      commands.push(['HINCRBY', `artferry:daily:${today}`, 'pv', 1])
      // 2. HyperLogLog 累计访客 UV
      commands.push(['PFADD', 'artferry:uv_hll:total', vid])
      commands.push(['PFADD', `artferry:uv_hll:${today}`, vid])
      // 3. 记录日历索引
      commands.push(['SADD', 'artferry:active_dates', today])
      // 4. 渠道来源归因
      commands.push(['HINCRBY', 'artferry:channels', channel, 1])
      // 5. 浏览器分布
      commands.push(['HINCRBY', 'artferry:browsers', browser, 1])
    } else if (event === 'download') {
      // 1. 累计官网离线包总下载次数与今日下载量
      commands.push(['HINCRBY', 'artferry:stats', 'download_total', 1])
      commands.push(['HINCRBY', `artferry:daily:${today}`, 'download', 1])
      commands.push(['SADD', 'artferry:active_dates', today])
      // 2. 按资源名记录下载数
      const asset = body.asset || 'article-ferry-latest.zip'
      commands.push(['HINCRBY', 'artferry:assets', asset, 1])
      // 3. 浏览器与渠道记录
      commands.push(['HINCRBY', 'artferry:browsers', browser, 1])
      commands.push(['HINCRBY', 'artferry:channels', channel, 1])
    }

    // 记录最新活动流水 (保留最新 30 条)
    const eventItem = JSON.stringify({
      type: event,
      path,
      channel,
      browser,
      asset: body.asset || null,
      time: Date.now()
    })
    commands.push(['LPUSH', 'artferry:events', eventItem])
    commands.push(['LTRIM', 'artferry:events', 0, 29])

    const saved = await executeRedisCommands(commands)

    return new Response(
      JSON.stringify({
        ok: true,
        recorded: event,
        channel,
        browser,
        persisted: saved,
        date: today
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
