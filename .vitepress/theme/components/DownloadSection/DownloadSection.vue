<script setup lang="ts">
import { useData } from "vitepress";
import { computed, ref } from "vue";
import { downloadTranslations, type Lang } from "../../../data/i18n";
import ghdata from "../../../../src/ghdata.json";

const { lang } = useData();
const t = computed(
	() =>
		downloadTranslations[lang.value as Lang] || downloadTranslations["zh-CN"],
);

const latestVersion = ref(ghdata.version);
const copiedId = ref<string | null>(null);

const platforms = computed(() => [
	{
		name: "Windows",
		icon: "simple-icons:windows",
		desc: t.value.windowsDesc,
		files: [
			{
				name: t.value.installer,
				pattern: "MicYou-Win-{version}-installer.exe",
			},
			{
				name: `${t.value.portable} (JRE)`,
				pattern: "MicYou-Win-{version}.zip",
			},
			{
				name: `${t.value.portable} (NoJRE)`,
				pattern: "MicYou-Win-NoJRE-{version}.zip",
			},
		],
	},
	{
		name: "macOS",
		icon: "simple-icons:macos",
		desc: t.value.macOSDesc,
		files: [
			{
				name: "DMG (Apple Silicon)",
				pattern: "MicYou-macOS-{version}-arm64.dmg",
			},
			{ name: "DMG (Intel)", pattern: "MicYou-macOS-{version}-x64.dmg" },
			{
				name: `${t.value.portable} (NoJRE)`,
				pattern: "MicYou-macOS-NoJRE-{version}.tar.gz",
			},
		],
	},
	{
		name: "Linux",
		icon: "simple-icons:linux",
		desc: t.value.linuxDesc,
		files: [
			{ name: "DEB", pattern: "MicYou-Linux-{version}.deb" },
			{ name: "RPM", pattern: "MicYou-Linux-{version}.rpm" },
			{ name: "Arch", copy: "paru -S micyou-bin" },
			{
				name: `${t.value.portable} (NoJRE)`,
				pattern: "MicYou-Linux-NoJRE-{version}.tar.gz",
			},
		],
	},
	{
		name: "Android",
		icon: "simple-icons:android",
		desc: t.value.androidDesc,
		files: [{ name: "APK", pattern: "MicYou-Android-{version}.apk" }],
	},
]);

const getUrl = (pattern: string) =>
	`https://github.com/LanRhyme/MicYou/releases/download/v${latestVersion.value}/${pattern.replace("{version}", latestVersion.value)}`;

const copyCmd = async (cmd: string) => {
	await navigator.clipboard.writeText(cmd);
	copiedId.value = cmd;
	setTimeout(() => (copiedId.value = null), 2000);
};
</script>

<template>
  <div class="dl">
    <header class="dl-head">
      <h1>{{ t.title }}</h1>
      <span v-if="latestVersion" class="ver">v{{ latestVersion }}</span>
    </header>

    <div class="card">
      <div v-for="(p, i) in platforms" :key="p.name" class="row" :class="{ 'has-border': i }">
        <div class="info">
          <iconify-icon :icon="p.icon" class="icon" />
          <div>
            <h3>{{ p.name }}</h3>
            <p>{{ p.desc }}</p>
          </div>
        </div>
        <div class="opts">
          <template v-for="f in p.files" :key="f.pattern || f.copy">
            <a v-if="f.pattern" :href="getUrl(f.pattern)" class="btn" target="_blank">
              <iconify-icon icon="mdi:download" />{{ f.name }}
            </a>
            <button v-else class="btn" :class="{ done: copiedId === f.copy }" @click="copyCmd(f.copy!)">
              <iconify-icon :icon="copiedId === f.copy ? 'mdi:check' : 'mdi:content-copy'" />
              {{ copiedId === f.copy ? t.copied : f.name }}
            </button>
          </template>
        </div>
      </div>
    </div>
    <p class="notes"><a href="https://github.com/LanRhyme/MicYou/releases/latest" target="_blank">{{ t.viewReleaseNotes }}</a></p>
  </div>
</template>

<style scoped>
.dl {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 24px;
}

.dl-head {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
  color: #5a7a9d;
}

.dl-head h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.ver {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 20px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border: 1px solid var(--vp-c-brand-1);
}

.card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
}

.row {
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  transition: background 0.2s;
}

.row:hover {
  background: var(--vp-c-bg);
}

.row.has-border {
  border-top: 1px solid var(--vp-c-divider);
}

.info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon {
  font-size: 1.75rem;
  color: var(--vp-c-brand-1);
}

.info h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}

.info p {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  margin: 0;
}

.opts {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover,
.btn.done {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  transform: translateY(-1px);
}

.notes {
  text-align: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--vp-c-divider);
}

.notes a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 500;
}

.notes a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .row {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .dl-head {
    flex-direction: column;
    gap: 12px;
  }

  .dl-head h1 {
    font-size: 1.5rem;
  }
}
</style>