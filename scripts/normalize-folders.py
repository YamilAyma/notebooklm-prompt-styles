import os

def normalize_folders():
    # Get the root directory (parent of scripts/)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(script_dir)
    preview_path = os.path.join(root_dir, "preview")

    if not os.path.exists(preview_path):
        print(f"Error: {preview_path} not found")
        return

    print(f"Normalizing folders in: {preview_path}\n")

    for folder in os.listdir(preview_path):
        folder_path = os.path.join(preview_path, folder)
        if not os.path.isdir(folder_path):
            continue

        if "-" in folder:
            new_name = folder.replace("-", "_")
            new_path = os.path.join(preview_path, new_name)

            if os.path.exists(new_path):
                print(f"Warning: Collision: {new_path} already exists. Merging contents...")
                # Optional: move files from old to new, then delete old
                for file in os.listdir(folder_path):
                    os.rename(os.path.join(folder_path, file), os.path.join(new_path, file))
                os.rmdir(folder_path)
            else:
                os.rename(folder_path, new_path)
                print(f"Renamed: {folder} -> {new_name}")

if __name__ == "__main__":
    normalize_folders()
