# NotebookLM Slide Styles Collection

A curated collection of visual design styles (YAML) to customize the output of NotebookLM slide generation.

## 📖 Table of Contents
- [🏷️ Brand Inspired](#-brand-inspired)
  - [Editorial Essence](#editorial-essence)
  - [Visual Discovery](#visual-discovery)
  - [Executive Report](#executive-report)
- [🌿 Minimalist](#-minimalist)
  - [Geometric Mono](#geometric-mono)
  - [Silicon Refined](#silicon-refined)
  - [Lush Minimal](#lush-minimal)
- [🎨 Creative](#-creative)
  - [Creative Spark](#creative-spark)
  - [Artisan Rust](#artisan-rust)
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
    theme: "Minimalist, sophisticated, and human-centric. High-end editorial style using warm cream backgrounds and bold terracotta accents."
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

  image_generation_prompts:
    style_guidelines: "Editorial photography style, warm natural lighting, high-end magazine aesthetic, minimalist cream background, terracotta accents."
    themes:
      - target: "Abstract Connection"
        prompt_elements: "Minimalist geometric shapes, warm earth tones, fine line art."

slide_layout_templates:
  - type: "Cover_Editorial"
    usage: "Main title slide with high-impact serif typography"
  - type: "Split_Insight"
    usage: "40/60 text-image split for conceptual explanations"
```

#### Visual Discovery
Focuses on visual-first layouts, card-based components with high border-radius, and vibrant red accents to drive engagement and focus. Inspired by modern discovery feeds.

![Visual Discovery Preview](assets/visual_discovery_preview.png)

```yaml
design_system:
  global_style:
    theme: "Modern, visual-first, and organized. Inspired by card-based discovery aesthetics. Uses card-based layouts with high border radius, soft shadows, and vibrant accents."
    typography: 
      primary_heading: "Clean rounded sans-serif (e.g., Roboto, Helvetica Rounded), bold"
      secondary_heading: "Simple sans-serif, medium weight, clean"
      body_text: "Functional sans-serif, standard weights, high contrast on white"
    color_palette:
      primary_color: "#E60023"
      background: "#FFFFFF"
      text_main: "#111111"
      accent_color: "#EFEFEF"
    key_visual_elements: 
      - "Rounded corners (16px to 24px) for cards and images"
      - "Drop shadows for depth"
      - "Grid-based image distribution"
      - "Circular profiles and 'save' style button call-outs"

  image_generation_prompts:
    style_guidelines: "Clean white studio background, vibrant accents, rounded corners, drop shadows, flat design elements, organized grid."

slide_layout_templates:
  - type: "Cover_Discovery"
    usage: "Impactful intro slide"
  - type: "Card_Grid_Insights"
    usage: "Presenting multiple features or items"
  - type: "Masonry_Vision"
    usage: "Inspiration or mood board"
```

#### Executive Report
Data-dense, executive style for professional reports. Focuses on statement-driven "Action Titles", rigorous grid structures, and professional high-fidelity visuals.

![Executive Report Preview](assets/executive_report_preview.png)

```yaml
design_system:
  global_style:
    theme: "Professional, data-dense, and executive. Inspired by high-end consulting report standards. Focuses on statement-driven 'Action Titles', rigorous grid layouts, and high-impact data visualization."
    typography: 
      primary_heading: "Authoritative serif (e.g., Times New Roman, Georgia), bold, statement-driven"
      secondary_heading: "Clean professional sans-serif (e.g., Helvetica, Arial), bold"
      body_text: "Functional sans-serif, standard weights, high density"
    color_palette:
      primary_color: "#051C2C"
      background: "#FFFFFF"
      text_main: "#333333"
      accent_color: "#007DBB"
      secondary_accent: "#999999"
    key_visual_elements: 
      - "Full-width horizontal dividers for header and footer separation"
      - "High-information density"
      - "Source and Footer attribution blocks"
      - "Waterfall and Stacked bar chart motifs in icons"

  image_generation_prompts:
    style_guidelines: "Clean professional white background, deep blue accents, business-centric data visualization, executive presentation style."

slide_layout_templates:
  - type: "Executive_Action_Title"
    usage: "Standard consulting slide with a key insight title"
  - type: "Waterfall_Insight"
    usage: "Dynamic financial or process flow visualization"
  - type: "Quad_Analysis"
    usage: "Comparison of four key metrics"
```

---

### 🌿 Minimalist

#### Geometric Mono
Professional, architectural, and monochromatic design. It uses a strong grayscale palette with geometric shapes and high-contrast photography to convey precision, structure, and corporate excellence.

![Geometric Mono Preview](assets/geometric_mono_preview.png)

```yaml
design_system:
  global_style:
    theme: "Professional, architectural, and monochromatic. Precision and structure."
    typography: 
      primary_heading: "Bold geometric sans-serif (e.g., Montserrat), uppercase"
      secondary_heading: "Medium weight sans-serif, clean"
      body_text: "Functional sans-serif, high contrast"
    color_palette:
      primary_color: "#FFFFFF"
      background: "#E0E0E0"
      text_main: "#000000"
      accent_color: "#333333"
    key_visual_elements: 
      - "High-contrast architectural grayscale photography"
      - "Diagonals and geometric color blocks"
      - "Circular icons with thin white outlines"

slide_layout_templates:
  - type: "Corporate_Summary"
    usage: "Executive summary or project overview"
  - type: "Geometric_Split"
    usage: "Comparing data or value propositions"
  - type: "Architectural_Timeline"
    usage: "Visualizing project phases or milestones"
```

#### Silicon Refined
Ultra-minimalist, premium, and sleek. Focuses on generous whitespace, precision typography, and high-fidelity visuals. Designed for high-end technology presentations where clarity and elegance are paramount.

![Silicon Refined Preview](assets/silicon_refined_preview.png)

```yaml
design_system:
  global_style:
    theme: "Ultra-minimalist, premium, and sleek. Generous whitespace and precision."
    typography: 
      primary_heading: "Clean high-quality sans-serif (e.g., SF Pro style), bold"
      secondary_heading: "Lightweight sans-serif, wide tracking"
      body_text: "Refined sans-serif, airy line-height"
    color_palette:
      primary_color: "#1D1D1F"
      background: "#FFFFFF"
      text_main: "#1D1D1F"
      accent_color: "#0071E3"
    key_visual_elements: 
      - "Generous whitespace (Airy layout)"
      - "High-resolution product-focused photography"
      - "Bento-style grids for features"

slide_layout_templates:
  - type: "Hero_Breathe"
    usage: "Impactful intro or single-statement slide"
  - type: "Bento_Grid_Specs"
    usage: "Showcasing multiple features or specifications"
  - type: "Feature_Gradient"
    usage: "Highlighting a breakthrough benefit"
```

#### Lush Minimal
Nature-inspired, organic, and soft design. It focuses on botanical imagery, sage greens, and large rounded corners to create a peaceful yet professional atmosphere.

![Lush Minimal Preview](assets/lush_minimal_preview.png)

```yaml
design_system:
  global_style:
    theme: "Nature-inspired, organic, and soft. Botanical focus."
    typography: 
      primary_heading: "Bold rounded sans-serif (e.g., Lexend)"
      secondary_heading: "Regular weight sans-serif"
      body_text: "Clean sans-serif with generous spacing"
    color_palette:
      primary_color: "#4A4A4A"
      background: "#F5F7F5"
      text_main: "#4A4A4A"
      accent_color: "#7A906E"
    key_visual_elements: 
      - "Botanical photography (monstera, succulents)"
      - "Large rounded corners (24px+)"
      - "Soft, subtle drop shadows"

slide_layout_templates:
  - type: "Botanical_Split"
    usage: "Intro slides or service highlights"
  - type: "Organic_Goals"
    usage: "Presenting multiple points or objectives"
  - type: "Sage_Data"
    usage: "Presenting metrics or growth"
```

### 🎨 Creative

#### Creative Spark
Vibrant, creative, and high-impact design. Uses a deep dark canvas with neon purple accents, combining elegant script typography with bold, heavy block fonts for maximum contrast.

![Creative Spark Preview](assets/creative_spark_preview.png)

```yaml
design_system:
  global_style:
    theme: "Vibrant, creative, and high-impact. Dark canvas with neon purple accents."
    typography: 
      primary_heading: "Bold heavy sans-serif (e.g., Montserrat Black)"
      accent_heading: "Elegant cursive script (e.g., Great Vibes)"
      body_text: "Clean modern sans-serif"
    color_palette:
      primary_color: "#B18CFF"
      background: "#0F0F0F"
      text_main: "#FFFFFF"
    key_visual_elements: 
      - "Four-pointed sparkle icons"
      - "Thick vertical color blocks on edges"
      - "High-contrast tables"

slide_layout_templates:
  - type: "Cover_Spark"
    usage: "High-impact opening slide"
  - type: "Stitched_Portfolio"
    usage: "Showcasing multiple works or images"
  - type: "Impact_Results_Table"
    usage: "Presenting data with high contrast"
```

#### Artisan Rust
Warm, handcrafted, and organic design. Uses a textured rust-colored background with hand-drawn white doodles and tall condensed typography for an artisan feel.

![Artisan Rust Preview](assets/artisan_rust_preview.png)

```yaml
design_system:
  global_style:
    theme: "Warm, handcrafted, and organic. Textured rust canvas with hand-drawn doodles."
    typography: 
      primary_heading: "Tall condensed sans-serif (e.g., Anton)"
      secondary_heading: "Clean minimal sans-serif"
      body_text: "Functional sans-serif"
    color_palette:
      primary_color: "#FFFFFF"
      background: "#B34D2E"
      text_main: "#F5F5DC"
    key_visual_elements: 
      - "Hand-drawn white doodles"
      - "Grainy paper texture"
      - "Sticker-style image cutouts"

slide_layout_templates:
  - type: "Artisan_Portfolio"
    usage: "Showcasing projects with a handcrafted vibe"
  - type: "Process_Timeline"
    usage: "Visualizing steps or history"
  - type: "Sticker_Callout"
    usage: "Focusing on a specific person or object"
```

---

## 🚀 How to Use
1. Copy the YAML code block for your desired theme.
2. Paste it into your NotebookLM prompt or configuration when generating slides.
3. Enjoy your beautifully styled presentation!

## 🛠️ Contribution
Feel free to add more styles by creating a YAML file in the `styles/` folder and updating this README under the appropriate category.
