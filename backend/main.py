from fastapi import FastAPI, HTTPException  # Fixed: Imported HTTPException here
from scanner import scan_folder
from pathlib import Path

app = FastAPI()     # creates our backend application.


@app.get("/")       # creates the home API.
def home():
    return {
        "message": "Smart File Backend is working!"
    }               # sends a response when someone visits the backend.

@app.get("/scan")               # creates a new API endpoint called /scan.
def scan(folder_path: str):

    folder = Path(folder_path)

    if not folder.exists():
        raise HTTPException(
            status_code=404,
            detail="Folder does not exist"
        )

    if not folder.is_dir():
        raise HTTPException(
            status_code=400,
            detail="The provided path is not a folder"
        )

    files = scan_folder(folder_path)

    return {
        "folder": folder_path,
        "files_found": len(files),
        "files": files
    }
