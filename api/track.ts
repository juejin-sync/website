/**
 * 文章摆渡 (ArtFerry) 数据遥测上报 Serverless 接口
 * 接收来自官网的 PV (访问) 与 Download (离线包下载) 信号
 */

export const config = {
  runtime: 'edge' // 使用 Edge Runtime，全球极速响应，冷启动趋近于 0ms
}

function getTodayString(): string {
  const d = new Date()
  // 东八区北京时间
  const bjTime = new Date(d.getTime() + (8 * 60 + d.getTimezoneOffset()) * 60000)
  const y = bjTime.getFullYear()
  const m = String(bjTime.getMonth() + 1).padStart(2, '0')
  const day = String(bjTime.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
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
  // 处理跨域预检
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

    const commands: any[][] = []

    if (event === 'pv') {
      // 1. 累计官网总浏览量 PV
      commands.push(['HINCRBY', 'artferry:stats', 'pv_total', 1])
      // 2. 累计今日 PV
      commands.push(['HINCRBY', `artferry:daily:${today}`, 'pv', 1])
      // 3. HyperLogLog 累计总访客 UV
      commands.push(['PFADD', 'artferry:uv_hll:total', vid])
      // 4. HyperLogLog 累计今日 UV
      commands.push(['PFADD', `artferry:uv_hll:${today}`, vid])
      // 5. 记录今日在日历索引集合中
      commands.push(['SADD', 'artferry:active_dates', today])
    } else if (event === 'download') {
      // 1. 累计官网离线包总下载次数
      commands.push(['HINCRBY', 'artferry:stats', 'download_total', 1])
      // 2. 累计今日下载量
      commands.push(['HINCRBY', `artferry:daily:${today}`, 'download', 1])
      // 3. 记录今日在日历索引集合中
      commands.push(['SADD', 'artferry:active_dates', today])
      // 4. 按资源名记录下载数
      const asset = body.asset || 'article-ferry-latest.zip'
      commands.push(['HINCRBY', 'artferry:assets', asset, 1])
    }

    const saved = await executeRedisCommands(commands)

    return new Response(
      JSON.stringify({
        ok: true,
        recorded: event,
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
