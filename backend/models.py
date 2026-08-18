from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from database import Base


# --------------------------------------------------
# Scan Model
# --------------------------------------------------

class Scan(Base):
    __tablename__ = "scans"

    # Unique ID for each scan
    id = Column(Integer, primary_key=True, index=True)

    # Folder that was scanned
    folder_path = Column(String, nullable=False)

    # Number of files found during the scan
    files_count = Column(Integer, default=0)

    # Date and time of the scan
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship with scanned files
    files = relationship(
        "File",
        back_populates="scan",
        cascade="all, delete"
    )


# --------------------------------------------------
# File Model
# --------------------------------------------------

class File(Base):
    __tablename__ = "files"

    # Unique ID for each file record
    id = Column(Integer, primary_key=True, index=True)

    # ID of the scan this file belongs to
    scan_id = Column(
        Integer,
        ForeignKey("scans.id"),
        nullable=False
    )

    # File information
    name = Column(String, nullable=False)
    path = Column(String, nullable=False)
    size = Column(Integer, nullable=False)
    extension = Column(String)
    file_hash = Column(String, nullable=False)

    # Relationship back to the scan
    scan = relationship(
        "Scan",
        back_populates="files"
    )