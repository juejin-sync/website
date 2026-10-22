import { ref, onMounted } from 'vue'
import { withBase } from 'vitepress'

export interface ReleaseInfo {
  version: string
  headline: string
  size: string
  downloadUrl: string
  githubUrl: string
  repoUrl: string
  isLatest: boolean
}

const CACHE_KEY = 'juejin_sync_github_release_v2'
const CACHE_TTL_MS = 10 * 60 * 1000 // 10 分钟缓存

// 模块级单例响应式对象，默认兜底最新 v1.5.0
const releaseState = ref<ReleaseInfo>({
  version: 'v1.5.0',
  headline: '批量文章分发向导 · 纯本地沙箱执行',
  size: '约 1.05 MB',
  downloadUrl: '',
  githubUrl: 'https://github.com/juejin-sync/juejin-sync/releases/latest',
  repoUrl: 'https://github.com/juejin-sync/juejin-sync',
  isLatest: false
})

let isFetching = false

export function useRelease() {
  const localFallbackUrl = withBase('/downloads/juejin-sync-latest.zip')
  
  if (!releaseState.value.downloadUrl) {
    releaseState.value.downloadUrl = localFallbackUrl
  }

  onMounted(async () => {
    if (typeof window === 'undefined' || !window.fetch) return

    // 1. 尝试从 localStorage 读取缓存
    try {
      const cachedRaw = localStorage.getItem(CACHE_KEY)
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw)
        if (cached && typeof cached.timestamp === 'number') {
          const isFresh = Date.now() - cached.timestamp < CACHE_TTL_MS
          if (cached.data && cached.data.version) {
            Object.assign(releaseState.value, cached.data)
            if (isFresh) {
              return
            }
          }
        }
      }
    } catch {
      // 忽略缓存读取错误
    }

    // 2. 避免并发重复请求
    if (isFetching) return
    isFetching = true

    try {
      const res = await fetch('https://api.github.com/repos/juejin-sync/juejin-sync/releases/latest', {
        headers: { Accept: 'application/vnd.github.v3+json' }
      })

      if (res.ok) {
        const data = await res.json()
        if (data.tag_name) {
          const nextVersion = data.tag_name
          const nextGithubUrl = data.html_url || 'https://github.com/juejin-sync/juejin-sync/releases/latest'

          // 提取 Release 亮点文字
          let nextHeadline = '批量文章分发向导 · 纯本地沙箱执行'
          if (typeof data.body === 'string') {
            // 提取第一个特性高亮点
            const matchFeature = data.body.match(/\*\*(.*?)\*\*/)
            if (matchFeature && matchFeature[1]) {
              nextHeadline = `现已支持${matchFeature[1]} · 纯本地沙箱执行`
            }
          }

          // 寻找 Release 附件中的 zip 包
          const zipAsset = Array.isArray(data.assets)
            ? data.assets.find((a: any) => typeof a.name === 'string' && a.name.endsWith('.zip'))
            : null

          let nextDownloadUrl = localFallbackUrl
          let nextSize = '约 1.05 MB'

          if (zipAsset) {
            nextDownloadUrl = zipAsset.browser_download_url
            if (zipAsset.size) {
              const sizeInKb = Math.round(zipAsset.size / 1024)
              nextSize = `约 ${sizeInKb} KB`
            }
          }

          const freshData: ReleaseInfo = {
            version: nextVersion,
            headline: nextHeadline,
            size: nextSize,
            downloadUrl: nextDownloadUrl,
            githubUrl: nextGithubUrl,
            repoUrl: 'https://github.com/juejin-sync/juejin-sync',
            isLatest: true
          }

          Object.assign(releaseState.value, freshData)

          // 存入缓存
          try {
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ timestamp: Date.now(), data: freshData })
            )
          } catch {
            // 忽略存储失败
          }
        }
      }
    } catch (e) {
      // 离线或弱网静默降级
    } finally {
      isFetching = false
    }
  })

  return {
    release: releaseState
  }
}
