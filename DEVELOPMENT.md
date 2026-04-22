# Developer Documentation — NotebookLM Styles Showcase

This document provides technical details on how the showcase website works, its data pipeline, and how to maintain the collection.

## 🏗️ Architecture Overview

The project is a **Data-Driven Static Site**. Instead of hardcoding content into the HTML, the site is generated from the source YAML files and preview images located in the root of the repository.

- `/styles/*.yaml`: The source of truth for the design prompts.
- `/preview/[style_id]/*.png`: Preview images for each style.
- `/scripts/`: Node.js and Python utilities for data processing.
- `/web/`: The frontend application (Vanilla JS + Vite).
- `/web/data/styles.json`: The generated "database" used by the frontend.

## ⚙️ Data Pipeline

### 1. Style Synchronization (`scripts/build-data.js`)
This is the core build script. It performs the following:
- Parses the root `README.md` to identify style categories.
- Reads every `.yaml` file in `/styles`.
- Scans `/preview` for matching folders.
- **Filters Styles**: Only styles that have at least one preview image are included in the final site.
- **Asset Management**: Copies the image folders from the root `/preview` to `/web/preview` so they are accessible by the web server.
- **Generates JSON**: Creates `web/data/styles.json`.

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
   *Note: `npm run dev` automatically runs the data build script before starting Vite.*

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

The frontend is built with **Vanilla CSS** located in `web/css/styles.css`.
- **Theme**: Swiss-minimalist with Inter and JetBrains Mono.
- **Interactivity**: Handled in `web/js/app.js` using native DOM APIs and a modular approach (tooltips, favorites, navigation).
- **Responsive**: Uses a CSS grid (Bento style) and a mobile-specific "Bottom Sheet" for YAML viewing.

## 🚀 Deployment

The site is configured to be deployed as a static site (e.g., GitHub Pages).
- Run `npm run build`.
- The output will be in the `dist/` directory (if configured) or simply serve the `web/` folder after running the build data script.
