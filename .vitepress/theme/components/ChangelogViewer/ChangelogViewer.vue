<script setup lang="ts">
import { useData } from "vitepress";
import { computed, onMounted, ref } from "vue";
import { marked, type Tokens } from "marked";
import { changelogTranslations, type Lang } from "../../../data/i18n";

const { lang } = useData();
const t = computed(
	() =>
		changelogTranslations[lang.value as Lang] || changelogTranslations["zh-CN"],
);

const changelog = ref<string>("");
const loading = ref(true);
const error = ref<string | null>(null);

// Changelog API URL - 用户端获取，不需要 secret
const CHANGELOG_URL = "https://bot.micyou.top/changelog.md";

// 缓存配置
const CACHE_KEY = "micyou-changelog";
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 小时

interface CacheData {
	content: string;
	timestamp: number;
}

// 获取缓存
function getCache(): CacheData | null {
	try {
		const cached = localStorage.getItem(CACHE_KEY);
		if (cached) {
			return JSON.parse(cached);
		}
	} catch {
		// ignore
	}
	return null;
}

// 设置缓存
function setCache(content: string) {
	try {
		const data: CacheData = {
			content,
			timestamp: Date.now(),
		};
		localStorage.setItem(CACHE_KEY, JSON.stringify(data));
	} catch {
		// ignore
	}
}

// 检查缓存是否有效
function isCacheValid(cache: CacheData | null): boolean {
	if (!cache) return false;
	return Date.now() - cache.timestamp < CACHE_DURATION;
}

// GitHub 链接匹配正则
const GITHUB_PR_ISSUE_REGEX =
	/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/(pull|issues)\/(\d+)$/;
const GITHUB_COMPARE_REGEX =
	/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/compare\/(.+)$/;

// 使用 marked 扩展来处理链接
const githubLinkExtension = {
	name: "githubLink",
	level: "inline" as const,
	start(src: string) {
		return src.indexOf("https://github.com");
	},
	tokenizer(src: string) {
		const match = src.match(
			/^(https:\/\/github\.com\/[^/\s]+\/[^/\s]+\/(pull|issues|compare)\/[^\s]+)/,
		);
		if (match) {
			return {
				type: "githubLink",
				raw: match[0],
				href: match[0],
			};
		}
		return undefined;
	},
	renderer(token: Tokens.Generic) {
		// PR/Issue 链接
		const prMatch = token.href.match(GITHUB_PR_ISSUE_REGEX);
		if (prMatch) {
			return `<a href="${token.href}" target="_blank" rel="noopener noreferrer">#${prMatch[4]}</a>`;
		}
		// Compare 链接
		const compareMatch = token.href.match(GITHUB_COMPARE_REGEX);
		if (compareMatch) {
			return `<a href="${token.href}" target="_blank" rel="noopener noreferrer"><code>${compareMatch[3]}</code></a>`;
		}
		return `<a href="${token.href}" target="_blank" rel="noopener noreferrer">${token.href}</a>`;
	},
};

// 处理 @username 提及
const mentionExtension = {
	name: "mention",
	level: "inline" as const,
	start(src: string) {
		return src.indexOf("@");
	},
	tokenizer(src: string) {
		const match = src.match(/^@([a-zA-Z0-9_-]+)/);
		if (match) {
			return {
				type: "mention",
				raw: match[0],
				username: match[1],
			};
		}
		return undefined;
	},
	renderer(token: Tokens.Generic) {
		return `<a href="https://github.com/${token.username}" target="_blank" rel="noopener noreferrer">@${token.username}</a>`;
	},
};

// 配置 marked
marked.use({ extensions: [githubLinkExtension, mentionExtension] });

const renderedContent = computed(() => {
	if (!changelog.value) return "";
	return marked.parse(changelog.value, {
		gfm: true,
		breaks: true,
	});
});

onMounted(async () => {
	// 先检查缓存
	const cache = getCache();
	if (cache && isCacheValid(cache)) {
		changelog.value = cache.content;
		loading.value = false;
		return;
	}

	// 缓存无效或不存在，从服务器获取
	try {
		const res = await fetch(CHANGELOG_URL);
		if (!res.ok) {
			throw new Error(`HTTP ${res.status}: ${res.statusText}`);
		}
		const content = await res.text();
		changelog.value = content;
		// 更新缓存
		setCache(content);
	} catch (e) {
		// 如果请求失败但有旧缓存，使用旧缓存
		if (cache) {
			changelog.value = cache.content;
		} else {
			error.value = e instanceof Error ? e.message : String(e);
			console.error("Failed to fetch changelog:", e);
		}
	} finally {
		loading.value = false;
	}
});
</script>

<template>
  <div class="changelog-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <iconify-icon icon="mdi:loading" class="spin" />
      <span>{{ t.loading }}</span>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error">
      <iconify-icon icon="mdi:alert-circle-outline" />
      <span>{{ t.error }}</span>
      <p class="error-detail">{{ error }}</p>
    </div>

    <!-- 内容 -->
    <article v-else class="changelog-content" v-html="renderedContent" />
  </div>
</template>

<style scoped>
.changelog-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.loading,
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px 24px;
  color: var(--vp-c-text-2);
  font-size: 1rem;
}

.loading iconify-icon,
.error iconify-icon {
  font-size: 2rem;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.error {
  color: var(--vp-c-danger-1);
}

.error-detail {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  margin-top: 8px;
}

.changelog-content {
  line-height: 1.8;
}

/* Markdown 样式 */
.changelog-content :deep(h2) {
  margin-top: 2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 1.5rem;
  font-weight: 600;
}

.changelog-content :deep(h2:first-child) {
  margin-top: 0;
}

.changelog-content :deep(h3) {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
}

.changelog-content :deep(p) {
  margin: 0.75rem 0;
}

.changelog-content :deep(ul) {
  margin: 0.75rem 0;
  padding-left: 1.5rem;
}

.changelog-content :deep(li) {
  margin: 0.25rem 0;
}

.changelog-content :deep(a) {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.changelog-content :deep(a:hover) {
  text-decoration: underline;
}

.changelog-content :deep(code) {
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--vp-c-mute);
  font-size: 0.875em;
}

.changelog-content :deep(a code) {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.changelog-content :deep(hr) {
  margin: 1.5rem 0;
  border: none;
  border-top: 1px solid var(--vp-c-divider);
}
</style>