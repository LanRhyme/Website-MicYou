<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const contributors = ref([]);
const loading = ref(true);
const error = ref("");

const fetchContributors = async () => {
	loading.value = true;
	error.value = "";
	try {
		const res = await fetch(
			"https://api.github.com/repos/LanRhyme/MicYou/contributors?per_page=100",
		);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const data = await res.json();
		if (!Array.isArray(data)) {
			throw new Error(t("contributors.unexpectedResponse"));
		}
		contributors.value = data
			.filter(
				(c) => c.type === "User" && !c.login.toLowerCase().includes("bot"),
			)
			.sort((a, b) => b.contributions - a.contributions);
	} catch (err) {
		console.error("Failed to load contributors:", err);
		error.value = t("contributors.error");
	} finally {
		loading.value = false;
	}
};

const retry = () => {
	fetchContributors();
};

onMounted(() => {
	fetchContributors();
});

const isAuthor = (login) => ["LanRhyme", "ChinsaaWei"].includes(login);
</script>

<template>
  <section id="contributors" class="contributors">
    <h2>{{ t('contributors.title') }}</h2>
    <p class="subtitle">{{ t('contributors.subtitle') }}</p>

    <div v-if="loading" class="loading">{{ t('contributors.loading') }}</div>
    <div v-else-if="error" class="error">{{ t('contributors.error') }}<button @click="retry" class="retry-btn">{{ t('contributors.retry') }}</button></div>
    <div v-else class="grid">
      <a
        v-for="c in contributors"
        :key="c.id"
        :href="c.html_url"
        target="_blank"
        rel="noopener"
        class="card"
      >
        <img :src="c.avatar_url" :alt="c.login" class="avatar" />
        <div class="info">
          <span class="name">{{ c.login }}
            <span v-if="isAuthor(c.login)" class="author-badge">{{ t('contributors.authorBadge') }}</span>
          </span>
          <span class="contribs">{{ c.contributions }} {{ t('contributors.contributions') }}</span>
        </div>
      </a>
    </div>
  </section>
</template>

<style scoped>
.contributors {
  padding: 60px 24px;
  background: var(--md-sys-color-surface);
  text-align: center;
}

h2 {
  font: var(--md-sys-typescale-headline-large);
  color: var(--md-sys-color-on-surface);
  margin-bottom: 12px;
}

.subtitle {
  font: var(--md-sys-typescale-body-large);
  color: var(--md-sys-color-on-surface-variant);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.loading, .error {
  font: var(--md-sys-typescale-body-medium);
  color: var(--md-sys-color-on-surface-variant);
  padding: 40px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--md-sys-color-surface-variant);
  border-radius: var(--md-sys-shape-corner-medium);
  text-decoration: none;
  color: inherit;
  transition: background 0.2s;
}

.card:hover {
  background: color-mix(in srgb, var(--md-sys-color-surface-variant), white 5%);
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.name {
  font: var(--md-sys-typescale-title-medium);
  color: var(--md-sys-color-on-surface);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-badge {
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  font: var(--md-sys-typescale-label-small);
  padding: 2px 8px;
  border-radius: var(--md-sys-shape-corner-small);
}

.contribs {
  font: var(--md-sys-typescale-body-small);
  color: var(--md-sys-color-on-surface-variant);
}

.retry-btn {
  margin-left: 12px;
  padding: 6px 12px;
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  border: none;
  border-radius: var(--md-sys-shape-corner-small);
  font: var(--md-sys-typescale-label-medium);
  cursor: pointer;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: color-mix(in srgb, var(--md-sys-color-primary), white 10%);
}
</style>