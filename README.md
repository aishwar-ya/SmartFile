# SMARTFIE

> Smart File Duplicate Detection and Storage Optimization System.

## 📖 About

SMARTFIE is a web-based file management and storage optimization system that scans folders, detects exact duplicate files, calculates wasted storage, allows users to select duplicate files for cleanup, and maintains scan history for future reference.

The project is developed incrementally, with each feature implemented and tested before moving to the next stage.

---

## 🚦 Status

🟡 **In Development** — Core backend and frontend dashboard features completed. Advanced features and final testing are next.

---

## 🛠️ Tech Stack

- **Backend:** Python + FastAPI
- **Database:** SQLite + SQLAlchemy
- **Hashing:** SHA-256
- **Frontend:** React + CSS
- **Editor:** VS Code
- **Version Control:** Git + GitHub

---

## ✨ Features

SMARTFIE currently provides:

- 📁 Folder scanning
- 📄 Recursive file scanning
- 🔍 Exact duplicate file detection
- 🔐 SHA-256 file hashing
- 💾 Wasted storage calculation
- 📊 Storage statistics dashboard
- 🗂️ Duplicate file grouping
- ☑️ Individual file selection
- ☑️ Select All / Deselect All functionality
- 🗑️ Cleanup selected duplicate files
- 💚 Storage recovery tracking
- 🕒 Scan and cleanup history
- 🗄️ SQLite database storage
- 📱 Responsive dashboard interface

---

## 🗂️ Project Structure

```text
SMARTFIE/
│
├── README.md
│
├── backend/
│   ├── main.py
│   ├── scanner.py
│   ├── hasher.py
│   ├── duplicate_finder.py
│   ├── database.py
│   ├── models.py
│   ├── create_database.py
│   ├── save_scan.py
│   ├── check_database.py
│   ├── scan_history.py
│   └── TestFiles/
│
└── frontend/
    ├── src/
    ├── public/
    └── package.json
```

---

## 📅 Development Progress

### Stage 1 — Project Setup ✅
- Created project structure
- Created Python virtual environment
- Installed FastAPI and Uvicorn
- Created and tested the basic backend

### Stage 2 — File Scanner ✅
- Built a recursive file scanner
- Scans folders and subfolders
- Collects file name, path, size, and extension
- Added folder validation and error handling
- Added `/scan` API functionality

### Stage 3 — Duplicate Detection ✅
- Implemented SHA-256 hashing
- Detects exact duplicate files
- Groups duplicate files together
- Calculates potentially wasted storage
- Added `/duplicates` API functionality

### Stage 4 — SQLite Database & Scan History ✅
- Added SQLite database using SQLAlchemy
- Created Scan and File database models
- Stores scanned file metadata
- Stores SHA-256 hashes
- Maintains scan history
- Added `/history` API
- Tested multiple scan records successfully

### Stage 5 — React Dashboard ✅
- Built the SMARTFIE frontend dashboard
- Added sidebar navigation
- Added Dashboard and History pages
- Connected frontend with backend APIs
- Added storage overview statistics
- Displays:
  - Files Scanned
  - Duplicate Groups
  - Wasted Storage
  - Storage Recovered
- Added Storage Statistics section
- Added storage usage progress bars
- Displays duplicate file groups

### Stage 6 — Duplicate File Cleanup Interface ✅
- Displays duplicate files in groups
- Shows file name, path, and size
- Added individual file selection
- Added Select All / Deselect All
- Added Clean Selected action
- Added cleanup status messages
- Tracks storage recovery
- Added cleanup-related history support

### Stage 7 — Advanced Features 🔲

Planned improvements include:
- Improved cleanup safety
- File type filtering
- Scan progress indicator
- Better error handling
- Search and filtering
- Dark mode
- Export scan reports

### Stage 8 — Testing & Final Documentation 🔲
- Complete frontend testing
- Complete backend testing
- Test cleanup functionality thoroughly
- Improve error handling
- Finalize project documentation
- Prepare screenshots and project report
- Prepare final project demonstration

---

## 📊 Dashboard

The SMARTFIE dashboard provides an overview of the latest scan.

It displays:
- Total files scanned
- Number of duplicate groups
- Wasted storage
- Storage recovered
- Storage waste analysis
- Duplicate file groups

Users can quickly identify duplicate files and select files for cleanup.

---

## 🗑️ Duplicate File Management

Duplicate files are displayed in groups.

For each file, the system shows:
- File name
- File path
- File size

Users can:
- Select individual files
- Select all duplicate files
- Deselect all files
- Clean selected files

This makes duplicate file cleanup easier and more controlled.

---

## 🕒 History

The History section stores information about previous scans and cleanup activities.

It helps users review previous operations and track file management activity.

---

## 📡 API Endpoints

| Method | Endpoint      | Description                  |
|--------|---------------|-------------------------------|
| GET    | `/`           | Health check / root endpoint |
| GET    | `/scan`       | Scan a folder for files      |
| GET    | `/duplicates` | Detect duplicate files       |
| GET    | `/history`    | View scan history            |

### Interactive API Documentation

Swagger UI is available at:

```
http://127.0.0.1:8000/docs
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/SMARTFIE.git
```

### 2. Open the Backend Folder
```bash
cd SMARTFIE/backend
```

### 3. Create a Virtual Environment
```bash
python -m venv venv
```

### 4. Activate the Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### 5. Install Backend Dependencies
```bash
pip install fastapi uvicorn sqlalchemy
```

### 6. Start the Backend
```bash
uvicorn main:app --reload
```

The backend will run locally on:
```
http://127.0.0.1:8000
```

---

## 🎨 Running the Frontend

Open the frontend folder:
```bash
cd SMARTFIE/frontend
```

Install dependencies:
```bash
npm install
```

Start the frontend:
```bash
npm run dev
```

Open the local URL shown in the terminal.

---

## 🎓 What I've Learned

Through this project, I have gained practical experience with:
- Python programming
- Virtual environments
- FastAPI
- REST API development
- Recursive file scanning
- SHA-256 hashing
- Duplicate file detection
- SQLite
- SQLAlchemy
- Database models and relationships
- Scan history management
- React
- Frontend dashboard development
- State management
- File selection interfaces
- Git and GitHub workflow
- Full-stack application development

---

## 📌 Current Development Status

**Completed**
- Backend project setup
- File scanning
- Duplicate detection
- SHA-256 hashing
- Wasted storage calculation
- SQLite database integration
- Scan history
- React dashboard
- Storage statistics
- Duplicate files interface
- File selection
- Select All functionality
- Cleanup interface
- History interface

**Next**
- Advanced features
- Additional testing
- Improved cleanup safety
- Final documentation
- Project report and presentation

---

## 📝 Development Notes

SMARTFIE is developed incrementally.

Each major feature is:
1. Planned
2. Implemented
3. Tested
4. Improved
5. Documented

This approach helps maintain a clear and organized development process throughout the project.

---

## 📄 License

This project is currently unlicensed.

A license such as MIT may be added before public release.

---

**SMARTFIE — Scan • Find • Clean**

This README will continue to be updated as the project evolves.