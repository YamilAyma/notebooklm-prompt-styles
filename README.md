# NotebookLM Slide Styles Collection

A curated collection of visual design styles (YAML) to customize the output of NotebookLM slide generation.

## 🎨 Themes

### 1. Claude Aesthetic
Inspired by Anthropic's sophisticated, editorial, and human-centric design language. It uses warm cream backgrounds, bold terracotta accents, and elegant serif typography to create a "book-like" presentation feel.

![Claude Style Preview](assets/claude_preview.png)

#### Design Tokens
- **Background**: Warm Cream (`#FAF9F5`)
- **Primary Text**: Charcoal (`#141413`)
- **Accent**: Terracotta (`#D97757`)
- **Typography**: Serif Headings (Lora/Georgia), Sans-serif Subtitles (Poppins/Inter)

#### YAML Style Definition
```yaml
design_system:
  global_style:
    theme: "Minimalist, sophisticated, and human-centric. Inspired by Anthropic's 'Claude' brand identity."
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

---

## 🚀 How to Use
1. Copy the YAML code block for your desired theme.
2. Paste it into your NotebookLM prompt or configuration when generating slides.
3. Enjoy your beautifully styled presentation!

## 🛠️ Contribution
Feel free to add more styles by creating a YAML file in the `styles/` folder and updating this README.
