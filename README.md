# SMARTFIE

> A project built step by step — documenting the journey from setup to a fully working Smart File Duplicate Detection and Storage Optimization System.

## 📖 About

SMARTFIE is a web-based file management project designed to detect duplicate files, identify wasted storage space, and eventually provide safe cleanup options.

The project is being developed incrementally, with each stage documented as it happens. This README tracks progress, technical decisions, and lessons learned along the way.

## 🚦 Status

🟡 **In Development** — Stages 1 and 2 completed. Duplicate detection is the next major feature.

## 🗂️ Project Structure

```text
SMARTFIE/
├── README.md
└── backend/
    ├── venv/
    ├── main.py
    ├── scanner.py
    ├── test_scanner.py
    └── TestFiles/
```

## 🛠️ Tech Stack

### Current

* **Language:** Python
* **Backend:** FastAPI
* **Server:** Uvicorn
* **Environment:** Python virtual environment (`venv`)
* **Editor:** VS Code
* **Version Control:** Git & GitHub

### Planned

* **Frontend:** React + Tailwind CSS
* **Database:** SQLite
* **Duplicate Detection:** SHA-256 hashing

## 📅 Progress Log

### Stage 1 — Project Setup ✅

* Created the SMARTFIE project folder
* Created the `backend` folder
* Created a Python virtual environment
* Activated the virtual environment
* Installed FastAPI
* Installed Uvicorn
* Created `main.py`
* Created the basic FastAPI application
* Tested the backend successfully
* Verified FastAPI API documentation

### Stage 2 — File Scanner ✅

* Created `scanner.py`
* Implemented folder scanning
* Added recursive subfolder scanning
* Retrieved file names
* Retrieved file paths
* Retrieved file sizes
* Retrieved file extensions
* Created test files and folders
* Created `test_scanner.py`
* Connected the scanner to FastAPI
* Created the `/scan` API endpoint
* Added folder validation
* Added error handling for invalid paths and inaccessible files
* Tested the file scanner successfully

## 🔍 Current Functionality

The backend can currently:

1. Receive a folder path.
2. Scan the selected folder and its subfolders.
3. Find files.
4. Collect basic file information.
5. Return the results through a FastAPI endpoint.

The scanner currently collects:

```text
File Name
File Path
File Size
File Extension
```

### Current API

```text
GET /
GET /scan
```

FastAPI documentation is available at:

```text
http://127.0.0.1:8000/docs
```

## 🚀 Getting Started

Clone the repository and set up the backend environment:

```bash
git clone https://github.com/<your-username>/SMARTFIE.git
cd SMARTFIE/backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn

# Start the FastAPI server
uvicorn main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

## ✅ Completed

* [x] Create project structure
* [x] Set up Python virtual environment
* [x] Install FastAPI and Uvicorn
* [x] Create FastAPI backend
* [x] Build Python file scanner
* [x] Scan folders recursively
* [x] Collect file metadata
* [x] Connect scanner to FastAPI
* [x] Test `/scan` API

## 📌 Roadmap

| Stage   | Description                                 | Status         |
| ------- | ------------------------------------------- | -------------- |
| Stage 1 | Project Setup                               | ✅ Done         |
| Stage 2 | Python File Scanner                         | ✅ Done         |
| Stage 3 | SHA-256 Duplicate Detection                 | 🔲 Next        |
| Stage 4 | SQLite Database & Scan History              | 🔲 Not Started |
| Stage 5 | React + Tailwind Dashboard                  | 🔲 Not Started |
| Stage 6 | Safe Cleanup & Storage Recovery             | 🔲 Not Started |
| Stage 7 | Advanced File Similarity Features           | 🔲 Not Started |
| Stage 8 | Testing, Documentation & Final Presentation | 🔲 Not Started |

## 🎯 Next Stage

### Stage 3 — Duplicate Detection

The next stage will introduce **SHA-256 hashing** to identify exact duplicate files.

Example:

```text
File A → SHA-256 → ABC123
File B → SHA-256 → ABC123
File C → SHA-256 → XYZ789
```

Files with the same hash will be grouped as duplicates.

The system will then calculate the amount of storage that could potentially be recovered by removing unnecessary copies.

## 🎓 What I've Learned So Far

* Python project setup
* Python virtual environments
* FastAPI basics
* Running a backend with Uvicorn
* Creating API endpoints
* Working with file paths
* Recursive folder scanning
* Reading file metadata
* Basic error handling
* Testing backend functionality using FastAPI Swagger UI
* Using VS Code for project development

## 📝 Development Notes

The project is being developed incrementally. Each stage is tested before moving to the next stage to make the development process easier to understand, debug, and document.

The first two stages were completed during the initial development phase.

---

*This README is updated as the project evolves — check back for progress on each new stage.*