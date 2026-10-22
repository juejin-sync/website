<script setup>
import LandingNav from './home/LandingNav.vue'
import HeroSimulator from './home/HeroSimulator.vue'
import BentoFeatures from './home/BentoFeatures.vue'
import QuickInstall from './home/QuickInstall.vue'
import SecurityDossier from './home/SecurityDossier.vue'
import LandingFooter from './home/LandingFooter.vue'
</script>

<template>
  <div class="landing-page-root">
    <!-- 1. Floating Frosted Capsule Navbar -->
    <LandingNav />

    <!-- Main Content Area -->
    <main class="landing-main">
      <!-- 2. Hero Section & Interactive Sync Pipeline Simulator -->
      <HeroSimulator />

      <!-- 3. Asymmetric Bento Box Grid (Core Capabilities) -->
      <BentoFeatures />

      <!-- 4. Fast Onboarding & 2-Step Installation Guide -->
      <QuickInstall />

      <!-- 5. Client-side Security Metrics & Open Source Dossier -->
      <SecurityDossier />
    </main>

    <!-- 6. Immersive Tech Footer -->
    <LandingFooter />
  </div>
</template>

<style scoped>
.landing-page-root {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  background-color: var(--bento-bg);
}

.landing-main {
  position: relative;
  width: 100%;
  padding-top: 72px; /* 给悬浮顶部导航留出空间 */
}
</style>
