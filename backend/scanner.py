from pathlib import Path


def scan_folder(folder_path):
    folder = Path(folder_path)            # converts the folder location into something Python can work with.

    files = []

    for file in folder.rglob("*"):        # searches through the folder and all its subfolders.
        if file.is_file():                # makes sure we only collect actual files, not folders.

            try:
                file_info = {       
                    "name": file.name,
                    "path": str(file.resolve()),
                    "size": file.stat().st_size,
                    "extension": file.suffix.lower()
                }

                files.append(file_info)
            except (PermissionError, OSError):
                continue

    return files