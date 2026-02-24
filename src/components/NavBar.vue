<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Button from "./Button.vue";
import LanguageSwitcher from "./LanguageSwitcher.vue";

const isScrolled = ref(false);

const handleScroll = () => {
	isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
	window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
	window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <header class="navbar" :class="{ 'navbar--scrolled': isScrolled }">
    <div class="navbar-container">
      <div class="navbar-logo">
        <span class="material-symbols-rounded logo-icon">mic</span>
        <span class="logo-text">MicYou</span>
      </div>
      
      <nav class="navbar-links">
        <a href="#features" class="nav-link">{{ $t('nav.features') }}</a>
        <a href="#download" class="nav-link">{{ $t('nav.download') }}</a>
        <a href="https://github.com/LanRhyme/MicYou" target="_blank" class="nav-link">{{ $t('nav.about') }}</a>
      </nav>

      <div class="navbar-actions">
        <Button variant="filled" :label="$t('nav.getStarted')" href="#download" />
        <LanguageSwitcher />
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  z-index: 1000;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px; 
}

.navbar--scrolled {
  background-color: rgba(28, 27, 31, 0.8); /* Surface color with opacity */
  backdrop-filter: blur(12px);
  box-shadow: var(--md-sys-elevation-level2);
}

.navbar-container {
  max-width: 1200px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--md-sys-color-primary);
  font-weight: 700;
  font-size: 22px;
  letter-spacing: -0.5px;
  cursor: pointer;
  user-select: none;
  flex: 1; /* Occupy left space */
}

.logo-icon {
  font-size: 28px;
  color: var(--md-sys-color-primary);
}

.navbar-links {
  display: flex;
  gap: 32px;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1; /* Occupy right space */
  justify-content: flex-end; /* Align actions to the right */
}

.nav-link {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: var(--md-sys-color-primary);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0%; 
  height: 2px;
  background-color: var(--md-sys-color-primary);
  transition: width 0.3s ease;
  border-radius: 2px;
}

.nav-link:hover::after {
  width: 100%;
}

@media (max-width: 768px) {
  .navbar-links {
    display: none; /* Mobile menu needed later ideally */
  }
}
</style>
