# MicYou Official Website

This is the official website for MicYou, a professional microphone streaming software that turns your smartphone into a high-quality microphone for your PC.

## Technology Stack

- **Framework**: Astro 5
- **Design System**: Material Design 3 guidelines (Vanilla CSS + CSS Variables)
- **Tooling**: Biome (Linter & Formatter), TypeScript
- **i18n**: Built-in support for English and Chinese
- **Icons**: Google Material Symbols Rounded
- **Fonts**: Roboto

## Features

- **Responsive Implementation**: Works seamlessly on desktop and mobile.
- **Modern UI**: Dark mode by default, glassmorphism effects, smooth animations.
- **Component-Based**: Reusable Astro components for easy maintenance.
- **Internationalization (i18n)**: Multi-language support.

## Project Setup

### Install Dependencies

```sh
pnpm install
```

### Run Development Server

```sh
pnpm run dev
```

### Type Check & Linting

```sh
pnpm run type-check
pnpm run lint
```

### Format Code

```sh
pnpm run format
```

### Build for Production

```sh
pnpm run build
```

## Customization

- Update `src/styles/theme.css` to change the color palette.
- Modify content in `src/components/` and `src/locales/` to update text and translations.
