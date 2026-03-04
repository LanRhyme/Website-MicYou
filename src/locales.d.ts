type LocaleValue = string | { [key: string]: LocaleValue };
type LocaleMessages = { [key: string]: LocaleValue };

declare module "./locales/en" {
	const value: LocaleMessages;
	export default value;
}

declare module "./locales/zh" {
	const value: LocaleMessages;
	export default value;
}

declare module "./locales/*" {
	const value: LocaleMessages;
	export default value;
}
