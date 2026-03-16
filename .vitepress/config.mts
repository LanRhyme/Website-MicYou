import { figure } from "@mdit/plugin-figure";
import { defineConfig, type HeadConfig } from "vitepress";
import { docsSidebar, getSidebarPath } from "../src/docs/sidebar";
import { navTranslations, themeConfigTranslations } from "./data/i18n";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	srcDir: "./src",
	title: "MicYou",
	description: "将 Android 设备转变为 PC 的高质量麦克风",
	cleanUrls: true,
	sitemap: {
		hostname: "https://micyou.top",
	},

	markdown: {
		lineNumbers: true,
		image: { lazyLoading: true },
		config: (md) => {
			md.use(figure);
		},
	},

	// 支持 iconify-icon 组件
	vue: {
		template: {
			compilerOptions: { isCustomElement: (tag) => tag === "iconify-icon" },
		},
	},

	head: [
		["link", { rel: "icon", href: "/app_icon.png" }],
		["meta", { name: "theme-color", content: "#334355" }],
		// 预加载关键资源 - 优化 LCP
		[
			"link",
			{
				rel: "preload",
				href: "/app_icon.png",
				as: "image",
				fetchpriority: "high",
			},
		],
		// 预连接优化 - 减少外部资源连接延迟
		[
			"link",
			{ rel: "preconnect", href: "https://api.github.com", crossorigin: "" },
		],
		[
			"link",
			{
				rel: "preconnect",
				href: "https://api.iconify.design",
				crossorigin: "",
			},
		],
		[
			"link",
			{ rel: "preconnect", href: "https://umami.micyou.top", crossorigin: "" },
		],
		[
			"link",
			{ rel: "dns-prefetch", href: "https://avatars.githubusercontent.com" },
		],
		// 无障碍优化
		["meta", { name: "format-detection", content: "telephone=no" }],
		["meta", { name: "mobile-web-app-capable", content: "yes" }],
		["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
		[
			"meta",
			{ name: "apple-mobile-web-app-status-bar-style", content: "default" },
		],
	],

	// 动态生成 OG 标签
	transformPageData(pageData) {
		const pagePath = pageData.relativePath
			.replace(/\.md$/, "")
			.replace(/\/index$/, "/");
		const canonicalUrl = `https://micyou.top/${pagePath}`;
		const ogImage = pageData.frontmatter.ogImage || "/app_icon.png";

		const head: HeadConfig[] = [
			["meta", { property: "og:type", content: "website" }],
			["meta", { property: "og:title", content: pageData.title || "MicYou" }],
			[
				"meta",
				{
					property: "og:description",
					content:
						pageData.description || "将 Android 设备转变为 PC 的高质量麦克风",
				},
			],
			["meta", { property: "og:url", content: canonicalUrl }],
			[
				"meta",
				{ property: "og:image", content: `https://micyou.top${ogImage}` },
			],
			["meta", { name: "twitter:card", content: "summary_large_image" }],
			["meta", { name: "twitter:title", content: pageData.title || "MicYou" }],
			[
				"meta",
				{
					name: "twitter:description",
					content:
						pageData.description || "将 Android 设备转变为 PC 的高质量麦克风",
				},
			],
			[
				"meta",
				{ name: "twitter:image", content: `https://micyou.top${ogImage}` },
			],
			["link", { rel: "canonical", href: canonicalUrl }],
		];

		pageData.frontmatter.head ??= [];
		pageData.frontmatter.head.push(...head);
	},

	locales: {
		root: {
			label: "简体中文",
			lang: "zh-CN",
			title: "MicYou",
			description:
				"将 Android 设备转变为 PC 的高质量麦克风 - 高质量、低延迟、跨平台的音频传输解决方案",
			themeConfig: {
				nav: navTranslations["zh-CN"],
				sidebar: { [getSidebarPath("zh-CN")]: docsSidebar("zh-CN") },
				...themeConfigTranslations["zh-CN"],
			},
		},
		en: {
			label: "English",
			lang: "en",
			title: "MicYou",
			description:
				"Transform your Android device into a high-quality microphone for PC - High quality, low latency, cross-platform audio transmission solution",
			themeConfig: {
				nav: navTranslations.en,
				sidebar: { [getSidebarPath("en")]: docsSidebar("en") },
				...themeConfigTranslations.en,
			},
		},
		"zh-TW": {
			label: "繁體中文",
			lang: "zh-TW",
			title: "MicYou",
			description:
				"將 Android 裝置轉變為 PC 的高品質麥克風 - 高品質、低延遲、跨平台的音訊傳輸解決方案",
			themeConfig: {
				nav: navTranslations["zh-TW"],
				sidebar: { [getSidebarPath("zh-TW")]: docsSidebar("zh-TW") },
				...themeConfigTranslations["zh-TW"],
			},
		},
	},

	themeConfig: {
		logo: "/app_icon.png",
		socialLinks: [
			{ icon: "github", link: "https://github.com/LanRhyme/MicYou" },
			{ icon: "telegram", link: "https://t.me/MicYouChannel" },
		],
	},
});
