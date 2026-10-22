<script setup>
import { withBase } from 'vitepress'
import { ref, computed } from 'vue'
import { useRelease } from '../useRelease'
import { trackDownload } from '../tracker'

const { release } = useRelease()

const handleDownload = () => {
  trackDownload(release.value.version ? `juejin-sync-${release.value.version}.zip` : 'juejin-sync-latest.zip')
}

// 模拟演示状态
const isSimulating = ref(false)
const simulateStep = ref(0) // 0: idle, 1: running, 2: finished
const copied = ref(false)
const activeDraftTab = ref('wechat')

// 平台定义（纯 SVG 图标，无 Emoji）
const platforms = [
  {
    id: 'wechat',
    name: '微信公众号',
    badge: '自动裁三套封面',
    highlight: '内联代码块样式',
    stats: '16:9 / 1:1 / 3:4 封面生成'
  },
  {
    id: 'zhihu',
    name: '知乎专栏',
    badge: '防盗链双轨保护',
    highlight: 'Draft.js 公式排版',
    stats: '外链转存 + 缺图阻断'
  },
  {
    id: 'csdn',
    name: 'CSDN 草稿',
    badge: '分类专栏自动命中',
    highlight: '原图剥离防盗链',
    stats: '3 张原图无损落盘'
  },
  {
    id: 'cnblogs',
    name: '博客园随笔',
    badge: '题图转存无水印',
    highlight: '纯净 Markdown',
    stats: '正文图片无损转存'
  }
]

// 选中的发布渠道
const selectedIds = ref(['wechat', 'zhihu', 'csdn', 'cnblogs'])

const toggleSelect = (id) => {
  if (isSimulating.value) return
  const idx = selectedIds.value.indexOf(id)
  if (idx > -1) {
    selectedIds.value.splice(idx, 1)
  } else {
    selectedIds.value.push(id)
  }
  if (!selectedIds.value.includes(activeDraftTab.value) && selectedIds.value.length > 0) {
    activeDraftTab.value = selectedIds.value[0]
  }
}

const activePlatform = computed(() => {
  return platforms.find(p => p.id === activeDraftTab.value) || platforms[0]
})

const runSimulation = () => {
  if (isSimulating.value || selectedIds.value.length === 0) return
  isSimulating.value = true
  simulateStep.value = 1

  setTimeout(() => {
    simulateStep.value = 2
    isSimulating.value = false
  }, 1400)
}

const resetSimulation = () => {
  simulateStep.value = 0
}

const copyExtensionsUrl = async () => {
  try {
    await navigator.clipboard.writeText('chrome://extensions')
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2200)
  } catch (err) {
    // clipboard fallback
  }
}
</script>

<template>
  <div class="craft-page">
    <!-- ====================================================================
         SECTION 1: HERO & WORKSTATION (Asymmetric Left-Heavy 58% : 42%)
         ==================================================================== -->
    <section class="manifesto-wrap">
      <div class="manifesto-col">
        <div class="attitude-stamp">
          <span class="stamp-pulse"></span>
          <span>拒绝手动复制粘贴</span>
        </div>

        <h1 class="manifesto-h1">
          <span class="h1-line">掘金写完了。</span>
          <span class="h1-line highlight-clay">别再当手动搬运工。</span>
          <span class="h1-line">两秒搞定四家草稿。</span>
        </h1>

        <div class="manifesto-dialogue">
          <p class="dialogue-lead">写文章两小时，搬运四十分钟？</p>
          <div class="dialogue-pills">
            <span class="pill-item">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              原图绝不裂。
            </span>
            <span class="pill-item">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              排版绝不散。
            </span>
            <span class="pill-item">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              只塞草稿箱。
            </span>
            <span class="pill-item">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              绝不替你瞎点发布。
            </span>
          </div>
        </div>

        <div class="manifesto-actions">
          <a :href="release.downloadUrl" download @click="handleDownload" class="btn-clay">
            <svg class="svg-icon" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <div class="btn-words">
              <strong>下载离线 ZIP 包</strong>
              <small>{{ release.version }} · {{ release.size }} · 免翻直链</small>
            </div>
          </a>

          <a href="#quick-steps" class="btn-sketch">
            <span>两步装进浏览器 ↓</span>
          </a>

          <a href="https://github.com/juejin-sync/juejin-sync" target="_blank" rel="noopener" class="btn-github">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>看源码 ↗</span>
          </a>
        </div>
      </div>

      <!-- Right Column: Interactive Workstation (Tactile Desk) -->
      <div class="workstation-col">
        <div class="tactile-frame">
          <div class="frame-bar">
            <div class="bar-signals">
              <span class="signal-dot dot-red"></span>
              <span class="signal-dot dot-yellow"></span>
              <span class="signal-dot dot-green"></span>
            </div>
            <div class="bar-tag">发文现场实时推演</div>
            <div class="bar-meta">v1.4.0 挂载态</div>
          </div>

          <div class="frame-board">
            <!-- Source Card: 掘金发文编辑器 -->
            <div class="board-card card-juejin">
              <div class="card-kicker">
                <span class="kicker-index">① 来源端</span>
                <span class="kicker-title">掘金 Markdown 原文</span>
              </div>
              <div class="article-snippet">
                <div class="snippet-title">深入剖析 Chrome Extension MV3 架构实战</div>
                <div class="snippet-numbers">4,200 字 · 3 张架构图 · 纯本地提取</div>
              </div>

              <!-- Channel Switcher -->
              <div class="channel-toggles">
                <div class="toggle-lead">点选你要同步的渠道：</div>
                <div class="toggle-grid">
                  <div
                    v-for="p in platforms"
                    :key="p.id"
                    class="toggle-chip"
                    :class="{ 'is-selected': selectedIds.includes(p.id) }"
                    @click="toggleSelect(p.id)"
                  >
                    <div class="chip-checkbox">
                      <svg v-if="selectedIds.includes(p.id)" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <div class="chip-text">
                      <span class="chip-name">{{ p.name }}</span>
                      <small class="chip-badge">{{ p.badge }}</small>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Trigger Button -->
              <div class="action-footer">
                <button
                  v-if="simulateStep !== 2"
                  class="btn-trigger"
                  :disabled="isSimulating || selectedIds.length === 0"
                  @click="runSimulation"
                >
                  <span v-if="!isSimulating">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" style="display:inline;vertical-align:-3px;margin-right:6px;"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    模拟搬运到草稿箱 ({{ selectedIds.length }})
                  </span>
                  <span v-else class="text-running">
                    <svg class="craft-spin" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" style="display:inline;vertical-align:-3px;margin-right:6px;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    多通道并行转存中...
                  </span>
                </button>
                <button v-else class="btn-reset" @click="resetSimulation">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" style="display:inline;vertical-align:-2px;margin-right:4px;"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                  ↻ 清除，再试一次
                </button>
              </div>
            </div>

            <!-- Target Result Box -->
            <div class="board-card card-target" :class="{ 'is-completed': simulateStep === 2 }">
              <div class="card-kicker">
                <span class="kicker-index">② 目标端</span>
                <span class="kicker-title">草稿箱就绪反馈 ({{ selectedIds.length }} 处)</span>
              </div>

              <div v-if="simulateStep === 2" class="result-box">
                <div class="result-tabs">
                  <button
                    v-for="p in platforms.filter(x => selectedIds.includes(x.id))"
                    :key="p.id"
                    class="res-tab-btn"
                    :class="{ active: activeDraftTab === p.id }"
                    @click="activeDraftTab = p.id"
                  >
                    {{ p.name }}
                  </button>
                </div>
                <div class="res-details">
                  <div class="res-stat-badge">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                    草稿已安全落盘
                  </div>
                  <div class="res-items">
                    <span>{{ activePlatform.highlight }}</span>
                    <span>{{ activePlatform.stats }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="result-empty">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" class="empty-icon"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
                <span>点击左下方按钮，看草稿如何无损落盘。</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ====================================================================
         SECTION 2: ASYMMETRIC PAIN-POINT DISSECTION (66% Wide : 34% Sticky)
         NO Hero + 3 Cards! Broken into a collage workstation.
         ==================================================================== -->
    <section class="dissect-wrap">
      <div class="section-badge">实景解剖</div>
      <h2 class="dissect-h2">这个小工具帮你砍掉哪些破事？</h2>

      <div class="dissect-grid">
        <!-- Wide Card: 微信排版深渊 (66%) -->
        <div class="dissect-card card-wide">
          <div class="card-ribbon">公众号排版专场</div>
          <div class="wide-inner">
            <div class="wide-left">
              <h3 class="dissect-title">微信排版，真的能把人逼疯。</h3>
              <p class="dissect-chat">
                <span>贴过去代码缩进全散架。</span><br>
                <span>行内样式还要自己一个个调。</span><br>
                <span>为了发文还要手动做封面。</span>
              </p>
              <div class="solution-capsule">
                <strong>插件解法：</strong>
                <span>内置专用排版引擎。</span>
                <span>原图转存素材库。</span>
                <span>自动生成三套尺寸封面。</span>
                <span>省下二十分钟喝杯咖啡。</span>
              </div>
            </div>
            <div class="wide-visual">
              <div class="code-preview-mock">
                <div class="mock-header">
                  <span class="mock-lang">wechat-engine.ts</span>
                  <span class="mock-ok">✓ 样式内嵌保真</span>
                </div>
                <pre class="mock-code"><code>// 代码缩进严格保留
// 支持横向平滑滚动
const clean = pipe(
  stripWatermark,
  inlineSyntax,
  genCovers
);</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side: Two Staggered Cards (34%) -->
        <div class="dissect-stacked">
          <!-- Card 2: 防盗链 -->
          <div class="dissect-card card-anti-theft">
            <div class="mini-tag">吞图受害者</div>
            <h3 class="dissect-title-sm">外链图片，一复制就变红叉。</h3>
            <p class="dissect-chat-sm">
              <span>防盗链把图片吃得干干净净。</span><br>
              <span>插件用双轨无损转存。</span><br>
              <span>缺一张图就坚决终止。</span><br>
              <span>绝不给你发一篇残缺稿。</span>
            </p>
          </div>

          <!-- Card 3: 改错字覆盖 -->
          <div class="dissect-card card-idempotent">
            <div class="mini-tag">草稿箱自愈</div>
            <h3 class="dissect-title-sm">改了个错字，重贴四次？</h3>
            <p class="dissect-chat-sm">
              <span>掘金重新点一下同步。</span><br>
              <span>自动覆盖原有各家草稿。</span><br>
              <span>绝不堆一堆重名废稿。</span><br>
              <span>多平台各自独立，省心。</span>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ====================================================================
         SECTION 3: TWO-STEP INSTALLATION (Staggered Steps, Not Equal Columns)
         ==================================================================== -->
    <section id="quick-steps" class="steps-wrap">
      <div class="section-badge">极简安装</div>
      <h2 class="steps-h2">别怕麻烦，装它只要一分钟。</h2>

      <div class="steps-staggered">
        <!-- Step 1 -->
        <div class="step-card step-one">
          <div class="step-order">#01</div>
          <h3 class="step-h3">下载解压离线包</h3>
          <p class="step-text">
            <span>下载 ZIP 离线压缩包。</span><br>
            <span>解压后放在常用的地方。</span><br>
            <span>千万别手欠删掉文件夹。</span>
          </p>
          <a :href="release.downloadUrl" download @click="handleDownload" class="step-btn-dl">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span>直接下载 ({{ release.size }})</span>
          </a>
        </div>

        <!-- Connection Arrow -->
        <div class="step-link-arrow">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </div>

        <!-- Step 2 -->
        <div class="step-card step-two">
          <div class="step-order">#02</div>
          <h3 class="step-h3">拖进扩展中心秒启用</h3>
          <p class="step-text">
            <span>打开浏览器扩展管理页。</span><br>
            <span>右上角打开开发者模式。</span><br>
            <span>把解压文件夹拖进去。</span><br>
            <span>当场搞定，立刻就能用了。</span>
          </p>
          <div class="cli-copy-box">
            <span class="cli-cmd">chrome://extensions</span>
            <button class="cli-copy-btn" @click="copyExtensionsUrl">
              <span v-if="!copied">复制地址</span>
              <span v-else class="copied-text">✓ 已复制</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ====================================================================
         SECTION 4: MANIFESTO & REAL NUMBERS (Bottom Dossier)
         ==================================================================== -->
    <section class="dossier-wrap">
      <div class="dossier-inner">
        <div class="dossier-left">
          <div class="dossier-tag">工匠态度</div>
          <h2 class="dossier-title">为什么写这个破插件？</h2>
          <div class="dossier-chat">
            <p>因为我自己也要写文章。</p>
            <p>每次搬运四十分钟，烦透了。</p>
            <p>不收你一分钱。</p>
            <p>绝不偷偷上传你 Cookie。</p>
            <p>所有代码都在 GitHub 上。</p>
          </div>
        </div>

        <div class="dossier-right">
          <div class="stat-cube">
            <span class="stat-number">0</span>
            <span class="stat-label">远程服务器依赖</span>
          </div>
          <div class="stat-cube">
            <span class="stat-number">4</span>
            <span class="stat-label">大平台草稿直达</span>
          </div>
          <div class="stat-cube">
            <span class="stat-number">1.05<small>MB</small></span>
            <span class="stat-label">极致轻巧体积</span>
          </div>
          <div class="stat-cube highlight-cube">
            <span class="stat-number">100<small>%</small></span>
            <span class="stat-label">本地沙箱安全执行</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ==========================================================================
   Anti-Mainstream Scoped CSS
   No Purple, No Ease-in-out, Hard Shadows, Asymmetric Grid
   ========================================================================== */

.craft-page {
  width: 100%;
  max-width: 1220px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

/* Section 1: Hero & Workstation */
.manifesto-wrap {
  display: grid;
  grid-template-columns: 55% 45%;
  gap: 40px;
  align-items: start;
  margin-bottom: 72px;
}

@media (max-width: 960px) {
  .manifesto-wrap {
    grid-template-columns: 1fr;
    gap: 36px;
  }
}

.attitude-stamp {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 3px 10px;
  background: var(--craft-accent-acid);
  color: #171719;
  border: 1.5px solid #171719;
  box-shadow: 2px 2px 0px #171719;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  border-radius: 2px;
  margin-bottom: 20px;
}

.stamp-pulse {
  width: 8px;
  height: 8px;
  background: #D64016;
  border-radius: 50%;
}

.manifesto-h1 {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 2.8rem;
  line-height: 1.15;
  margin: 0 0 24px 0;
  letter-spacing: -0.03em;
}

@media (max-width: 640px) {
  .manifesto-h1 {
    font-size: 2.1rem;
  }
}

.h1-line {
  color: var(--vp-c-text-1);
}

.highlight-clay {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-decoration-thickness: 4px;
  text-underline-offset: 6px;
}

.manifesto-dialogue {
  margin-bottom: 32px;
}

.dialogue-lead {
  font-size: 1.08rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 12px 0;
}

.dialogue-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pill-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: var(--craft-paper-card);
  border: 1.5px solid var(--craft-paper-border);
  box-shadow: var(--craft-shadow-sm);
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  border-radius: 4px;
}

.manifesto-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
}

.btn-clay {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 22px;
  background: var(--vp-c-brand-1);
  color: #FFFFFF !important;
  border: 2px solid var(--craft-paper-border);
  border-radius: 4px;
  box-shadow: var(--craft-shadow);
  text-decoration: none !important;
  font-weight: 800;
  transition: var(--craft-snap);
}

.btn-clay:hover {
  transform: translate(-1px, -1px);
  box-shadow: var(--craft-shadow-hover);
}

.btn-clay:active {
  transform: translate(2px, 2px);
  box-shadow: var(--craft-shadow-active);
}

.btn-words {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}

.btn-words strong {
  font-size: 0.96rem;
}

.btn-words small {
  font-size: 0.74rem;
  opacity: 0.92;
}

.btn-sketch {
  display: inline-flex;
  align-items: center;
  padding: 12px 18px;
  background: var(--craft-paper-card);
  color: var(--vp-c-text-1) !important;
  border: 2px solid var(--craft-paper-border);
  border-radius: 4px;
  box-shadow: var(--craft-shadow-sm);
  text-decoration: none !important;
  font-size: 0.92rem;
  font-weight: 700;
  transition: var(--craft-snap);
}

.btn-sketch:hover {
  transform: translate(-1px, -1px);
  box-shadow: var(--craft-shadow);
}

.btn-sketch:active {
  transform: translate(1px, 1px);
  box-shadow: var(--craft-shadow-active);
}

.btn-github {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 14px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2) !important;
  border: 2px solid var(--craft-paper-border);
  border-radius: 4px;
  box-shadow: var(--craft-shadow-sm);
  text-decoration: none !important;
  font-size: 0.88rem;
  font-weight: 700;
  transition: var(--craft-snap);
}

.btn-github:hover {
  color: var(--vp-c-text-1) !important;
  transform: translate(-1px, -1px);
  box-shadow: var(--craft-shadow);
}

/* Workstation Column */
.workstation-col {
  position: relative;
}

.tactile-frame {
  background: var(--craft-paper-card);
  border: 2px solid var(--craft-paper-border);
  box-shadow: var(--craft-shadow);
  border-radius: 6px;
  overflow: hidden;
  transform: rotate(0.4deg);
  transition: var(--craft-spring);
}

.tactile-frame:hover {
  transform: rotate(0deg);
}

.frame-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  background: var(--vp-c-bg-alt);
  border-bottom: 2px solid var(--craft-paper-border);
}

.bar-signals {
  display: flex;
  gap: 6px;
}

.signal-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  border: 1px solid var(--craft-paper-border);
}

.dot-red { background: #FF5F56; }
.dot-yellow { background: #FFBD2E; }
.dot-green { background: #27C93F; }

.bar-tag {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.bar-meta {
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

.frame-board {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.board-card {
  border: 1.5px solid var(--craft-paper-border);
  border-radius: 4px;
  padding: 14px;
  background: var(--vp-c-bg);
}

.card-kicker {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.kicker-index {
  font-size: 0.72rem;
  font-weight: 800;
  padding: 1px 6px;
  background: var(--craft-paper-border);
  color: var(--vp-c-bg);
  border-radius: 2px;
}

.kicker-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--vp-c-text-2);
}

.article-snippet {
  background: var(--craft-paper-card);
  border: 1px solid var(--craft-paper-border);
  padding: 8px 10px;
  margin-bottom: 12px;
  border-radius: 3px;
}

.snippet-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
}

.snippet-numbers {
  font-size: 0.76rem;
  color: var(--vp-c-text-3);
}

.channel-toggles {
  margin-bottom: 12px;
}

.toggle-lead {
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--vp-c-text-2);
  margin-bottom: 6px;
}

.toggle-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.toggle-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: var(--craft-paper-card);
  border: 1.5px solid var(--craft-paper-border);
  border-radius: 3px;
  cursor: pointer;
  user-select: none;
  transition: var(--craft-snap);
}

.toggle-chip.is-selected {
  background: var(--craft-accent-warm);
  border-color: var(--vp-c-brand-1);
}

.chip-checkbox {
  width: 14px;
  height: 14px;
  border: 1.5px solid var(--craft-paper-border);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  background: var(--craft-paper-card);
}

.toggle-chip.is-selected .chip-checkbox {
  background: var(--vp-c-brand-1);
  color: #fff;
  border-color: var(--vp-c-brand-1);
}

.chip-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.chip-name {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.chip-badge {
  font-size: 0.68rem;
  color: var(--vp-c-text-3);
}

.action-footer {
  padding-top: 4px;
}

.btn-trigger {
  width: 100%;
  padding: 9px 12px;
  background: var(--craft-paper-border);
  color: var(--vp-c-bg);
  border: none;
  border-radius: 3px;
  font-size: 0.86rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 2px 2px 0px var(--vp-c-brand-1);
  transition: var(--craft-snap);
}

.btn-trigger:hover:not(:disabled) {
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0px var(--vp-c-brand-1);
}

.btn-trigger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-reset {
  width: 100%;
  padding: 8px 12px;
  background: var(--craft-accent-acid);
  color: #171719;
  border: 1.5px solid #171719;
  border-radius: 3px;
  font-size: 0.84rem;
  font-weight: 800;
  cursor: pointer;
}

.card-target {
  transition: var(--craft-snap);
}

.card-target.is-completed {
  border-color: var(--vp-c-brand-1);
  background: var(--craft-paper-card);
}

.result-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
  overflow-x: auto;
}

.res-tab-btn {
  padding: 4px 8px;
  font-size: 0.74rem;
  font-weight: 700;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--craft-paper-border);
  border-radius: 2px;
  cursor: pointer;
  color: var(--vp-c-text-2);
}

.res-tab-btn.active {
  background: var(--vp-c-brand-1);
  color: #fff;
  border-color: var(--vp-c-brand-1);
}

.res-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.res-stat-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.78rem;
  font-weight: 800;
  color: var(--craft-accent-green);
}

.res-items {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
}

.result-empty {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.craft-spin {
  animation: craftSpin 0.9s linear infinite;
}

@keyframes craftSpin {
  100% { transform: rotate(360deg); }
}

/* ==========================================================================
   Section 2: Asymmetric Pain-point Dissection
   ========================================================================== */
.dissect-wrap {
  margin-bottom: 72px;
}

.section-badge {
  display: inline-block;
  padding: 2px 8px;
  font-size: 0.76rem;
  font-weight: 800;
  background: var(--craft-paper-border);
  color: var(--vp-c-bg);
  border-radius: 2px;
  margin-bottom: 12px;
}

.dissect-h2 {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 28px 0;
  letter-spacing: -0.02em;
}

.dissect-grid {
  display: grid;
  grid-template-columns: 64% 36%;
  gap: 24px;
}

@media (max-width: 900px) {
  .dissect-grid {
    grid-template-columns: 1fr;
  }
}

.dissect-card {
  position: relative;
  background: var(--craft-paper-card);
  border: 2px solid var(--craft-paper-border);
  box-shadow: var(--craft-shadow);
  border-radius: 6px;
  padding: 24px;
}

.card-ribbon {
  position: absolute;
  top: -11px;
  right: 20px;
  background: var(--craft-accent-acid);
  color: #171719;
  border: 1.5px solid #171719;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 1px 8px;
  box-shadow: 1.5px 1.5px 0px #171719;
}

.wide-inner {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 20px;
  align-items: center;
}

@media (max-width: 680px) {
  .wide-inner {
    grid-template-columns: 1fr;
  }
}

.dissect-title {
  font-size: 1.35rem;
  font-weight: 800;
  margin: 0 0 10px 0;
  color: var(--vp-c-text-1);
}

.dissect-chat {
  font-size: 0.92rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0 0 18px 0;
}

.solution-capsule {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 10px 12px;
  background: var(--craft-accent-warm);
  border: 1.5px dashed var(--craft-paper-border);
  border-radius: 4px;
  font-size: 0.82rem;
  color: var(--vp-c-text-1);
}

.solution-capsule strong {
  color: var(--vp-c-brand-1);
}

.code-preview-mock {
  background: #18181B;
  border: 1.5px solid var(--craft-paper-border);
  border-radius: 4px;
  padding: 12px;
  color: #F4F4F5;
  font-family: var(--vp-font-family-mono);
  box-shadow: 2px 2px 0px var(--craft-paper-border);
}

.mock-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 1px solid #3F3F46;
  font-size: 0.74rem;
  margin-bottom: 8px;
}

.mock-lang { color: #A1A1AA; }
.mock-ok { color: var(--craft-accent-acid); font-weight: 700; }

.mock-code {
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.5;
  color: #E4E4E7;
}

.dissect-stacked {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mini-tag {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 800;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--craft-paper-border);
  padding: 1px 6px;
  margin-bottom: 8px;
  border-radius: 2px;
}

.dissect-title-sm {
  font-size: 1.05rem;
  font-weight: 800;
  margin: 0 0 8px 0;
}

.dissect-chat-sm {
  font-size: 0.86rem;
  color: var(--vp-c-text-2);
  line-height: 1.55;
  margin: 0;
}

/* ==========================================================================
   Section 3: Staggered Installation Steps
   ========================================================================== */
.steps-wrap {
  margin-bottom: 72px;
}

.steps-h2 {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 32px 0;
}

.steps-staggered {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  align-items: center;
}

@media (max-width: 800px) {
  .steps-staggered {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .step-link-arrow {
    transform: rotate(90deg);
    margin: 8px auto;
  }
}

.step-card {
  background: var(--craft-paper-card);
  border: 2px solid var(--craft-paper-border);
  box-shadow: var(--craft-shadow);
  border-radius: 6px;
  padding: 24px;
  position: relative;
}

.step-one {
  transform: translateY(-8px);
}

.step-order {
  display: inline-block;
  font-size: 0.88rem;
  font-weight: 900;
  color: var(--vp-c-brand-1);
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}

.step-h3 {
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0 0 10px 0;
}

.step-text {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.step-btn-dl {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  background: var(--vp-c-brand-1);
  color: #fff !important;
  border: 1.5px solid var(--craft-paper-border);
  box-shadow: var(--craft-shadow-sm);
  border-radius: 3px;
  font-size: 0.88rem;
  font-weight: 700;
  text-decoration: none !important;
  transition: var(--craft-snap);
}

.step-btn-dl:hover {
  transform: translate(-1px, -1px);
  box-shadow: var(--craft-shadow);
}

.cli-copy-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--vp-c-bg-alt);
  border: 1.5px solid var(--craft-paper-border);
  padding: 6px 10px;
  border-radius: 3px;
}

.cli-cmd {
  font-family: var(--vp-font-family-mono);
  font-size: 0.84rem;
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.cli-copy-btn {
  padding: 4px 10px;
  background: var(--craft-accent-acid);
  color: #171719;
  border: 1px solid #171719;
  border-radius: 2px;
  font-size: 0.76rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 1px 1px 0px #171719;
}

.cli-copy-btn:active {
  transform: translate(1px, 1px);
  box-shadow: none;
}

.copied-text {
  color: #0E6245;
}

.step-link-arrow {
  color: var(--craft-ink-muted);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ==========================================================================
   Section 4: Manifesto Dossier & Big Numbers
   ========================================================================== */
.dossier-wrap {
  border-top: 2px dashed var(--craft-paper-border);
  padding-top: 48px;
}

.dossier-inner {
  display: grid;
  grid-template-columns: 45% 55%;
  gap: 36px;
  align-items: center;
}

@media (max-width: 800px) {
  .dossier-inner {
    grid-template-columns: 1fr;
  }
}

.dossier-tag {
  display: inline-block;
  font-size: 0.76rem;
  font-weight: 800;
  padding: 2px 8px;
  background: var(--craft-accent-acid);
  color: #171719;
  border: 1.5px solid #171719;
  box-shadow: 1.5px 1.5px 0px #171719;
  border-radius: 2px;
  margin-bottom: 12px;
}

.dossier-title {
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 16px 0;
}

.dossier-chat {
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.dossier-chat p {
  margin: 0 0 4px 0;
}

.dossier-right {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-cube {
  background: var(--craft-paper-card);
  border: 2px solid var(--craft-paper-border);
  box-shadow: var(--craft-shadow-sm);
  border-radius: 4px;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.highlight-cube {
  background: var(--craft-accent-warm);
  border-color: var(--vp-c-brand-1);
}

.stat-number {
  font-size: 2.2rem;
  font-weight: 900;
  line-height: 1;
  color: var(--vp-c-text-1);
  letter-spacing: -0.03em;
}

.stat-number small {
  font-size: 1.1rem;
  font-weight: 700;
  margin-left: 2px;
}

.stat-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--vp-c-text-3);
}
</style>
