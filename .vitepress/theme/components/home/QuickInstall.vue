<script setup>
import { ref } from 'vue'
import { useRelease } from '../../useRelease'
import { trackDownload } from '../../tracker'

const { release } = useRelease()
const copied = ref(false)

const handleDownload = () => {
  trackDownload(release.value.version ? `juejin-sync-${release.value.version}.zip` : 'juejin-sync-latest.zip')
}

const copyChromeUrl = async () => {
  try {
    await navigator.clipboard.writeText('chrome://extensions')
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    // clipboard fallback
  }
}
</script>

<template>
  <section id="quick-install" class="install-section">
    <div class="install-container">
      <div class="install-head">
        <div class="install-kicker">
          <span class="kicker-glow"></span>
          <span>Fast Onboarding</span>
        </div>
        <h2 class="install-title">两步极简安装，即装即用</h2>
        <p class="install-desc">
          国内网络无需魔法翻墙，无需繁琐设置，全系 Chromium 内核浏览器（Chrome、Edge、Brave、360 等）通用支持。
        </p>
      </div>

      <!-- Step Cards Grid -->
      <div class="install-cards-grid">
        <!-- Step 1 Card -->
        <div class="install-step-card">
          <div class="step-badge-wrap">
            <span class="step-num">01</span>
            <span class="step-subtitle">下载离线安装包</span>
          </div>
          <h3 class="step-heading">获取最新发布压缩包并解压</h3>
          <p class="step-body">
            点击下方按钮下载官方原版离线 ZIP 压缩包，解压后存放在本地固定文件夹（解压后的文件夹请保留，不要随意删除）。
          </p>

          <div class="step-action-area">
            <a :href="release.downloadUrl" download @click="handleDownload" class="dl-action-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <div class="dl-btn-text">
                <span class="dl-title">下载离线包 ({{ release.version }})</span>
                <span class="dl-meta">{{ release.size }} · 免翻直链</span>
              </div>
            </a>
          </div>
        </div>

        <!-- Step 2 Card -->
        <div class="install-step-card">
          <div class="step-badge-wrap">
            <span class="step-num">02</span>
            <span class="step-subtitle">载入浏览器扩展</span>
          </div>
          <h3 class="step-heading">开启开发者模式并拖入文件夹</h3>
          <p class="step-body">
            在浏览器地址栏打开扩展管理页，开启右上角「开发者模式」，点击「加载已解压的扩展程序」（或直接将文件夹拖入窗口）即可启用。
          </p>

          <div class="step-action-area">
            <div class="terminal-command-box">
              <div class="cmd-content">
                <span class="cmd-prompt">url</span>
                <span class="cmd-text">chrome://extensions</span>
              </div>
              <button type="button" class="cmd-copy-btn" @click="copyChromeUrl" title="复制管理页地址">
                <span v-if="!copied">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  复制地址
                </span>
                <span v-else class="copied-feedback">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  已复制
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.install-section {
  padding: 64px 0 80px;
  background: var(--bento-card-subtle);
  border-top: 1px solid var(--bento-border);
  border-bottom: 1px solid var(--bento-border);
}

.install-container {
  max-width: 1220px;
  margin: 0 auto;
  padding: 0 24px;
}

.install-head {
  text-align: center;
  max-width: 680px;
  margin: 0 auto 52px;
}

.install-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: 9999px;
  background: var(--bento-card-bg);
  border: 1px solid var(--bento-border);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 16px;
}

.kicker-glow {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 8px var(--vp-c-brand-1);
}

.install-title {
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  margin: 0 0 16px 0;
  color: var(--bento-text-title);
}

@media (max-width: 640px) {
  .install-title {
    font-size: 1.85rem;
  }
}

.install-desc {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--bento-text-body);
  margin: 0;
}

.install-cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 860px) {
  .install-cards-grid {
    grid-template-columns: 1fr;
  }
}

.install-step-card {
  border-radius: var(--bento-radius);
  background: var(--bento-card-bg);
  border: 1px solid var(--bento-border);
  box-shadow: var(--bento-shadow);
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

.install-step-card:hover {
  border-color: var(--bento-border-hover);
  transform: translateY(-2px);
  box-shadow: var(--bento-shadow-hover);
}

.step-badge-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.step-num {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 700;
  color: #FFFFFF;
  background: var(--vp-c-brand-1);
  padding: 2px 8px;
  border-radius: 6px;
}

.step-subtitle {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--bento-text-muted);
}

.step-heading {
  font-size: 1.3rem;
  font-weight: 650;
  color: var(--bento-text-title);
  margin: 0 0 12px 0;
}

.step-body {
  font-size: 0.92rem;
  line-height: 1.6;
  color: var(--bento-text-body);
  margin: 0 0 28px 0;
}

.dl-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 22px;
  border-radius: var(--bento-radius-sm);
  background: linear-gradient(135deg, #1E80FF 0%, #0056CC 100%);
  color: #FFFFFF !important;
  text-decoration: none !important;
  box-shadow: 0 4px 16px rgba(30, 128, 255, 0.3);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.dl-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(30, 128, 255, 0.4);
}

.dl-btn-text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}

.dl-title {
  font-size: 0.92rem;
  font-weight: 600;
}

.dl-meta {
  font-size: 0.72rem;
  opacity: 0.88;
  font-family: var(--font-mono);
}

.terminal-command-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bento-card-subtle);
  border: 1px solid var(--bento-inner-border);
  border-radius: var(--bento-radius-sm);
  padding: 8px 14px;
}

.cmd-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cmd-prompt {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.cmd-text {
  font-family: var(--font-mono);
  font-size: 0.88rem;
  color: var(--bento-text-title);
  font-weight: 500;
}

.cmd-copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  background: var(--bento-card-bg);
  border: 1px solid var(--bento-border);
  color: var(--bento-text-title);
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cmd-copy-btn:hover {
  border-color: var(--bento-border-hover);
}

.copied-feedback {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #10B981;
  font-weight: 600;
}
</style>
