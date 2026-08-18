from database import SessionLocal
from models import Scan, File
from scanner import scan_folder


# Folder to scan
folder_path = "TestFiles"


# Scan the folder
files = scan_folder(folder_path)


# Open a database session
db = SessionLocal()

try:
    # Create a new scan record
    scan = Scan(
        folder_path=folder_path,
        files_count=len(files)
    )

    db.add(scan)
    db.commit()
    db.refresh(scan)

    # Save each scanned file
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

    # Save all file records
    db.commit()

    print("Scan saved successfully!")
    print("Scan ID:", scan.id)
    print("Files saved:", len(files))

finally:
    # Close the database connection
    db.close()