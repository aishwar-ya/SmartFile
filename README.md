# SMARTFIE

> Smart File Duplicate Detection and Storage Optimization System.

## 📖 About

SMARTFIE is a web-based file management system that scans folders, detects exact duplicate files, calculates wasted storage, and stores scan history for future reference.

The project is being developed step by step, with each stage tested before moving to the next.

## 🚦 Status

🟡 **In Development** — Stages 1–4 completed. Stage 5 is next.

## 🛠️ Tech Stack

- **Backend:** Python + FastAPI
- **Database:** SQLite + SQLAlchemy
- **Hashing:** SHA-256
- **Frontend:** React + Tailwind CSS *(planned)*
- **Editor:** VS Code
- **Version Control:** Git + GitHub

## 🗂️ Project Structure

```text
SMARTFIE/
├── README.md
└── backend/
    ├── main.py
    ├── scanner.py
    ├── hasher.py
    ├── duplicate_finder.py
    ├── database.py
    ├── models.py
    ├── create_database.py
    ├── save_scan.py
    ├── check_database.py
    ├── scan_history.py
    └── TestFiles/
```

## 📅 Progress

### Stage 1 — Project Setup ✅
- Created project structure and Python virtual environment
- Installed FastAPI and Uvicorn
- Created and tested the basic backend

### Stage 2 — File Scanner ✅
- Built a recursive file scanner
- Collects file name, path, size, and extension
- Added `/scan` API with validation and error handling

### Stage 3 — Duplicate Detection ✅
- Implemented SHA-256 hashing
- Detects and groups exact duplicate files
- Calculates potentially wasted storage
- Added `/duplicates` API

### Stage 4 — SQLite Database & Scan History ✅
- Added SQLite database using SQLAlchemy
- Created `Scan` and `File` database models
- Stores scanned files, metadata, and SHA-256 hashes
- Implemented scan history
- Added `/history` API
- Tested multiple scan records successfully

## 🔍 Current Functionality

SMARTFIE can currently:

- Scan folders and subfolders
- Collect file metadata
- Calculate SHA-256 hashes
- Detect exact duplicate files
- Calculate wasted storage
- Store scan and file information in SQLite
- Maintain scan history

## 📡 API Endpoints

| Method | Endpoint      | Description                   |
|--------|---------------|--------------------------------|
| GET    | `/`           | Health check / root endpoint  |
| GET    | `/scan`       | Scan a folder for files       |
| GET    | `/duplicates` | Detect duplicate files        |
| GET    | `/history`    | View scan history             |

Interactive API docs (Swagger UI):

```
http://127.0.0.1:8000/docs
```

## 🚀 Getting Started

```bash
git clone https://github.com/<your-username>/SMARTFIE.git
cd SMARTFIE/backend

# Create virtual environment
python -m venv venv

# Activate on Windows
venv\Scripts\activate

# Activate on macOS/Linux
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy

# Start the backend
uvicorn main:app --reload
```

## 📌 Roadmap

| Stage   | Description                   | Status |
|---------|--------------------------------|--------|
| Stage 1 | Project Setup                 | ✅     |
| Stage 2 | File Scanner                  | ✅     |
| Stage 3 | Duplicate Detection           | ✅     |
| Stage 4 | SQLite & Scan History         | ✅     |
| Stage 5 | React + Tailwind Dashboard    | 🔲     |
| Stage 6 | Safe Cleanup                  | 🔲     |
| Stage 7 | Advanced Features             | 🔲     |
| Stage 8 | Testing & Final Documentation | 🔲     |

## 🎓 What I've Learned

- Python and virtual environments
- FastAPI and API development
- Recursive file scanning
- SHA-256 hashing
- Duplicate detection
- SQLite and SQLAlchemy
- Database models and relationships
- Scan history management
- API testing with Swagger UI
- Git and GitHub workflow

## 📝 Development Notes

SMARTFIE is developed incrementally. Each stage is implemented, tested, and documented before moving to the next.

- **Completed:** Stages 1–4
- **Next:** Stage 5 — React + Tailwind Dashboard

## 📄 License

This project is currently unlicensed. Add a license (e.g., MIT) once you're ready to share it publicly.

---

*This README is updated as the project evolves — check back for progress on each new stage.*