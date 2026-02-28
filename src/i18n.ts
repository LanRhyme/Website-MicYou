import { createI18n } from "vue-i18n";
import en from "./locales/en";
import zh from "./locales/zh";

type NavigatorWithUserLanguage = Navigator & { userLanguage?: string };

const userLang =
	typeof navigator !== "undefined"
		? navigator.language ||
			(navigator as NavigatorWithUserLanguage).userLanguage ||
			"en"
		: "en";
const defaultLocale = userLang.startsWith("zh") ? "zh" : "en";

const i18n = createI18n({
	legacy: false,
	locale: defaultLocale,
	fallbackLocale: "en",
	messages: {
		en,
		zh,
	},
});

export default i18n;
