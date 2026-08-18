from database import SessionLocal
from models import Scan, File
from scanner import scan_folder


def save_scan(folder_path):
    # Scan the selected folder
    files = scan_folder(folder_path)

    # Open database session
    db = SessionLocal()

    try:
        # Create scan record
        scan = Scan(
            folder_path=folder_path,
            files_count=len(files)
        )

        db.add(scan)
        db.commit()
        db.refresh(scan)

        # Save each file
        for file_data in files:
            file_record = File(
                scan_id=scan.id,
                name=file_data["name"],
                path=file_data["path"],
                size=file_data["size"],
                extension=file_data["extension"],
                file_hash=file_data["hash"]
            )

            db.add(file_record)

        db.commit()

        return scan

    finally:
        db.close()