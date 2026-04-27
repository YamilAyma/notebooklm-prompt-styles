import os
import sys
from pathlib import Path
from PIL import Image
import re

# Configuration
BASE_DIR = Path(__file__).parent.parent
PREVIEW_DIR = BASE_DIR / "preview"
SRC_DIR = BASE_DIR / "src"
EXTENSIONS = ('.png', '.jpg', '.jpeg', '.webp')
QUALITY = 85

def process_images():
    print("--- Starting Optimization and Renaming ---")
    
    if not PREVIEW_DIR.exists():
        print(f"Error: {PREVIEW_DIR} not found.")
        return

    # 1. Rename and Convert to WebP
    for root, dirs, files in os.walk(PREVIEW_DIR):
        # Cast root to string for comparison if needed, but Path handles it
        if str(root) == str(PREVIEW_DIR): continue
        
        folder_name = os.path.basename(root)
        image_files = [f for f in files if f.lower().endswith(EXTENSIONS)]
        if not image_files: continue

        print(f"Processing folder: {folder_name}")
        image_files.sort() # Ensure consistent indexing

        # Temporary renaming to avoid collisions during the process
        processed_files = []
        for i, filename in enumerate(image_files, start=1):
            old_path = Path(root) / filename
            temp_name = f"__temp_{i}_{filename}"
            temp_path = Path(root) / temp_name
            
            try:
                os.rename(old_path, temp_path)
                processed_files.append((temp_path, i))
            except Exception as e:
                print(f"  Error temp renaming {filename}: {e}")

        # Convert and finalize rename
        for temp_path, i in processed_files:
            new_name = f"{folder_name}_{i}.webp"
            new_path = Path(root) / new_name

            try:
                with Image.open(temp_path) as img:
                    img.save(new_path, 'WEBP', quality=QUALITY)
                
                # Remove temp file
                os.remove(temp_path)
            except Exception as e:
                print(f"  Error converting {temp_path.name}: {e}")

    # 2. Update Code References (Astro & JS)
    print("\n--- Updating Code References ---")
    # This regex looks for /preview/something/something.png (or jpg/jpeg/webp)
    # and replaces the extension with .webp
    pattern = re.compile(r'(/preview/[^/]+/[^/]+\.)(png|jpg|jpeg|webp)', re.IGNORECASE)

    for root, dirs, files in os.walk(SRC_DIR):
        for file in files:
            if file.endswith(('.astro', '.js', '.ts', '.mdx')):
                file_path = Path(root) / file
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content, count = pattern.subn(r'\1webp', content)
                    
                    if count > 0:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"  Updated {count} references in: {file}")
                except Exception as e:
                    print(f"  Error updating {file}: {e}")

    print("\nAll done! Images are optimized and code is updated.")

if __name__ == "__main__":
    process_images()
