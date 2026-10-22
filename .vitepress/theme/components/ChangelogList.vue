<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useData } from 'vitepress'

const { theme } = useData()

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

const CACHE_KEY = 'juejin_sync_changelog_releases'
const CACHE_TTL_MS = 15 * 60 * 1000 // 15 分钟缓存

// 预置兜底数据（保障弱网、离线、SSG 阶段 0 延时渲染）
const fallbackReleases: ReleaseItem[] = [
  {
    tagName: 'v1.4.0',
    name: '🚀 v1.4.0 知乎专栏草稿同步与品牌全面升级',
    date: '2026-10-09',
    body: `### 📌 知乎专栏草稿箱同步
- **新增知乎专栏同步**：全新支持知乎专栏草稿箱同步，支持掘金新文章发布联动同步与历史文章批量/单篇同步。
- **免敏感权限同源 Bridge 架构**：通过注入 zhuanlan.zhihu.com 的同源 Bridge 获取非 HttpOnly 的 _xsrf 凭证与发起安全 API 交互，完全不申请 Chrome 敏感 cookies 权限。
- **Draft.js 高保真排版**：转换适配知乎专栏 Draft.js 编辑器结构，支持行内/块级字面量保护、表格属性保留、公式块支持以及离屏 Mermaid 渲染 PNG 嵌入。
- **图片双轨上传与 Abort 策略**：外链优先通过知乎服务端转存，失败时自动降级为本地二进制上传；正文图片转存失败严格执行 abort 策略，缺图立即终止草稿写入。
- **品牌全面统一**：扩展更名为「掘金同步助手」（juejin-sync），官网全新接入 juejinsync.vercel.app。`,
    htmlUrl: 'https://github.com/juejin-sync/juejin-sync/releases/tag/v1.4.0',
    asset: {
      name: 'juejin-sync-latest.zip',
      size: '约 1.05 MB',
      downloadUrl: 'https://github.com/juejin-sync/juejin-sync/releases/latest/download/juejin-sync-latest.zip'
    }
  },
  {
    tagName: 'v1.3.1',
    name: '🚀 v1.3.1 博客园题图与摘要同步修复',
    date: '2026-10-09',
    body: `### 🛠️ 博客园随笔修复与体验提升
- **封面题图转存修复**：修复博客园随笔题图不接受 WebP 导致草稿保存报错的问题，自动使用 OffscreenCanvas 转为 PNG 后转存。
- **摘要提取与首发声明隔离**：修复无源摘要时自动摘要误混入文末首发声明的问题，在追加声明前提取纯文本摘要。
- **转存去重优化**：封面与正文包含相同图片时优先复用转存结果，避免重复上传。`,
    htmlUrl: 'https://github.com/juejin-sync/juejin-sync/releases/tag/v1.3.1',
    asset: {
      name: 'juejin-sync-v1.3.1.zip',
      size: '约 1.05 MB',
      downloadUrl: 'https://github.com/juejin-sync/juejin-sync/releases/download/v1.3.1/juejin-sync-v1.3.1.zip'
    }
  },
  {
    tagName: 'v1.3.0',
    name: '🚀 v1.3.0 博客园随笔草稿同步与多平台生态',
    date: '2026-10-08',
    body: `### 📌 博客园随笔草稿同步
- **新增博客园草稿同步**：沿用当前 Chrome 浏览器已有登录态，分别校验登录状态、博客开通状态与稳定账号标识。
- **正文图片无损转存**：支持博客园正文图片无损转存、新建与更新草稿、已发布内容覆盖保护、中断恢复与账号隔离。
- **三平台协同调度**：CSDN、微信公众号与博客园三航道并行，支持按需勾选自由组合。`,
    htmlUrl: 'https://github.com/juejin-sync/juejin-sync/releases/tag/v1.3.0',
    asset: {
      name: 'juejin-sync-v1.3.0.zip',
      size: '约 1.05 MB',
      downloadUrl: 'https://github.com/juejin-sync/juejin-sync/releases/download/v1.3.0/juejin-sync-v1.3.0.zip'
    }
  },
  {
    tagName: 'v1.2.0',
    name: '🚀 v1.2.0 Mermaid 图表离屏渲染与正文图片保真',
    date: '2026-09-24',
    body: `### ✨ 图表保真与性能优化
- **Mermaid 图表离屏渲染**：微信同步支持将流程图、时序图等 Mermaid 语法在离屏文档中渲染为高清 PNG 图片并转存为正文配图。
- **渲染容器排队与图表隔离**：多图串行渲染，防止方向不同或多图场景串图。
- **支持 Data URL 转存**：扩展正式构建启用体积压缩与权限优化。`,
    htmlUrl: 'https://github.com/juejin-sync/juejin-sync/releases/tag/v1.2.0',
    asset: {
      name: 'article-ferry-v1.2.0.zip',
      size: '约 105 KB',
      downloadUrl: 'https://github.com/juejin-sync/juejin-sync/releases/download/v1.2.0/article-ferry-v1.2.0.zip'
    }
  },
  {
    tagName: 'v1.1.0',
    name: '🚀 v1.1.0 发布后同步流程与契约时序测试',
    date: '2026-09-20',
    body: `### 📦 发布后同步流程
- **多平台选择嵌入发布表单**：移除新文章编辑器顶部的立即同步按钮，将多平台选择无缝嵌入掘金“发布文章”弹层表单。
- **发布成功后智能消费**：勾选阶段仅记录本次平台选择；只有在发布接口返回业务成功且包含文章标识后才创建同步任务。
- **防止误触发与幂等保护**：发布失败、取消发布、草稿身份不一致或缺少文章标识时不触发同步；同一次发布响应只消费一次。
- **多入口协同**：创作者中心和个人文章列表继续保留手动立即同步入口。
- **快照冻结机制**：发布请求发出时冻结正文、平台选择和公众号身份，关闭面板或修改编辑器不影响已提交请求；发布失败时释放快照并保留选择供重试。
- **全量自动化测试扩充**：新增掘金发布请求、成功响应契约及异步时序回归测试，全量自动化测试增至 100 项。`,
    htmlUrl: 'https://github.com/juejin-sync/juejin-sync/releases/tag/v1.1.0',
    asset: {
      name: 'article-ferry-v1.1.0.zip',
      size: '约 103 KB',
      downloadUrl: 'https://github.com/juejin-sync/juejin-sync/releases/download/v1.1.0/article-ferry-v1.1.0.zip'
    }
  },
  {
    tagName: 'v1.0.0',
    name: '🚀 v1.0.0 微信公众号完整同步与多平台架构',
    date: '2026-09-18',
    body: `### 📌 微信公众号完整同步
- **新增微信公众号网页登录态检测与账号展示**：不申请 \`cookies\` 权限，不保存 Cookie 或上传票据；草稿链接可能包含微信页面 token。
- **新增微信专用 Markdown 编译器**：按微信兼容约束重建标题、段落、列表、引用、代码块、表格与图片排版，并内联关键样式。
- **正文图片全部转存到微信素材库**：源文章封面上传后自动生成 16:9、1:1、3:4 三套裁剪结果并绑定草稿。
- **一键同步多平台**：掘金编辑器、创作者中心和个人文章列表统一使用“同步多平台”按钮，弹窗勾选目标平台后同步。
- **微信和 CSDN 独立任务调度**：独立失败重试、进度、通知与草稿链接，正式版本号升级为 1.0.0。

### 🛠️ 体验与健壮性优化
- 微信任务与草稿映射绑定公众号账号，开始和最终写入前校验账号；未绑定账号的旧草稿不自动覆盖。
- 代码块按微信“插入代码”结构逐行输出，保留空行、缩进与特殊字符，语言使用 Markdown 标注。
- 草稿封面与摘要缓存按草稿隔离；无源封面文章允许同步草稿，发布所需封面由用户在微信后台补充。`,
    htmlUrl: 'https://github.com/juejin-sync/juejin-sync/releases/tag/v1.0.0',
    asset: {
      name: 'article-ferry-v1.0.0.zip',
      size: '约 100 KB',
      downloadUrl: 'https://github.com/juejin-sync/juejin-sync/releases/download/v1.0.0/article-ferry-v1.0.0.zip'
    }
  },
  {
    tagName: 'v0.6.1',
    name: '🚀 v0.6.1 品牌升级与官网解耦',
    date: '2026-09-17',
    body: `### ✨ 体验与品牌升级
- **全量统一「掘金同步助手」官方品牌标识**：采用工业级 1024x1024 超采样与 Lanczos 抗锯齿渲染，Chrome 扩展管理页、工具栏图标、视网膜 SVG 及 Favicon 全面升级为专属舰徽。
- **接入独立官方网站与文档中心**：关于卡片、README 与官网统一接入生产域名 [juejinsync.vercel.app](https://juejinsync.vercel.app)，支持站内离线包免梯一键直下。

### 🛠️ 工程与解耦优化
- **架构纯粹化解耦**：官方网站独立上线至专用仓库 [juejin-sync/juejin-sync](https://github.com/juejin-sync/juejin-sync)，扩展主仓库取消 \`docs/\` 索引跟踪并通过 \`.gitignore\` 忽略草稿。
- **README 缓存彻底治理**：图片引用调整为相对路径，杜绝 GitHub Camo CDN 代理对历史图片的历史陈旧缓存。`,
    htmlUrl: 'https://github.com/juejin-sync/juejin-sync/releases/tag/v0.6.1',
    asset: {
      name: 'article-ferry-v0.6.1.zip',
      size: '约 68 KB',
      downloadUrl: 'https://github.com/juejin-sync/juejin-sync/releases/download/v0.6.1/article-ferry-v0.6.1.zip'
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
    htmlUrl: 'https://github.com/juejin-sync/juejin-sync/releases/tag/v0.6.0',
    asset: {
      name: 'article-ferry-v0.6.0.zip',
      size: '约 67 KB',
      downloadUrl: 'https://github.com/juejin-sync/juejin-sync/releases/download/v0.6.0/article-ferry-v0.6.0.zip'
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
    htmlUrl: 'https://github.com/juejin-sync/juejin-sync/releases/tag/v0.5.3',
    asset: null
  },
  {
    tagName: 'v0.5.2',
    name: '🎨 v0.5.2 旗舰工艺与渡口夜灯',
    date: '2026-09-17',
    body: `### ✨ 新增
- 新增专属「一叶轻舟破浪」专属品牌舰徽、CSDN 在线状态呼吸光晕。
- 新增「渡口夜灯」空状态温感插画与清晰实用的 3 步实操指南。

### 🛠️ 修复
- 任务运行态完整展示实时百分比与具体转存进度。
- 扩展版本号通过 chrome.runtime.getManifest() 动态注入，杜绝硬编码漂移。`,
    htmlUrl: 'https://github.com/juejin-sync/juejin-sync/releases/tag/v0.5.2',
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
    htmlUrl: 'https://github.com/juejin-sync/juejin-sync/releases/tag/v0.5.1',
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
    htmlUrl: 'https://github.com/juejin-sync/juejin-sync/releases/tag/v0.5.0',
    asset: null
  },
  {
    tagName: 'v0.4.1',
    name: '🚀 v0.4.1 自动专栏映射与排版增强',
    date: '2026-09-01',
    body: `### ✨ 优化
- 优化文章排版与分类映射稳定性。
- 完善图片转存异常捕获与重试机制。`,
    htmlUrl: 'https://github.com/juejin-sync/juejin-sync/releases/tag/v0.4.1',
    asset: null
  },
  {
    tagName: 'v0.4.0',
    name: '🚀 v0.4.0 掘金发文自动同步 CSDN',
    date: '2026-09-01',
    body: `### ✨ 核心发布
- 实现掘金发文自动同步至 CSDN 草稿箱核心链路。
- 本地无感图床转存，杜绝外链裂图。`,
    htmlUrl: 'https://github.com/juejin-sync/juejin-sync/releases/tag/v0.4.0',
    asset: null
  },
  {
    tagName: 'v0.3.0',
    name: '🚀 v0.3.0 异步队列与并发控制',
    date: '2026-09-01',
    body: `### ✨ 架构升级
- 引入任务队列调度与自适应重试。
- 优化长文大图后台搬运性能。`,
    htmlUrl: 'https://github.com/juejin-sync/juejin-sync/releases/tag/v0.3.0',
    asset: null
  },
  {
    tagName: 'v0.2.1',
    name: '🚀 v0.2.1 格式清洗与代码围栏修复',
    date: '2026-09-01',
    body: `### 🛠️ 修复
- 修复部分特殊 Markdown 符号与代码高亮解析。`,
    htmlUrl: 'https://github.com/juejin-sync/juejin-sync/releases/tag/v0.2.1',
    asset: null
  },
  {
    tagName: 'v0.2.0',
    name: '🚀 v0.2.0 图片转存引擎重构',
    date: '2026-09-01',
    body: `### ✨ 特性
- 独立端侧图片流水线，自动剔除平台水印。`,
    htmlUrl: 'https://github.com/juejin-sync/juejin-sync/releases/tag/v0.2.0',
    asset: null
  },
  {
    tagName: 'v0.1.1',
    name: '🚀 v0.1.1 鉴权优化与体验修复',
    date: '2026-09-01',
    body: `### 🛠️ 修复
- 修复未登录或登录态过期提示。`,
    htmlUrl: 'https://github.com/juejin-sync/juejin-sync/releases/tag/v0.1.1',
    asset: null
  },
  {
    tagName: 'v0.1.0',
    name: '🎉 v0.1.0 首个公开发行版本',
    date: '2026-08-31',
    body: `### 🎉 首发
- 掘金同步助手 Chrome 扩展基础原型诞生。`,
    htmlUrl: 'https://github.com/juejin-sync/juejin-sync/releases/tag/v0.1.0',
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
          syncSidebar(releases.value)
          if (isFresh) return
        }
      }
    }
  } catch {
    // ignore
  }

  // 初次尝试同步侧边栏（使用当前值）
  syncSidebar(releases.value)

  // 2. 异步向 GitHub API 请求最新全量 Releases
  isLoading.value = true
  try {
    const res = await fetch('https://api.github.com/repos/juejin-sync/juejin-sync/releases', {
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
            htmlUrl: item.html_url || `https://github.com/juejin-sync/juejin-sync/releases/tag/${item.tag_name}`,
            asset
          }
        })

        releases.value = parsed
        isLive.value = true
        syncSidebar(releases.value)

        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ timestamp: Date.now(), data: parsed })
          )
        } catch {
          // ignore
        }

        setTimeout(() => {
          scrollToCurrentHash()
          setupScrollSpy()
        }, 60)
      }
    }
  } catch (e) {
    // 弱网或限流静默降级
  } finally {
    isLoading.value = false
  }

  // 挂载后定位已存在的锚点与启动滚动联动
  setTimeout(() => {
    scrollToCurrentHash()
    setupScrollSpy()
  }, 100)

  if (typeof window !== 'undefined') {
    window.addEventListener('hashchange', onHash)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('hashchange', onHash)
  }
  if (scrollSpyObserver) {
    scrollSpyObserver.disconnect()
    scrollSpyObserver = null
  }
})

function onHash() {
  setTimeout(() => {
    scrollToCurrentHash()
    updateActiveSidebarLink()
  }, 20)
}

function scrollToCurrentHash() {
  if (typeof window === 'undefined') return
  const rawHash = window.location.hash.slice(1)
  if (!rawHash) return
  const target = document.getElementById(rawHash) || document.getElementById(toAnchorId(rawHash))
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' })
  }
}

let scrollSpyObserver: IntersectionObserver | null = null

function updateActiveSidebarLink(currentHash?: string) {
  if (typeof window === 'undefined') return
  const rawHash = currentHash || window.location.hash
  if (!rawHash) return

  const cleanHash = rawHash.startsWith('#') ? rawHash : `#${rawHash}`
  const sidebarNavs = document.querySelectorAll('#VPSidebarNav, .VPSidebar .nav')
  sidebarNavs.forEach((navEl) => {
    const items = navEl.querySelectorAll('.VPSidebarItem.level-1')
    items.forEach((item) => {
      const link = item.querySelector('a')
      if (link) {
        const href = link.getAttribute('href') || ''
        const dataHash = link.getAttribute('data-target-hash') || ''
        if (href.endsWith(cleanHash) || dataHash === cleanHash) {
          item.classList.add('is-active', 'has-active')
        } else {
          item.classList.remove('is-active', 'has-active')
        }
      }
    })
  })
}

function setupScrollSpy() {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return
  if (scrollSpyObserver) {
    scrollSpyObserver.disconnect()
  }

  scrollSpyObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.target.id) {
          updateActiveSidebarLink('#' + entry.target.id)
          break
        }
      }
    },
    {
      rootMargin: '-80px 0px -70% 0px',
      threshold: 0
    }
  )

  const cards = document.querySelectorAll('.cl-card')
  cards.forEach((c) => scrollSpyObserver?.observe(c))
}

function syncSidebar(items: ReleaseItem[]) {
  if (typeof window === 'undefined' || !items?.length) return

  // 1. 尝试内存层更新主题配置（以防上层组件读取）
  try {
    if (theme.value && theme.value.sidebar) {
      theme.value.sidebar['/changelog/'] = [
        {
          text: '更新日志',
          items: items.map((rel, index) => ({
            text: index === 0 ? `${rel.tagName} (最新)` : rel.tagName,
            link: `/changelog/#${toAnchorId(rel.tagName)}`
          }))
        }
      ]
    }
  } catch {
    // ignore
  }

  // 2. 真实 DOM 响应式同步（彻底解决发布新版后左侧静态侧边栏不刷新的问题）
  const doDomSync = () => {
    const sidebarNavs = document.querySelectorAll('#VPSidebarNav, .VPSidebar .nav')
    if (!sidebarNavs.length) return

    sidebarNavs.forEach((navEl) => {
      const itemsContainer = navEl.querySelector('.VPSidebarItem.level-0 .items')
      if (!itemsContainer) return

      const existingItems = Array.from(itemsContainer.querySelectorAll('.VPSidebarItem.level-1'))
      const templateNode = (existingItems[0] || navEl.querySelector('.VPSidebarItem.level-1')) as HTMLElement | null
      if (!templateNode) return

      const topTag = items[0].tagName
      const firstTextEl = templateNode.querySelector('.text')
      const firstText = firstTextEl?.textContent?.trim() || ''

      // 如果第一项已经匹配最新版本并且带有 (最新)，且条目数量一致，说明已经同步完毕
      if (firstText.includes(topTag) && firstText.includes('(最新)') && existingItems.length === items.length) {
        updateActiveSidebarLink()
        return
      }

      // 获取干净模板节点进行克隆
      const cloneSource = templateNode.cloneNode(true) as HTMLElement
      cloneSource.classList.remove('is-active', 'has-active')

      // 清空现有节点并按当前 items 实时重建
      itemsContainer.innerHTML = ''

      items.forEach((rel, index) => {
        const node = cloneSource.cloneNode(true) as HTMLElement
        const isLatest = index === 0
        const anchorId = toAnchorId(rel.tagName)
        const targetHash = `#${anchorId}`
        const targetHref = `/changelog/${targetHash}`

        const linkEl = node.querySelector('a') as HTMLAnchorElement | null
        const textEl = node.querySelector('.text') as HTMLElement | null

        if (linkEl) {
          linkEl.href = targetHref
          linkEl.setAttribute('data-target-hash', targetHash)
          linkEl.onclick = (e) => {
            e.preventDefault()
            history.pushState(null, '', targetHref)
            const target = document.getElementById(anchorId) || document.getElementById(rel.tagName)
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' })
            }
            updateActiveSidebarLink(targetHash)
          }
        }

        if (textEl) {
          textEl.textContent = isLatest ? `${rel.tagName} (最新)` : rel.tagName
        }

        const currentHash = window.location.hash
        if (currentHash === targetHash || (index === 0 && (!currentHash || currentHash === '#'))) {
          node.classList.add('is-active', 'has-active')
        }

        itemsContainer.appendChild(node)
      })
    })

    setupScrollSpy()
  }

  // 立即执行并配合延迟重试，确保任何渲染时序下都精准挂载
  doDomSync()
  setTimeout(doDomSync, 50)
  setTimeout(doDomSync, 250)
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
          <span v-if="index === 0" class="craft-dot-latest">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </span>
          <span v-else class="circle-dot"></span>
        </div>

        <!-- 卡片主体 -->
        <div class="cl-card-inner">
          <!-- 卡片头部 -->
          <div class="cl-card-header">
            <div class="cl-title-row">
              <span class="cl-version-tag">{{ rel.tagName }}</span>
              <span v-if="index === 0" class="cl-latest-pill">最新发布</span>
              <span class="cl-date">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:-2px;margin-right:4px;">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                {{ rel.date }}
              </span>
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
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>下载 ZIP</span>
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

.craft-dot-latest {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: var(--craft-accent-acid);
  color: #171719;
  border: 1.5px solid var(--craft-paper-border);
  border-radius: 4px;
  box-shadow: 1px 1px 0px var(--craft-paper-border);
}

.circle-dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  border: 2px solid var(--craft-paper-border);
  background: var(--vp-c-bg);
}

/* 卡片外观 */
.cl-card-inner {
  background: var(--craft-paper-card);
  border: 2px solid var(--craft-paper-border);
  box-shadow: var(--craft-shadow-sm);
  border-radius: 6px;
  padding: 22px 24px;
  transition: var(--craft-snap);
}

.cl-card.is-latest .cl-card-inner {
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--craft-shadow);
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
  padding: 5px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  background: var(--vp-c-brand-1);
  color: #fff !important;
  border: 1.5px solid var(--craft-paper-border);
  box-shadow: 1.5px 1.5px 0px var(--craft-paper-border);
  text-decoration: none !important;
  transition: var(--craft-snap);
}

.cl-btn-dl:hover {
  transform: translate(-1px, -1px);
  box-shadow: 2.5px 2.5px 0px var(--craft-paper-border);
}

.cl-btn-dl:active {
  transform: translate(1px, 1px);
  box-shadow: 0px 0px 0px var(--craft-paper-border);
}

.cl-btn-dl small {
  opacity: 0.9;
  font-weight: 500;
}

.cl-btn-src {
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-1) !important;
  border: 1.5px solid var(--craft-paper-border);
  box-shadow: 1.5px 1.5px 0px var(--craft-paper-border);
  background: var(--vp-c-bg-soft);
  text-decoration: none !important;
  transition: var(--craft-snap);
}

.cl-btn-src:hover {
  transform: translate(-1px, -1px);
  box-shadow: 2.5px 2.5px 0px var(--craft-paper-border);
}

.cl-btn-src:active {
  transform: translate(1px, 1px);
  box-shadow: 0px 0px 0px var(--craft-paper-border);
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
