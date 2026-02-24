import { createI18n } from "vue-i18n";
import en from "./locales/en";
import zh from "./locales/zh";

// Determine user's preferred language
const userLang = navigator.language || navigator.userLanguage;
const defaultLocale = userLang.startsWith("zh") ? "zh" : "en";

const i18n = createI18n({
	legacy: false, // Usage of Composition API
	locale: defaultLocale,
	fallbackLocale: "en",
	messages: {
		en,
		zh,
	},
});

export default i18n;
