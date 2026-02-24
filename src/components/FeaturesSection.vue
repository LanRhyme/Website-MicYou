<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import FeatureCard from "./FeatureCard.vue";

const { t } = useI18n();

const features = computed(() => [
	{
		icon: "speed",
		title: t("features.latencyTitle"),
		description: t("features.latencyDesc"),
	},
	{
		icon: "mic_external_on",
		title: t("features.qualityTitle"),
		description: t("features.qualityDesc"),
	},
	{
		icon: "wifi_tethering",
		title: t("features.connectionTitle"),
		description: t("features.connectionDesc"),
	},
	{
		icon: "devices",
		title: t("features.crossPlayTitle"),
		description: t("features.crossPlayDesc"),
	},
	{
		icon: "settings_input_component",
		title: t("features.setupTitle"),
		description: t("features.setupDesc"),
	},
	{
		icon: "security",
		title: t("features.privacyTitle"),
		description: t("features.privacyDesc"),
	},
]);
</script>

<template>
  <section id="features" class="features-section">
    <div class="features-header">
      <h2 class="features-title">{{ t('features.title') }}</h2>
      <p class="features-subtitle">{{ t('features.subtitle') }}</p>
    </div>
    
    <div class="features-grid">
      <FeatureCard 
        v-for="(feature, index) in features" 
        :key="index"
        :icon="feature.icon"
        :title="feature.title"
        :description="feature.description"
        :delay="index * 100"
      />
    </div>
  </section>
</template>

<style scoped>
.features-section {
  padding: 100px 24px;
  background-color: var(--md-sys-color-background);
  max-width: 1200px;
  margin: 0 auto;
}

.features-header {
  text-align: center;
  margin-bottom: 64px;
}

.features-title {
  font-family: 'Roboto', sans-serif;
  font-size: 36px; /* Headline Large */
  font-weight: 700;
  color: var(--md-sys-color-on-surface);
  margin-bottom: 16px;
}

.features-subtitle {
  font-size: 18px; /* Body Large */
  color: var(--md-sys-color-on-surface-variant);
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}
</style>
