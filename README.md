<div align="center">

# 🗃️ SMARTFIE

### Smart File Duplicate Detection & Storage Optimization System

*Find. Analyze. Clean. Recover.*

![Status](https://img.shields.io/badge/status-in%20development-yellow?style=for-the-badge)
![Python](https://img.shields.io/badge/backend-Python%20%2B%20FastAPI-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![SQLite](https://img.shields.io/badge/database-SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![License](https://img.shields.io/badge/license-unlicensed-lightgrey?style=for-the-badge)

</div>

---

## 📖 About

**SMARTFIE** is a full-stack, web-based file management and storage optimization system. It scans folders, detects **exact duplicate files** using SHA-256 hashing, calculates wasted storage, and gives users full control over cleanup — with built-in backup and undo support.

Whether files have different names or live in different folders, SMARTFIE identifies them as duplicates the moment their content matches.

> Built incrementally — every feature is planned, implemented, tested, and documented before moving to the next stage.

---

## 📑 Table of Contents

- [Status](#-status)
- [Tech Stack](#️-tech-stack)
- [Features](#-features)
- [Project Structure](#️-project-structure)
- [Development Progress](#-development-progress)
- [How It Works](#-how-it-works)
- [API Endpoints](#-api-endpoints)
- [Getting Started](#-getting-started)
- [Testing](#-testing)
- [What I've Learned](#-what-ive-learned)
- [Current Status](#-current-development-status)
- [License](#-license)

---

## 🚦 Status

🟡 **In Development**

The core backend, database, duplicate detection, React dashboard, file classification, cleanup, recovery, dark mode, and documentation features have all been implemented. Additional testing and final documentation are in progress.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| 🐍 Backend | Python + FastAPI |
| 🗄️ Database | SQLite + SQLAlchemy |
| 🔐 Hashing | SHA-256 |
| ⚛️ Frontend | React + CSS |
| 🔗 API Communication | Axios |
| 💻 Dev Environment | VS Code |
| 🔧 Version Control | Git + GitHub |

---

## ✨ Features

| | | |
|---|---|---|
| 📁 Folder scanning | 📄 Recursive file scanning | 🔍 Exact duplicate detection |
| 🔐 SHA-256 hashing | 💾 Wasted storage calculation | 📊 Storage statistics dashboard |
| 🗂️ Duplicate file grouping | 🗃️ File type classification | 🖼️ Duplicate image detection |
| ☑️ Individual file selection | ☑️ Select All / Deselect All | 🗑️ Cleanup selected duplicates |
| ↩️ Undo cleanup | 💚 Storage recovery tracking | 🕒 Scan history |
| 🗄️ SQLite storage | 🌙 Dark mode | 📱 Responsive dashboard |

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
│   ├── test_duplicates.py
│   ├── test_hasher.py
│   ├── test_scanner.py
│   └── TestFiles/
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.jsx
    │   │   └── Dashboard.css
    │   ├── api/
    │   │   └── api.js
    │   └── assets/
    │
    ├── public/
    └── package.json
```

---

## 📅 Development Progress

<details open>
<summary><b>Stage 1 — Project Setup ✅</b></summary>

- Created project structure
- Created Python virtual environment
- Installed FastAPI and Uvicorn
- Created and tested the basic backend
</details>

<details>
<summary><b>Stage 2 — File Scanner ✅</b></summary>

- Built a recursive file scanner
- Scans folders and subfolders
- Collects file name, path, size, and extension
- Added file type classification
- Added folder validation and error handling
- Added `/scan` API functionality
</details>

<details>
<summary><b>Stage 3 — Duplicate Detection ✅</b></summary>

- Implemented SHA-256 hashing
- Detects exact duplicate files
- Groups duplicate files together
- Calculates potentially wasted storage
- Added `/duplicates` API functionality
- Added duplicate image detection during normal scanning
</details>

<details>
<summary><b>Stage 4 — SQLite Database & Scan History ✅</b></summary>

- Added SQLite database using SQLAlchemy
- Created Scan and File database models
- Stores scanned file metadata and SHA-256 hashes
- Maintains scan history
- Added `/history` API
- Tested multiple scan records successfully
</details>

<details>
<summary><b>Stage 5 — React Dashboard ✅</b></summary>

- Built the SMARTFIE frontend dashboard
- Added sidebar navigation, Dashboard and History pages
- Connected frontend with backend APIs
- Storage overview: Files Scanned, Duplicate Groups, Wasted Storage, Storage Recovered
- Storage statistics + usage progress bars
- File type classification & duplicate group display
- Displays scanned folder path
- Responsive layout + dark mode
</details>

<details>
<summary><b>Stage 6 — Duplicate File Cleanup & Recovery ✅</b></summary>

- Displays duplicate files in groups (name, path, size)
- Individual file selection + Select All / Deselect All
- Clean Selected action with status messages
- Storage recovery tracking
- Backup before cleanup + Undo Cleanup functionality
- Cleanup-related history support
</details>

<details>
<summary><b>Stage 7 — Advanced Features 🟡</b></summary>

**Completed**
- Improved cleanup safety
- File type grouping and filtering
- Duplicate image detection
- Cleanup Undo functionality
- Dark mode

**Remaining**
- [ ] Scan progress indicator
- [ ] Further error handling improvements
- [ ] Search and filtering
- [ ] Export scan reports
</details>

<details>
<summary><b>Stage 8 — Testing & Final Documentation 🔲</b></summary>

- [ ] Complete frontend testing
- [ ] Complete backend testing
- [ ] Test cleanup functionality thoroughly
- [ ] Improve error handling
- [ ] Finalize project documentation
- [ ] Prepare screenshots and project report
- [ ] Prepare final project demonstration
</details>

---

## 🔍 How It Works

### 📊 Dashboard
The SMARTFIE dashboard provides an overview of the latest scan, displaying total files scanned, duplicate groups, wasted storage, storage recovered, waste analysis, file type categories, duplicate file groups, and the scanned folder path.

### 📁 Folder Scanning
Users provide a folder path, and SMARTFIE recursively scans that folder and its subfolders. For each file it collects the name, path, size, extension, type, and SHA-256 hash — then displays the results on the dashboard.

### 🔐 Duplicate Detection
Each file's content is hashed using SHA-256. Files that produce the same hash are grouped as duplicates — regardless of file name or location.

```text
photo1.png
photo1_copy.png
```
If both files contain exactly the same data, they produce the same hash and are flagged as duplicates.

### 🗃️ File Classification
Scanned files are automatically classified by extension into:

`Images` · `Documents` · `Videos` · `Audio` · `Other`

### 🗑️ Duplicate File Management
Duplicate groups show file name, path, and size. Users can select individual files, select/deselect all, and clean selected files — **nothing is removed automatically**, keeping cleanup fully user-controlled.

### ↩️ Cleanup and Recovery
Before removing a file, SMARTFIE creates a backup copy, then removes the original and tracks recovered storage. The **Undo Cleanup** feature restores files from backup at any time.

### 🕒 History
Scan and cleanup activity is stored in the SQLite database, letting users review past operations at any time.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check / root endpoint |
| `GET` | `/scan` | Scan a folder for files |
| `GET` | `/duplicates` | Detect duplicate files |
| `GET` | `/history` | View scan history |
| `DELETE` | `/cleanup` | Remove a selected duplicate file |
| `POST` | `/undo-cleanup` | Restore files removed during cleanup |

**Interactive API Docs:** once the backend is running, Swagger UI is available at [`http://127.0.0.1:8000/docs`](http://127.0.0.1:8000/docs)

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/aishwar-ya/SmartFile.git
cd SmartFile
```

### 🐍 Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy

# Start the backend
uvicorn main:app --reload
```

- Backend runs at: `http://127.0.0.1:8000`
- Swagger docs at: `http://127.0.0.1:8000/docs`

### ⚛️ Frontend Setup

Open a **new terminal**:

```bash
cd SmartFile/frontend
npm install
npm run dev
```

Then open the local URL shown in your terminal. 🎉

---

## 🧪 Testing

The backend includes dedicated test files for core components:

```text
backend/
├── test_duplicates.py
├── test_hasher.py
└── test_scanner.py
```

A dedicated test folder supports duplicate detection and classification testing:

```text
TestFiles/
├── Images/
├── Documents/
├── Videos/
├── Audio/
└── Other/
```

---

## 🎓 What I've Learned

<table>
<tr>
<td valign="top" width="33%">

**Backend**
- Python programming
- Virtual environments
- FastAPI & REST API design
- Recursive file scanning
- SHA-256 hashing
- Duplicate detection logic

</td>
<td valign="top" width="33%">

**Database**
- SQLite
- SQLAlchemy
- Database models & relationships
- Scan history management

</td>
<td valign="top" width="33%">

**Frontend & Workflow**
- React & state management
- Dashboard development
- File selection interfaces
- Cleanup & recovery flows
- Git & GitHub workflow
- Full-stack development

</td>
</tr>
</table>

---

## 📌 Current Development Status

**✅ Completed**

Backend setup · Recursive scanning · SHA-256 hashing · Duplicate detection · Wasted storage calculation · SQLite integration · Scan history · React dashboard · Storage statistics · File classification · Duplicate image detection · Duplicate file interface · File selection · Select All / Deselect All · Cleanup interface · Cleanup backup · Undo cleanup · Storage recovery tracking · History interface · Dark mode · Responsive dashboard

**🔜 Next**

- [ ] Scan progress indicator
- [ ] Additional error handling
- [ ] Search and filtering
- [ ] Export scan reports
- [ ] Additional testing
- [ ] Final documentation
- [ ] Project report
- [ ] Final presentation & demonstration

---

## 📝 Development Notes

SMARTFIE is developed incrementally. Each major feature is **planned → implemented → tested → improved → documented**, keeping the project organized from start to finish.

---

## 📄 License

This project is currently **unlicensed**. A license such as MIT may be added before public release.