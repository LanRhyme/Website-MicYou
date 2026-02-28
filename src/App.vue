<script setup>
import NavBar from "./components/NavBar.vue";
import HeroSection from "./components/HeroSection.vue";
import FeaturesSection from "./components/FeaturesSection.vue";
import DownloadSection from "./components/DownloadSection.vue";
import ContributorsSection from "./components/ContributorsSection.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <div class="app-container">
    <NavBar />
    <main>
      <HeroSection />
      <FeaturesSection />
      <DownloadSection />
      <ContributorsSection />
    </main>
    <Footer />
  </div>
</template>

<style>
/* Global styles often go in theme.css or global.css, but App.vue is fine for layout root */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--md-sys-color-background);
  color: var(--md-sys-color-on-background);
}

html {
  scroll-behavior: smooth;
}

/* Scrollbar styling for Webkit */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--md-sys-color-surface);
}

::-webkit-scrollbar-thumb {
  background: var(--md-sys-color-outline);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--md-sys-color-outline-variant);
}
</style>
