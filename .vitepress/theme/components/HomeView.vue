<script setup>
import { withBase } from 'vitepress'
import { ref, computed } from 'vue'
import { useRelease } from '../useRelease'
import { trackDownload } from '../tracker'

const { release } = useRelease()

const handleDownload = () => {
  trackDownload(release.value.version ? `juejin-sync-${release.value.version}.zip` : 'juejin-sync-latest.zip')
}

const isSimulating = ref(false)
const simulateStep = ref(0) // 0: idle, 1: transferring, 2: saved
const copied = ref(false)
const activeDraftTab = ref('csdn')

// 目标平台定义
const platformList = [
  {
    id: 'csdn',
    name: 'CSDN 草稿箱',
    shortName: 'CSDN',
    badge: '分类自动匹配',
    badgeClass: '',
    tabLabel: 'CSDN 草稿',
    tabClass: '',
    successBadge: '✓ CSDN 草稿已保存',
    successBadgeClass: '',
    stats: ['3 张原图无损转存', '专栏分类已对齐']
  },
  {
    id: 'wechat',
    name: '微信公众号',
    shortName: '微信公众号',
    badge: 'v1.0.0 航道',
    badgeClass: 'badge-green',
    tabLabel: '微信公众号 🌟',
    tabClass: 'wechat-tab-btn',
    successBadge: '✓ 微信图文草稿就绪',
    successBadgeClass: 'badge-green-fill',
    stats: ['16:9/1:1/3:4 封面生成', '代码内联样式']
  },
  {
    id: 'cnblogs',
    name: '博客园随笔',
    shortName: '博客园',
    badge: 'v1.3.0 航道',
    badgeClass: 'badge-blue',
    tabLabel: '博客园草稿 🍃',
    tabClass: 'cnblogs-tab-btn',
    successBadge: '✓ 博客园随笔草稿已保存',
    successBadgeClass: 'badge-blue-fill',
    stats: ['正文图片无损转存', 'Markdown 原生排版']
  },
  {
    id: 'zhihu',
    name: '知乎专栏',
    shortName: '知乎',
    badge: 'v1.4.0 航道',
    badgeClass: 'badge-blue',
    tabLabel: '知乎专栏 🔷',
    tabClass: 'zhihu-tab-btn',
    successBadge: '✓ 知乎专栏草稿已就绪',
    successBadgeClass: 'badge-blue-fill',
    stats: ['Draft.js 高保真排版', '图片双轨上传与保护']
  }
]

// 选中的目标平台（默认全选演示）
const selectedPlatforms = ref(['csdn', 'wechat', 'cnblogs', 'zhihu'])

const togglePlatform = (id) => {
  if (isSimulating.value) return
  const index = selectedPlatforms.value.indexOf(id)
  if (index > -1) {
    selectedPlatforms.value.splice(index, 1)
  } else {
    selectedPlatforms.value.push(id)
  }

  // 保证激活的草稿 Tab 属于当前选中的平台
  if (!selectedPlatforms.value.includes(activeDraftTab.value) && selectedPlatforms.value.length > 0) {
    activeDraftTab.value = selectedPlatforms.value[0]
  }
}

const activePlatformDetails = computed(() => {
  return platformList.filter(p => selectedPlatforms.value.includes(p.id))
})

const currentPlatformDetail = computed(() => {
  return platformList.find(p => p.id === activeDraftTab.value) || activePlatformDetails.value[0]
})

const transferringNames = computed(() => {
  return activePlatformDetails.value.map(p => p.shortName).join(' & ')
})

const copyExtensionUrl = async () => {
  try {
    await navigator.clipboard.writeText('chrome://extensions')
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2500)
  } catch (e) {
    // fallback
  }
}

const runSimulation = () => {
  if (isSimulating.value || selectedPlatforms.value.length === 0) return
  isSimulating.value = true
  simulateStep.value = 1

  // 保证当前激活的 tab 在选中列表中
  if (!selectedPlatforms.value.includes(activeDraftTab.value) && selectedPlatforms.value.length > 0) {
    activeDraftTab.value = selectedPlatforms.value[0]
  }

  setTimeout(() => {
    simulateStep.value = 2
    isSimulating.value = false
  }, 1600)
}
</script>

<template>
  <div class="ferry-landing">
    <!-- 局部工程网格微背景（仅首屏聚焦，边缘柔和隐去，非全屏铺满） -->
    <div class="hero-grid-backdrop" aria-hidden="true"></div>

    <!-- 1. HERO SECTION -->
    <section class="hero-wrap">
      <!-- Main Headline -->
      <h1 class="hero-title">
        把时间留给写作，<span class="hero-highlight">把搬运交给轻舟。</span>
      </h1>

      <p class="hero-subtitle">
        在掘金写完文章，一键勾选同步多平台。<br>
        支持 CSDN、微信公众号、博客园与知乎专栏草稿箱，原图无损，自动排版，一键直达。
      </p>

      <!-- Primary Actions -->
      <div class="cta-actions">
        <a :href="release.downloadUrl" download @click="handleDownload" class="btn-primary">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span class="btn-text">
            <strong>下载扩展离线包</strong>
            <small>{{ release.version }} · {{ release.size }} · 免翻直链</small>
          </span>
        </a>

        <a href="#install-guide" class="btn-secondary">
          <span>两步安装教程 ↓</span>
        </a>

        <a href="https://github.com/juejin-sync/juejin-sync" target="_blank" rel="noopener" class="btn-ghost">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <span>GitHub 开源</span>
        </a>
      </div>

      <!-- 2. INTERACTIVE CHROME WINDOW MOCKUP (真实浏览器使用场景) -->
      <div class="chrome-mockup-wrapper">
        <div class="chrome-window">
          <!-- Chrome Titlebar -->
          <div class="chrome-tabbar">
            <div class="window-controls">
              <span class="dot dot-close"></span>
              <span class="dot dot-min"></span>
              <span class="dot dot-max"></span>
            </div>
            <div class="chrome-tab">
              <span class="tab-favicon">✍️</span>
              <span class="tab-title">掘金 Markdown 编辑器 - 撰写中</span>
            </div>
            <div class="chrome-address-bar">
              <span class="lock-icon">🔒</span>
              <span class="url-text">https://juejin.cn/editor/drafts/741892...</span>
            </div>
            <div class="extension-icon-badge" title="掘金同步助手 Chrome 扩展已就绪">
              <img :src="withBase('/logo.svg')" width="18" height="18" alt="掘金同步助手 logo" />
            </div>
          </div>

          <!-- Simulation Board Inside Browser -->
          <div class="mockup-inner">
            <div class="mockup-header-tip">
              <span>💡 实际使用场景演示：在掘金写完文章点击「同步多平台」，自由勾选目标平台一键同步</span>
              <span class="status-tip">{{ simulateStep === 0 ? '等待点击模拟' : simulateStep === 1 ? '正在并行搬运多平台...' : `✓ 已勾选的 ${selectedPlatforms.length} 处草稿已安全入库` }}</span>
            </div>

            <div class="pipeline-grid">
              <!-- Left Shore: 掘金发文抽屉 -->
              <div class="pipeline-card card-source">
                <div class="card-tag tag-juejin">
                  <span class="tag-circle"></span>
                  <span>① 掘金写作端 · 同步多平台</span>
                </div>
                <div class="article-info-box">
                  <div class="article-title">深入剖析 Chrome Extension MV3 架构实战</div>
                  <div class="article-meta">
                    <span>4,200 字</span>
                    <span>·</span>
                    <span>3 张高清架构图</span>
                  </div>
                </div>

                <!-- The Actual Checkbox Injected by Extension -->
                <div class="injected-checkbox-box">
                  <div class="checkbox-header">
                    <span>勾选同步目标平台：</span>
                    <span class="hint-clickable">（支持点击勾选）</span>
                  </div>
                  <div class="platform-checks">
                    <label
                      v-for="platform in platformList"
                      :key="platform.id"
                      class="check-item"
                      :class="{ 'is-checked': selectedPlatforms.includes(platform.id), 'is-disabled': isSimulating }"
                    >
                      <input
                        type="checkbox"
                        :checked="selectedPlatforms.includes(platform.id)"
                        :disabled="isSimulating"
                        @change="togglePlatform(platform.id)"
                        class="checkbox-ui"
                      />
                      <span class="check-name">{{ platform.name }}</span>
                      <span class="check-badge" :class="platform.badgeClass">{{ platform.badge }}</span>
                    </label>
                  </div>
                </div>

                <div class="action-row">
                  <span class="column-match">
                    {{ selectedPlatforms.length > 0 ? `已就绪 ${selectedPlatforms.length} 个发布渠道` : '请至少勾选 1 个渠道' }}
                  </span>
                  <button
                    class="btn-simulate-publish"
                    :disabled="isSimulating || selectedPlatforms.length === 0"
                    @click="runSimulation"
                  >
                    {{ isSimulating ? '正在并行搬运...' : simulateStep === 2 ? '↻ 重新模拟' : '🚀 模拟点击「同步多平台」' }}
                  </button>
                </div>
              </div>

              <!-- Shipping Lane -->
              <div class="shipping-lane-col">
                <div class="lane-svg-wrap">
                  <svg class="lane-svg" viewBox="0 0 120 30" fill="none">
                    <path d="M 10 15 L 110 15" stroke="var(--vp-c-divider)" stroke-width="2" />
                    <path
                      d="M 10 15 L 110 15"
                      stroke="var(--vp-c-brand-1)"
                      stroke-width="2"
                      class="flow-stroke"
                      :class="{ 'is-active': isSimulating }"
                    />
                  </svg>
                  <div class="ferry-boat-icon" :class="`step-${simulateStep}`">
                    ⛵
                  </div>
                </div>
                <div class="lane-text">
                  <span v-if="simulateStep === 0">写完点同步，多平台多航道并行同步</span>
                  <span v-else-if="simulateStep === 1" class="text-transit">并发转存 {{ transferringNames }}...</span>
                  <span v-else class="text-success">{{ selectedPlatforms.length }} 处草稿已入库，排版与封面就绪</span>
                </div>
              </div>

              <!-- Right Shore: 目标草稿箱 -->
              <div class="pipeline-card card-target" :class="{ 'is-ready': simulateStep === 2 && selectedPlatforms.length > 0 }">
                <div class="card-tag tag-multi">
                  <span class="tag-circle"></span>
                  <span>② 目标平台草稿箱 (已同步 {{ selectedPlatforms.length }} 处)</span>
                </div>

                <div class="target-draft-box">
                  <div v-if="simulateStep === 2 && selectedPlatforms.length > 0" class="draft-content">
                    <div class="draft-target-tabs">
                      <button
                        v-for="platform in activePlatformDetails"
                        :key="platform.id"
                        type="button"
                        class="target-tab-btn"
                        :class="[platform.tabClass, { active: activeDraftTab === platform.id }]"
                        @click="activeDraftTab = platform.id"
                      >
                        {{ platform.tabLabel }}
                      </button>
                    </div>

                    <div v-if="currentPlatformDetail" class="tab-result-pane" :key="currentPlatformDetail.id">
                      <div class="draft-title">深入剖析 Chrome Extension MV3 架构实战</div>
                      <div class="draft-stats">
                        <span class="badge-success" :class="currentPlatformDetail.successBadgeClass">
                          {{ currentPlatformDetail.successBadge }}
                        </span>
                        <span v-for="stat in currentPlatformDetail.stats" :key="stat">{{ stat }}</span>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="selectedPlatforms.length === 0" class="draft-waiting">
                    <span class="waiting-icon">⚠️</span>
                    <span>请在左侧勾选至少 1 个目标平台</span>
                  </div>
                  <div v-else class="draft-waiting">
                    <span class="waiting-icon">⏳</span>
                    <span>等待文章进入草稿箱...</span>
                  </div>
                </div>

                <div class="safe-note">
                  <strong>安心保证：</strong>各平台均只停在草稿箱，排版检查确认后，由你亲自点击发布。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. THREE RELIEFS (接地气的 3 大烦恼解决方案) -->
    <section class="section-block">
      <div class="section-head text-center">
        <span class="section-kicker">做点实事</span>
        <h2 class="section-title">这个小插件帮你省掉哪 3 件烦心事？</h2>
        <p class="section-desc">搬运文章不需要繁琐的手工体力活，也不用去读生涩技术名词</p>
      </div>

      <div class="reliefs-grid">
        <!-- Relief 1 -->
        <div class="relief-card">
          <div class="relief-icon">🖼️</div>
          <h3 class="relief-title">原图与封面自动搬运，不裂图、不模糊</h3>
          <p class="relief-desc">
            文章图片经常因为防盗链裂成红叉，或者带上水印。插件不仅能剥离水印无损转存到 CSDN，还会将图片一并转存到微信素材库，并自动按 16:9、1:1、3:4 裁剪生成三套标准微信封面绑定草稿。
          </p>
          <div class="relief-tag">再也不用把图片一张张另存再费劲裁封面图</div>
        </div>

        <!-- Relief 2 -->
        <div class="relief-card">
          <div class="relief-icon">📱</div>
          <h3 class="relief-title">微信排版与代码高亮原汁原味，无需第三方中转</h3>
          <p class="relief-desc">
            公众号排版向来最繁琐：代码块换行、字体样式错位。插件内置微信专属 Markdown 编译器，内联关键样式，代码逐行渲染保留缩进并支持横向平滑滚动，提示框变标准引用。
          </p>
          <div class="relief-tag">省去复制到第三方排版工具微调 20 分钟的折磨</div>
        </div>

        <!-- Relief 3 -->
        <div class="relief-card">
          <div class="relief-icon">⚡</div>
          <h3 class="relief-title">改了错别字重新同步，自动覆盖原草稿</h3>
          <p class="relief-desc">
            修改了错别字或调整了代码？在源站重新点击同步，插件会自动更新覆盖对应平台的旧草稿，多平台任务独立隔离，绝不会在草稿箱堆出一堆同名的垃圾废稿。
          </p>
          <div class="relief-tag">即使删了旧草稿也能自愈重建，多平台互不干扰</div>
        </div>
      </div>
    </section>

    <!-- 4. INSTALLATION GUIDE (两步极简上手) -->
    <section id="install-guide" class="section-block">
      <div class="section-head text-center">
        <span class="section-kicker">简单起步</span>
        <h2 class="section-title">插件怎么装？两步搞定</h2>
        <p class="section-desc">国内网络无需翻墙，解压后拖进浏览器就能用，全 Chromium 浏览器通用</p>
      </div>

      <div class="install-steps-wrap">
        <div class="install-step-card">
          <div class="step-badge">步骤 01</div>
          <h3 class="step-title">下载安装包并解压</h3>
          <p class="step-desc">
            点击下方按钮直接下载最新版离线压缩包（{{ release.size }}），解压到一个你常用的文件夹（解压后请保留该文件夹，不要删除）。
          </p>
          <div class="step-action">
            <a :href="release.downloadUrl" download @click="handleDownload" class="step-btn">
              <span>⬇️ 下载离线包 ({{ release.version }} · {{ release.size }})</span>
            </a>
          </div>
        </div>

        <div class="install-step-arrow">➔</div>

        <div class="install-step-card">
          <div class="step-badge">步骤 02</div>
          <h3 class="step-title">加载到扩展程序</h3>
          <p class="step-desc">
            在浏览器地址栏打开扩展管理页，开启右上角<strong>「开发者模式」</strong>，点击<strong>「加载已解压的扩展程序」</strong>选择刚才解压的文件夹（或直接把文件夹拖进来）。
          </p>
          <div class="step-action">
            <button class="step-btn-copy" @click="copyExtensionUrl">
              <span>chrome://extensions</span>
              <span class="copy-hint">{{ copied ? '✓ 已复制地址' : '复制地址 📋' }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="install-footnote">
        <span>支持浏览器：Google Chrome、Microsoft Edge、Brave、Arc、360 极速浏览器等所有 Chromium 核心浏览器</span>
      </div>
    </section>

    <!-- 5. THREE PROMISES (作为纯本地插件的安全底线) -->
    <section class="section-block section-trust">
      <div class="section-head text-center">
        <span class="section-kicker">安全与隐私</span>
        <h2 class="section-title">作为一个本地小工具的底线</h2>
        <p class="section-desc">不碰你的账号密码，不设第三方云端，坚守创作主权</p>
      </div>

      <div class="trust-grid">
        <div class="trust-item">
          <div class="trust-icon">🔒</div>
          <div class="trust-content">
            <h4>0 Cookie 权限申请</h4>
            <p>直接复用浏览器中已有的平台登录会话（掘金、CSDN、微信公众号、博客园、知乎），插件坚决不申请敏感 Cookie 权限，绝不读取你的账号密码。</p>
          </div>
        </div>

        <div class="trust-item">
          <div class="trust-icon">💻</div>
          <div class="trust-content">
            <h4>100% 电脑本地运行</h4>
            <p>文章排版转换与图片转存全部在你的电脑浏览器沙箱内完成，绝不经过任何第三方云端服务器，数据不出电脑。</p>
          </div>
        </div>

        <div class="trust-item">
          <div class="trust-icon">✋</div>
          <div class="trust-content">
            <h4>止步草稿箱，绝不擅自公开发布</h4>
            <p>工具专注消灭机械转存工作，文章稳妥存至草稿箱。分类确认与最终公开发布的决定权，100% 永远属于创作者本人。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. BOTTOM CTA BANNER -->
    <section class="bottom-cta-wrap">
      <div class="cta-inner">
        <h2 class="cta-heading">少一次机械复制，多一点时间写下一篇。</h2>
        <p class="cta-lead">完全免费，代码开源。装好之后，发文顺手勾一下就好。</p>
        <div class="cta-btns">
          <a :href="release.downloadUrl" download @click="handleDownload" class="btn-primary">
            <span>⬇️ 一键下载离线包 ({{ release.version }} · {{ release.size }})</span>
          </a>
          <a :href="withBase('/guide/quick-start')" class="btn-secondary">
            <span>3 分钟上手指南 ↗</span>
          </a>
        </div>
        <div class="cta-meta">
          <span>掘金同步助手 · Chrome 浏览器扩展 · MIT 开源协议</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 容器与基础排版：全量采用 VitePress 标准 CSS Variables，完美支持亮/暗主题无缝切换 */
.ferry-landing {
  position: relative;
  max-width: 1152px;
  margin: 0 auto;
  padding: 32px 24px 64px;
  color: var(--vp-c-text-1);
}

/* 局部工程网格微纹理（呼吸感精细网格，仅在首屏局部聚焦并柔和淡出，绝非全屏铺满） */
.hero-grid-backdrop {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  max-width: 1400px;
  height: 680px;
  pointer-events: none;
  z-index: 0;

  /* 32px 精密浅色工程细网格 */
  background-size: 32px 32px;
  background-image:
    linear-gradient(to right, var(--vp-c-divider) 1px, transparent 1px),
    linear-gradient(to bottom, var(--vp-c-divider) 1px, transparent 1px);
  opacity: 0.65;

  /* 椭圆径向渐变遮罩：中心清晰，向四周与下方柔和隐去，不干扰主体阅读 */
  -webkit-mask-image: radial-gradient(ellipse 65% 55% at 50% 18%, #000 20%, transparent 85%);
  mask-image: radial-gradient(ellipse 65% 55% at 50% 18%, #000 20%, transparent 85%);
}

.hero-grid-backdrop::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 20%, rgba(29, 125, 250, 0.05) 0%, transparent 65%);
  pointer-events: none;
}

.dark .hero-grid-backdrop {
  opacity: 0.45;
}

/* 1. HERO SECTION */
.hero-wrap {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 36px 0 20px;
}

.badge-row {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}

.extension-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border: 1px solid var(--vp-c-brand-1);
  opacity: 0.95;
}

.pill-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
}

.version-pill {
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-family: var(--vp-font-family-mono);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}

.hero-title {
  font-size: clamp(24px, 3.4vw, 42px);
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: -0.02em;
  margin: 0 auto 18px;
  color: var(--vp-c-text-1);
  max-width: 1050px;
  text-wrap: balance;
}

.hero-highlight {
  color: var(--vp-c-brand-1);
}

.hero-subtitle {
  font-size: clamp(15px, 1.8vw, 18px);
  line-height: 1.75;
  color: var(--vp-c-text-2);
  max-width: 640px;
  margin: 0 auto 32px;
}

.cta-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 44px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 22px;
  border-radius: 10px;
  background: var(--vp-c-brand-1);
  color: #ffffff !important;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(29, 125, 250, 0.25);
  text-decoration: none !important;
}

.btn-primary:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-1px);
}

.btn-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
}

.btn-text small {
  font-size: 11px;
  font-weight: 400;
  opacity: 0.9;
  margin-top: 2px;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  padding: 14px 20px;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1) !important;
  font-weight: 500;
  font-size: 14px;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.2s ease;
  text-decoration: none !important;
}

.btn-secondary:hover {
  background: var(--vp-c-bg-mute);
  border-color: var(--vp-c-brand-1);
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 18px;
  border-radius: 10px;
  color: var(--vp-c-text-2) !important;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  text-decoration: none !important;
}

.btn-ghost:hover {
  color: var(--vp-c-text-1) !important;
}

/* 2. CHROME MOCKUP WINDOW */
.chrome-mockup-wrapper {
  max-width: 920px;
  margin: 0 auto;
}

.chrome-window {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 16px 40px -10px rgba(0, 0, 0, 0.08);
}

.dark .chrome-window {
  box-shadow: 0 20px 48px -12px rgba(0, 0, 0, 0.45);
}

.chrome-tabbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.window-controls {
  display: flex;
  gap: 6px;
}

.dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
}
.dot-close { background: #ff5f56; }
.dot-min { background: #ffbd2e; }
.dot-max { background: #27c93f; }

.chrome-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: var(--vp-c-bg);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  white-space: nowrap;
}

.chrome-address-bar {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  font-size: 11px;
  color: var(--vp-c-text-2);
  overflow: hidden;
}

.url-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.extension-icon-badge {
  padding: 4px;
  border-radius: 6px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  justify-content: center;
}

.mockup-inner {
  padding: 24px;
}

.mockup-header-tip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--vp-c-text-2);
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px dashed var(--vp-c-divider);
}

.status-tip {
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.pipeline-grid {
  display: grid;
  grid-template-columns: 1fr 140px 1fr;
  gap: 16px;
  align-items: center;
}

.pipeline-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 16px;
  text-align: left;
}

.card-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 12px;
}

.tag-juejin {
  background: rgba(30, 128, 255, 0.12);
  color: #1e80ff;
}

.tag-csdn {
  background: rgba(252, 85, 49, 0.12);
  color: #fc5531;
}

.tag-multi {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}

.tag-circle {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.article-info-box {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  padding: 10px 12px;
  border-radius: 8px;
  margin-bottom: 12px;
}

.article-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.article-meta {
  font-size: 11px;
  color: var(--vp-c-text-2);
  margin-top: 4px;
  display: flex;
  gap: 6px;
}

.injected-checkbox-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px;
  background: var(--vp-c-brand-soft);
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 8px;
  margin-bottom: 14px;
}

.checkbox-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.plugin-by {
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.hint-clickable {
  font-size: 10px;
  color: var(--vp-c-brand-1);
  font-weight: 500;
  opacity: 0.85;
}

.platform-checks {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.check-item {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11.5px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  padding: 5px 8px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}

.check-item:hover {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-brand-1);
}

.check-item.is-disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.check-item.is-checked {
  border-color: rgba(29, 125, 250, 0.4);
}

.checkbox-ui {
  cursor: pointer;
  accent-color: var(--vp-c-brand-1);
}

.check-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.check-badge {
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}

.check-badge.badge-green {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  font-weight: 600;
}

.check-badge.badge-blue {
  background: rgba(46, 122, 204, 0.15);
  color: #2e7acc;
  font-weight: 600;
}

.dark .check-badge.badge-blue {
  background: rgba(56, 139, 253, 0.2);
  color: #58a6ff;
}

.action-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.column-match {
  font-size: 11px;
  color: var(--vp-c-text-2);
}

.btn-simulate-publish {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: var(--vp-c-brand-1);
  color: #fff;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-simulate-publish:disabled {
  opacity: 0.6;
  cursor: wait;
}

.shipping-lane-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.lane-svg-wrap {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lane-svg {
  width: 100%;
  height: 30px;
}

.flow-stroke.is-active {
  stroke-dasharray: 6 6;
  animation: flowingLine 1.2s linear infinite;
}

@keyframes flowingLine {
  from { stroke-dashoffset: 24; }
  to { stroke-dashoffset: 0; }
}

.ferry-boat-icon {
  position: absolute;
  font-size: 18px;
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.step-0 { left: 10px; }
.step-1 { left: 45%; }
.step-2 { left: calc(100% - 24px); }

.lane-text {
  font-size: 11px;
  color: var(--vp-c-text-2);
  margin-top: 4px;
}

.text-transit { color: var(--vp-c-brand-1); font-weight: 500; }
.text-success { color: #10b981; font-weight: 500; }

.target-draft-box {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  transition: border-color 0.3s ease;
}

.card-target.is-ready .target-draft-box {
  border-color: #10b981;
}

.draft-content {
  width: 100%;
}

.draft-target-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.target-tab-btn {
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 5px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.target-tab-btn:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-brand-1);
}

.target-tab-btn.active {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.wechat-tab-btn.active {
  background: rgba(16, 185, 129, 0.12);
  border-color: #10b981;
  color: #10b981;
}

.cnblogs-tab-btn.active {
  background: rgba(46, 122, 204, 0.12);
  border-color: #2e7acc;
  color: #2e7acc;
}

.dark .cnblogs-tab-btn.active {
  background: rgba(56, 139, 253, 0.18);
  border-color: #58a6ff;
  color: #58a6ff;
}

.tab-result-pane {
  animation: fadeInPane 0.2s ease-in-out;
}

@keyframes fadeInPane {
  from { opacity: 0.6; transform: translateY(2px); }
  to { opacity: 1; transform: translateY(0); }
}

.draft-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.draft-stats {
  font-size: 11px;
  color: var(--vp-c-text-2);
  margin-top: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.badge-success {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.badge-green-fill {
  background: rgba(16, 185, 129, 0.2) !important;
  color: #10b981 !important;
}

.badge-blue-fill {
  background: rgba(46, 122, 204, 0.2) !important;
  color: #2e7acc !important;
}

.dark .badge-blue-fill {
  background: rgba(56, 139, 253, 0.25) !important;
  color: #58a6ff !important;
}

.draft-waiting {
  font-size: 12px;
  color: var(--vp-c-text-3);
  display: flex;
  align-items: center;
  gap: 6px;
}

.safe-note {
  font-size: 11px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
}

/* 3. SECTION BLOCKS (通用版块) */
.section-block {
  padding: 64px 0 20px;
  border-top: 1px solid var(--vp-c-divider);
  margin-top: 56px;
}

.section-head {
  margin-bottom: 36px;
}

.section-kicker {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--vp-c-brand-1);
  text-transform: uppercase;
  margin-bottom: 8px;
}

.section-title {
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 10px;
  border: none;
}

.section-desc {
  font-size: 15px;
  color: var(--vp-c-text-2);
  margin: 0;
}

/* RELIEFS GRID */
.reliefs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.relief-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.relief-card:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
}

.relief-icon {
  font-size: 28px;
  margin-bottom: 16px;
}

.relief-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 10px;
}

.relief-desc {
  font-size: 13px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
  margin: 0 0 16px;
  flex-grow: 1;
}

.relief-tag {
  font-size: 11px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
}

/* INSTALL STEPS */
.install-steps-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  max-width: 860px;
  margin: 0 auto;
}

.install-step-card {
  flex: 1;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 24px;
  text-align: left;
}

.step-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  padding: 3px 8px;
  border-radius: 4px;
  margin-bottom: 12px;
}

.step-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 8px;
}

.step-desc {
  font-size: 13px;
  line-height: 1.65;
  color: var(--vp-c-text-2);
  margin: 0 0 16px;
}

.install-step-arrow {
  font-size: 22px;
  color: var(--vp-c-divider);
}

.step-btn {
  display: block;
  text-align: center;
  padding: 10px 14px;
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: #fff !important;
  font-size: 12px;
  font-weight: 600;
  transition: background 0.2s;
  text-decoration: none !important;
}

.step-btn:hover {
  background: var(--vp-c-brand-2);
}

.step-btn-copy {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: border-color 0.2s;
}

.step-btn-copy:hover {
  border-color: var(--vp-c-brand-1);
}

.copy-hint {
  color: var(--vp-c-brand-1);
  font-size: 11px;
}

.install-footnote {
  text-align: center;
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-top: 20px;
}

/* TRUST SECTION */
.trust-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.trust-item {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 24px;
  text-align: left;
}

.trust-icon {
  font-size: 24px;
  margin-bottom: 12px;
}

.trust-content h4 {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 8px;
}

.trust-content p {
  font-size: 12px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
  margin: 0;
}

/* BOTTOM CTA */
.bottom-cta-wrap {
  margin-top: 64px;
  padding: 48px 24px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  text-align: center;
}

.cta-heading {
  font-size: clamp(22px, 2.5vw, 30px);
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 10px;
  border: none;
}

.cta-lead {
  font-size: 15px;
  color: var(--vp-c-text-2);
  margin: 0 0 28px;
}

.cta-btns {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.cta-meta {
  font-size: 12px;
  color: var(--vp-c-text-3);
  display: flex;
  justify-content: center;
  gap: 8px;
}

/* RESPONSIVE ADAPTATION */
@media (max-width: 860px) {
  .pipeline-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .shipping-lane-col {
    padding: 10px 0;
  }
  .lane-svg-wrap {
    transform: rotate(90deg);
    width: 60px;
  }
  .step-0 { top: 0; left: 20px; }
  .step-1 { top: 50%; left: 20px; }
  .step-2 { top: 100%; left: 20px; }
  .reliefs-grid, .trust-grid {
    grid-template-columns: 1fr;
  }
  .install-steps-wrap {
    flex-direction: column;
  }
  .install-step-arrow {
    transform: rotate(90deg);
  }
  .mobile-br {
    display: none;
  }
}
</style>
