# NotebookLM Slide Styles Skill

This skill enables an AI assistant to translate visual identity and design documents into a standardized YAML format optimized for NotebookLM slide generation.

## When to Trigger
- The user provides an image or a set of images and asks for the "style" or "design system".
- The user uploads a PDF or PPT and wants to replicate its layout/aesthetic for new slides.
- The user describes a theme (e.g., "Cyberpunk", "Eco-minimalism") and needs a design definition.
- The user explicitly mentions "NotebookLM slide YAML" or "Slide deck styles".

## Workflow

### 1. Analyze Style Inputs
When visual or document inputs are provided, analyze the following aspects:
- **Typography**: Identify primary fonts (headings) and secondary/body fonts. Note the weights, letter spacing, and casing.
- **Color Palette**: Identify primary, secondary, and accent colors. Look for HEX codes or descriptive names. Identify background styles (solid, gradient, patterns).
- **Key Visual Elements**: Patterns, photography styles (e.g., minimalist, high contrast, warm lighting), icon styles, and layout characteristics (e.g., asymmetrical, grid-based).

### 2. Map to Slide Templates
Standardize the design across these common slide types:
- **Cover**: Main title, subtitle, background.
- **Split Layouts**: 50/50 or 40/60 image-text distributions.
- **Lists & Processes**: How headers and list items are visually organized.
- **Timeline/Roadmap**: Horizontal or grid-based flows.
- **Profiles**: Team/Founder introductions.
- **Closings**: Engaging final visuals.

### 3. Generate Image Prompts
Create a dedicated section for image generation AI (like Midjourney, DALL-E) or stock searches:
- **Style Guidelines**: Keywords for lighting, texture, and overall vibe.
- **Themes**: Specific prompts for abstract backgrounds, accent objects, and portraits.

### 4. Output Format
ALWAYS produce a valid YAML following this exact structure:

```yaml
design_system:
  global_style:
    theme: "[Detailed description of the vibe]"
    typography: 
      primary_heading: "[Font name and style]"
      secondary_heading: "[Font name and style]"
      body_text: "[Font name and style]"
    color_palette:
      primary_color: "[HEX or Name]"
      background: "[HEX or pattern description]"
      text_main: "[HEX or Name]"
    key_visual_elements: 
      - "[Element 1 description]"
      - "[Element 2 description]"

  image_generation_prompts:
    style_guidelines: "[General AI photography/art guidance]"
    themes:
      - target: "[Target name, e.g., Abstract Background]"
        prompt_elements: "[Specific keywords for AI prompt]"

slide_layout_templates:
  - type: "[TemplateName]"
    usage: "[When to use it]"
    components:
      - "[Component 1 description]"
      - "[Component 2 description]"
```
