# SMARTFIE

> Smart File Duplicate Detection and Storage Optimization System.

## 📖 About

SMARTFIE is a web-based file management system that scans folders, detects exact duplicate files, calculates wasted storage, and stores scan history.

The project is developed step by step, with each stage tested before moving to the next.

## 🚦 Status

🟡 **In Development** — Stages 1–5 completed. Stage 6 is next.

## 🛠️ Tech Stack

- **Backend:** Python + FastAPI
- **Frontend:** React + Vite
- **Styling:** Tailwind CSS
- **Database:** SQLite + SQLAlchemy
- **Hashing:** SHA-256
- **API Communication:** Axios
- **Development:** VS Code
- **Version Control:** Git + GitHub

## 🗂️ Project Structure

```text
SMARTFIE/
├── README.md
├── backend/
│   ├── main.py
│   ├── scanner.py
│   ├── hasher.py
│   ├── duplicate_finder.py
│   ├── database.py
│   ├── models.py
│   ├── save_scan.py
│   ├── scan_history.py
│   ├── smartfile.db
│   └── TestFiles/
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── api.js
    │   ├── components/
    │   │   ├── Dashboard.jsx
    │   │   └── Dashboard.css
    │   ├── App.jsx
    │   └── main.jsx
    ├── public/
    ├── package.json
    └── vite.config.js
```

## 📅 Progress

### Stage 1 — Project Setup ✅
- Created project structure.
- Created Python virtual environment.
- Installed FastAPI and Uvicorn.
- Created and tested the basic backend.

### Stage 2 — File Scanner ✅
- Built a recursive file scanner.
- Collects file name, path, size, and extension.
- Added `/scan` API.
- Added folder validation and error handling.

### Stage 3 — Duplicate Detection ✅
- Implemented SHA-256 hashing.
- Detects and groups exact duplicate files.
- Calculates potentially wasted storage.
- Added `/duplicates` API.

### Stage 4 — SQLite Database & Scan History ✅
- Added SQLite using SQLAlchemy.
- Created Scan and File database models.
- Stores scanned files, metadata, and SHA-256 hashes.
- Implemented scan history.
- Added `/history` API.

### Stage 5 — React Dashboard & Integration ✅
- Created React frontend using Vite.
- Built the SMARTFIE dashboard.
- Added responsive dashboard styling.
- Connected React with FastAPI using Axios.
- Displayed real scanned file data.
- Displayed duplicate detection results.
- Displayed wasted storage.
- Integrated SQLite scan history.
- Added Scan Folder functionality.
- Added scanning/loading feedback.
- Added invalid folder and file-path validation.
- Added user-friendly error messages.
- Configured CORS for frontend-backend communication.
- Tested the complete frontend and backend workflow.

**Result:** SMARTFIE now has a functional React dashboard connected to the FastAPI backend and SQLite database.

## 🔍 Current Functionality

SMARTFIE can currently:

- Scan folders and subfolders.
- Collect file metadata.
- Calculate SHA-256 hashes.
- Detect exact duplicate files.
- Calculate wasted storage.
- Store scan information in SQLite.
- Maintain scan history.
- Display real scan results on the dashboard.
- Allow users to enter a folder path and start a scan.
- Handle invalid folder paths safely.

## 🔗 Backend API

The frontend communicates with these FastAPI endpoints:

- `GET /`
- `GET /scan`
- `GET /duplicates`
- `GET /history`

FastAPI documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

## 🚀 Getting Started

### 1. Start the Backend

Open a terminal:

```bash
cd backend
```

Activate the virtual environment:

```bash
venv\Scripts\activate
```

Start FastAPI:

```bash
uvicorn main:app --reload
```

Backend: [http://127.0.0.1:8000](http://127.0.0.1:8000)

### 2. Start the Frontend

Open a second terminal:

```bash
cd frontend
```

Install dependencies if required:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

Open the URL shown by Vite, for example: [http://localhost:5173](http://localhost:5173)

## 📊 Example Test Data

The current `TestFiles` folder contains sample files used for testing.

Example:

```text
TestFiles/
├── copy.txt
├── original.txt
├── notes.txt
├── document.pdf
├── photo.jpg
└── another.pdf
```

Example scan result:

```text
Files scanned:       6
Duplicate groups:    2
Wasted storage:      53 bytes
```

## 📌 Roadmap

| Stage | Description | Status |
|---|---|---|
| Stage 1 | Project Setup | ✅ |
| Stage 2 | File Scanner | ✅ |
| Stage 3 | Duplicate Detection | ✅ |
| Stage 4 | SQLite & Scan History | ✅ |
| Stage 5 | React Dashboard & Integration | ✅ |
| Stage 6 | Safe Cleanup & Storage Recovery | 🔲 |
| Stage 7 | Advanced Features | 🔲 |
| Stage 8 | Testing & Final Documentation | 🔲 |

## 🎓 What I've Learned

- Python and virtual environments
- FastAPI and API development
- Recursive file scanning
- SHA-256 hashing
- Duplicate detection
- SQLite and SQLAlchemy
- Database models and relationships
- Scan history management
- React and Vite
- Axios API communication
- Frontend-backend integration
- CORS configuration
- Error handling and validation
- API testing with Swagger UI
- Git and GitHub workflow

## 📝 Development Notes

SMARTFIE is developed incrementally. Each stage is implemented, tested, and documented before moving to the next stage.

**Completed**
- Stage 1 — Project Setup
- Stage 2 — File Scanner
- Stage 3 — Duplicate Detection
- Stage 4 — SQLite Database & Scan History
- Stage 5 — React Dashboard & Frontend Integration

**Next**
- Stage 6 — Safe Cleanup & Storage Recovery