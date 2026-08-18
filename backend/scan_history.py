from database import SessionLocal
from models import Scan


# Open database session
db = SessionLocal()

try:
    # Get all previous scans
    scans = db.query(Scan).order_by(Scan.created_at.desc()).all()

    print("Scan History")
    print("=" * 50)

    for scan in scans:
        print("Scan ID:", scan.id)
        print("Folder:", scan.folder_path)
        print("Files:", scan.files_count)
        print("Date:", scan.created_at)
        print("-" * 50)

finally:
    # Close database connection
    db.close()