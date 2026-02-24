<script setup>
import { useI18n } from "vue-i18n";
import { ref, onMounted, onUnmounted } from "vue";

const { locale } = useI18n();
const isOpen = ref(false);
const dropdownRef = ref(null);

const languages = [
	{ code: "en", label: "English", icon: "language" }, // or flag emoji? stick to icon for MD3
	{ code: "zh", label: "简体中文", icon: "translate" },
];

const toggleDropdown = () => {
	isOpen.value = !isOpen.value;
};

const selectLanguage = (code) => {
	locale.value = code;
	isOpen.value = false;
	// Optional: Save to localStorage if we want persistence
	// localStorage.setItem('user-locale', code)
};

const handleClickOutside = (event) => {
	if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
		isOpen.value = false;
	}
};

onMounted(() => {
	document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
	document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="language-switcher" ref="dropdownRef">
    <button class="switcher-btn" @click="toggleDropdown">
      <span class="material-symbols-rounded">language</span>
      <span class="current-lang-code">{{ locale === 'zh' ? 'ZH' : 'EN' }}</span>
      <span class="material-symbols-rounded arrow-icon" :class="{ 'rotated': isOpen }">expand_more</span>
    </button>
    
    <transition name="fade">
      <div v-if="isOpen" class="dropdown-menu">
        <button 
          v-for="lang in languages" 
          :key="lang.code"
          class="dropdown-item"
          :class="{ 'active': locale === lang.code }"
          @click="selectLanguage(lang.code)"
        >
          {{ lang.label }}
        </button>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.language-switcher {
  position: relative;
  margin-left: 16px;
}

.switcher-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: 1px solid var(--md-sys-color-outline);
  color: var(--md-sys-color-on-surface);
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  transition: all 0.2s;
}

.switcher-btn:hover {
  background-color: var(--md-sys-color-secondary-container);
  border-color: transparent;
}

.current-lang-code {
  font-weight: 500;
  text-transform: uppercase;
  margin: 0 4px;
}

.arrow-icon {
  font-size: 18px;
  transition: transform 0.2s;
}

.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 120px;
  background-color: var(--md-sys-color-surface-variant);
  border-radius: 12px;
  box-shadow: var(--md-sys-elevation-level2);
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
}

.dropdown-item {
  background: transparent;
  border: none;
  color: var(--md-sys-color-on-surface-variant);
  padding: 10px 16px;
  text-align: left;
  cursor: pointer;
  border-radius: 8px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: var(--md-sys-color-on-surface);
}

.dropdown-item.active {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  font-weight: 500;
}

/* Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
