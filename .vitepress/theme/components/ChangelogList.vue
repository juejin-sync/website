<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface ReleaseAsset {
  name: string
  size: string
  downloadUrl: string
}

interface ReleaseItem {
  tagName: string
  name: string
  date: string
  body: string
  htmlUrl: string
  asset: ReleaseAsset | null
}

const CACHE_KEY = 'artferry_changelog_releases'
const CACHE_TTL_MS = 15 * 60 * 1000 // 15 分钟缓存

// 预置兜底数据（保障弱网、离线、SSG 阶段 0 延时渲染）
const fallbackReleases: ReleaseItem[] = [
  {
    tagName: 'v0.6.1',
    name: '🚀 v0.6.1 品牌升级与官网解耦',
    date: '2026-09-17',
    body: `### ✨ 体验与品牌升级
- **全量统一「文章摆渡」官方品牌标识**：采用工业级 1024x1024 超采样与 Lanczos 抗锯齿渲染，Chrome 扩展管理页、工具栏图标、视网膜 SVG 及 Favicon 全面升级为「一叶轻舟破浪 ⛵」专属舰徽。
- **接入独立官方网站与文档中心**：关于卡片、README 与官网统一接入极简生产域名 [artferry.vercel.app](https://artferry.vercel.app)，支持站内离线包免梯一键直下。

### 🛠️ 工程与解耦优化
- **架构纯粹化解耦**：官方网站独立上线至专用仓库 [Xxcool/artferry](https://github.com/Xxcool/artferry)，扩展主仓库取消 \`docs/\` 索引跟踪并通过 \`.gitignore\` 忽略草稿。
- **README 缓存彻底治理**：图片引用调整为相对路径，杜绝 GitHub Camo CDN 代理对历史图片的历史陈旧缓存。`,
    htmlUrl: 'https://github.com/Xxcool/juejin-csdn-extension/releases/tag/v0.6.1',
    asset: {
      name: 'article-ferry-v0.6.1.zip',
      size: '约 68 KB',
      downloadUrl: 'https://github.com/Xxcool/juejin-csdn-extension/releases/download/v0.6.1/article-ferry-v0.6.1.zip'
    }
  },
  {
    tagName: 'v0.6.0',
    name: '🚀 v0.6.0 智能专栏与 Dry-run 预演',
    date: '2026-09-17',
    body: `### ✨ 新增特性
- **CSDN 分类专栏动态拉取**：设置页默认分类输入框支持从当前登录账号实时拉取个人专栏列表，无需再手动翻查分类名。
- **正文摘要自动生成**：优先使用掘金作者手填摘要，缺失时从正文自动提取前 100 字纯文本写入 CSDN 摘要。
- **掘金首发声明注入**：同步时在正文末尾追加「本文首发于掘金」引用声明。
- **长耗时任务 Chrome 原生系统通知**：任务耗时 ≥ 10 秒或外链图片 ≥ 3 张时播报结果，点击通知直达 CSDN 草稿页。
- **同步前 Dry-run 排版预演**：任务卡片新增「预演」按钮，静态分析字数、分类命中与外链图片数，提前弹窗展示风险清单。
- **掘金图片无水印直链提取**：转存前剔除掘金 CDN 水印参数获取原始高清图。

### 🛠️ 缺陷修复与自愈
- **修复 CSDN 侧草稿被删除后任务永久卡死**：遇到 400「该文章不存在」时自动降级为新建草稿并更新映射。
- **修复成功系统通知永不触发**：任务保存成功后构建通知对象时显式标记 saved 状态。`,
    htmlUrl: 'https://github.com/Xxcool/juejin-csdn-extension/releases/tag/v0.6.0',
    asset: {
      name: 'article-ferry-v0.6.0.zip',
      size: '约 67 KB',
      downloadUrl: 'https://github.com/Xxcool/juejin-csdn-extension/releases/download/v0.6.0/article-ferry-v0.6.0.zip'
    }
  },
  {
    tagName: 'v0.5.3',
    name: '✨ v0.5.3 航道流光与微胶囊轨道',
    date: '2026-09-17',
    body: `### ✨ 新增
- 新增二级 Tab（筛选标签）集成式微胶囊轨道，支持选中态日光白药丸与动态数量角标。
- 新增任务卡片「草稿 ↗」蓝色高光实体渐变按钮与 1px 精细微边框状态徽章。
- 新增进行中任务进度条动态微光航线流光动效（lightShimmer）。

### 🛠️ 修复
- 修复双 Tab 滑块位移多出 2px 偏移的问题，实现两端 1:1 绝对物理对称。
- 修复 CSDN 在线绿点呼吸光晕扩散范围，动效更加轻盈克制。`,
    htmlUrl: 'https://github.com/Xxcool/juejin-csdn-extension/releases/tag/v0.5.3',
    asset: null
  },
  {
    tagName: 'v0.5.2',
    name: '🎨 v0.5.2 旗舰工艺与渡口夜灯',
    date: '2026-09-17',
    body: `### ✨ 新增
- 新增专属「一叶轻舟破浪」摆渡舰徽、CSDN 在线状态呼吸光晕。
- 新增「渡口夜灯」空状态温感插画与清晰实用的 3 步实操指南。

### 🛠️ 修复
- 任务运行态完整展示实时百分比与具体转存进度。
- 扩展版本号通过 chrome.runtime.getManifest() 动态注入，杜绝硬编码漂移。`,
    htmlUrl: 'https://github.com/Xxcool/juejin-csdn-extension/releases/tag/v0.5.2',
    asset: null
  },
  {
    tagName: 'v0.5.1',
    name: '🛡️ v0.5.1 可靠性与安全防御',
    date: '2026-09-16',
    body: `### 🛡️ 可靠性与安全防御
- 新增 CSDN 线上已发布博文状态检测，物理阻断覆盖已发布文章。
- 任务历史 Storage 瘦身，持久化剥离 Markdown 全量正文，根除 10MB 配额风险。
- 后台任务执行引入全局并发闸门（Semaphore 上限 2），杜绝触发平台限流。
- 新增掘金容器语法清洗：:::tip 等容器语法自动转换为标准 Markdown 引用块。`,
    htmlUrl: 'https://github.com/Xxcool/juejin-csdn-extension/releases/tag/v0.5.1',
    asset: null
  },
  {
    tagName: 'v0.5.0',
    name: '🚀 v0.5.0 双 Tab 仪表盘与草稿幂等',
    date: '2026-09-16',
    body: `### ✨ 新增与优化
- 弹窗重构为一体化双 Tab 仪表盘布局，打开即见同步任务与草稿链接。
- 新建文章在点击“确定并发布”时立即创建 CSDN 同步任务，不阻塞掘金发文。
- 历史文章同步支持双身份草稿映射，避免重复生成草稿。
- 支持默认 CSDN 分类，以及“掘金标签 → CSDN 分类”映射。`,
    htmlUrl: 'https://github.com/Xxcool/juejin-csdn-extension/releases/tag/v0.5.0',
    asset: null
  },
  {
    tagName: 'v0.4.1',
    name: '🚀 v0.4.1 自动专栏映射与排版增强',
    date: '2026-09-01',
    body: `### ✨ 优化
- 优化文章排版与分类映射稳定性。
- 完善图片转存异常捕获与重试机制。`,
    htmlUrl: 'https://github.com/Xxcool/juejin-csdn-extension/releases/tag/v0.4.1',
    asset: null
  },
  {
    tagName: 'v0.4.0',
    name: '🚀 v0.4.0 掘金发文自动同步 CSDN',
    date: '2026-09-01',
    body: `### ✨ 核心发布
- 实现掘金发文自动同步至 CSDN 草稿箱核心链路。
- 本地无感图床转存，杜绝外链裂图。`,
    htmlUrl: 'https://github.com/Xxcool/juejin-csdn-extension/releases/tag/v0.4.0',
    asset: null
  },
  {
    tagName: 'v0.3.0',
    name: '🚀 v0.3.0 异步队列与并发控制',
    date: '2026-09-01',
    body: `### ✨ 架构升级
- 引入任务队列调度与自适应重试。
- 优化长文大图后台搬运性能。`,
    htmlUrl: 'https://github.com/Xxcool/juejin-csdn-extension/releases/tag/v0.3.0',
    asset: null
  },
  {
    tagName: 'v0.2.1',
    name: '🚀 v0.2.1 格式清洗与代码围栏修复',
    date: '2026-09-01',
    body: `### 🛠️ 修复
- 修复部分特殊 Markdown 符号与代码高亮解析。`,
    htmlUrl: 'https://github.com/Xxcool/juejin-csdn-extension/releases/tag/v0.2.1',
    asset: null
  },
  {
    tagName: 'v0.2.0',
    name: '🚀 v0.2.0 图片转存引擎重构',
    date: '2026-09-01',
    body: `### ✨ 特性
- 独立端侧图片流水线，自动剔除平台水印。`,
    htmlUrl: 'https://github.com/Xxcool/juejin-csdn-extension/releases/tag/v0.2.0',
    asset: null
  },
  {
    tagName: 'v0.1.1',
    name: '🚀 v0.1.1 鉴权优化与体验修复',
    date: '2026-09-01',
    body: `### 🛠️ 修复
- 修复未登录或登录态过期提示。`,
    htmlUrl: 'https://github.com/Xxcool/juejin-csdn-extension/releases/tag/v0.1.1',
    asset: null
  },
  {
    tagName: 'v0.1.0',
    name: '🎉 v0.1.0 首个公开发行版本',
    date: '2026-08-31',
    body: `### 🎉 首发
- 文章摆渡 Chrome 扩展基础原型诞生。`,
    htmlUrl: 'https://github.com/Xxcool/juejin-csdn-extension/releases/tag/v0.1.0',
    asset: null
  }
]

const releases = ref<ReleaseItem[]>(fallbackReleases)
const isLive = ref(false)
const isLoading = ref(false)

function toAnchorId(tag: string): string {
  if (!tag) return ''
  return tag.toLowerCase().replace(/[^a-z0-9]/g, '-')
}

// 安全 HTML 转义
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// 行内语法解析
function inlineFormat(text: string): string {
  let out = escapeHtml(text)
  out = out.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
  out = out.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  out = out.replace(/\*(.*?)\*/g, '<em>$1</em>')
  out = out.replace(/`([^`]+)`/g, '<code class="cl-code">$1</code>')
  out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="cl-link">$1</a>')
  return out
}

// 块级简易 Markdown 解析器
function renderMarkdown(raw: string): string {
  if (!raw) return ''
  const lines = raw.split('\n')
  const result: string[] = []
  let inUl = false
  let inOl = false

  const closeLists = () => {
    if (inUl) { result.push('</ul>'); inUl = false }
    if (inOl) { result.push('</ol>'); inOl = false }
  }

  for (let line of lines) {
    line = line.trimEnd()
    if (!line.trim()) {
      closeLists()
      continue
    }

    if (/^---{1,}$/.test(line.trim())) {
      closeLists()
      result.push('<hr class="cl-hr" />')
      continue
    }

    if (line.startsWith('### ')) {
      closeLists()
      result.push(`<h4 class="cl-h4">${inlineFormat(line.slice(4))}</h4>`)
      continue
    }
    if (line.startsWith('## ')) {
      closeLists()
      result.push(`<h3 class="cl-h3">${inlineFormat(line.slice(3))}</h3>`)
      continue
    }
    if (line.startsWith('# ')) {
      closeLists()
      result.push(`<h2 class="cl-h2">${inlineFormat(line.slice(2))}</h2>`)
      continue
    }

    const ulMatch = line.match(/^[-*]\s+(.*)$/)
    if (ulMatch) {
      if (inOl) { result.push('</ol>'); inOl = false }
      if (!inUl) { result.push('<ul class="cl-ul">'); inUl = true }
      result.push(`<li>${inlineFormat(ulMatch[1])}</li>`)
      continue
    }

    const olMatch = line.match(/^(\d+)\.\s+(.*)$/)
    if (olMatch) {
      if (inUl) { result.push('</ul>'); inUl = false }
      if (!inOl) { result.push('<ol class="cl-ol">'); inOl = true }
      result.push(`<li>${inlineFormat(olMatch[2])}</li>`)
      continue
    }

    closeLists()
    result.push(`<p class="cl-p">${inlineFormat(line)}</p>`)
  }

  closeLists()
  return result.join('')
}

onMounted(async () => {
  if (typeof window === 'undefined' || !window.fetch) return

  // 1. 优先读取 localStorage 缓存
  try {
    const cachedRaw = localStorage.getItem(CACHE_KEY)
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw)
      if (cached && typeof cached.timestamp === 'number') {
        const isFresh = Date.now() - cached.timestamp < CACHE_TTL_MS
        if (Array.isArray(cached.data) && cached.data.length > 0) {
          releases.value = cached.data
          isLive.value = true
          if (isFresh) return
        }
      }
    }
  } catch {
    // ignore
  }

  // 2. 异步向 GitHub API 请求最新全量 Releases
  isLoading.value = true
  try {
    const res = await fetch('https://api.github.com/repos/Xxcool/juejin-csdn-extension/releases', {
      headers: { Accept: 'application/vnd.github.v3+json' }
    })

    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        const parsed: ReleaseItem[] = data.map((item: any) => {
          let asset: ReleaseAsset | null = null
          if (Array.isArray(item.assets)) {
            const zip = item.assets.find((a: any) => typeof a.name === 'string' && a.name.endsWith('.zip'))
            if (zip) {
              asset = {
                name: zip.name,
                size: zip.size ? `约 ${Math.round(zip.size / 1024)} KB` : '',
                downloadUrl: zip.browser_download_url
              }
            }
          }

          return {
            tagName: item.tag_name || '',
            name: item.name || item.tag_name || '',
            date: item.published_at ? item.published_at.slice(0, 10) : '',
            body: item.body || '',
            htmlUrl: item.html_url || `https://github.com/Xxcool/juejin-csdn-extension/releases/tag/${item.tag_name}`,
            asset
          }
        })

        releases.value = parsed
        isLive.value = true

        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ timestamp: Date.now(), data: parsed })
          )
        } catch {
          // ignore
        }

        setTimeout(scrollToCurrentHash, 60)
      }
    }
  } catch (e) {
    // 弱网或限流静默降级
  } finally {
    isLoading.value = false
  }

  // 挂载后定位已存在的锚点
  setTimeout(scrollToCurrentHash, 100)

  if (typeof window !== 'undefined') {
    window.addEventListener('hashchange', () => {
      setTimeout(scrollToCurrentHash, 20)
    })
  }
})

function scrollToCurrentHash() {
  if (typeof window === 'undefined') return
  const rawHash = window.location.hash.slice(1)
  if (!rawHash) return
  const target = document.getElementById(rawHash) || document.getElementById(toAnchorId(rawHash))
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="cl-container">
    <!-- 时间线卡片列表 -->
    <div class="cl-timeline">
      <div
        v-for="(rel, index) in releases"
        :key="rel.tagName"
        :id="toAnchorId(rel.tagName)"
        class="cl-card"
        :class="{ 'is-latest': index === 0 }"
      >
        <!-- 隐形锚点同时支持 #v0-6-1 与 #v0.6.1 -->
        <span :id="rel.tagName" class="cl-anchor-target" aria-hidden="true"></span>

        <!-- 时间线节点徽标 -->
        <div class="cl-timeline-dot">
          <span v-if="index === 0" class="boat-dot">⛵</span>
          <span v-else class="circle-dot"></span>
        </div>

        <!-- 卡片主体 -->
        <div class="cl-card-inner">
          <!-- 卡片头部 -->
          <div class="cl-card-header">
            <div class="cl-title-row">
              <span class="cl-version-tag">{{ rel.tagName }}</span>
              <span v-if="index === 0" class="cl-latest-pill">最新发布</span>
              <span class="cl-date">📅 {{ rel.date }}</span>
            </div>

            <!-- 下载与查看按钮 -->
            <div class="cl-card-btns">
              <a
                v-if="rel.asset"
                :href="rel.asset.downloadUrl"
                download
                class="cl-btn-dl"
                :title="rel.asset.name"
              >
                <span>⬇️ 下载 ZIP</span>
                <small v-if="rel.asset.size">{{ rel.asset.size }}</small>
              </a>
              <a
                :href="rel.htmlUrl"
                target="_blank"
                rel="noopener"
                class="cl-btn-src"
              >
                <span>Releases ↗</span>
              </a>
            </div>
          </div>

          <!-- 卡片正文 Markdown 内容 -->
          <div class="cl-card-body" v-html="renderMarkdown(rel.body)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cl-container {
  margin: 24px 0 48px;
}

/* 时间线结构 */
.cl-timeline {
  position: relative;
  padding-left: 28px;
}

.cl-timeline::before {
  content: '';
  position: absolute;
  top: 14px;
  bottom: 20px;
  left: 9px;
  width: 2px;
  background: var(--vp-c-divider);
}

/* 卡片容器 */
.cl-card {
  position: relative;
  margin-bottom: 32px;
  scroll-margin-top: 84px;
}

.cl-anchor-target {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

/* 节点图标 */
.cl-timeline-dot {
  position: absolute;
  left: -28px;
  top: 16px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg);
  z-index: 2;
}

.boat-dot {
  font-size: 16px;
  transform: translateY(-2px);
}

.circle-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--vp-c-brand-1);
  background: var(--vp-c-bg);
}

/* 卡片外观 */
.cl-card-inner {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  padding: 20px 24px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.cl-card.is-latest .cl-card-inner {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 20px rgba(29, 125, 250, 0.08);
}

/* 卡片头部 */
.cl-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 16px;
}

.cl-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.cl-version-tag {
  font-family: var(--vp-font-family-mono);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.cl-latest-pill {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--vp-c-brand-1);
  color: #fff;
}

.cl-date {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.cl-card-btns {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cl-btn-dl {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  background: var(--vp-c-brand-1);
  color: #fff !important;
  text-decoration: none !important;
  transition: opacity 0.2s ease;
}

.cl-btn-dl:hover {
  opacity: 0.9;
}

.cl-btn-dl small {
  opacity: 0.85;
  font-weight: 400;
}

.cl-btn-src {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  color: var(--vp-c-text-2) !important;
  border: 1px solid var(--vp-c-divider);
  text-decoration: none !important;
  transition: all 0.2s ease;
}

.cl-btn-src:hover {
  color: var(--vp-c-brand-1) !important;
  border-color: var(--vp-c-brand-1);
}

/* Markdown 正文样式 */
.cl-card-body {
  font-size: 14px;
  line-height: 1.65;
  color: var(--vp-c-text-1);
}

:deep(.cl-h2) {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 16px 0 8px;
}

:deep(.cl-h3) {
  font-size: 0.98rem;
  font-weight: 700;
  margin: 14px 0 6px;
  color: var(--vp-c-text-1);
}

:deep(.cl-h4) {
  font-size: 0.92rem;
  font-weight: 600;
  margin: 12px 0 6px;
  color: var(--vp-c-brand-1);
}

:deep(.cl-ul), :deep(.cl-ol) {
  margin: 6px 0 12px 18px;
  padding: 0;
}

:deep(li) {
  margin: 4px 0;
}

:deep(.cl-p) {
  margin: 6px 0;
}

:deep(.cl-code) {
  font-size: 0.85em;
  font-family: var(--vp-font-family-mono);
  padding: 2px 5px;
  border-radius: 4px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-brand-1);
}

:deep(.cl-link) {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}

:deep(.cl-hr) {
  border: none;
  border-top: 1px dashed var(--vp-c-divider);
  margin: 14px 0;
}

@media (max-width: 640px) {
  .cl-timeline {
    padding-left: 20px;
  }
  .cl-timeline::before {
    left: 7px;
  }
  .cl-timeline-dot {
    left: -20px;
  }
  .cl-card-inner {
    padding: 16px 14px;
  }
  .cl-card-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
