---
description: Protocol for extracting and documenting NotebookLM styles.
---

# Workflow: Style Extraction & Documentation

This protocol defines the standard procedure for extracting visual design systems from references and integrating them into the NotebookLM Slide Styles repository.

## 0. Initial Research & Context
Before acting, the agent **MUST** read the `README.md` and explore existing files in `styles/`.
- Identify the current categories (Minimalist, Creative, Brand Inspired).
- Maintain consistency in tone and formatting.
- **Language**: All style names, descriptions, and YAML content **MUST be in English** to maintain consistency for a global audience.

## 1. Visual Style Extraction
Use the `notebooklm-slide-styles` skill as the primary engine.
- **Input**: Provide images, descriptions, or URLs to the skill.
- **Output Audit**: Review the generated YAML to ensure it captures subtle details (textures, border styles, complex palettes).
- **Images**: **DO NOT** generate or create preview images. The user will provide these or handle them manually. Focus only on the YAML and documentation.

## 2. File Implementation
Create a new `.yaml` file in the `styles/` folder.
- **Naming (Simple ID)**: Use `snake_case` and keep the ID simple, without special characters or HTML entities (e.g., `scholars_journal.yaml`).
- **Completeness**: Include `image_generation_prompts` and detailed `slide_layout_templates`.

## 3. Documentation (README.md)
Update the `README.md` following these steps:
1. **Table of Contents (TOC)**: Add the style name under the correct category. **Avoid HTML entities like `&#39;`**.
2. **Section**: Create a new `#### Style Name` section.
3. **Description**: A concise, premium-sounding summary of the aesthetic.
4. **Image Reference**: Point to `preview/style_name/style_name_1.png`.
5. **Preview Code**: Add a **simplified** version of the YAML (tokens only).
6. **Link to YAML**: Add the standard disclaimer and relative link to the full file.
   > [!TIP]
   > This is a simplified preview. [View Full YAML](styles/filename.yaml)

## 4. Data Synchronization
**It is mandatory** to regenerate the data file so the website reflects the changes:
```bash
npm run build:data
```
*The script reads the README TOC and YAML files to generate `public/data/styles.json`.*

## 5. Git Workflow
Follow these rules for persisting changes:
- **Language**: English (mandatory for this repository).
- **Format**: `feat (Styles) - Added [name style] style`.
- **Final Audit**: **DO NOT** commit changes automatically. Wait for the user to explicitly say "comitea" or similar.
- **Batching**: If multiple styles are extracted in one session, they can be committed together or separately as per user preference.

## 6. Final Audit & Sync
- Run `npm run build:data` to synchronize all styles.
- **Commit Message Format**: When the user requests a commit, use exactly this format: `feat (Styles) - Added [name style] style`.
- **No Auto-Commit**: DO NOT run `git commit` automatically unless the user explicitly reviews and approves the changes in the same turn.