import os
import re
from PIL import Image
from pathlib import Path

# Configuration
ROOT = Path(__file__).parent.parent
PREVIEW_DIR = ROOT / "preview"
SRC_DIR = ROOT / "src"
EXTENSIONS = ('.png', '.jpg', '.jpeg')
QUALITY = 85

def update_code_references():
    """Update .astro and .js files to point to .webp versions of preview images."""
    print("\n--- Updating Code References ---")
    
    # Regex to find preview image paths in code
    # Matches patterns like /preview/folder/image.png, .jpg, etc.
    img_ref_pattern = re.compile(r'/preview/([^/]+)/([^/\s\'"]+)\.(png|jpg|jpeg)', re.IGNORECASE)

    for root, _, files in os.walk(SRC_DIR):
        for filename in files:
            if filename.endswith(('.astro', '.js', '.jsx', '.ts', '.tsx')):
                file_path = Path(root) / filename
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()

                    new_content = img_ref_pattern.sub(r'/preview/\1/\2.webp', content)

                    if content != new_content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"  Updated references in: {file_path.relative_to(ROOT)}")
                except Exception as e:
                    print(f"  Error updating references in {filename}: {e}")

def main():
    if not PREVIEW_DIR.exists():
        print(f"Error: {PREVIEW_DIR} not found.")
        return

    print("--- NotebookLM Preview Optimizer ---")
    
    processed_folders = []
    skipped_folders = 0

    # Get all subdirectories in preview/
    folders = [f for f in os.listdir(PREVIEW_DIR) if os.path.isdir(PREVIEW_DIR / f)]
    
    for folder_name in folders:
        folder_path = PREVIEW_DIR / folder_name
        files = os.listdir(folder_path)
        
        # Identify source images that need conversion
        source_files = [f for f in files if f.lower().endswith(EXTENSIONS)]
        
        if not source_files:
            skipped_folders += 1
            continue

        print(f"Optimizing folder: {folder_name} ({len(source_files)} images found)")
        source_files.sort() # Ensure consistent order

        for i, filename in enumerate(source_files, 1):
            old_path = folder_path / filename
            new_name = f"{folder_name}_{i}.webp"
            new_path = folder_path / new_name

            try:
                with Image.open(old_path) as img:
                    img.save(new_path, "WEBP", quality=QUALITY)
                
                # Remove original file
                os.remove(old_path)
            except Exception as e:
                print(f"  Error processing {filename}: {e}")

        processed_folders.append(folder_name)

    # 2. Update Code References (only if something was processed)
    if processed_folders:
        update_code_references()

    # Final Report
    print("\n" + "="*40)
    print("--- OPTIMIZATION SUMMARY ---")
    if processed_folders:
        print(f"✅ Optimized {len(processed_folders)} folders:")
        for f in processed_folders:
            print(f"   - {f}")
    else:
        print("✨ Everything is already up to date. No folders needed optimization.")
    
    print(f"ℹ️  Skipped {skipped_folders} folders (already in WebP format).")
    print("="*40)

if __name__ == "__main__":
    main()
