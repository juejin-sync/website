<script setup>
import { ref, computed } from 'vue'
import { withBase } from 'vitepress'
import { useRelease } from '../../useRelease'
import { trackDownload } from '../../tracker'

const { release } = useRelease()

const handleDownload = () => {
  trackDownload(release.value.version ? `juejin-sync-${release.value.version}.zip` : 'juejin-sync-latest.zip')
}

// 模拟状态
const isSimulating = ref(false)
const simulateStep = ref(0) // 0: idle, 1: syncing, 2: success
const activeTab = ref('wechat')

// 4 大平台定义（规范 SVG 矢量图标）
const platforms = [
  {
    id: 'wechat',
    name: '微信公众号',
    color: 'var(--color-wechat)',
    badge: '16:9/1:1/3:4 封面',
    highlight: '代码高亮与内联样式',
    stats: '微信图文草稿已就绪'
  },
  {
    id: 'zhihu',
    name: '知乎专栏',
    color: 'var(--color-zhihu)',
    badge: 'Draft.js 适配',
    highlight: '公式与外链转存',
    stats: '专栏草稿安全落盘'
  },
  {
    id: 'csdn',
    name: 'CSDN 草稿',
    color: 'var(--color-csdn)',
    badge: '专栏分类匹配',
    highlight: '剔除水印无损转存',
    stats: '3 张原图无损落盘'
  },
  {
    id: 'cnblogs',
    name: '博客园随笔',
    color: 'var(--color-cnblogs)',
    badge: '原生 Markdown',
    highlight: '正文图片保真',
    stats: '随笔草稿已生成'
  }
]

// 选中的目标平台（默认全选）
const selectedPlatforms = ref(['wechat', 'zhihu', 'csdn', 'cnblogs'])

const togglePlatform = (id) => {
  if (isSimulating.value) return
  const index = selectedPlatforms.value.indexOf(id)
  if (index > -1) {
    if (selectedPlatforms.value.length > 1) {
      selectedPlatforms.value.splice(index, 1)
    }
  } else {
    selectedPlatforms.value.push(id)
  }
  if (!selectedPlatforms.value.includes(activeTab.value)) {
    activeTab.value = selectedPlatforms.value[0]
  }
}

const activePlatform = computed(() => {
  return platforms.find(p => p.id === activeTab.value) || platforms[0]
})

const startSimulation = () => {
  if (isSimulating.value) return
  isSimulating.value = true
  simulateStep.value = 1

  setTimeout(() => {
    simulateStep.value = 2
    isSimulating.value = false
  }, 1300)
}

const resetSimulation = () => {
  simulateStep.value = 0
}
</script>

<template>
  <section id="simulator" class="hero-section">
    <!-- Top Radial Light Glow -->
    <div class="hero-glow-sphere" aria-hidden="true"></div>

    <div class="hero-container">
      <!-- Left Column: Value Proposition -->
      <div class="hero-content">
        <!-- Release Pill Badge (全面动态响应 GitHub Releases 最新数据) -->
        <a href="/changelog/" class="release-pill">
          <span class="pill-badge">{{ release.version || 'v1.5.0' }}</span>
          <span class="pill-text">{{ release.headline || '批量文章分发向导 · 纯本地沙箱执行' }}</span>
          <svg class="pill-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </a>

        <!-- Headline -->
        <h1 class="hero-title">
          在掘金写完文章，<br />
          <span class="gradient-text">一键流转</span>各大技术社区草稿箱。
        </h1>

        <!-- Subtitle -->
        <p class="hero-subtitle">
          面向掘金创作者的开源 Chrome 扩展：支持微信公众号、知乎专栏、CSDN 与博客园草稿秒级同步。原图无损清洗，自动适配排版，100% 端侧隐私安全。
        </p>

        <!-- CTA Actions -->
        <div class="hero-actions">
          <a :href="release.downloadUrl" download @click="handleDownload" class="btn-primary">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span class="btn-text">
              <strong>下载离线 ZIP 包</strong>
              <small>{{ release.version }} · {{ release.size }}</small>
            </span>
          </a>

          <a href="#quick-install" class="btn-secondary">
            <span>两步极简安装</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </a>

          <a href="https://github.com/juejin-sync/juejin-sync" target="_blank" rel="noopener" class="btn-ghost" title="查看 GitHub 开源仓库">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>GitHub 开源</span>
          </a>
        </div>

        <!-- Metric Badges -->
        <div class="hero-metrics">
          <div class="metric-item">
            <span class="metric-dot"></span>
            <span>4 大平台草稿秒级直达</span>
          </div>
          <div class="metric-item">
            <span class="metric-dot"></span>
            <span>0 后端服务器中转</span>
          </div>
          <div class="metric-item">
            <span class="metric-dot"></span>
            <span>Manifest V3 官方现代规范</span>
          </div>
        </div>
      </div>

      <!-- Right Column: Interactive Pipeline Simulator -->
      <div class="hero-simulator">
        <div class="simulator-window">
          <!-- Window Titlebar -->
          <div class="window-bar">
            <div class="window-traffic-lights">
              <span class="light red"></span>
              <span class="light yellow"></span>
              <span class="light green"></span>
            </div>
            <div class="window-title">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span>juejin.cn/editor/drafts/741892...</span>
            </div>
            <div class="window-ext-badge">
              <span class="ext-pulse"></span>
              <span>juejin-sync {{ release.version || 'v1.5.0' }}</span>
            </div>
          </div>

          <!-- Simulator Interior -->
          <div class="simulator-body">
            <!-- Source Card: Juejin Editor Injected Drawer -->
            <div class="sim-block source-block">
              <div class="block-header">
                <div class="header-tag">
                  <span class="tag-index">01</span>
                  <span class="tag-label">掘金 Markdown 写作源端</span>
                </div>
                <span class="header-status">已自动捕获</span>
              </div>

              <div class="article-meta-card">
                <div class="meta-title">深入剖析 Chrome Extension MV3 架构实战</div>
                <div class="meta-details">
                  <span class="meta-mono">4,200 字</span>
                  <span class="meta-sep">/</span>
                  <span class="meta-mono">3 张高清架构图</span>
                  <span class="meta-sep">/</span>
                  <span class="meta-tag">原图无损直存</span>
                </div>
              </div>

              <!-- Channel Selector (Multi-selection) -->
              <div class="channel-selector">
                <div class="selector-title">
                  <span>选择同步草稿箱渠道：</span>
                  <span class="selector-hint">已勾选 {{ selectedPlatforms.length }} 个平台</span>
                </div>

                <div class="channel-chips">
                  <button
                    v-for="platform in platforms"
                    :key="platform.id"
                    type="button"
                    class="channel-chip"
                    :class="{ 'is-selected': selectedPlatforms.includes(platform.id) }"
                    @click="togglePlatform(platform.id)"
                  >
                    <span class="chip-checkbox">
                      <svg v-if="selectedPlatforms.includes(platform.id)" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span class="chip-name">{{ platform.name }}</span>
                    <span class="chip-feature">{{ platform.badge }}</span>
                  </button>
                </div>
              </div>

              <!-- Action Bar -->
              <div class="sim-actions">
                <button
                  v-if="simulateStep !== 2"
                  type="button"
                  class="btn-simulate"
                  :disabled="isSimulating"
                  @click="startSimulation"
                >
                  <span v-if="!isSimulating" class="btn-inner">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    <span>启动多通道同步模拟</span>
                  </span>
                  <span v-else class="btn-inner">
                    <svg class="spin-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                    </svg>
                    <span>多通道并行流转中...</span>
                  </span>
                </button>

                <button v-else type="button" class="btn-reset" @click="resetSimulation">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="1 4 1 10 7 10"></polyline>
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                  </svg>
                  <span>重新演示</span>
                </button>
              </div>
            </div>

            <!-- Target Card: Multi-platform Drafts Destination -->
            <div class="sim-block target-block" :class="{ 'is-active': simulateStep === 2 }">
              <div class="block-header">
                <div class="header-tag">
                  <span class="tag-index">02</span>
                  <span class="tag-label">目标平台草稿箱入库</span>
                </div>
                <span v-if="simulateStep === 2" class="header-success">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {{ selectedPlatforms.length }} 处草稿就绪
                </span>
                <span v-else class="header-idle">待触发</span>
              </div>

              <!-- Output Panel -->
              <div class="target-panel">
                <div v-if="simulateStep === 2" class="target-content">
                  <div class="target-tabs">
                    <button
                      v-for="platform in platforms.filter(p => selectedPlatforms.includes(p.id))"
                      :key="platform.id"
                      type="button"
                      class="target-tab"
                      :class="{ 'is-active': activeTab === platform.id }"
                      @click="activeTab = platform.id"
                    >
                      <span>{{ platform.name }}</span>
                    </button>
                  </div>

                  <div class="target-card-preview">
                    <div class="preview-header">
                      <span class="preview-badge">{{ activePlatform.stats }}</span>
                      <span class="preview-secure">草稿保护 · 需作者手动发布</span>
                    </div>
                    <div class="preview-body">
                      <div class="preview-feature-item">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{{ activePlatform.highlight }}</span>
                      </div>
                      <div class="preview-feature-item">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Markdown 结构原汁原味，无缝继承</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="target-empty">
                  <div class="empty-icon-wrap">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </div>
                  <span class="empty-text">点击「启动多通道同步模拟」，体验真实草稿箱流转</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  min-height: calc(100vh - var(--vp-nav-height, 64px));
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 32px 0 44px;
  box-sizing: border-box;
  overflow: hidden;
}

.hero-glow-sphere {
  position: absolute;
  top: -120px;
  right: 10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(30, 128, 255, 0.15) 0%, rgba(30, 128, 255, 0.02) 60%, transparent 80%);
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
}

.hero-container {
  width: 100%;
  max-width: 1220px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1.05fr 1.15fr;
  gap: 44px;
  align-items: center;
  position: relative;
  z-index: 1;
}

@media (max-width: 1024px) {
  .hero-section {
    min-height: auto;
    padding: 36px 0 48px;
  }
  .hero-container {
    grid-template-columns: 1fr;
    gap: 36px;
  }
}

/* Value Proposition Column */
.hero-content {
  display: flex;
  flex-direction: column;
}

.release-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  padding: 3px 10px 3px 5px;
  border-radius: 9999px;
  background: var(--bento-card-bg);
  border: 1px solid var(--bento-border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  text-decoration: none !important;
  color: var(--bento-text-title);
  font-size: 0.8rem;
  margin-bottom: 18px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.release-pill:hover {
  border-color: var(--bento-border-hover);
  transform: translateY(-1px);
}

.pill-badge {
  padding: 2px 7px;
  border-radius: 9999px;
  background: var(--vp-c-brand-1);
  color: #FFFFFF;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
}

.pill-text {
  color: var(--bento-text-body);
  font-weight: 500;
}

.pill-arrow {
  color: var(--bento-text-muted);
}

.hero-title {
  font-size: 2.6rem;
  font-weight: 750;
  line-height: 1.18;
  letter-spacing: -0.03em;
  margin: 0 0 16px 0;
  color: var(--bento-text-title);
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 2.1rem;
  }
}

.gradient-text {
  background: linear-gradient(135deg, #1E80FF 0%, #0056CC 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.02rem;
  line-height: 1.6;
  color: var(--bento-text-body);
  margin: 0 0 26px 0;
  max-width: 520px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 26px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 22px;
  border-radius: var(--bento-radius-sm);
  background: linear-gradient(135deg, #1E80FF 0%, #0056CC 100%);
  color: #FFFFFF !important;
  text-decoration: none !important;
  box-shadow: 0 6px 18px rgba(30, 128, 255, 0.32);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(30, 128, 255, 0.42);
}

.btn-text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}

.btn-text strong {
  font-size: 0.92rem;
  font-weight: 600;
}

.btn-text small {
  font-size: 0.72rem;
  opacity: 0.88;
  font-family: var(--font-mono);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: var(--bento-radius-sm);
  background: var(--bento-card-bg);
  border: 1px solid var(--bento-border);
  color: var(--bento-text-title) !important;
  font-size: 0.88rem;
  font-weight: 600;
  text-decoration: none !important;
  box-shadow: var(--bento-shadow);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-secondary:hover {
  border-color: var(--bento-border-hover);
  transform: translateY(-2px);
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: var(--bento-radius-sm);
  background: transparent;
  color: var(--bento-text-body) !important;
  font-size: 0.88rem;
  font-weight: 500;
  text-decoration: none !important;
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  color: var(--vp-c-brand-1) !important;
  background: var(--vp-c-brand-soft);
}

.hero-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--bento-border);
}

.metric-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 0.8rem;
  color: var(--bento-text-muted);
  font-weight: 500;
}

.metric-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
}

/* Simulator Window (Modern Developer Tool) */
.hero-simulator {
  position: relative;
}

.simulator-window {
  background: var(--bento-card-bg);
  border: 1px solid var(--bento-border);
  border-radius: var(--bento-radius);
  box-shadow: var(--bento-shadow-hover);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.window-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  background: var(--bento-card-subtle);
  border-bottom: 1px solid var(--bento-inner-border);
}

.window-traffic-lights {
  display: flex;
  gap: 5px;
}

.light {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}
.light.red { background: #FF5F56; }
.light.yellow { background: #FFBD2E; }
.light.green { background: #27C93F; }

.window-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 0.73rem;
  color: var(--bento-text-muted);
}

.window-ext-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--vp-c-brand-1);
}

.ext-pulse {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 6px var(--vp-c-brand-1);
}

.simulator-body {
  padding: 13px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sim-block {
  border: 1px solid var(--bento-border);
  border-radius: var(--bento-radius-sm);
  background: var(--bento-card-subtle);
  padding: 11px 13px;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 7px;
}

.header-tag {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tag-index {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  padding: 1px 5px;
  background: var(--vp-c-brand-soft);
  border-radius: 4px;
}

.tag-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--bento-text-title);
}

.header-status {
  font-size: 0.72rem;
  color: var(--bento-text-muted);
}

.header-success {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.72rem;
  font-weight: 600;
  color: #10B981;
}

.header-idle {
  font-size: 0.72rem;
  color: var(--bento-text-muted);
}

.article-meta-card {
  background: var(--bento-card-bg);
  border: 1px solid var(--bento-inner-border);
  border-radius: 6px;
  padding: 7px 11px;
  margin-bottom: 9px;
}

.meta-title {
  font-size: 0.83rem;
  font-weight: 600;
  color: var(--bento-text-title);
  margin-bottom: 2px;
}

.meta-details {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  color: var(--bento-text-muted);
}

.meta-mono {
  font-family: var(--font-mono);
}

.meta-sep {
  opacity: 0.4;
}

.meta-tag {
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

.channel-selector {
  margin-bottom: 9px;
}

.selector-title {
  display: flex;
  justify-content: space-between;
  font-size: 0.73rem;
  color: var(--bento-text-muted);
  margin-bottom: 6px;
}

.selector-hint {
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

.channel-chips {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.channel-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  border-radius: 6px;
  background: var(--bento-card-bg);
  border: 1px solid var(--bento-border);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: left;
}

.channel-chip:hover {
  border-color: var(--bento-border-hover);
}

.channel-chip.is-selected {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.chip-checkbox {
  width: 13px;
  height: 13px;
  border-radius: 3px;
  border: 1px solid var(--bento-border);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bento-card-bg);
  flex-shrink: 0;
}

.channel-chip.is-selected .chip-checkbox {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #FFFFFF;
}

.chip-name {
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--bento-text-title);
  white-space: nowrap;
}

.chip-feature {
  font-size: 0.66rem;
  color: var(--bento-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sim-actions {
  display: flex;
}

.btn-simulate {
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  background: var(--vp-c-brand-1);
  color: #FFFFFF;
  border: none;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 3px 12px rgba(30, 128, 255, 0.25);
}

.btn-simulate:hover:not(:disabled) {
  background: #1171EE;
  transform: translateY(-1px);
}

.btn-simulate:disabled {
  opacity: 0.75;
  cursor: not-allowed;
}

.btn-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}

.spin-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

.btn-reset {
  width: 100%;
  padding: 7px 12px;
  border-radius: 6px;
  background: var(--bento-card-bg);
  border: 1px solid var(--bento-border);
  color: var(--bento-text-title);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.btn-reset:hover {
  border-color: var(--bento-border-hover);
}

/* Target Panel */
.target-block.is-active {
  border-color: rgba(30, 128, 255, 0.3);
}

.target-panel {
  min-height: 102px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.target-tabs {
  display: flex;
  gap: 5px;
  margin-bottom: 7px;
  overflow-x: auto;
}

.target-tab {
  padding: 3px 8px;
  border-radius: 5px;
  background: var(--bento-card-bg);
  border: 1px solid var(--bento-border);
  font-size: 0.72rem;
  color: var(--bento-text-body);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.target-tab.is-active {
  background: var(--vp-c-brand-1);
  color: #FFFFFF;
  border-color: var(--vp-c-brand-1);
}

.target-card-preview {
  background: var(--bento-card-bg);
  border: 1px solid var(--bento-inner-border);
  border-radius: 6px;
  padding: 8px 11px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.preview-badge {
  font-size: 0.72rem;
  font-weight: 600;
  color: #10B981;
}

.preview-secure {
  font-size: 0.68rem;
  color: var(--bento-text-muted);
}

.preview-body {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.preview-feature-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.73rem;
  color: var(--bento-text-body);
}

.preview-feature-item svg {
  color: #10B981;
}

.target-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 10px;
  color: var(--bento-text-muted);
}

.empty-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: var(--bento-card-bg);
  border: 1px solid var(--bento-inner-border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.empty-text {
  font-size: 0.76rem;
  line-height: 1.4;
}
</style>
