# QWEN.md - MicYou Website

> Project context and development guide for AI assistants.

## Project Overview

MicYou Website is the official documentation site for the MicYou application. MicYou transforms Android devices into high-quality microphones for PC.

### Core Features

- Multiple connection modes: Wi-Fi, USB (ADB/AOA), Bluetooth
- Professional audio processing: noise suppression, AGC, de-reverberation
- Virtual microphone support (with VB-Cable)
- Cross-platform: Windows, Linux, macOS

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| VitePress | 2.0.0-alpha.16 | Static site generator |
| Vue | 3.5.30 | Frontend framework |
| @theojs/lumen | 6.4.5 | Theme component library |
| pnpm | 10.32.1 | Package manager |
| TypeScript | - | Type support |
| Biome | 2.4.8 | Code formatting and linting |

## Project Structure

```
Website-MicYou/
├── .agent/                 # AI agent configuration
│   ├── AGENT.md            # Agent guide
│   └── Skill.md            # Skill definitions
├── .github/
│   └── workflows/          # GitHub Actions deployment
├── .husky/                 # Git hooks configuration
├── .vitepress/
│   ├── config.mts          # Main VitePress config
│   ├── cache/              # Build cache
│   ├── data/               # i18n translation data
│   │   ├── i18n.ts         # Translation entry
│   │   └── lang/           # Language files
│   │       ├── zh.ts       # Simplified Chinese
│   │       ├── en.ts       # English
│   │       └── zh_tw.ts    # Traditional Chinese
│   ├── theme/              # Custom theme
│   │   ├── index.ts        # Theme entry
│   │   ├── style.css       # Custom styles
│   │   └── components/     # Custom components
│   │       ├── ChangelogViewer/
│   │       ├── ContributorsCards/
│   │       ├── DownloadSection/
│   │       └── UmamiStats/
│   └── dist/               # Build output
├── scripts/
│   └── fetch-gh-data.ts    # Fetch GitHub data script
├── src/
│   ├── index.md            # Homepage
│   ├── changelog.md        # Changelog page
│   ├── download.md         # Download page
│   ├── video.md            # Video page
│   ├── docs/               # Documentation pages
│   │   ├── sidebar.ts      # Sidebar config
│   │   ├── quick-start.md
│   │   └── faq.md
│   ├── en/                 # English content
│   ├── zh/                 # Simplified Chinese content (alias)
│   ├── zh-TW/              # Traditional Chinese content
│   ├── public/             # Static assets
│   │   ├── app_icon.png
│   │   ├── input-device.png
│   │   ├── output-device.png
│   │   └── robots.txt
│   └── ghdata.json         # GitHub data cache
├── biome.json              # Biome configuration
├── package.json
└── pnpm-lock.yaml
```

## Development Commands

```bash
pnpm install        # Install dependencies
pnpm dev            # Start development server
pnpm build          # Build for production (includes fetch:ghdata)
pnpm preview        # Preview build result
pnpm lint           # Run linter
pnpm format         # Format code
pnpm fetch:ghdata   # Fetch GitHub data (releases, stats)
```

## Internationalization (i18n)

Three languages are supported:

| Code | Language | Path Prefix |
|------|----------|-------------|
| zh-CN | Simplified Chinese | `/` (root) |
| en | English | `/en/` |
| zh-TW | Traditional Chinese | `/zh-TW/` |

### Steps to Add a New Language

1. Create a language file in `.vitepress/data/lang/` (e.g., `ja.ts`)
2. Import and register it in `.vitepress/data/i18n.ts`
3. Add configuration to `locales` in `.vitepress/config.mts`
4. Create corresponding language directory under `src/`
5. Update translations in `src/docs/sidebar.ts`

## Theme Customization

The project uses the `@theojs/lumen` theme component library, providing:

| Component | Description |
|-----------|-------------|
| `Footer` | Footer component |
| `BoxCube` | Box display component |
| `Card` | Card component |
| `Links` | Links component |
| `Pill` | Pill tag component |
| `CopyText` | Copy to clipboard component |

### Custom Components

Located in `.vitepress/theme/components/`:

| Component | Description |
|-----------|-------------|
| `Contributors` | Contributor display component with cards |
| `ChangelogViewer` | Changelog viewer with GitHub releases |
| `DownloadSection` | Download links for different platforms |
| `UmamiStats` | Umami analytics stats display |

## Adding New Documentation

1. Create a Markdown file in `src/docs/`
2. Create translations in `src/en/docs/` and `src/zh-TW/docs/`
3. Update sidebar links in `src/docs/sidebar.ts`
4. Update language translation configs if needed

### Frontmatter Requirements

All documentation pages **must** include frontmatter at the beginning:

```markdown
---
title: Page Title - Site Name
description: Brief description for SEO (150-160 characters recommended).
---

# Page Title

Content...
```

**Required fields:**

| Field | Description |
|-------|-------------|
| `title` | Page title, typically includes site name suffix |
| `description` | SEO description for search engines and social sharing |

**Examples:**

```markdown
---
title: Quick Start - MicYou Installation Guide
description: MicYou quick start guide with detailed installation and configuration instructions for Windows, macOS, Linux, and Android.
---
```

**Homepage exception:** Uses `layout: home` with hero and features configuration instead of standard frontmatter.

## Image Handling

- **Never use external image links** (GitHub issue attachments, external URLs, etc.)
- All images must be stored in `src/public/` folder
- Reference images using root-relative paths: `![Description](/image-name.png)`
- Use descriptive, lowercase file names with hyphens (e.g., `input-device.png`)
- Supported formats: PNG, JPG, SVG, WebP, GIF

## Deployment

- Automatic deployment to GitHub Pages via GitHub Actions
- Triggered on push to main branch
- Build output located in `.vitepress/dist/`

## Code Standards

- Use TypeScript for configuration files
- Markdown files use frontmatter for page configuration
- Components use Vue 3 Composition API
- Follow VitePress official documentation standards
- Use Biome for code formatting and linting

## Git Hooks

- Husky is configured for git hooks
- lint-staged runs Biome format on staged files before commit

## Notes

- Node.js version requirement: 22 or higher
- Use pnpm as package manager (not npm/yarn)
- `.vitepress/dist/` and `.vitepress/cache/` are gitignored
- When modifying i18n, update all three languages synchronously

---

## Skills & Workflows

### 1. Add Document (add-doc)

Add a new documentation page with automatic multi-language translation and navigation config.

**Steps**:
1. Create Chinese Markdown file in `src/docs/`
2. Create English version in `src/en/docs/`
3. Create Traditional Chinese version in `src/zh-TW/docs/`
4. Update sidebar config in `src/docs/sidebar.ts`
5. Update language files in `.vitepress/data/lang/` if needed

### 2. Update i18n (update-i18n)

Update or add new translation content.

**Steps**:
1. Identify key-value pairs that need translation
2. Update language files in `.vitepress/data/lang/`
3. Ensure all three languages (zh-CN, en, zh-TW) are updated synchronously

**Language File Structure**:

```typescript
// Navigation
export const nav = [
  { text: 'Text', link: '/path' }
]

// Theme config
export const themeConfig = {
  editLink: { pattern: '...', text: '...' },
  lastUpdated: { text: '...' },
  docFooter: { prev: '...', next: '...' },
  outline: { label: '...' },
  returnToTopLabel: '...'
}

// Contributors component
export const contributors = {
  title: '...',
  subtitle: '...'
}

// Footer data
export function getFooterData(): FooterData {
  return {
    // ...
  }
}
```

### 3. Create Component (create-component)

Create custom Vue components.

**Steps**:
1. Create component directory in `.vitepress/theme/components/`
2. Write Vue 3 component using Composition API
3. Register component in `.vitepress/theme/index.ts`
4. Add necessary styles to `style.css`

**Component Template**:

```vue
<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  title: string
}>()
</script>

<template>
  <div class="component-name">
    {{ title }}
  </div>
</template>

<style scoped>
.component-name {
  /* styles */
}
</style>
```

### 4. Build & Preview (build-preview)

Build the project and preview the result.

**Steps**:
1. Run `pnpm build` to build the project
2. Check build output for errors
3. Run `pnpm preview` to start preview server
4. Provide preview URL

### 5. Sync Check (sync-check)

Check if multi-language content is synchronized.

**Steps**:
1. Scan all Markdown files in `src/docs/`
2. Compare corresponding files in `src/en/docs/` and `src/zh-TW/docs/`
3. Report missing or out-of-sync files
4. Check if sidebar.ts config covers all documents

---

## Related Links

| Resource | Link |
|----------|------|
| VitePress Documentation | https://vitepress.dev/ |
| Vue 3 Documentation | https://vuejs.org/ |
| @theojs/lumen | https://github.com/s-theo/lumen |
| pnpm Documentation | https://pnpm.io/ |