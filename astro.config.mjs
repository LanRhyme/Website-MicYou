import { defineConfig } from "astro/config";

export default defineConfig({
	site: "https://micyou.top",
	base: "/",
	i18n: {
		locales: ["en", "zh"],
		defaultLocale: "zh",
		routing: {
			prefixDefaultLocale: false,
		},
	},
});
