# NotebookLM Slide Styles Collection

A curated collection of visual design styles (YAML) to customize the output of NotebookLM slide generation.

## 🌐 Showcase Website

Explore the collection interactively through our high-performance showcase site. Preview styles with rotating thumbnails, copy YAML prompts with a single click, and save your favorites.

- **Local Development:**
  ```bash
  npm install
  npm run dev
  ```
- **Live Version:** [View the Showcase](https://yamilayma.github.io/notebooklm-styles-prompt/) *(Placeholder)*

---

## 📖 Table of Contents
- [🏷️ Brand Inspired](#-brand-inspired)
  - [Editorial Essence](#editorial-essence)
  - [Visual Discovery](#visual-discovery)
  - [Executive Report](#executive-report)
- [🌿 Minimalist](#-minimalist)
  - [Geometric Mono](#geometric-mono)
  - [Silicon Refined](#silicon-refined)
  - [Lush Minimal](#lush-minimal)
  - [Structured Mint](#structured-mint)
  - [Architectural Mono](#architectural-mono)
  - [Architectural Cobalt](#architectural-cobalt)
- [🎨 Creative](#-creative)
  - [Creative Spark](#creative-spark)
  - [Artisan Rust](#artisan-rust)
  - [Vintage Charm](#vintage-charm)
  - [Scholar's Journal](#scholars-journal)
  - [Neon Pulsar](#neon-pulsar)
  - [Cobalt Editorial](#cobalt-editorial)
  - [Midnight Tactical](#midnight-tactical)
  - [Creative Classroom](#creative-classroom)
  - [Botanical Journal](#botanical-journal)
  - [Y2K Nostalgia](#y2k-nostalgia)
  - [Creative Workshop](#creative-workshop)
  - [Ensign Corporate](#ensign-corporate)
- [🚀 How to Use](#-how-to-use)
- [🛠️ Contribution](#-contribution)

---

## 🎨 Themes

> [!IMPORTANT]
> The code snippets below are **simplified previews** focused on design tokens. To get the full configuration (including image generation prompts and detailed components), use the **[View Full YAML]** link in each section.

### 🏷️ Brand Inspired

#### Editorial Essence
Sophisticated, editorial, and human-centric design language. It uses warm cream backgrounds, bold terracotta accents, and elegant serif typography to create a "book-like" presentation feel.

![Editorial Essence Preview](assets/editorial_essence_preview.png)

> [!TIP]
> This is a simplified preview. [View Full YAML](styles/editorial_essence.yaml)

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

> [!TIP]
> This is a simplified preview. [View Full YAML](styles/visual_discovery.yaml)

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

> [!TIP]
> This is a simplified preview. [View Full YAML](styles/executive_report.yaml)

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

> [!TIP]
> This is a simplified preview. [View Full YAML](styles/geometric_mono.yaml)

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

> [!TIP]
> This is a simplified preview. [View Full YAML](styles/silicon_refined.yaml)

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

> [!TIP]
> This is a simplified preview. [View Full YAML](styles/lush_minimal.yaml)

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

#### Structured Mint
Professional, structured, and refreshing corporate design. Features distinctive tiered corner frames in mint green and dark teal, offering a clean and organized frame for business presentations.

![Structured Mint Preview](assets/structured_mint_preview.png)

> [!TIP]
> This is a simplified preview. [View Full YAML](styles/structured_mint.yaml)

```yaml
design_system:
  global_style:
    theme: "Corporate, structured, and refreshing. Tiered corner frames and mint accents."
    typography: 
      primary_heading: "Bold geometric sans-serif (e.g., Montserrat), uppercase"
      secondary_heading: "Medium sans-serif, clean"
      body_text: "Functional sans-serif, optimized for readability"
    color_palette:
      primary_color: "#557A68"
      background: "#FFFFFF"
      accent_mint: "#B2EBF2"
      text_main: "#263238"
    key_visual_elements: 
      - "Tiered corner frames (Mint and Teal accents)"
      - "Pill-shaped category tags"
      - "Numbered grid boxes"
      - "Vertical mint-green accent bars"

slide_layout_templates:
  - type: "Structured_Cover"
    usage: "Impactful intro with tiered frames"
  - type: "Grid_Methodology"
    usage: "Listing steps or structured points"
  - type: "Content_Focus_Split"
    usage: "Image and text side-by-side"
```

#### Architectural Mono
Modern brutalist, monochromatic, and architectural design. Inspired by minimalist gallery aesthetics, it features high-contrast grayscale photography, large technical stamps, and sleek sans-serif typography.

![Architectural Mono Preview](assets/architectural_mono_preview.png)

> [!TIP]
> This is a simplified preview. [View Full YAML](styles/architectural_mono.yaml)

```yaml
design_system:
  global_style:
    theme: "Modern brutalist, monochromatic, and architectural. High-contrast grayscale."
    typography: 
      primary_heading: "Clean modern sans-serif (e.g., Inter, Helvetica), bold"
      secondary_heading: "Refined sans-serif, standard weight"
      body_text: "Functional sans-serif, technical feel"
      accent_mono: "Monospace for technical labels"
    color_palette:
      primary_color: "#111111"
      background: "#E8E8E8"
      text_main: "#111111"
      accent_gray: "#B0B0B0"
    key_visual_elements: 
      - "High-contrast grayscale architectural photography"
      - "Large year stamps (e.g., '20 | 25')"
      - "Thin horizontal technical dividers"
      - "Thin arrow icons (→)"
      - "Vertical section labels"

slide_layout_templates:
  - type: "Architectural_Cover"
    usage: "Impactful intro with full-page imagery"
  - type: "Mission_Grid"
    usage: "Masonry grid for multiple references"
  - type: "Sliver_About"
    usage: "Vertical image sliver presentation"
```

#### Architectural Cobalt
Technical, dark architectural, and blueprint-inspired design. Features deep charcoal backgrounds with vibrant cobalt blue gradients and precise 'sight' crosshair visual elements for a high-end engineering feel.

![Architectural Cobalt Preview](assets/architectural_cobalt_preview.png)

> [!TIP]
> This is a simplified preview. [View Full YAML](styles/architectural_cobalt.yaml)

```yaml
design_system:
  global_style:
    theme: "Technical, dark architectural, blueprint-inspired. Deep charcoal with cobalt blue."
    typography: 
      primary_heading: "Bold high-contrast sans-serif"
      secondary_heading: "Medium sans-serif, clean"
      body_text: "Functional sans-serif, optimized for dark mode"
      technical_label: "Small uppercase sans-serif, spaced"
    color_palette:
      primary_color: "#304FFE"
      background: "#111111"
      text_main: "#FFFFFF"
      accent_overlay: "rgba(48, 79, 254, 0.2)"
    key_visual_elements: 
      - "Circular crosshair/sight icons"
      - "Vibrant cobalt blue gradient overlays"
      - "Dark, high-shadow architectural photography"
      - "Thin white structural grid lines"

slide_layout_templates:
  - type: "Cobalt_Impact_Cover"
    usage: "Impactful intro with technical structural visuals"
  - type: "Dark_Project_Detail"
    usage: "Showcasing projects with technical metadata"
  - type: "Expertise_Profile"
    usage: "Team introduction or profile highlights"
```

### 🎨 Creative

#### Creative Spark
Vibrant, creative, and high-impact design. Uses a deep dark canvas with neon purple accents, combining elegant script typography with bold, heavy block fonts for maximum contrast.

![Creative Spark Preview](assets/creative_spark_preview.png)

> [!TIP]
> This is a simplified preview. [View Full YAML](styles/creative_spark.yaml)

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

> [!TIP]
> This is a simplified preview. [View Full YAML](styles/artisan_rust.yaml)

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

#### Vintage Charm
Romantic, nostalgic, and layered design inspired by coquette and scrapbooking aesthetics. It uses pastel tones, torn paper textures, and elegant accents like bows and pearls for a high-jewelry, vintage feel.

![Vintage Charm Preview](assets/vintage_charm_preview.png)

> [!TIP]
> This is a simplified preview. [View Full YAML](styles/vintage_charm.yaml)

```yaml
design_system:
  global_style:
    theme: "Romantic, nostalgic, and layered. Vintage scrapbook aesthetic."
    typography: 
      primary_heading: "Elegant vintage serif (e.g., Playfair Display)"
      secondary_heading: "Soft serif or clean traditional sans"
      body_text: "Functional serif with a classic feel"
    color_palette:
      primary_color: "#E67E7E"
      background: "#F8E1E1"
      text_main: "#4A3B3B"
      accent_color: "#D2C1A5"
    key_visual_elements: 
      - "Pink/Red ribbons and bows"
      - "Torn paper edges and layered textures"
      - "Vintage illustrations (floral/portraits)"
      - "Washi tape and pearls"

slide_layout_templates:
  - type: "Scrapbook_Header"
    usage: "Dynamic intro or section transitions"
  - type: "Layered_Referents"
    usage: "Showcasing aesthetic or historical references"
  - type: "Numbered_Vintage_Grid"
    usage: "Listing steps, characteristics, or points"
```

#### Scholar's Journal
Academic, vintage, and scientific design. Inspired by 19th-century botanical engravings and researcher journals. It features heavy coarse paper textures and deep indigo line art illustrations for a scholarly feel.

![Scholar's Journal Preview](assets/scholars_journal_preview.png)

> [!TIP]
> This is a simplified preview. [View Full YAML](styles/scholars_journal.yaml)

```yaml
design_system:
  global_style:
    theme: "Academic, vintage, and scientific. Botanical engravings focus."
    typography: 
      primary_heading: "Traditional serif or slab serif (e.g., Trocchi)"
      secondary_heading: "Classic serif, clean"
      body_text: "Functional traditional serif"
    color_palette:
      primary_color: "#3E4E63"
      background: "#D1D1D1"
      text_main: "#2D3436"
    key_visual_elements: 
      - "Etched/Engraved line art illustrations"
      - "Heavy coarse paper texture grain"
      - "Indigo on Parchment monochromatic scheme"

slide_layout_templates:
  - type: "Scholar_Intro"
    usage: "Title slides or section starts"
  - type: "Illustration_Focus"
    usage: "Presenting concepts with a visual anchor"
  - type: "Balanced_Journal"
    usage: "Summary or Q&A slides"
```

#### Neon Pulsar
Futuristic, high-energy, and tech-focused design. This dark mode aesthetic uses vibrant neon gradients (Cyan, Magenta, Purple) and glassmorphic elements to create a cutting-edge startup atmosphere.

![Neon Pulsar Preview](assets/neon_pulsar_preview.png)

> [!TIP]
> This is a simplified preview. [View Full YAML](styles/neon_pulsar.yaml)

```yaml
design_system:
  global_style:
    theme: "Futuristic, high-energy, tech-focused. Dark mode neon."
    typography: 
      primary_heading: "Extra-bold modern sans-serif (e.g., Inter)"
      secondary_heading: "Medium sans-serif, high contrast"
      body_text: "Clean sans-serif for dark mode"
    color_palette:
      primary_color: "#FFFFFF"
      background: "#000000"
      accent_cyan: "#00F2FF"
      accent_purple: "#7000FF"
      accent_magenta: "#FF00E5"
    key_visual_elements: 
      - "Blurred neon gradient spheres"
      - "Concentric rings and digital orbits"
      - "Pill-shaped containers"
      - "Glassmorphic cards with neon borders"

slide_layout_templates:
  - type: "Tech_Startup_Hero"
    usage: "Main title or key announcement"
  - type: "Service_Orbits"
    usage: "Showing features around a core concept"
  - type: "Neon_Bento_Grid"
    usage: "Showcasing tech specs or team members"
```

#### Cobalt Editorial
Bold editorial and Swiss-inspired design. High contrast between Electric Blue and Cream, featuring large brutalist typography, liquid organic textures, and iconic symbols like asterisks and plus signs.

![Cobalt Editorial Preview](assets/cobalt_editorial_preview.png)

> [!TIP]
> This is a simplified preview. [View Full YAML](styles/cobalt_editorial.yaml)

```yaml
design_system:
  global_style:
    theme: "Bold editorial, Swiss-inspired. Electric Blue & Cream."
    typography: 
      primary_heading: "Extra-bold brutalist sans-serif (e.g., Inter)"
      secondary_heading: "Bold sans-serif, vertical layouts"
      body_text: "Clean sans-serif, high legibility"
    color_palette:
      primary_color: "#2B59FF"
      background: "#FDF5E6"
      text_main: "#000000"
    key_visual_elements: 
      - "Electric Blue asterisks (*) and plus signs (+)"
      - "Liquid, rippled, or smoky textures"
      - "Split-screen layouts"
      - "Pill-shaped buttons with blue outlines"

slide_layout_templates:
  - type: "Editorial_Split"
    usage: "Core sections or chapter starts"
  - type: "Vertical_Type_List"
    usage: "Detailed overviews or content lists"
  - type: "Modular_Brand_Focus"
    usage: "Presenting mission statements or pillars"
```

#### Midnight Tactical
Modern, tech-utilitarian design with a high-contrast matte black base and vibrant lime green accents. Features industrial aesthetic elements like tilted boxes, double chevrons, and monospace metadata.

![Midnight Tactical Preview](assets/midnight_tactical_preview.png)

> [!TIP]
> This is a simplified preview. [View Full YAML](styles/midnight_tactical.yaml)

```yaml
design_system:
  global_style:
    theme: "Modern tech-utilitarian. Matte Black & Lime Green."
    typography: 
      primary_heading: "Bold geometric sans-serif (e.g., Space Grotesk)"
      secondary_heading: "Medium sans-serif, high contrast white"
      body_text: "Clean sans-serif for dark backgrounds"
      accent_mono: "Monospace for technical labels"
    color_palette:
      primary_color: "#C6FF00"
      background: "#000000"
      text_main: "#FFFFFF"
    key_visual_elements: 
      - "Tilted lime green highlight boxes (fractional labels)"
      - "Pill-shaped labels in dark green"
      - "Double chevron accents (<<)"
      - "Rounded-corner modular grid containers"

slide_layout_templates:
  - type: "Tactical_Hero"
    usage: "Section headers or main announcements"
  - type: "Utility_Agenda"
    usage: "Agenda or multi-point summaries"
  - type: "Textured_Gallery"
    usage: "Showcasing visual references or products"
```

#### Creative Classroom
Playful, warm, and educational design. Inspired by primary school classrooms and hand-drawn doodle aesthetics. Features soft cream backgrounds, chalkboard content frames, and flat 2D illustrations of classroom objects.

![Creative Classroom Preview](assets/creative_classroom_preview.png)

> [!TIP]
> This is a simplified preview. [View Full YAML](styles/creative_classroom.yaml)

```yaml
design_system:
  global_style:
    theme: "Playful educational. Classroom & Doodles."
    typography: 
      primary_heading: "Hand-drawn bold sans-serif (e.g., Fredoka One)"
      secondary_heading: "Rounded friendly sans-serif"
      body_text: "Clean legible sans-serif"
    color_palette:
      primary_color: "#557A68"
      background: "#FFF9E6"
      accent_wood: "#C4A484"
    key_visual_elements: 
      - "Chalkboard-themed content frames"
      - "Flat, 2D vector illustrations (globes, books)"
      - "ABC alphabet blocks"
      - "Irregular hand-drawn edges"

slide_layout_templates:
  - type: "Classroom_Hero"
    usage: "Main title or module introductions"
  - type: "Informational_Board"
    usage: "Core lesson content or discussion"
  - type: "Object_Focus_Detail"
    usage: "Summaries or conceptual focuses"
```

#### Botanical Journal
Eco-friendly, natural, and scrapbook-inspired design. Features hand-drawn botanical doodles (leaves, vines, flowers), washi tape accents, and torn notebook paper textures on a warm cream background.

![Botanical Journal Preview](assets/botanical_journal_preview.png)

> [!TIP]
> This is a simplified preview. [View Full YAML](styles/botanical_journal.yaml)

```yaml
design_system:
  global_style:
    theme: "Eco Scrapbook. Natural & Botanical."
    typography: 
      primary_heading: "Bubbly hand-drawn sans-serif (e.g., Fredoka One)"
      secondary_heading: "Friendly rounded sans-serif"
      body_text: "Clean legible sans-serif"
    color_palette:
      primary_color: "#7CB342"
      background: "#F9F7F1"
      accent_lime: "#D4E157"
    key_visual_elements: 
      - "Torn binder paper textures"
      - "Decorative washi tape strips"
      - "Hand-drawn botanical doodles"
      - "Circular or oval photo frames"

slide_layout_templates:
  - type: "Botanical_Hero"
    usage: "Main title or environmental intros"
  - type: "Notebook_Scrapbook"
    usage: "Detailed points or objectives"
  - type: "Eco_Profile"
    usage: "Nature focus or overviews"
```

#### Y2K Nostalgia
Bubblegum pop, iridescent textures, and early digital nostalgia. Features CD-ROM reflections, fluffy clouds, and 3D 'plastic' icons (gummy bears, hearts, cupids) on pastel gradients.

![Y2K Nostalgia Preview](assets/y2k_nostalgia_preview.png)

> [!TIP]
> This is a simplified preview. [View Full YAML](styles/y2k_nostalgia.yaml)

```yaml
design_system:
  global_style:
    theme: "Retro Digital. Bubblegum & Holographic."
    typography: 
      primary_heading: "Bold quirky block letters"
      secondary_heading: "Pixellated or typewriter monospace"
      body_text: "Clean legible monospace (e.g., Courier New)"
    color_palette:
      primary_color: "#FF85A1"
      background: "#FDEFF4"
      accent_purple: "#B19CD9"
    key_visual_elements: 
      - "CD-ROM rainbow reflections"
      - "Holographic/Iridescent textures"
      - "3D plastic gummy bears and icons"
      - "Polaroid photo frames"

slide_layout_templates:
  - type: "Pop_Culture_Hero"
    usage: "Dynamic titles or mood setters"
  - type: "Digital_Dairy"
    usage: "Storytelling or personal anecdotes"
  - type: "Memory_Gallery"
    usage: "Photos or event highlights"
```

#### Creative Workshop
Artistic, youthful, and workshop-oriented design. Features notebook grid backgrounds, pastel pink wavy accents, and friendly 2D art supply doodles (pencils, rainbows, stars).

![Creative Workshop Preview](assets/creative_workshop_preview.png)

> [!TIP]
> This is a simplified preview. [View Full YAML](styles/creative_workshop.yaml)

```yaml
design_system:
  global_style:
    theme: "Art Studio. Creative & Playful."
    typography: 
      primary_heading: "Bold blocky sans-serif (Multi-color)"
      secondary_heading: "Rounded friendly sans-serif"
      body_text: "Clean legible sans-serif"
    color_palette:
      primary_color: "#F48FB1"
      background: "#FFFFFF"
      grid_lines: "#E1F5FE"
    key_visual_elements: 
      - "Ruled background textures"
      - "Organic wavy pink blobs"
      - "Smiling art supply illustrations"
      - "Pill-shaped category tags"

slide_layout_templates:
  - type: "Workshop_Hero"
    usage: "Project titles or starters"
  - type: "Activity_Grid"
    usage: "Listing activities or topics"
  - type: "Showcase_Gallery"
    usage: "Highlighting events or work"
```

#### Ensign Corporate
Modern corporate, dynamic, and professional design. Features a strong navy and vivid blue foundation with energetic yellow/orange accents and distinctive corner 'ribbon' layers for a high-impact business presentation.

![Ensign Corporate Preview](assets/ensign_corporate_preview.png)

> [!TIP]
> This is a simplified preview. [View Full YAML](styles/ensign_corporate.yaml)

```yaml
design_system:
  global_style:
    theme: "Modern corporate, dynamic, professional. Navy/Blue with Yellow accents."
    typography: 
      primary_heading: "Bold geometric sans-serif, uppercase"
      secondary_heading: "Medium-bold sans-serif, accent color"
      body_text: "Clean sans-serif, business readability"
      info_label: "Small bold uppercase pill labels"
    color_palette:
      primary_color: "#101D42"
      secondary_color: "#4A6CF7"
      accent_yellow: "#FFB400"
      background: "#F5F7FA"
    key_visual_elements: 
      - "Layered corner 'ribbons' (Navy and Blue stacking)"
      - "Pill-shaped accent backgrounds for labels"
      - "Bold circular iconography"
      - "Rounded cards for content blocks"

slide_layout_templates:
  - type: "Ensign_Cover"
    usage: "Professional business introduction"
  - type: "Ribbon_Team"
    usage: "Team introduction with individual roles"
  - type: "Icon_Service_Grid"
    usage: "Listing core services or features"
```

---

## 🚀 How to Use
1. Copy the YAML code block for your desired theme.
2. Paste it into your NotebookLM prompt or configuration when generating slides.
3. Enjoy your beautifully styled presentation!

## 🛠️ Contribution
Feel free to add more styles by creating a YAML file in the `styles/` folder and updating this README under the appropriate category.
