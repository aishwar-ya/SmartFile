from pathlib import Path

# Import FastAPI to create the backend
# HTTPException is used to handle invalid requests
from fastapi import FastAPI, HTTPException

# Import our file scanner
from scanner import scan_folder

# Import duplicate detection functions
from duplicate_finder import find_duplicates, calculate_wasted_storage


# Create the FastAPI application
app = FastAPI()

# Convert bytes into a readable storage format
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

# Creates the home endpoint: GET /
@app.get("/")
def home():
    return {
        "message": "Smart File Backend is working!"
    }


# --------------------------------------------------
# File Scanning API
# --------------------------------------------------

# Creates the scan endpoint: GET /scan
@app.get("/scan")
def scan(folder_path: str):

    # Convert the folder path into a Path object
    folder = Path(folder_path)

    # Check whether the folder exists
    if not folder.exists():
        raise HTTPException(
            status_code=404,
            detail="Folder does not exist"
        )

    # Check whether the provided path is actually a folder
    if not folder.is_dir():
        raise HTTPException(
            status_code=400,
            detail="The provided path is not a folder"
        )

    # Scan the folder and collect file information
    files = scan_folder(folder_path)

    # Return the scanning results
    return {
        "folder": folder_path,
        "files_found": len(files),
        "files": files
    }


# --------------------------------------------------
# Duplicate Detection API
# --------------------------------------------------

# Creates the duplicate detection endpoint: GET /duplicates
@app.get("/duplicates")
def duplicates(folder_path: str):

    # Convert the folder path into a Path object
    folder = Path(folder_path)

    # Check whether the folder exists
    if not folder.exists():
        raise HTTPException(
            status_code=404,
            detail="Folder does not exist"
        )

    # Check whether the provided path is a folder
    if not folder.is_dir():
        raise HTTPException(
            status_code=400,
            detail="The provided path is not a folder"
        )

    # Scan the folder and collect file information
    # This also calculates SHA-256 hashes
    files = scan_folder(folder_path)

    # Group files that have the same SHA-256 hash
    duplicate_groups = find_duplicates(files)

    # Calculate the storage occupied by duplicate copies
    wasted_storage = calculate_wasted_storage(duplicate_groups)

    # Return the duplicate detection results
    return {
    "folder": folder_path,
    "files_scanned": len(files),
    "duplicate_groups": len(duplicate_groups),
    "wasted_storage": wasted_storage,
    "wasted_storage_readable": format_size(wasted_storage),
    "duplicates": duplicate_groups
}