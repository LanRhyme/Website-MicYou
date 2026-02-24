<script setup>
import Button from "./Button.vue";
</script>

<template>
  <section class="hero-section">
    <div class="hero-content">
      <h1 class="hero-title">
        {{ $t('hero.titleTop') }} <br>
        <span class="gradient-text">{{ $t('hero.titleBottom') }}</span>
      </h1>
      <p class="hero-subtitle">
        {{ $t('hero.subtitle') }}
      </p>
      
      <div class="hero-actions">
        <Button variant="filled" :label="$t('hero.btnDownload')" icon="download" href="#download" />
        <Button variant="outlined" :label="$t('hero.btnLearnMore')" icon="arrow_forward" href="#features" />
      </div>
    </div>
    
    <div class="hero-visual">
       <!-- Abstract visual representation of waves or a device -->
       <div class="visual-circle circle-1"></div>
       <div class="visual-circle circle-2"></div>
       <div class="visual-grid"></div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 24px 60px;
  position: relative;
  overflow: hidden;
  background: radial-gradient(circle at 50% 10%, #2D2A35 0%, #1C1B1F 60%);
}

.hero-content {
  max-width: 800px;
  text-align: center;
  z-index: 2;
  position: relative;
}

.hero-title {
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-size: 64px;
  line-height: 1.1;
  letter-spacing: -1.5px;
  margin-bottom: 24px;
  color: var(--md-sys-color-on-surface);
}

.gradient-text {
  background: linear-gradient(90deg, #A8C7FA 0%, #D6E3FF 50%, #A8C7FA 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  background-size: 200%;
  animation: shimmer 6s infinite linear;
}

@keyframes shimmer {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

.hero-subtitle {
  font-size: 20px;
  line-height: 1.6;
  color: var(--md-sys-color-on-surface-variant);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

/* Visual Background Elements */
.hero-visual {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.visual-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
}

.circle-1 {
  width: 600px;
  height: 600px;
  background: var(--md-sys-color-primary); /* Primary purple */
  top: -100px;
  right: -100px;
  animation: float 10s infinite ease-in-out;
}

.circle-2 {
  width: 500px;
  height: 500px;
  background: var(--md-sys-color-tertiary); /* Pinkish */
  bottom: -100px;
  left: -100px;
  animation: float 12s infinite ease-in-out reverse;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(20px, 40px); }
}

.visual-grid {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.5;
  mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 40px;
  }
  .hero-subtitle {
    font-size: 16px;
  }
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
