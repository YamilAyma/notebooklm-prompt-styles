import os
import sys
from pathlib import Path

# Path configurations
BASE_DIR = Path(__file__).parent.parent
STYLES_DIR = BASE_DIR / "styles"
PREVIEWS_DIR = BASE_DIR / "preview"
INPUT_FILE = BASE_DIR / "input.yaml"

def read_file_content(file_path):
    """Reads file content and strips leading/trailing whitespace."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read().strip()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return None

def main():
    print("--- NotebookLM Style Matcher ---")
    
    # 1. Check if input file exists
    if not INPUT_FILE.exists():
        INPUT_FILE.touch()
        print(f"Input file 'input.yaml' not found. Created one in the root directory.")
        print("Please paste your YAML code there and run the script again.")
        return

    # 2. Read user input
    user_input = read_file_content(INPUT_FILE)
    
    if not user_input:
        print("Warning: 'input.yaml' is empty. Please paste the YAML style content.")
        return

    print("Searching for an exact match in 'styles/'...")
    
    match_found = False
    # 3. Iterate through all styles
    for style_file in STYLES_DIR.glob("*.yaml"):
        style_content = read_file_content(style_file)
        
        if style_content == user_input:
            style_name = style_file.stem
            target_dir = PREVIEWS_DIR / style_name
            
            print(f"\n✅ Success! YAML matches exactly with: '{style_name}.yaml'")
            
            # 4. Check if the directory already exists
            if not target_dir.exists():
                target_dir.mkdir(parents=True, exist_ok=True)
                print(f"📁 Directory created: preview/{style_name}")
            else:
                print(f"ℹ️ Skip: The directory 'preview/{style_name}' already exists. No changes made.")
            
            match_found = True
            break

    if not match_found:
        print("\n❌ No exact match found.")
        print("Ensure there are no changes in spaces, comments, or line breaks.")
        print("The YAML must be identical to the original file in 'styles/'.")

if __name__ == "__main__":
    main()
