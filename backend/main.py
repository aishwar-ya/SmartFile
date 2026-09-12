from pathlib import Path
import shutil
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from scanner import scan_folder
from duplicate_finder import (
    find_duplicates,
    calculate_wasted_storage,
)

from save_scan import save_scan
from database import SessionLocal
from models import Scan


# --------------------------------------------------
# Create FastAPI application
# --------------------------------------------------

app = FastAPI()


# --------------------------------------------------
# CORS configuration
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5176",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5176",
        "http://localhost:5177",
        "http://127.0.0.1:5177",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Helper: Format storage size
# --------------------------------------------------

def format_size(size):
    units = ["Bytes", "KB", "MB", "GB", "TB"]

    for unit in units:
        if size < 1024:
            return f"{size:.2f} {unit}"

        size /= 1024

    return f"{size:.2f} PB"


# --------------------------------------------------
# Home API
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "Smart File Backend is working!"
    }


# --------------------------------------------------
# File Scanning API
# --------------------------------------------------

@app.get("/scan")
def scan(folder_path: str):

    # Convert folder path into a Path object
    folder = Path(folder_path)

    # Check whether the folder exists
    if not folder.exists():
        raise HTTPException(
            status_code=404,
            detail="Folder does not exist",
        )

    # Check whether the path is a folder
    if not folder.is_dir():
        raise HTTPException(
            status_code=400,
            detail="The provided path is not a folder",
        )

    # Scan the folder
    files = scan_folder(folder_path)

    # Count files by type
    file_type_counts = {
        "Images": 0,
        "Documents": 0,
        "Videos": 0,
        "Audio": 0,
        "Other": 0,
    }

    for file in files:
        file_type = file.get("file_type", "Other")

        if file_type in file_type_counts:
            file_type_counts[file_type] += 1
        else:
            file_type_counts["Other"] += 1

    # Save scan information to SQLite
    save_scan(folder_path)

    return {
        "folder": folder_path,
        "files_found": len(files),
        "files": files,
    }


# --------------------------------------------------
# Duplicate Detection API
# --------------------------------------------------

@app.get("/duplicates")
def duplicates(folder_path: str):

    # Convert folder path into a Path object
    folder = Path(folder_path)

    # Check whether the folder exists
    if not folder.exists():
        raise HTTPException(
            status_code=404,
            detail="Folder does not exist",
        )

    # Check whether the path is a folder
    if not folder.is_dir():
        raise HTTPException(
            status_code=400,
            detail="The provided path is not a folder",
        )

    # Scan the folder
    files = scan_folder(folder_path)

    # Find duplicate groups
    duplicate_groups = find_duplicates(files)

    # Calculate wasted storage
    wasted_storage = calculate_wasted_storage(
        duplicate_groups
    )

    return {
        "folder": folder_path,
        "files_scanned": len(files),
        "duplicate_groups": len(duplicate_groups),
        "wasted_storage": wasted_storage,
        "wasted_storage_readable": format_size(
            wasted_storage
        ),
        "duplicates": duplicate_groups,
    }


# --------------------------------------------------
# Scan History API
# --------------------------------------------------

@app.get("/history")
def scan_history():

    # Open database session
    db = SessionLocal()

    try:
        # Get all scans, newest first
        scans = (
            db.query(Scan)
            .order_by(Scan.created_at.desc())
            .all()
        )

        # Return scan history
        return {
            "total_scans": len(scans),
            "history": [
                {
                    "id": scan.id,
                    "folder": scan.folder_path,
                    "files_count": scan.files_count,
                    "created_at": scan.created_at,
                }
                for scan in scans
            ],
        }

    finally:
        # Always close the database session
        db.close()


# --------------------------------------------------
# Safe Duplicate Cleanup API
# --------------------------------------------------

@app.delete("/cleanup")
def cleanup_file(
    folder_path: str,
    file_path: str,
):

    # Convert paths to absolute Path objects
    folder = Path(folder_path).resolve()
    selected_file = Path(file_path).resolve()

    # Check whether the folder exists
    if not folder.exists():
        raise HTTPException(
            status_code=404,
            detail="Folder does not exist",
        )

    # Check whether the path is a folder
    if not folder.is_dir():
        raise HTTPException(
            status_code=400,
            detail="The provided path is not a folder",
        )

    # Check whether the selected file exists
    if not selected_file.exists():
        raise HTTPException(
            status_code=404,
            detail="Selected file does not exist",
        )

    # Check whether the selected path is a file
    if not selected_file.is_file():
        raise HTTPException(
            status_code=400,
            detail="Selected path is not a file",
        )

    # Make sure the selected file belongs
    # to the scanned folder
    try:
        selected_file.relative_to(folder)

    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Selected file is outside the scanned folder",
        )

    # Scan the folder again
    # This verifies that the file is still a duplicate
    files = scan_folder(str(folder))

    # Find duplicate groups
    duplicate_groups = find_duplicates(files)

    # Find the duplicate group containing
    # the selected file
    matching_group = None

    for group in duplicate_groups:

        for file_data in group["files"]:

            if (
                Path(file_data["path"]).resolve()
                == selected_file
            ):
                matching_group = group
                break

        if matching_group:
            break

    # Do not allow deletion of a non-duplicate file
    if matching_group is None:
        raise HTTPException(
            status_code=400,
            detail=(
                "Selected file is not part "
                "of a duplicate group"
            ),
        )

    # Never delete the only remaining copy
    if len(matching_group["files"]) <= 1:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete the only remaining copy",
        )

    # Store file size before deletion
    file_size = selected_file.stat().st_size

    # Create backup folder for Undo
    backup_folder = Path("cleanup_backup")
    backup_folder.mkdir(exist_ok=True)

    # Store information about the original file location
    backup_info_file = backup_folder / "backup_info.json"

    backup_info = []

    # Load existing backup information
    if backup_info_file.exists():
        try:
            import json

            with open(backup_info_file, "r", encoding="utf-8") as file:
                backup_info = json.load(file)
        except (json.JSONDecodeError, OSError):
            backup_info = []

    # Create a unique backup filename
    backup_file = backup_folder / selected_file.name

    counter = 1
    while backup_file.exists():
        backup_file = backup_folder / (
            f"{selected_file.stem}_{counter}{selected_file.suffix}"
        )
        counter += 1

    # Copy the file to the backup folder
    shutil.copy2(selected_file, backup_file)

    # Save original location information
    backup_info.append({
        "backup_file": str(backup_file.resolve()),
        "original_file": str(selected_file.resolve()),
    })

    # Save backup information
    import json

    with open(backup_info_file, "w", encoding="utf-8") as file:
        json.dump(backup_info, file, indent=4)

    # Delete ONLY the selected file
    selected_file.unlink()

    return {
        "message": "Duplicate file deleted successfully",
        "deleted_file": str(selected_file),
        "recovered_storage": file_size,
        "recovered_storage_readable": format_size(
            file_size
        ),
        "backup_file": str(backup_file),
    }

@app.post("/undo-cleanup")
def undo_cleanup():
    import json

    backup_folder = Path("cleanup_backup")
    backup_info_file = backup_folder / "backup_info.json"

    # Check whether backup information exists
    if not backup_info_file.exists():
        raise HTTPException(
            status_code=404,
            detail="No deleted files available to restore",
        )

    try:
        with open(backup_info_file, "r", encoding="utf-8") as file:
            backup_info = json.load(file)
    except (json.JSONDecodeError, OSError):
        raise HTTPException(
            status_code=500,
            detail="Could not read backup information",
        )

    if not backup_info:
        raise HTTPException(
            status_code=404,
            detail="No deleted files available to restore",
        )

    restored_files = []

    for item in backup_info:
        backup_file = Path(item["backup_file"])
        original_file = Path(item["original_file"])

        # Restore only if the backup still exists
        if backup_file.exists():

            # Create the original folder if necessary
            original_file.parent.mkdir(
                parents=True,
                exist_ok=True,
            )

            # Restore the file
            shutil.move(
                str(backup_file),
                str(original_file),
            )

            restored_files.append(
                str(original_file)
            )

    # Clear backup information after restoration
    with open(backup_info_file, "w", encoding="utf-8") as file:
        json.dump([], file, indent=4)

    return {
        "message": "Deleted files restored successfully",
        "restored_files": restored_files,
        "restored_count": len(restored_files),
    }
    