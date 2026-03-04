import { defineConfig } from "astro/config";

export default defineConfig({
	site: "https://lanrhyme.github.io",
	base: "/Website-MicYou",
	i18n: {
		locales: ["en", "zh"],
		defaultLocale: "zh",
		routing: {
			prefixDefaultLocale: false,
		},
	},
});
