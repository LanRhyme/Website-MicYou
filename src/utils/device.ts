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
		// Prefer architecture from userAgentData when available
		if (uaData?.architecture) {
			return /arm|aarch/i.test(uaData.architecture) ? "mac_arm" : "mac_x64";
		}

		// Fallback: try to read the WebGL renderer string which may include "Apple M1/M2" on Apple Silicon
		try {
			const canvas = document.createElement("canvas");
			const gl =
				(canvas.getContext("webgl") as WebGLRenderingContext) ||
				(canvas.getContext("experimental-webgl") as WebGLRenderingContext);
			if (gl) {
				const dbg = gl.getExtension("WEBGL_debug_renderer_info");
				if (dbg) {
					const renderer = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) as string;
					if (renderer && /Apple/i.test(renderer)) {
						if (/M\s?1|M1|M2|M3|Apple Silicon|Apple-?Silicon|ARM/i.test(renderer)) {
							return "mac_arm";
						}
						// if renderer mentions Apple but not M1/M2, still prefer arm if "Apple" appears with arm-like tokens
						if (/Apple/.test(renderer) && /ARM|AARCH/i.test(renderer)) {
							return "mac_arm";
						}
					}
				}
			}
		} catch (e) {
			// ignore errors and fall through to UA checks
		}

		// Last-resort UA heuristics (rarely correct for Apple Silicon because many UAs still show Intel)
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
