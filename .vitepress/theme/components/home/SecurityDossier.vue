<script setup>
import { useRelease } from '../../useRelease'

const { release } = useRelease()
</script>

<template>
  <section class="dossier-section">
    <div class="dossier-container">
      <div class="dossier-grid">
        <!-- Metric 1 -->
        <div class="metric-card">
          <div class="metric-num-wrap">
            <span class="metric-num">0</span>
            <span class="metric-unit">Server</span>
          </div>
          <span class="metric-title">零外部后端依赖</span>
          <p class="metric-desc">不自建任何中转服务器，鉴权与上传均在当前浏览器同源完成。</p>
        </div>

        <!-- Metric 2 -->
        <div class="metric-card">
          <div class="metric-num-wrap">
            <span class="metric-num">4</span>
            <span class="metric-unit">Platforms</span>
          </div>
          <span class="metric-title">多航道并行调度</span>
          <p class="metric-desc">支持微信公众号、知乎专栏、CSDN 与博客园草稿箱原子级写入。</p>
        </div>

        <!-- Metric 3 -->
        <div class="metric-card">
          <div class="metric-num-wrap">
            <span class="metric-num">{{ release.size ? release.size.replace('约 ', '') : '1.05 MB' }}</span>
          </div>
          <span class="metric-title">极致轻量打包</span>
          <p class="metric-desc">轻量化扩展架构，冷启动无感加载，毫秒级注入发文抽屉。</p>
        </div>

        <!-- Metric 4 -->
        <div class="metric-card highlight-card">
          <div class="metric-num-wrap">
            <span class="metric-num">100<small>%</small></span>
            <span class="metric-unit">Client-Side</span>
          </div>
          <span class="metric-title">端侧零信任底座</span>
          <p class="metric-desc">绝不触碰全局敏感 Cookies，代码在 GitHub 接受全球开发者审计。</p>
        </div>
      </div>

      <!-- Trust Bar -->
      <div class="trust-bar">
        <div class="trust-left">
          <span class="trust-tag">MIT Open Source</span>
          <span class="trust-desc">由技术博主为创作者量身打磨，代码完全开源，承诺永久免费。</span>
        </div>
        <div class="trust-right">
          <a :href="release.githubUrl" target="_blank" rel="noopener" class="trust-link">
            <span>浏览 GitHub 仓库源码</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dossier-section {
  padding: 56px 0 72px;
}

.dossier-container {
  max-width: 1220px;
  margin: 0 auto;
  padding: 0 24px;
}

.dossier-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

@media (max-width: 960px) {
  .dossier-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 540px) {
  .dossier-grid {
    grid-template-columns: 1fr;
  }
}

.metric-card {
  padding: 24px;
  border-radius: var(--bento-radius);
  background: var(--bento-card-bg);
  border: 1px solid var(--bento-border);
  box-shadow: var(--bento-shadow);
  display: flex;
  flex-direction: column;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.metric-card:hover {
  border-color: var(--bento-border-hover);
  transform: translateY(-2px);
  box-shadow: var(--bento-shadow-hover);
}

.highlight-card {
  border-color: rgba(30, 128, 255, 0.25);
  background: var(--bento-card-bg);
}

.metric-num-wrap {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 8px;
}

.metric-num {
  font-family: var(--font-mono);
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--bento-text-title);
  line-height: 1;
}

.metric-num small {
  font-size: 1.2rem;
}

.metric-unit {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.metric-title {
  font-size: 0.95rem;
  font-weight: 650;
  color: var(--bento-text-title);
  margin-bottom: 6px;
}

.metric-desc {
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--bento-text-muted);
  margin: 0;
}

.trust-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-radius: var(--bento-radius-sm);
  background: var(--bento-card-bg);
  border: 1px solid var(--bento-border);
  flex-wrap: wrap;
  gap: 16px;
}

.trust-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.trust-tag {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.trust-desc {
  font-size: 0.86rem;
  color: var(--bento-text-body);
}

.trust-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none !important;
  transition: opacity 0.2s ease;
}

.trust-link:hover {
  opacity: 0.85;
}
</style>
