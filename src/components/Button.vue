<script setup>
import { computed } from "vue";

const props = defineProps({
	variant: {
		type: String,
		default: "filled", // filled, tonal, outlined, text
		validator: (value) =>
			["filled", "tonal", "outlined", "text"].includes(value),
	},
	icon: String,
	label: String,
	href: String,
});

const componentTag = computed(() => (props.href ? "a" : "button"));
</script>

<template>
  <component 
    :is="componentTag" 
    :href="href"
    class="md-button" 
    :class="`md-button--${variant}`"
  >
    <span v-if="icon" class="material-symbols-rounded md-button__icon">{{ icon }}</span>
    <span class="md-button__label">
      <slot>{{ label }}</slot>
    </span>
  </component>
</template>

<style scoped>
.md-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 24px;
  border-radius: 20px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.1px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
  text-decoration: none;
  border: none;
  outline: none;
  gap: 8px;
  position: relative;
  overflow: hidden;
  user-select: none;
}

.md-button__icon {
  font-size: 18px;
}

/* Filled Button */
.md-button--filled {
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}
.md-button--filled:hover {
  box-shadow: var(--md-sys-elevation-level1);
  background-image: linear-gradient(rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08));
}
.md-button--filled:active {
  background-image: linear-gradient(rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12));
}

/* Tonal Button */
.md-button--tonal {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}
.md-button--tonal:hover {
  box-shadow: var(--md-sys-elevation-level1);
  background-image: linear-gradient(rgba(29, 25, 43, 0.08), rgba(29, 25, 43, 0.08));
}

/* Outlined Button */
.md-button--outlined {
  background-color: transparent;
  color: var(--md-sys-color-primary);
  border: 1px solid var(--md-sys-color-outline);
}
.md-button--outlined:hover {
  background-color: rgba(208, 188, 255, 0.08); /* primary 8% */
  border-color: var(--md-sys-color-primary);
}
.md-button--outlined:active {
  background-color: rgba(208, 188, 255, 0.12);
}

/* Text Button */
.md-button--text {
  background-color: transparent;
  color: var(--md-sys-color-primary);
  padding: 0 12px;
  min-width: 48px;
}
.md-button--text:hover {
  background-color: rgba(208, 188, 255, 0.08);
}
.md-button--text:active {
  background-color: rgba(208, 188, 255, 0.12);
}

/* With Icon spacing */
.md-button:has(.md-button__icon) {
  padding-left: 16px; 
}
.md-button--text:has(.md-button__icon) {
  padding-right: 16px;
}
</style>
