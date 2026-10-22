<script setup>
import { useRelease } from '../useRelease'
import { trackDownload } from '../tracker'

const { release } = useRelease()

const handleDownload = () => {
  trackDownload(release.value.version ? `juejin-sync-${release.value.version}.zip` : 'juejin-sync-latest.zip')
}
</script>

<template>
  <div class="craft-dl-container">
    <div class="craft-dl-card">
      <div class="craft-tape-badge">离线安装包</div>

      <div class="craft-dl-header">
        <h3 class="craft-dl-title">不用翻墙，直接下载。</h3>
        <p class="craft-dl-desc">
          <span>解压后拖进浏览器。</span>
          <span>两步开启，当场就能用。</span>
          <span>不用折腾任何外部网络。</span>
        </p>
      </div>

      <div class="craft-btn-row">
        <a :href="release.downloadUrl" download @click="handleDownload" class="craft-btn-primary">
          <svg class="craft-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <div class="craft-btn-info">
            <span class="craft-btn-main">下载 ZIP 压缩包</span>
            <span class="craft-btn-sub">{{ release.version }} · {{ release.size }}</span>
          </div>
        </a>

        <a :href="release.githubUrl" target="_blank" rel="noopener" class="craft-btn-ghost">
          <svg class="craft-svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <span>查看 GitHub 源码 ↗</span>
        </a>
      </div>

      <div class="craft-specs-grid">
        <div class="craft-spec-tag">
          <span class="craft-dot"></span>
          <span>全 Chromium 内核通用</span>
        </div>
        <div class="craft-spec-tag">
          <span class="craft-dot"></span>
          <span>现代 Manifest V3 架构</span>
        </div>
        <div class="craft-spec-tag">
          <span class="craft-dot"></span>
          <span>纯本地运行，零泄露</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.craft-dl-container {
  margin: 32px 0 40px;
}

.craft-dl-card {
  position: relative;
  background: var(--craft-paper-card);
  border: 2px solid var(--craft-paper-border);
  box-shadow: var(--craft-shadow);
  border-radius: 6px;
  padding: 32px 28px 24px;
  background-image: 
    radial-gradient(var(--craft-paper-border) 0.6px, transparent 0.6px);
  background-size: 14px 14px;
}

.craft-tape-badge {
  position: absolute;
  top: -12px;
  left: 24px;
  background: var(--craft-accent-acid);
  color: #171719;
  border: 1.5px solid #171719;
  font-size: 0.78rem;
  font-weight: 800;
  padding: 2px 10px;
  letter-spacing: 0.05em;
  transform: rotate(-1.5deg);
  box-shadow: 2px 2px 0px #171719;
}

.dark .craft-tape-badge {
  box-shadow: 2px 2px 0px #000000;
}

.craft-dl-title {
  font-size: 1.45rem;
  font-weight: 800;
  margin: 0 0 10px 0;
  color: var(--vp-c-text-1);
}

.craft-dl-desc {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.92rem;
  color: var(--vp-c-text-2);
  margin: 0 0 24px 0;
}

.craft-btn-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
}

.craft-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 22px;
  background: var(--vp-c-brand-1);
  color: #FFFFFF !important;
  border: 2px solid var(--craft-paper-border);
  border-radius: 4px;
  box-shadow: var(--craft-shadow-sm);
  text-decoration: none !important;
  font-weight: 700;
  transition: var(--craft-snap);
}

.craft-btn-primary:hover {
  transform: translate(-1px, -1px);
  box-shadow: var(--craft-shadow);
}

.craft-btn-primary:active {
  transform: translate(2px, 2px);
  box-shadow: var(--craft-shadow-active);
}

.craft-btn-info {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}

.craft-btn-main {
  font-size: 0.95rem;
}

.craft-btn-sub {
  font-size: 0.75rem;
  opacity: 0.9;
}

.craft-btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1) !important;
  border: 2px solid var(--craft-paper-border);
  border-radius: 4px;
  box-shadow: var(--craft-shadow-sm);
  text-decoration: none !important;
  font-size: 0.9rem;
  font-weight: 700;
  transition: var(--craft-snap);
}

.craft-btn-ghost:hover {
  transform: translate(-1px, -1px);
  box-shadow: var(--craft-shadow);
}

.craft-btn-ghost:active {
  transform: translate(2px, 2px);
  box-shadow: var(--craft-shadow-active);
}

.craft-specs-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  padding-top: 18px;
  border-top: 1.5px dashed var(--craft-paper-border);
}

.craft-spec-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.craft-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--craft-accent-green);
  border: 1px solid var(--craft-paper-border);
}
</style>
