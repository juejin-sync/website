<script setup>
import HeroSimulator from './home/HeroSimulator.vue'
import BentoFeatures from './home/BentoFeatures.vue'
import QuickInstall from './home/QuickInstall.vue'
import SecurityDossier from './home/SecurityDossier.vue'
import LandingFooter from './home/LandingFooter.vue'
</script>

<template>
  <div class="landing-page-root">
    <!-- Main Content Area -->
    <main class="landing-main">
      <!-- 1. Hero Section & Interactive Sync Pipeline Simulator -->
      <HeroSimulator />

      <!-- 2. Asymmetric Bento Box Grid (Core Capabilities) -->
      <BentoFeatures />

      <!-- 3. Fast Onboarding & 2-Step Installation Guide -->
      <QuickInstall />

      <!-- 4. Client-side Security Metrics & Open Source Dossier -->
      <SecurityDossier />
    </main>

    <!-- 5. Immersive Tech Footer -->
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
}
</style>
