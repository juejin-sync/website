import { ref, onMounted } from 'vue'
import { withBase } from 'vitepress'

export interface ReleaseInfo {
  version: string
  size: string
  downloadUrl: string
  githubUrl: string
  isLatest: boolean
}

const CACHE_KEY = 'artferry_github_release'
const CACHE_TTL_MS = 10 * 60 * 1000 // 10 分钟缓存

// 模块级单例响应式对象，跨页面跳转无需重复请求 GitHub API
const releaseState = ref<ReleaseInfo>({
  version: 'v0.6.1',
  size: '约 68 KB',
  downloadUrl: '',
  githubUrl: 'https://github.com/Xxcool/juejin-csdn-extension/releases/latest',
  isLatest: false
})

let isFetching = false

export function useRelease() {
  const localFallbackUrl = withBase('/downloads/article-ferry-latest.zip')
  
  if (!releaseState.value.downloadUrl) {
    releaseState.value.downloadUrl = localFallbackUrl
  }

  onMounted(async () => {
    if (typeof window === 'undefined' || !window.fetch) return

    // 1. 尝试从 localStorage 读取缓存（加速首屏渲染，防止 GitHub API 限流）
    try {
      const cachedRaw = localStorage.getItem(CACHE_KEY)
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw)
        if (cached && typeof cached.timestamp === 'number') {
          const isFresh = Date.now() - cached.timestamp < CACHE_TTL_MS
          if (cached.data && cached.data.version) {
            Object.assign(releaseState.value, cached.data)
            if (isFresh) {
              return // 缓存未过期，无需发起网络请求
            }
          }
        }
      }
    } catch {
      // 忽略 localStorage 异常（如无痕模式禁存）
    }

    // 2. 避免并发重复请求
    if (isFetching) return
    isFetching = true

    try {
      const res = await fetch('https://api.github.com/repos/Xxcool/juejin-csdn-extension/releases/latest', {
        headers: { Accept: 'application/vnd.github.v3+json' }
      })

      if (res.ok) {
        const data = await res.json()
        if (data.tag_name) {
          const nextVersion = data.tag_name
          const nextGithubUrl = data.html_url || 'https://github.com/Xxcool/juejin-csdn-extension/releases/latest'

          // 寻找 Release 附件中的 zip 包
          const zipAsset = Array.isArray(data.assets)
            ? data.assets.find((a: any) => typeof a.name === 'string' && a.name.endsWith('.zip'))
            : null

          let nextDownloadUrl = localFallbackUrl
          let nextSize = '约 68 KB'

          if (zipAsset) {
            nextDownloadUrl = zipAsset.browser_download_url
            if (zipAsset.size) {
              const sizeInKb = Math.round(zipAsset.size / 1024)
              nextSize = `约 ${sizeInKb} KB`
            }
          }

          const freshData: ReleaseInfo = {
            version: nextVersion,
            size: nextSize,
            downloadUrl: nextDownloadUrl,
            githubUrl: nextGithubUrl,
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
      // 离线或 GitHub API 受限时静默回退，保持本地或已缓存的配置
    } finally {
      isFetching = false
    }
  })

  return {
    release: releaseState,
    localDownloadUrl: localFallbackUrl
  }
}

