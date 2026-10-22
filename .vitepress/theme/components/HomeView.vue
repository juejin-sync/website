<script setup>
import HeroSimulator from './home/HeroSimulator.vue'
import BentoFeatures from './home/BentoFeatures.vue'
import QuickInstall from './home/QuickInstall.vue'
import SecurityDossier from './home/SecurityDossier.vue'
</script>

<template>
  <div class="home-wrapper">
    <!-- 1. Hero & Interactive Sync Pipeline Simulator -->
    <HeroSimulator />

    <!-- 2. Asymmetric Bento Box Grid (Core Capabilities) -->
    <BentoFeatures />

    <!-- 3. Fast Onboarding & 2-Step Installation Guide -->
    <QuickInstall />

    <!-- 4. Client-side Security Metrics & Open Source Dossier -->
    <SecurityDossier />
  </div>
</template>

<style scoped>
.home-wrapper {
  position: relative;
  width: 100%;
  min-height: 100vh;
}
</style>
