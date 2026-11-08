# Developer Documentation — NotebookLM Styles Showcase

This document provides technical details on how the showcase website works, its data pipeline, and how to maintain the collection.

## 🏗️ Architecture Overview

The project is a **Data-Driven Static Site**. Instead of hardcoding content into the HTML, the site is generated from the source YAML files and preview images located in the root of the repository.

- `/styles/*.yaml`: The source of truth for the design prompts.
- `/preview/[style_id]/[style_id]_[n].webp`: Preview images for each style (WebP, generated with `scripts/optimize_and_rename.py`).
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
- **Generates Thumbnails**: Creates a 480px WebP thumbnail per preview in `public/preview/<style>/thumbs/` (with `sharp`). Originals are untouched.
- **Generates JSON**: Creates `public/data/styles.json` (each style has `previews` and `thumbs`).

**Run manually:** `npm run build:data`

### 2. Style Validation (`scripts/validate-styles.js`)
Checks every YAML in `/styles`: valid syntax, required structure (`theme`, `typography`, `color_palette`, `key_visual_elements`, `slide_layout_templates`), at least one preview image, and no preview folder without a YAML. Missing HEX colors only produce warnings.

**Run manually:** `npm run validate`

### 3. Style Similarity (`scripts/check-similarity.js`)
Compares every pair of styles with Jaccard similarity on (a) words of theme, typography and key visual elements and (b) HEX colors. Pairs at or above the thresholds (45% text, 60% colors) are listed as warnings; the script never fails, because similar styles can be legitimate variants. It also runs in CI.

**Run manually:** `npm run similarity` (add `-- --style <id>` for the 5 closest styles, or `-- --text 0.3 --colors 0.5` to change thresholds)

### 4. Image Organization (Python utilities)
- `scripts/match_style_preview.py`: matches a pasted `input.yaml` with an existing style and creates its `/preview` folder.
- `scripts/optimize_and_rename.py`: converts images to `.webp`, renames them to `{style}_{n}.webp` and deletes the originals.
- `scripts/rename-previews.py`: renames images inside each preview subfolder to `{folder_name}_{index}.{ext}`.
- `scripts/normalize-folders.py`: normalizes preview folder names (hyphens to underscores).

**Run manually:** `python scripts/optimize_and_rename.py`

### 5. Adding a Style (`scripts/add-style.js`)
Adds a style to the README (TOC and body).

**Run manually:** `node scripts/add-style.js --name "Style Name" --cat "Category" --yaml "styles/file.yaml"`

## 🛠️ Local Development

1. **Install Dependencies**: `npm install`
2. **Start Dev Server**: `npm run dev`
3. **Running Tests**: `npm test`

## ⚡ Prerendered Cards (SSG)

The first page of cards (12 per list, 6 on the landing) is rendered at build time by `src/components/StyleCard.astro`, so the HTML is useful without JavaScript. On load, `app.js` calls `hydrateCard()` (`ui/card.js`) to attach favorites, tooltip and bottom sheet to those cards instead of re-creating them. If the prerendered cards do not match the data, it falls back to a full client render. **`StyleCard.astro` and `createCard()` must keep the same markup**, and `PAGE_SIZE` in the pages must match `itemsToShow` in `app.js`.

## 🖼️ Thumbnails in the Grid

Cards (`StyleCard.astro` and `card.js`) display the 480px `thumbs` of each style, including the hover rotation, and fall back to `previews` if a style has no thumbnails. The originals are not shown anywhere else in the UI.

## 🔎 Search

`SearchBar.astro` (in `/styles` and every category page) is wired up by `initSearch()` in `app.js`. It filters on the client against each style's `searchText` (built in `build-data.js`: name, category, theme, typography and key visual elements, lowercase and without accents). Every typed word must match (AND). The search is **global**: while a query is active the category is ignored. The query lives in the URL (`?q=`), `/` focuses the box and `Esc` clears it. `normalizeText` in `utils.js` must stay equal to the one in `build-data.js`.

## 🔍 SEO

`Layout.astro` accepts `title`, `description` and `jsonLd` and always emits the canonical URL and the matching `og:`/`twitter:` tags (built from `Astro.url` and `site`). Each page passes its own description; `/styles` and the category pages add `CollectionPage` (and `BreadcrumbList`) structured data, the home page adds `WebSite`, and `FAQ.astro` adds `FAQPage`. Languages are switched on the client under the same URL, so there is no `hreflang`.

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

## 🤖 Continuous Integration

`.github/workflows/ci.yml` runs on every pull request and on pushes to `main`: `npm run validate`, `npm test` and `npm run build` (Node 22).

## 🚀 Deployment

The site is built using Astro and deployed as a static site (SSG).
- Run `npm run build`.
- Output: `dist/` directory.
- **Vercel Settings**:
  - Framework Preset: Astro
  - Build Command: `npm run build`
  - Output Directory: `dist`

