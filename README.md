# NotebookLM Slide Styles Collection

A curated collection of visual design styles (YAML) to customize the output of NotebookLM slide generation.

## 📖 Table of Contents
- [🏷️ Brand Inspired](#-brand-inspired)
  - [Editorial Essence](#editorial-essence)
  - [Visual Discovery](#visual-discovery)
  - [Executive Report](#executive-report)
- [🌿 Minimalist](#-minimalist)
- [🎨 Creative](#-creative)
- [🚀 How to Use](#-how-to-use)
- [🛠️ Contribution](#-contribution)

---

## 🎨 Themes

### 🏷️ Brand Inspired

#### Editorial Essence
Sophisticated, editorial, and human-centric design language. It uses warm cream backgrounds, bold terracotta accents, and elegant serif typography to create a "book-like" presentation feel.

![Editorial Essence Preview](assets/editorial_essence_preview.png)

```yaml
design_system:
  global_style:
    theme: "Minimalist, sophisticated, and human-centric. High-end editorial style."
    typography: 
      primary_heading: "Elegant serif (e.g., Lora, Playfair Display), bold"
      secondary_heading: "Clean sans-serif (e.g., Poppins, Inter), uppercase"
      body_text: "Refined serif (e.g., Lora), airy line-height"
    color_palette:
      primary_color: "#D97757"
      background: "#FAF9F5"
      text_main: "#141413"
    key_visual_elements: 
      - "Generous whitespace (Editorial layout)"
      - "Abstract geometric line art"
      - "Pill-shaped labels"

slide_layout_templates:
  - type: "Cover_Editorial"
    usage: "Main title slide"
  - type: "Split_Insight"
    usage: "40/60 text-image split"
```

#### Visual Discovery
Focuses on visual-first layouts, card-based components with high border-radius, and vibrant red accents to drive engagement and focus. Inspired by modern discovery feeds.

![Visual Discovery Preview](assets/visual_discovery_preview.png)

```yaml
design_system:
  global_style:
    theme: "Modern, visual-first, and organized. Inspired by card-based discovery aesthetics."
    typography: 
      primary_heading: "Clean rounded sans-serif (e.g., Roboto, Helvetica Rounded), bold"
      secondary_heading: "Simple sans-serif, medium weight, clean"
      body_text: "Functional sans-serif, high contrast on white"
    color_palette:
      primary_color: "#E60023"
      background: "#FFFFFF"
      text_main: "#111111"
      accent_color: "#EFEFEF"
    key_visual_elements: 
      - "Rounded corners (16px to 24px) for cards and images"
      - "Drop shadows for depth"
      - "Grid-based image distribution"

slide_layout_templates:
  - type: "Cover_Discovery"
    usage: "Impactful intro slide"
  - type: "Card_Grid_Insights"
    usage: "Presenting multiple features in card format"
```

#### Executive Report
Data-dense, executive style for professional reports. Focuses on statement-driven "Action Titles", rigorous grid structures, and professional high-fidelity visuals.

![Executive Report Preview](assets/executive_report_preview.png)

```yaml
design_system:
  global_style:
    theme: "Professional, data-dense, and executive. Inspired by high-end consulting report standards."
    typography: 
      primary_heading: "Authoritative serif (e.g., Times New Roman, Georgia), bold"
      secondary_heading: "Clean professional sans-serif (e.g., Helvetica), bold"
      body_text: "Functional sans-serif, high density"
    color_palette:
      primary_color: "#051C2C"
      background: "#FFFFFF"
      text_main: "#333333"
      accent_color: "#007DBB"
    key_visual_elements: 
      - "Full-width horizontal dividers"
      - "Action Title block at the top"
      - "Source and Footer attribution blocks"

slide_layout_templates:
  - type: "Executive_Action_Title"
    usage: "Standard consulting slide with a key insight title"
  - type: "Waterfall_Insight"
    usage: "Dynamic financial or process flow visualization"
```

---

### 🌿 Minimalist
*Incoming soon...*

### 🎨 Creative
*Incoming soon...*

---

## 🚀 How to Use
1. Copy the YAML code block for your desired theme.
2. Paste it into your NotebookLM prompt or configuration when generating slides.
3. Enjoy your beautifully styled presentation!

## 🛠️ Contribution
Feel free to add more styles by creating a YAML file in the `styles/` folder and updating this README under the appropriate category.
