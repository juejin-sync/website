/**
 * 文章摆渡 (ArtFerry) 前端无感埋点探针
 * - 自动记录匿名访客标识 (localStorage: artferry_vid)
 * - 支持 PV (页面浏览) 与 Download (离线包下载) 上报
 * - 智能防抖防刷，静默失败不影响用户任何使用体验
 */

const STORAGE_KEY_VID = 'artferry_vid'
const LAST_PV_KEY = 'artferry_last_pv'

// 获取或生成匿名访客指纹
export function getVisitorId(): string {
  if (typeof window === 'undefined') return ''
  try {
    let vid = localStorage.getItem(STORAGE_KEY_VID)
    if (!vid) {
      vid = 'v_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
      localStorage.setItem(STORAGE_KEY_VID, vid)
    }
    return vid
  } catch {
    return 'v_anon'
  }
}

// 静默发送埋点信号
async function sendBeaconSignal(payload: Record<string, any>): Promise<void> {
  if (typeof window === 'undefined') return
  try {
    const body = JSON.stringify({
      ...payload,
      timestamp: Date.now(),
      referrer: document.referrer || '',
      userAgent: navigator.userAgent
    })

    // 优先使用 navigator.sendBeacon
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' })
      const ok = navigator.sendBeacon('/api/track', blob)
      if (ok) return
    }

    // 回退至 fetch keepalive
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true
    })
  } catch {
    // 忽略任何网络或跨域异常，确保用户体验零影响
  }
}

/**
 * 上报 PV (页面浏览)
 */
export function trackPageView(path?: string): void {
  if (typeof window === 'undefined') return
  const currentPath = path || window.location.pathname

  // 10秒内重复访问同一路径不重复记 PV，防止频繁刷新刷量
  try {
    const lastRecord = sessionStorage.getItem(LAST_PV_KEY)
    if (lastRecord) {
      const { path: lastPath, time } = JSON.parse(lastRecord)
      if (lastPath === currentPath && Date.now() - time < 10000) {
        return
      }
    }
    sessionStorage.setItem(
      LAST_PV_KEY,
      JSON.stringify({ path: currentPath, time: Date.now() })
    )
  } catch {
    // ignore
  }

  sendBeaconSignal({
    event: 'pv',
    path: currentPath,
    vid: getVisitorId()
  })
}

/**
 * 上报下载离线包事件
 */
export function trackDownload(assetName?: string): void {
  if (typeof window === 'undefined') return

  sendBeaconSignal({
    event: 'download',
    asset: assetName || 'article-ferry-latest.zip',
    path: window.location.pathname,
    vid: getVisitorId()
  })
}
