from database import SessionLocal
from models import Scan, File


db = SessionLocal()

try:
    scans = db.query(Scan).all()

    print("Total scans:", len(scans))
    print()

    for scan in scans:
        print("Scan ID:", scan.id)
        print("Folder:", scan.folder_path)
        print("Files:", scan.files_count)
        print()

        for file in scan.files:
            print("-", file.name)
            print("  Size:", file.size, "bytes")
            print("  Hash:", file.file_hash)

finally:
    db.close()