<script setup>
defineProps({
	icon: String,
	title: String,
	description: String,
	delay: Number, // for animation stagger
});
</script>

<template>
  <div class="feature-card" :style="{ animationDelay: `${delay}ms` }">
    <div class="icon-container">
      <span class="material-symbols-rounded feature-icon">{{ icon }}</span>
    </div>
    <h3 class="feature-title">{{ title }}</h3>
    <p class="feature-description">{{ description }}</p>
  </div>
</template>

<style scoped>
.feature-card {
  background-color: var(--md-sys-color-surface-variant);
  color: var(--md-sys-color-on-surface-variant);
  border-radius: var(--md-sys-shape-corner-medium);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: transform 0.3s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.3s cubic-bezier(0.2, 0, 0, 1);
  cursor: default;
  position: relative;
  overflow: hidden;
  opacity: 0;
  animation: fadeUp 0.8s cubic-bezier(0.2, 0, 0, 1) forwards;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-card:hover {
  transform: translateY(-4px);
  background-color: color-mix(in srgb, var(--md-sys-color-surface-variant), white 5%);
  box-shadow: var(--md-sys-elevation-level3);
}

.icon-container {
  width: 48px;
  height: 48px;
  border-radius: 50%; /* MD3 uses circles for icons often in small containers */
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.feature-icon {
  font-size: 24px;
}

.feature-title {
  font-family: 'Roboto', sans-serif;
  font-size: 22px;
  font-weight: 500; /* Title Large */
  color: var(--md-sys-color-on-surface);
}

.feature-description {
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400; /* Body Medium */
  line-height: 20px;
  opacity: 0.8;
}
</style>
