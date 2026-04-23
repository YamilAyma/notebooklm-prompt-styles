# Developer Documentation — NotebookLM Styles Showcase

This document provides technical details on how the showcase website works, its data pipeline, and how to maintain the collection.

## 🏗️ Architecture Overview

The project is a **Data-Driven Static Site**. Instead of hardcoding content into the HTML, the site is generated from the source YAML files and preview images located in the root of the repository.

- `/styles/*.yaml`: The source of truth for the design prompts.
- `/preview/[style_id]/*.png`: Preview images for each style.
- `/scripts/`: Node.js and Python utilities for data processing.
- `/styles/*.yaml`: The source of truth for the design prompts.
- `/preview/[style_id]/*.png`: Preview images for each style.
- `/scripts/`: Node.js and Python utilities for data processing.
- `/src/`: The Astro source code (Layouts, Pages, Components).
- `/public/data/styles.json`: The generated "database" used by the frontend.

## ⚙️ Data Pipeline

### 1. Style Synchronization (`scripts/build-data.js`)
This is the core build script. It performs the following:
- Parses the root `README.md` to identify style categories.
- Reads every `.yaml` file in `/styles`.
- Scans `/preview` for matching folders.
- **Filters Styles**: Only styles that have at least one preview image are included in the final site.
- **Asset Management**: Copies the image folders from the root `/preview` to `/public/preview` so they are accessible during the build.
- **Generates JSON**: Creates `public/data/styles.json`.
- **Dynamic Routing**: Astro uses this JSON to generate category pages (`/creative`, `/minimalist`, etc.) during build time.

**Run manually:** `npm run build:data`

### 2. Image Organization (`scripts/rename-previews.py`)
A Python utility to ensure consistent naming of preview images.
- Renames images inside each preview subfolder to `{folder_name}_{index}.{ext}`.
- This ensures clean URLs and predictable behavior in the frontend image rotation.

**Run manually:** `python scripts/rename-previews.py`

## 🛠️ Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start Dev Server**:
   ```bash
   npm run dev
   ```
   *Note: `npm run dev` automatically runs the data build script before starting the Astro dev server.*

3. **Running Tests**:
   We use Vitest to ensure the build script correctly parses YAML and README content.
   ```bash
   npm test
   ```

## ➕ Adding a New Style (Step-by-Step)

To add a new style to the showcase:

1. **Create YAML**: Add your style file in `/styles/my_new_style.yaml`.
2. **Add Previews**: Create a folder `/preview/my_new_style/` and add 2-3 PNG/JPG screenshots.
3. **Organize Images (Optional)**:
   ```bash
   python scripts/rename-previews.py
   ```
4. **Update README**: Add the style under the appropriate category in the root `README.md` (the build script uses this for categorization).
5. **Rebuild Data**:
   ```bash
   npm run build:data
   ```
6. **Preview**: Run `npm run dev` and check the site.

## 🎨 Design System

The frontend is built with **Astro** and uses **Vanilla CSS** located in `src/styles/styles.css`.
- **Theme**: Swiss-minimalist with Inter and JetBrains Mono.
- **Interactivity**: Handled in `src/scripts/app.js` using native DOM APIs. Astro bundles and optimizes these scripts.
- **Responsive**: Uses a CSS grid (Bento style) and a mobile-specific "Bottom Sheet" for YAML viewing.

## 📜 Git Guidelines

To maintain a professional and accessible project for the international community, all commit messages and documentation must be in **English**.

### Commit Message Format
We follow a simplified semantic commit convention:
- `type (Scope) - Imperative description`
- Examples: 
  - `feat (Web/UX) - Add social sharing buttons`
  - `fix (Preview) - Normalize folder names`
  - `docs - Update README acknowledgements`

### History Maintenance
If you accidentally commit in another language or need to clean up local history before pushing, you can follow the "Cherry-pick & Reword" strategy used to sanitize the initial repository history:

1. **Create a backup branch**: `git branch temp-save`
2. **Reset to the last valid commit**: `git reset --hard [last_english_commit_hash]`
3. **Re-apply and reword**: 
   - `git cherry-pick [spanish_commit_hash]`
   - `git commit --amend -m "New English Message"`
4. **Repeat** for each commit until the history is clean.
5. **Delete backup**: `git branch -D temp-save`

This ensures a clean, understandable, and strictly English history for all public contributors.

## 🚀 Deployment

The site is built using Astro and deployed as a static site (SSG).
- Run `npm run build`.
- The output will be in the `dist/` directory.
- **Vercel Settings**:
  - **Framework Preset**: Astro
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`
