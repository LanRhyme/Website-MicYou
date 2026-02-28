<script setup lang="ts">
import { ref, onMounted } from "vue";
import Button from "./Button.vue";
import { useI18n } from "vue-i18n";
import { detectDevice } from "../utils/device";

const { t } = useI18n();
const AUR_COMMAND = "paru -S micyou-bin";
const exeDownloadUrl = ref(
	"https://github.com/LanRhyme/MicYou/releases/latest",
);
const zipDownloadUrl = ref(
	"https://github.com/LanRhyme/MicYou/releases/latest",
);
const debDownloadUrl = ref(
	"https://github.com/LanRhyme/MicYou/releases/latest",
);
const rpmDownloadUrl = ref(
	"https://github.com/LanRhyme/MicYou/releases/latest",
);
const apkDownloadUrl = ref(
	"https://github.com/LanRhyme/MicYou/releases/latest",
);
const dmgArmDownloadUrl = ref(
	"https://github.com/LanRhyme/MicYou/releases/latest",
);
const dmgX64DownloadUrl = ref(
	"https://github.com/LanRhyme/MicYou/releases/latest",
);
const releaseVersion = ref("Latest");
const isLoading = ref(true);
const aurMessage = ref("");
const recommendedPlatform = ref("unknown");

const copyAurCommand = async () => {
	try {
		await navigator.clipboard.writeText(AUR_COMMAND);
		aurMessage.value = t("download.aurCommandCopied");
		setTimeout(() => {
			aurMessage.value = "";
		}, 3000);
	} catch (err) {
		console.error("Failed to copy:", err);
	}
};

const fetchReleaseData = async () => {
	try {
		const response = await fetch(
			"https://api.github.com/repos/LanRhyme/MicYou/releases/latest",
		);
		if (!response.ok) throw new Error("Failed to fetch");

		const data = await response.json();
		releaseVersion.value = data.tag_name;

		const apkAsset = data.assets.find((asset: { name: string }) =>
			asset.name.endsWith(".apk"),
		);
		const exeAsset = data.assets.find(
			(asset: { name: string }) =>
				asset.name.endsWith(".exe") || asset.name.endsWith(".msi"),
		);
		const zipAsset = data.assets.find((asset: { name: string }) =>
			asset.name.endsWith(".zip"),
		);
		const debAsset = data.assets.find((asset: { name: string }) =>
			asset.name.endsWith(".deb"),
		);
		const rpmAsset = data.assets.find((asset: { name: string }) =>
			asset.name.endsWith(".rpm"),
		);
		const releasePage = data.html_url;
		const dmgAnyAsset = data.assets.find((asset: { name: string }) =>
			asset.name.endsWith(".dmg"),
		);
		const dmgArmAsset = data.assets.find(
			(asset: { name: string }) =>
				asset.name.endsWith(".dmg") &&
				/arm|aarch|apple-silicon|universal/i.test(asset.name),
		);
		const dmgX64Asset = data.assets.find(
			(asset: { name: string }) =>
				asset.name.endsWith(".dmg") &&
				/x64|x86_64|intel|x86-64/i.test(asset.name),
		);

		if (exeAsset) {
			exeDownloadUrl.value = exeAsset.browser_download_url;
		} else {
			exeDownloadUrl.value = releasePage;
		}

		if (zipAsset) {
			zipDownloadUrl.value = zipAsset.browser_download_url;
		} else {
			zipDownloadUrl.value = releasePage;
		}

		if (apkAsset) {
			apkDownloadUrl.value = apkAsset.browser_download_url;
		} else {
			apkDownloadUrl.value = releasePage;
		}

		if (debAsset) {
			debDownloadUrl.value = debAsset.browser_download_url;
		} else {
			debDownloadUrl.value = releasePage;
		}

		if (rpmAsset) {
			rpmDownloadUrl.value = rpmAsset.browser_download_url;
		} else {
			rpmDownloadUrl.value = releasePage;
		}

		if (dmgArmAsset) {
			dmgArmDownloadUrl.value = dmgArmAsset.browser_download_url;
		} else if (dmgAnyAsset && !dmgX64Asset) {
			dmgArmDownloadUrl.value = dmgAnyAsset.browser_download_url;
		} else {
			dmgArmDownloadUrl.value = releasePage;
		}

		if (dmgX64Asset) {
			dmgX64DownloadUrl.value = dmgX64Asset.browser_download_url;
		} else if (dmgAnyAsset && !dmgArmAsset) {
			dmgX64DownloadUrl.value = dmgAnyAsset.browser_download_url;
		} else {
			dmgX64DownloadUrl.value = releasePage;
		}
	} catch (error) {
		console.error("Error fetching release data", error);
	} finally {
		isLoading.value = false;
	}
};

onMounted(() => {
	fetchReleaseData();
});

onMounted(() => {
	try {
		recommendedPlatform.value = detectDevice();
	} catch (error) {
		console.error("Error detecting device:", error);
		recommendedPlatform.value = "unknown";
	}
});
</script>

<template>
  <section id="download" class="download-section">
    <div class="download-content">
      <h2 class="section-title">{{ $t('download.title') }}</h2>
      <p class="section-subtitle">
        {{ $t('download.subtitle') }}
      </p>
      
      <div class="download-grid">
        <!-- Windows Card -->
        <div :class="['download-card', { recommended: recommendedPlatform === 'windows' }]">
          <div v-if="recommendedPlatform === 'windows'" class="badge">{{ $t('download.recommended') }}</div>
          <div class="platform-icon">
             <span class="material-symbols-rounded">desktop_windows</span>
          </div>
          <h3 class="platform-name">{{ $t('download.winClient') }}</h3>
          <p class="platform-desc">{{ $t('download.winReq') }}</p>
          <div class="store-buttons">
             <Button 
               :variant="recommendedPlatform === 'windows' ? 'filled' : 'outlined'" 
               :label="isLoading ? $t('download.loading') : $t('download.btnWinDownload')" 
               icon="download" 
               :href="exeDownloadUrl" 
             />
             <Button 
               :variant="recommendedPlatform === 'windows' ? 'outlined' : 'outlined'" 
               :label="$t('download.btnWinZip')" 
               icon="download" 
               :href="zipDownloadUrl" 
             />
          </div>
          <div class="version-info">{{ releaseVersion }} • {{ $t('download.bit64') }}</div>
        </div>

        <!-- Android Card -->
        <div :class="['download-card', { recommended: recommendedPlatform === 'android' }]">
          <div v-if="recommendedPlatform === 'android'" class="badge">{{ $t('download.recommended') }}</div>
          <div class="platform-icon">
             <span class="material-symbols-rounded">smartphone</span>
          </div>
          <h3 class="platform-name">{{ $t('download.androidApp') }}</h3>
          <p class="platform-desc">{{ $t('download.androidReq') }}</p>
          <div class="store-buttons">
             <Button :variant="recommendedPlatform === 'android' ? 'filled' : 'outlined'" :label="$t('download.btnApk')" icon="android" :href="apkDownloadUrl" />
          </div>
          <div class="version-info">{{ releaseVersion }}</div>
        </div>

          <!-- Mac Card -->
          <div :class="['download-card', { recommended: recommendedPlatform === 'mac_arm' || recommendedPlatform === 'mac_x64' }]">
            <div v-if="recommendedPlatform === 'mac_arm' || recommendedPlatform === 'mac_x64'" class="badge">{{ $t('download.recommended') }}</div>
           <div class="platform-icon">
             <span class="material-symbols-rounded">laptop_mac</span>
           </div>
           <h3 class="platform-name">{{ $t('download.macClient') }}</h3>
           <p class="platform-desc">{{ $t('download.macReq') }}</p>
           <div class="store-buttons">
             <Button :variant="recommendedPlatform === 'mac_arm' ? 'filled' : 'outlined'" :label="`macOS (Apple Silicon)`" icon="download" :href="dmgArmDownloadUrl" />
             <Button :variant="recommendedPlatform === 'mac_x64' ? 'filled' : 'outlined'" :label="`macOS (Intel x64)`" icon="download" :href="dmgX64DownloadUrl" />
           </div>
           <div class="version-info">{{ releaseVersion }}</div>
          </div>

        <!-- Linux Card -->
        <div :class="['download-card', { recommended: recommendedPlatform === 'linux' }]">
          <div v-if="recommendedPlatform === 'linux'" class="badge">{{ $t('download.recommended') }}</div>
          <div class="platform-icon">
             <span class="material-symbols-rounded">desktop_mac</span>
          </div>
          <h3 class="platform-name">{{ $t('download.linuxClient') }}</h3>
          <p class="platform-desc">{{ $t('download.linuxReq') }}</p>
          <div class="store-buttons">
             <Button :variant="recommendedPlatform === 'linux' ? 'filled' : 'outlined'" :label="$t('download.btnLinuxDebian')" icon="download" :href="debDownloadUrl" />
             <Button :variant="recommendedPlatform === 'linux' ? 'outlined' : 'outlined'" :label="$t('download.btnLinuxRPM')" icon="download" :href="rpmDownloadUrl" />
             <Button variant="outlined" :label="$t('download.btnLinuxAUR')" icon="content_copy" @click="copyAurCommand" />
             <div v-if="aurMessage" class="aur-message">{{ aurMessage }}</div>
          </div>
          <div class="version-info">{{ releaseVersion }} • {{ $t('download.bit64') }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.download-section {
  padding: 100px 24px;
  background-color: var(--md-sys-color-background);
  position: relative;
  overflow: hidden;
}

.download-content {
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 2;
}

.section-title {
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 16px;
    color: var(--md-sys-color-on-surface);
}

.section-subtitle {
    font-size: 18px;
    color: var(--md-sys-color-on-surface-variant);
    margin-bottom: 48px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.download-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  justify-content: center;
  /* 让每一行自动拉伸为相同高度，确保网格项等高 */
  grid-auto-rows: 1fr;
}

.download-card {
  position: relative;
  background: var(--md-sys-color-surface-variant);
  border-radius: 12px; /* MD3 recommended */
  padding: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgba(0,0,0,0.04);
  transition: transform 280ms cubic-bezier(.2,.9,.3,1), box-shadow 240ms ease;
  backdrop-filter: blur(6px) saturate(120%);
  box-shadow: var(--md-sys-elevation-level1);
  /* 充满所在网格单元高度，配合 grid-auto-rows: 1fr 使用 */
  height: 100%;
}

.download-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--md-sys-elevation-level2);
}

.download-card.recommended {
  transform: none; /* 不默认抬起，保持与其他卡片一致 */
  border: 1px solid rgba(63,123,255,0.12);
  box-shadow: var(--md-sys-elevation-level2);
  background: color-mix(in srgb, var(--md-sys-color-surface-variant), var(--md-sys-color-primary) 1%);
}

/* 推荐卡片在悬停时保持不抬起，仅保持微妙高亮 */
.download-card.recommended:hover {
  transform: translateY(-8px);
  box-shadow: var(--md-sys-elevation-level3);
}

.badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 8px 20px rgba(32,64,128,0.12);
  text-transform: none;
}

.platform-icon {
  font-size: 36px;
  color: var(--md-sys-color-primary);
  margin-bottom: 20px;
  width: 64px;
  height: 64px;
  background-color: var(--md-sys-color-secondary-container);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.platform-name {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--md-sys-color-on-surface);
}

.platform-desc {
  color: var(--md-sys-color-on-surface-variant);
  margin-bottom: 32px;
}

.store-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  align-items: stretch;
}

/* Larger screens: horizontal buttons */
@media (min-width: 900px) {
  .download-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .download-card .store-buttons {
    flex-direction: row;
    justify-content: center;
    gap: 14px;
  }
  .download-card .store-buttons > * {
    flex: 1 1 auto;
    max-width: none;
  }
}

.aur-message {
  padding: 8px 12px;
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  border-radius: 8px;
  font-size: 13px;
  text-align: center;
  margin-top: 4px;
}

.version-info {
  /* 将版本信息推到底部，保证卡片内部元素分布一致 */
  margin-top: auto;
  margin-top: 16px;
  font-size: 12px;
  color: var(--md-sys-color-outline);
}

@media (max-width: 768px) {
  .download-grid {
    grid-template-columns: 1fr;
  }
}
</style>
