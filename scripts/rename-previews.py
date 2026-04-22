import os
import sys

"""
rename-previews.py
------------------
Iterates through each subfolder in the /preview directory and renames
all images to follow the pattern: {folder_name}_{index}.{ext}
Example: preview/silicon_refined/img_01.png -> preview/silicon_refined/silicon_refined_1.png
"""

def rename_images(preview_dir):
    if not os.path.exists(preview_dir):
        print(f"Error: Directory '{preview_dir}' not found.")
        return

    # Supported image extensions
    EXTENSIONS = ('.png', '.jpg', '.jpeg', '.webp', '.avif')

    print(f"Scanning directory: {preview_dir}\n")

    for root, dirs, files in os.walk(preview_dir):
        # We only care about subdirectories of preview/
        if root == preview_dir:
            continue
        
        folder_name = os.path.basename(root)
        
        # Filter files by extension
        image_files = [f for f in files if f.lower().endswith(EXTENSIONS)]
        
        if not image_files:
            continue

        print(f"Processing: {folder_name} ({len(image_files)} images)")
        
        # Sort files to maintain alphabetical order during renaming
        image_files.sort()

        # Temporary renaming step to avoid collisions (e.g., if silicon_1.png already exists)
        # We rename to a unique temp name first
        temp_renames = []
        for i, filename in enumerate(image_files, start=1):
            ext = os.path.splitext(filename)[1].lower()
            old_path = os.path.join(root, filename)
            temp_name = f"__temp_{i}_{filename}"
            temp_path = os.path.join(root, temp_name)
            
            try:
                os.rename(old_path, temp_path)
                temp_renames.append((temp_path, i, ext))
            except Exception as e:
                print(f"  Warning: Could not temp rename {filename}: {e}")

        # Final rename to desired pattern
        for temp_path, i, ext in temp_renames:
            new_name = f"{folder_name}_{i}{ext}"
            new_path = os.path.join(root, new_name)
            
            try:
                os.rename(temp_path, new_path)
                # print(f"  Done: {new_name}")
            except Exception as e:
                print(f"  Error finalizing {new_name}: {e}")

    print("\nRenaming complete!")

if __name__ == "__main__":
    # Get absolute path to /preview based on script location
    script_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(script_dir)
    preview_path = os.path.join(root_dir, "preview")
    
    rename_images(preview_path)
