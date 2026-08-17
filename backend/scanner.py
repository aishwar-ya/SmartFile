from pathlib import Path


def scan_folder(folder_path):
    folder = Path(folder_path)            # converts the folder location into something Python can work with.

    files = []

    for file in folder.rglob("*"):        # searches through the folder and all its subfolders.
        if file.is_file():                # makes sure we only collect actual files, not folders.
            files.append(file)

    return files