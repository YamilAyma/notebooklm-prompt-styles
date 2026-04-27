# Contributing to NotebookLM Styles Showcase

Thank you for your interest in contributing! This guide will walk you through the process of adding a new style to the collection. We use automation to keep the repository optimized and consistent.

## Workflow Summary

1. **Create** the YAML configuration.
2. **Generate** previews using NotebookLM.
3. **Match** your code to a style file.
4. **Optimize** and convert images.
5. **Sync** the data.
6. **Document** in the README.
7. **Submit** your changes.

---

## Scripts & Automation Tools

We have automated parts of the contribution process to keep the repository clean and optimized.

| Script | Purpose | When to use it |
| :--- | :--- | :--- |
| `scripts/match_style_preview.py` | Matches a pasted YAML code from `input.yaml` with an existing style and creates the appropriate `/preview` folder. | After you have your YAML code and want to start adding images. |
| `scripts/optimize_and_rename.py` | Converts images to `.webp`, renames them to `{style}_{n}.webp`, updates code references, and deletes original PNGs/JPGs. | After adding new images to a preview folder. |
| `npm run build:data` | Rebuilds the `styles.json` file used by the website gallery. | Before committing your changes. |

---

## Step 1: Create the Style (YAML)

All styles are stored in the `/styles` directory.

1. Choose a descriptive name for your style (e.g., `modern_dark`). Use **snake_case**.
2. Create a new file: `styles/modern_dark.yaml`.
3. Define your style using the required structure:

```yaml
design_system:
  global_style:
    theme: "Brief description of the overall vibe"
    typography: 
      primary_heading: "Font for titles"
      body_text: "Font for content"
    color_palette:
      primary_color: "#HEX"
      background: "#HEX"
      text_main: "#HEX"
    key_visual_elements: 
      - "Feature 1"
      - "Feature 2"

slide_layout_templates:
  - type: "Template_Name"
    usage: "When to use it"
```

## Step 2: Generate Previews

To showcase your style, you need to generate a real slide deck in NotebookLM.

1. Go to [NotebookLM](https://notebooklm.google.com/).
2. Open or create a Notebook.
3. Use the **"Generate Slide Deck"** feature.
4. In the prompt, include the YAML code you created in Step 1.
5. Take at least **3 high-quality screenshots** of the resulting slides (Cover, Content, and a special layout).
6. **Privacy Tip:** Ensure your screenshots do not contain personal information or sensitive metadata.

## Step 3: Organize & Optimize Images (Automated)

1. Paste the YAML code of your style into the `input.yaml` file at the root of the project.
2. Run the matcher script to automatically identify the style and create the folder:
   ```bash
   python scripts/match_style_preview.py
   ```
   *This will create the folder `preview/your_style_name/` for you.*
3. Place your screenshots (`.png` or `.jpg`) inside that new folder.
4. Run the optimization script:
   ```bash
   python scripts/optimize_and_rename.py
   ```
   *This will convert everything to `.webp`, rename files correctly, and update the repository code.*

## Step 4: Update the Showcase Data

The website uses a generated JSON file to display the gallery. Rebuild it to include your new style:

```bash
npm run build:data
```

> [!IMPORTANT]
> The build script identifies categories from the `README.md` and only includes styles that have a corresponding folder in `/preview` with at least one image.

## Step 5: Update the README

Add your new style to the root `README.md` using the `.webp` extension for the preview image.

1. Add a link in the **Table of Contents**.
2. Add a section under the appropriate category.
3. Include a brief description, the preview image, and a link to the YAML file.

**Example markdown:**

```markdown
#### Modern Dark
A sleek, high-contrast theme for late-night presentations.

![Modern Dark Preview](preview/modern_dark/modern_dark_1.webp)

> [!TIP]
> This is a simplified preview. [View Full YAML](styles/modern_dark.yaml)
```

## Step 6: Commit and Push

We follow a strict commit message format in **English**: `type (Scope) - Imperative description`

Example:
```bash
git add .
git commit -m "feat (Styles) - Add Modern Dark style"
```

Push your changes and create a Pull Request!

---

## Technical Checklist

- [ ] YAML file added to `/styles/` (snake_case).
- [ ] Folder created in `/preview/` and images optimized to `.webp` using our scripts.
- [ ] `npm run build:data` executed successfully.
- [ ] Style added to `README.md` (TOC and Section) using `.webp` references.
- [ ] Commit message is in English and follows the convention.
