<script setup>
import { withBase } from 'vitepress'
import { useRelease } from '../../useRelease'

const { release } = useRelease()
</script>

<template>
  <footer class="landing-footer">
    <div class="footer-glow-line" aria-hidden="true"></div>
    <div class="footer-container">
      <div class="footer-main-grid">
        <!-- Brand Info -->
        <div class="footer-brand-col">
          <div class="footer-brand">
            <img :src="withBase('/logo.svg')" width="28" height="28" alt="Juejin Sync" class="brand-icon" />
            <span class="brand-title">掘金同步助手</span>
          </div>
          <p class="brand-mission">
            面向掘金博主与技术作者的 Chrome 开源扩展。一键流转多平台草稿箱，原图无损转存，自动排版适配，100% 端侧隐私安全。
          </p>
          <div class="brand-meta-pills">
            <span class="meta-pill">Manifest V3</span>
            <span class="meta-pill">TypeScript</span>
            <span class="meta-pill">MIT License</span>
            <span class="meta-pill">{{ release.version || 'v1.5.0' }}</span>
          </div>
        </div>

        <!-- Links Column 1: Supported Platforms -->
        <div class="footer-links-col">
          <h4 class="links-title">支持平台</h4>
          <ul class="links-list">
            <li><a href="/#features" class="footer-link">微信公众号 (图文与封面)</a></li>
            <li><a href="/#features" class="footer-link">知乎专栏 (Draft.js 保真)</a></li>
            <li><a href="/#features" class="footer-link">CSDN 博客 (专栏分类匹配)</a></li>
            <li><a href="/#features" class="footer-link">博客园随笔 (原生 Markdown)</a></li>
          </ul>
        </div>

        <!-- Links Column 2: Documentation -->
        <div class="footer-links-col">
          <h4 class="links-title">使用文档</h4>
          <ul class="links-list">
            <li><a href="/guide/quick-start" class="footer-link">3 分钟快速上手</a></li>
            <li><a href="/guide/installation" class="footer-link">离线包两步安装</a></li>
            <li><a href="/guide/dry-run" class="footer-link">排版预演机制 (Dry-run)</a></li>
            <li><a href="/guide/faq" class="footer-link">常见问题与排错指南</a></li>
          </ul>
        </div>

        <!-- Links Column 3: Open Source & Community -->
        <div class="footer-links-col">
          <h4 class="links-title">开源与社区</h4>
          <ul class="links-list">
            <li><a href="https://github.com/juejin-sync/juejin-sync" target="_blank" rel="noopener" class="footer-link">GitHub 源码仓库 ↗</a></li>
            <li><a href="/changelog/" class="footer-link">版本更新日志 (Changelog)</a></li>
            <li><a href="https://github.com/juejin-sync/juejin-sync/releases" target="_blank" rel="noopener" class="footer-link">Releases 历史发行包 ↗</a></li>
            <li><a href="https://github.com/juejin-sync/juejin-sync/issues" target="_blank" rel="noopener" class="footer-link">提交问题与功能建议 ↗</a></li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom-bar">
        <div class="copyright-text">
          <span>Copyright © 2026 掘金同步助手团队 · 基于 MIT 协议开源</span>
        </div>
        <div class="security-declaration">
          <span class="safe-dot"></span>
          <span>100% 浏览器本地沙箱执行 · 零外部中转 · 零凭据收集</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.landing-footer {
  position: relative;
  background: var(--bento-card-subtle);
  border-top: 1px solid var(--bento-border);
  padding: 64px 0 40px;
  overflow: hidden;
}

.footer-glow-line {
  position: absolute;
  top: 0;
  left: 20%;
  right: 20%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(30, 128, 255, 0.45), transparent);
}

.footer-container {
  max-width: 1220px;
  margin: 0 auto;
  padding: 0 24px;
}

.footer-main-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 40px;
  margin-bottom: 52px;
}

@media (max-width: 900px) {
  .footer-main-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 560px) {
  .footer-main-grid {
    grid-template-columns: 1fr;
  }
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.brand-icon {
  border-radius: 6px;
}

.brand-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--bento-text-title);
}

.brand-mission {
  font-size: 0.88rem;
  line-height: 1.65;
  color: var(--bento-text-body);
  margin: 0 0 18px 0;
  max-width: 380px;
}

.brand-meta-pills {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.meta-pill {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--bento-card-bg);
  border: 1px solid var(--bento-border);
  color: var(--bento-text-muted);
}

.links-title {
  font-size: 0.88rem;
  font-weight: 650;
  color: var(--bento-text-title);
  margin: 0 0 16px 0;
  letter-spacing: -0.01em;
}

.links-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-link {
  font-size: 0.85rem;
  color: var(--bento-text-muted);
  text-decoration: none !important;
  transition: color 0.15s ease;
}

.footer-link:hover {
  color: var(--vp-c-brand-1);
}

.footer-bottom-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 28px;
  border-top: 1px solid var(--bento-inner-border);
  flex-wrap: wrap;
  gap: 14px;
  font-size: 0.8rem;
  color: var(--bento-text-muted);
}

.security-declaration {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: #10B981;
}

.safe-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10B981;
  box-shadow: 0 0 6px #10B981;
}
</style>
