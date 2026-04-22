---
description: 
---

# Workflow: Style Extraction & Documentation

This protocol defines the standard procedure for extracting visual design systems from references and integrating them into the NotebookLM Slide Styles repository.

## 0. Initial Research & Context
Before acting, the agent **MUST** read the `README.md` and explore existing files in `styles/`.
- Identify the current "categories" (Minimalist, Creative, etc.).
- Understand the established aesthetic level (High-fidelity tokens).
- Maintain consistency in tone and formatting.

## 1. Visual Style Extraction
Use the `notebooklm-slide-styles` skill as the primary engine.
- **Input**: Provide images, descriptions, or URLs to the skill.
- **Output Audit**: Review the generated YAML to ensure it captures subtle details (textures, border styles, complex palettes).

## 2. File Implementation (Full source)
Create a new `.yaml` file in the `styles/` folder.
- **Naming**: Use `snake_case` (e.g., `structured_mint.yaml`).
- **Completeness**: Include `image_generation_prompts` and detailed `slide_layout_templates`.

## 3. Documentation (README.md)
Update the `README.md` following these steps:
1. **Update Table of Contents**: Add the new style name under the appropriate category.
2. **Add Section**: Create a new `#### Style Name` section.
3. **Draft Description**: A concise, premium-sounding summary of the aesthetic.
4. **Image Placeholder**: Add an image reference to `assets/style_name_preview.png`.
5. **Preview Code**: Add a **simplified** version of the YAML (tokens only).
6. **Disclaimer & Link**: Add the standard "Quick Preview" disclaimer and a relative link to the full YAML.
   > [!TIP]
   > This is a simplified preview. [View full YAML](styles/filename.yaml)

## 4. Git Workflow
Persistence is key. Follow these rules:
- **Audit History**: Run `git log --oneline` to see the current commit style.
- **Language**: All commit messages must be in **English**.
- **Format**: Follow the `type: description` pattern (e.g., `feat: add structured mint design style`).
