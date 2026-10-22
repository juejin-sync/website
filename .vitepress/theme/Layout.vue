<script setup>
import DefaultTheme from 'vitepress/theme'
import { useRelease } from './useRelease'
import { trackDownload } from './tracker'

const { Layout } = DefaultTheme
const { release } = useRelease()

const handleDownload = () => {
  trackDownload(release.value.version ? `juejin-sync-${release.value.version}.zip` : 'juejin-sync-latest.zip')
}
</script>

<template>
  <Layout>
    <!-- 统一品牌微胶囊版本标签 -->
    <template #nav-bar-title-after>
      <span class="global-nav-badge">v1.4</span>
    </template>

    <!-- 统一顶部高光下载按钮 -->
    <template #nav-bar-content-after>
      <div class="global-nav-extra">
        <a :href="release.downloadUrl" download @click="handleDownload" class="global-nav-dl-btn">
          <span>下载扩展</span>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </a>
      </div>
    </template>
  </Layout>
</template>

<style>
/* 全局注入的导航附加项样式 */
.global-nav-badge {
  font-family: var(--font-mono, monospace);
  font-size: 0.68rem;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 9999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  margin-left: 8px;
  vertical-align: middle;
}

.global-nav-extra {
  display: flex;
  align-items: center;
  margin-left: 12px;
}

.global-nav-dl-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border-radius: 9999px;
  background: linear-gradient(135deg, #1E80FF 0%, #0056CC 100%);
  color: #FFFFFF !important;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none !important;
  box-shadow: 0 2px 10px rgba(30, 128, 255, 0.35);
  transition: all 0.2s ease;
  white-space: nowrap;
}

.global-nav-dl-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(30, 128, 255, 0.45);
}

@media (max-width: 768px) {
  .global-nav-extra {
    display: none;
  }
}
</style>
