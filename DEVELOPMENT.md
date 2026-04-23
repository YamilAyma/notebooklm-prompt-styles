# Developer Documentation — NotebookLM Styles Showcase

This document provides technical details on how the showcase website works, its data pipeline, and how to maintain the collection.

## 🏗️ Architecture Overview

The project is a **Data-Driven Static Site**. Instead of hardcoding content into the HTML, the site is generated from the source YAML files and preview images located in the root of the repository.

- `/styles/*.yaml`: The source of truth for the design prompts.
- `/preview/[style_id]/*.png`: Preview images for each style.
- `/src/`: The Astro source code (Layouts, Pages, Components).
- `/src/scripts/`: Modular frontend logic.
  - `app.js`: Core orchestration, data fetching, and filtering logic.
  - `i18n.js`: Internationalization manager (EN, ES, PT).
  - `theme.js`: Light/Dark mode management.
  - `navigation.js`: Floating menu and category navigation.
  - `ui/`: UI components logic.
    - `card.js`: Style card creation and hover/click interactions.
    - `share.js`: Social sharing modal and clipboard logic.
    - `bottomSheet.js`: Detail view and YAML code interaction.
    - `tooltip.js`: Custom preview tooltips for desktop.
  - `utils.js`: Shared helper functions (Toast, path normalization).
- `/public/data/styles.json`: The generated "database" used by the frontend.

## ⚙️ Data Pipeline

### 1. Style Synchronization (`scripts/build-data.js`)
This is the core build script. It performs the following:
- Parses the root `README.md` to identify style categories.
- Reads every `.yaml` file in `/styles`.
- Scans `/preview` for matching folders.
- **Filters Styles**: Only styles that have at least one preview image are included in the final site.
- **Asset Management**: Copies the image folders from the root `/preview` to `/public/preview`.
- **Generates JSON**: Creates `public/data/styles.json`.

**Run manually:** `npm run build:data`

### 2. Image Organization (`scripts/rename-previews.py`)
A Python utility to ensure consistent naming of preview images.
- Renames images inside each preview subfolder to `{folder_name}_{index}.{ext}`.

**Run manually:** `python scripts/rename-previews.py`

## 🛠️ Local Development

1. **Install Dependencies**: `npm install`
2. **Start Dev Server**: `npm run dev`
3. **Running Tests**: `npm test`

## 🌐 Internationalization (i18n)

The site supports multiple languages (English, Spanish, Portuguese) using a custom lightweight system:
- **`src/scripts/i18n.js`**: Contains the dictionary and logic.
- **DOM Integration**: Elements with `data-i18n="key"` are translated automatically.
- **ARIA Support**: Elements with `data-i18n-aria="key"` update their `aria-label`.
- **Persistence**: Language preference is saved in `localStorage`.

To add a new language:
1. Add the language code and translations to the `translations` object in `i18n.js`.
2. Update the Language Selector in `Layout.astro`.

## 🌓 Theme Support

Managed via `src/scripts/theme.js`:
- Uses CSS Variables for colors and tokens.
- Respects system preferences and persists user choice in `localStorage`.
- Toggle button triggers a smooth transition and icon swap.

## 🎨 Design System

The frontend is built with **Astro** and uses **Vanilla CSS** in `src/styles/styles.css`.
- **Theme**: Swiss-minimalist with Inter and JetBrains Mono.
- **Interactivity**: Modular scripts in `src/scripts/`.
- **Responsive**: Bento-style grid and mobile-specific modals (Social Modal, Bottom Sheet).

## 📜 Git Guidelines

Commit messages must follow the project standard to keep history readable.

### Commit Message Format
`type (Scope) - Imperative description`
**Language:** English (Imperative).

**Examples:**
- `feat (i18n/UI) - Implement language selector`
- `fix (UI/Card) - Correct animated border on mobile`
- `brand (Styles) - Update corporate colors`
- `docs (Dev) - Update architecture documentation`

## 🚀 Deployment

The site is built using Astro and deployed as a static site (SSG).
- Run `npm run build`.
- Output: `dist/` directory.
- **Vercel Settings**:
  - Framework Preset: Astro
  - Build Command: `npm run build`
  - Output Directory: `dist`

