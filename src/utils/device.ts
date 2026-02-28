export type DeviceType =
	| "android"
	| "ios"
	| "windows"
	| "mac_arm"
	| "mac_x64"
	| "linux"
	| "unknown";

export function detectDevice(): DeviceType {
	const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
	const platform =
		typeof navigator !== "undefined" ? navigator.platform || "" : "";
	type NavigatorWithUAData = Navigator & {
		userAgentData?: {
			architecture?: string;
			[k: string]: unknown;
		};
	};

	const uaData =
		typeof navigator !== "undefined"
			? ((navigator as NavigatorWithUAData).userAgentData ?? null)
			: null;

	const isAndroid = /Android/i.test(ua);
	const isIOS = /iPhone|iPad|iPod/i.test(ua);
	const isWindows = /Win/i.test(platform) || /Windows/i.test(ua);
	const isMac = /Mac/i.test(platform) || /Macintosh/i.test(ua);
	const isLinux = /Linux/i.test(platform) && !isAndroid;

	if (isAndroid) return "android";
	if (isIOS) return "ios";
	if (isWindows) return "windows";

	if (isMac) {
		if (uaData?.architecture) {
			return /arm|aarch/i.test(uaData.architecture) ? "mac_arm" : "mac_x64";
		}
		if (/arm|aarch64|Apple Silicon|AppleSilicon|Apple-Silicon/i.test(ua)) {
			return "mac_arm";
		}
		return "mac_x64";
	}

	if (isLinux) return "linux";

	return "unknown";
}

export function isMobileDevice(): boolean {
	const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
	return /Android|iPhone|iPad|iPod/i.test(ua);
}
