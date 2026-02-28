declare module "./locales/en" {
	const value: {
		[key: string]: any;
	};
	export default value;
}

declare module "./locales/zh" {
	const value: {
		[key: string]: any;
	};
	export default value;
}

declare module "./locales/*" {
	const value: { [key: string]: any };
	export default value;
}
