/**
 * 从 GitHub API 获取贡献者和发布数据，保存到 public/ghdata.json
 * 用于避免客户端 API 调用触发速率限制
 */

import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC_DIR = join(ROOT, "src");
const OUTPUT_FILE = join(SRC_DIR, "ghdata.json");

const REPO_OWNER = "LanRhyme";
const REPO_NAME = "MicYou";

// 需要过滤的贡献者
const EXCLUDE_USERS = new Set([
	"LanRhyme",
	"ChinsaaWei",
	"dependabot[bot]",
	"crowdin-bot",
]);

interface GitHubContributor {
	author: {
		login: string;
		avatar_url: string;
		html_url: string;
	};
	total: number;
}

interface GitHubRelease {
	tag_name: string;
	name: string;
	published_at: string;
	html_url: string;
	body: string;
	assets: Array<{
		name: string;
		browser_download_url: string;
	}>;
}

interface OutputData {
	version: string;
	releaseUrl: string;
	releaseDate: string;
	releaseNotes: string;
	contributors: Array<{
		login: string;
		avatar_url: string;
		html_url: string;
		contributions: number;
	}>;
	fetchedAt: string;
}

async function fetchJSON<T>(
	url: string,
	token?: string,
	options?: { retryOn202?: boolean },
): Promise<T> {
	const headers: Record<string, string> = {
		Accept: "application/vnd.github.v3+json",
		"User-Agent": "MicYou-Website-Build-Script",
	};

	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	const res = await fetch(url, { headers });

	// GitHub stats API 可能返回 202 Accepted，表示数据正在计算中
	if (res.status === 202 && options?.retryOn202) {
		return null as T; // 返回 null 让调用者处理重试
	}

	if (!res.ok) {
		throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
	}

	return res.json();
}

async function fetchLatestRelease(token?: string): Promise<{
	version: string;
	url: string;
	date: string;
	notes: string;
}> {
	const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`;
	const release = await fetchJSON<GitHubRelease>(url, token);

	return {
		version: release.tag_name.replace(/^v/, ""),
		url: release.html_url,
		date: release.published_at,
		notes: release.body || "",
	};
}

async function fetchContributors(token?: string): Promise<
	Array<{
		login: string;
		avatar_url: string;
		html_url: string;
		contributions: number;
	}>
> {
	const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/stats/contributors`;
	const maxRetries = 5;
	const retryDelay = 3000; // 3 秒

	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		const data = await fetchJSON<GitHubContributor[] | null>(url, token, {
			retryOn202: true,
		});

		// 202 响应，数据正在计算中，等待后重试
		if (data === null) {
			console.log(
				`Contributors data is being calculated (attempt ${attempt}/${maxRetries}), waiting...`,
			);
			if (attempt < maxRetries) {
				await new Promise((resolve) => setTimeout(resolve, retryDelay));
				continue;
			}
			console.warn(
				"Max retries reached for contributors, returning empty array",
			);
			return [];
		}

		// 检查数据是否为数组
		if (!Array.isArray(data)) {
			console.warn("Contributors data is not an array, returning empty array");
			return [];
		}

		return data
			.filter((c) => {
				const login = c.author?.login;
				return login && !EXCLUDE_USERS.has(login) && !login.includes("[bot]");
			})
			.sort((a, b) => b.total - a.total)
			.map((c) => ({
				login: c.author.login,
				avatar_url: c.author.avatar_url,
				html_url: c.author.html_url,
				contributions: c.total,
			}));
	}

	return [];
}

async function main() {
	console.log("Fetching GitHub data...");

	// GitHub Token 可通过环境变量 GITHUB_TOKEN 设置
	const token = process.env.GITHUB_TOKEN;

	try {
		// 并行获取数据
		const [release, contributors] = await Promise.all([
			fetchLatestRelease(token),
			fetchContributors(token),
		]);

		const output: OutputData = {
			version: release.version,
			releaseUrl: release.url,
			releaseDate: release.date,
			releaseNotes: release.notes,
			contributors,
			fetchedAt: new Date().toISOString(),
		};

		// 写入文件
		writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), "utf-8");

		console.log(`✓ Version: ${output.version}`);
		console.log(`✓ Contributors: ${output.contributors.length}`);
		console.log(`✓ Saved to: ${OUTPUT_FILE}`);
	} catch (error) {
		console.error("Failed to fetch GitHub data:", error);
		process.exit(1);
	}
}

main();
