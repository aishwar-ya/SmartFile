# SMARTFIE

> Smart File Duplicate Detection and Storage Optimization System.

## 📖 About

SMARTFIE is a web-based file management system that scans folders, detects exact duplicate files, calculates wasted storage, stores scan history, and allows users to safely clean selected duplicate files.

The project is developed step by step, with each feature tested before moving to the next stage.

---

## 🚦 Status

🟡 **In Development** — Core functionality and dashboard features completed.

---

## 🛠️ Tech Stack

- **Backend:** Python + FastAPI
- **Frontend:** React + Vite
- **Styling:** CSS
- **Database:** SQLite + SQLAlchemy
- **Hashing:** SHA-256
- **API Communication:** Axios
- **Development:** VS Code
- **Version Control:** Git + GitHub

---

## 🗂️ Project Structure

```text
SMARTFIE/
├── README.md
├── backend/
│   ├── TestFiles/
│   ├── main.py
│   ├── scanner.py
│   ├── hasher.py
│   ├── duplicate_finder.py
│   ├── database.py
│   ├── models.py
│   ├── save_scan.py
│   ├── scan_history.py
│   ├── create_database.py
│   ├── check_database.py
│   ├── test_hasher.py
│   ├── test_scanner.py
│   ├── test_duplicates.py
│   └── smartfile.db
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
    │
    ├── public/
    ├── package.json
    └── vite.config.js
```

---

## 📅 Progress

### Stage 1 — Project Setup ✅
- Created the project structure.
- Created a Python virtual environment.
- Installed FastAPI and Uvicorn.
- Created and tested the basic backend.

### Stage 2 — File Scanner ✅
- Built a recursive file scanner.
- Scans folders and subfolders.
- Collects file name, path, size, and extension.
- Added the `/scan` API.
- Added folder validation and error handling.

### Stage 3 — Duplicate Detection ✅
- Implemented SHA-256 file hashing.
- Detects exact duplicate files.
- Groups files with identical content.
- Calculates potentially wasted storage.
- Added the `/duplicates` API.

### Stage 4 — SQLite Database & Scan History ✅
- Added SQLite using SQLAlchemy.
- Created database models.
- Stores scan information.
- Stores scanned file metadata.
- Stores SHA-256 hashes.
- Implemented scan history.
- Added the `/history` API.

### Stage 5 — React Dashboard & Integration ✅
- Created the React frontend using Vite.
- Built the SMARTFIE dashboard.
- Connected React with FastAPI using Axios.
- Displayed real scanned file data.
- Displayed duplicate detection results.
- Displayed wasted storage.
- Integrated SQLite scan history.
- Added Scan Folder functionality.
- Added invalid folder and file-path validation.
- Added user-friendly error messages.
- Configured CORS for frontend-backend communication.
- Tested the complete frontend and backend workflow.

**Result:** SMARTFIE now has a functional React dashboard connected to the FastAPI backend and SQLite database.

### Stage 6 — Safe Cleanup & Storage Recovery ✅
- Added duplicate file selection using checkboxes.
- Users can select specific duplicate files for cleanup.
- Added cleanup confirmation before deletion.
- Added protection against deleting all copies of a duplicate file.
- At least one copy of every duplicate group must remain.
- Selected files are removed individually.
- Duplicate data automatically refreshes after cleanup.
- Scan results refresh after cleanup.
- Scan history refreshes after cleanup.
- Added storage recovery tracking.
- Displays storage recovered from the latest cleanup.

**Result:** SMARTFIE can safely remove selected duplicate files while protecting at least one copy of each file.

### Stage 7 — Dashboard Improvements & User Experience ✅

**Dashboard Improvements**
- Improved dashboard layout and styling.
- Improved dashboard panels and spacing.
- Added improved empty states.
- Added button hover and click effects.
- Added responsive dashboard improvements.
- Added accessibility focus states.

**Scan Experience**
- Fixed folder path input lag.
- Added a separate scan loading state.
- Continue button changes to `Scanning...`.
- Dashboard remains visible while scanning.
- Dashboard automatically refreshes after a successful scan.
- Scan popup closes automatically after completion.

**Recent Scans**
- Displays the latest 5 scan records by default.
- Added View All Scans functionality.
- Users can expand the section to see all scan records.
- Added Show Less functionality to return to the latest 5 records.
- All scan history remains stored in the database.

**Result:** The dashboard now provides a cleaner and more user-friendly experience.

---

## 🔍 Current Functionality

SMARTFIE can currently:

- Scan folders and subfolders.
- Collect file metadata.
- Calculate SHA-256 hashes.
- Detect exact duplicate files.
- Group identical files.
- Calculate wasted storage.
- Store scan information in SQLite.
- Maintain scan history.
- Display storage statistics.
- Display duplicate file groups.
- Allow users to select duplicate files.
- Safely delete selected duplicate files.
- Protect at least one copy of every duplicate group.
- Track storage recovered after cleanup.
- Display the latest 5 scans.
- Allow users to view all scan history.
- Allow users to collapse scan history.
- Allow users to enter a folder path and start a new scan.
- Display scan loading feedback.
- Handle invalid folder paths safely.
- Refresh dashboard data after scanning and cleanup.

---

## 🔗 Backend API

The frontend communicates with the FastAPI backend.

Current API functionality includes:

- `GET /`
- `GET /scan`
- `GET /duplicates`
- `GET /history`
- Cleanup endpoint for deleting selected duplicate files safely

FastAPI documentation is available at:

[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
```

Move into the project folder:

```bash
cd SmartFie
```

### 2. Start the Backend

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

The backend should run at:

[http://127.0.0.1:8000](http://127.0.0.1:8000)

### 3. Start the Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

Open the URL shown by Vite in your browser.

---

## 🔄 How SMARTFIE Works

```text
User enters a folder path
        ↓
SMARTFIE scans the folder
        ↓
File metadata is collected
        ↓
SHA-256 hashes are generated
        ↓
Identical files are grouped
        ↓
Duplicate groups are displayed
        ↓
User selects unnecessary duplicates
        ↓
Safety validation checks each group
        ↓
At least one copy is preserved
        ↓
Selected files are deleted
        ↓
Storage recovery is calculated
        ↓
Dashboard automatically refreshes
```

---

## 📊 Example Test Data

The `TestFiles` folder contains sample files used for testing.

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

---

## 📌 Roadmap

| Stage | Description | Status |
|---|---|---|
| Stage 1 | Project Setup | ✅ |
| Stage 2 | File Scanner | ✅ |
| Stage 3 | Duplicate Detection | ✅ |
| Stage 4 | SQLite & Scan History | ✅ |
| Stage 5 | React Dashboard & Integration | ✅ |
| Stage 6 | Safe Cleanup & Storage Recovery | ✅ |
| Stage 7 | Dashboard Improvements & User Experience | ✅ |
| Stage 8 | Testing & Final Documentation | 🔲 |

---

## 🧪 Testing

The project currently includes backend test files for core functionality:

- File hashing
- File scanning
- Duplicate detection

Example test files:

- `test_hasher.py`
- `test_scanner.py`
- `test_duplicates.py`

Manual testing has also been performed for:

- Folder scanning
- Invalid folder paths
- Duplicate detection
- Duplicate file selection
- Safe cleanup
- Storage recovery
- Scan loading state
- Dashboard refresh
- Recent scan history
- View All Scans / Show Less

---

## 🎓 What I've Learned

Through this project, I have learned:

- Python and virtual environments
- FastAPI and API development
- Recursive file scanning
- SHA-256 hashing
- Duplicate file detection
- SQLite and SQLAlchemy
- Database models and relationships
- Scan history management
- React and Vite
- Axios API communication
- Frontend-backend integration
- CORS configuration
- Error handling and validation
- Loading states in React
- State management using React hooks
- Safe file deletion logic
- Dashboard UI design
- API testing with Swagger UI
- Git and GitHub workflow

---

## 📝 Development Notes

SMARTFIE is developed incrementally. Each feature is implemented, tested, and backed up using Git before moving to the next improvement.

**Completed**
- Stage 1 — Project Setup
- Stage 2 — File Scanner
- Stage 3 — Duplicate Detection
- Stage 4 — SQLite Database & Scan History
- Stage 5 — React Dashboard & Integration
- Stage 6 — Safe Cleanup & Storage Recovery
- Stage 7 — Dashboard Improvements & User Experience

**Next**
- Stage 8 — Testing & Final Documentation