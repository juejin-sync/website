<script setup>
import { ref, onMounted } from 'vue'
import { withBase } from 'vitepress'
import { useRelease } from '../../useRelease'
import { trackDownload } from '../../tracker'

const { release } = useRelease()
const isDark = ref(false)

onMounted(() => {
  if (typeof window !== 'undefined') {
    isDark.value = document.documentElement.classList.contains('dark')
    // 监听暗黑模式 class 变化
    const observer = new MutationObserver(() => {
      isDark.value = document.documentElement.classList.contains('dark')
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  }
})

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('vitepress-theme-appearance', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('vitepress-theme-appearance', 'light')
  }
}

const handleDownload = () => {
  trackDownload(release.value.version ? `juejin-sync-${release.value.version}.zip` : 'juejin-sync-latest.zip')
}
</script>

<template>
  <header class="floating-nav-wrapper">
    <nav class="floating-nav">
      <!-- Brand Logo -->
      <a href="/" class="nav-brand" title="掘金同步助手官网">
        <img :src="withBase('/logo.svg')" width="24" height="24" alt="Juejin Sync Logo" class="brand-logo" />
        <span class="brand-text">掘金同步助手</span>
        <span class="brand-badge">{{ release.version || 'v1.5.0' }}</span>
      </a>

      <!-- Navigation Links (与全站内页完全对齐) -->
      <div class="nav-links">
        <a href="#features" class="nav-link">功能特性</a>
        <a href="/guide/" class="nav-link">使用文档</a>
        <a href="/changelog/" class="nav-link">更新日志</a>
        <a href="/guide/faq" class="nav-link">常见排错</a>
      </div>

      <!-- Right Action Controls -->
      <div class="nav-actions">
        <!-- Theme Toggle -->
        <button
          type="button"
          class="theme-toggle-btn"
          :title="isDark ? '切换至亮色模式' : '切换至暗色模式'"
          @click="toggleTheme"
        >
          <svg v-if="isDark" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>

        <!-- GitHub Repo Link -->
        <a
          href="https://github.com/juejin-sync/juejin-sync"
          target="_blank"
          rel="noopener"
          class="nav-icon-link"
          title="GitHub 源码仓库"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </a>

        <!-- Fast Download Pill Button -->
        <a :href="release.downloadUrl" download @click="handleDownload" class="nav-cta-btn">
          <span>下载扩展</span>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </a>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.floating-nav-wrapper {
  position: fixed;
  top: 18px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 1000;
  padding: 0 16px;
  pointer-events: none;
}

.floating-nav {
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  max-width: 1060px;
  width: 100%;
  padding: 8px 14px 8px 18px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.dark .floating-nav {
  background: rgba(15, 18, 24, 0.78);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45), 0 1px 2px rgba(0, 0, 0, 0.2);
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none !important;
  color: var(--bento-text-title);
  flex-shrink: 0;
}

.brand-logo {
  border-radius: 6px;
}

.brand-text {
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.brand-badge {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 9999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
}

.nav-link {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--bento-text-body);
  text-decoration: none !important;
  transition: color 0.15s ease;
}

.nav-link:hover {
  color: var(--vp-c-brand-1);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.theme-toggle-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--bento-border);
  color: var(--bento-text-body);
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-toggle-btn:hover {
  color: var(--bento-text-title);
  border-color: var(--bento-border-hover);
}

.nav-icon-link {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bento-text-body);
  text-decoration: none !important;
  border: 1px solid var(--bento-border);
  transition: all 0.2s ease;
}

.nav-icon-link:hover {
  color: var(--bento-text-title);
  border-color: var(--bento-border-hover);
}

.nav-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 9999px;
  background: var(--vp-c-brand-1);
  color: #FFFFFF !important;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none !important;
  box-shadow: 0 2px 10px rgba(30, 128, 255, 0.3);
  transition: all 0.2s ease;
}

.nav-cta-btn:hover {
  background: #1171EE;
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(30, 128, 255, 0.45);
}
</style>
