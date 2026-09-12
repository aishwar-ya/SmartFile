from pathlib import Path

from hasher import calculate_hash


def get_file_type(extension):
    extension = extension.lower()

    image_extensions = {
        ".jpg", ".jpeg", ".png", ".gif",
        ".bmp", ".webp", ".svg", ".tiff"
    }

    document_extensions = {
        ".pdf", ".doc", ".docx", ".txt",
        ".xls", ".xlsx", ".ppt", ".pptx", ".csv"
    }

    video_extensions = {
        ".mp4", ".avi", ".mkv", ".mov",
        ".wmv", ".flv", ".webm"
    }

    audio_extensions = {
        ".mp3", ".wav", ".aac", ".flac",
        ".ogg", ".m4a", ".wma"
    }

    if extension in image_extensions:
        return "Images"

    if extension in document_extensions:
        return "Documents"

    if extension in video_extensions:
        return "Videos"

    if extension in audio_extensions:
        return "Audio"

    return "Other"


def scan_folder(folder_path):
    folder = Path(folder_path)

    files = []

    for file in folder.rglob("*"):
        if file.is_file():
            try:
                extension = file.suffix.lower()

                file_info = {
                    "name": file.name,
                    "path": str(file.resolve()),
                    "size": file.stat().st_size,
                    "extension": extension,
                    "file_type": get_file_type(extension),
                    "hash": calculate_hash(file)
                }

                files.append(file_info)

            except (PermissionError, OSError):
                continue

    return files