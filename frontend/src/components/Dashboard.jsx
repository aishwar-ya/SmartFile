import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import smartfieLogo from "../assets/smartfie-logo.png";

import {
  scanFolder,
  findDuplicates,
  getScanHistory,
  cleanupFile,
} from "../api/api";

/* =========================================================
   Navigation
========================================================= */

const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: GridIcon,
  },
  {
    key: "history",
    label: "History",
    icon: HistoryIcon,
  },
];

/* =========================================================
   Dashboard
========================================================= */

export default function Dashboard() {
  /* ===================== State ===================== */

  const [scanData, setScanData] = useState(null);
  const [duplicateData, setDuplicateData] = useState(null);
  const [historyData, setHistoryData] = useState(null);

  const [activePage, setActivePage] = useState("dashboard");
  const [showAllScans, setShowAllScans] = useState(false);

  const [loading, setLoading] = useState(true);
  const [scanLoading, setScanLoading] = useState(false);
  const [cleanupLoading, setCleanupLoading] = useState(false);

  const [error, setError] = useState("");
  const [cleanupMessage, setCleanupMessage] = useState("");

  const [recoveredStorage, setRecoveredStorage] = useState(0);

  const [folderPath, setFolderPath] = useState("");
  const [inputFolderPath, setInputFolderPath] = useState("");

  const [showScanInput, setShowScanInput] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState([]);

  /* ===================== Initial History Load ===================== */

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError("");

        const history = await getScanHistory();
        setHistoryData(history);
      } catch (err) {
        console.error("Initial load error:", err);

        setError(
          err.response?.data?.detail ||
            err.message ||
            "Could not load scan history."
        );
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  /* ===================== Values ===================== */

  const totalFiles = scanData?.files_found || 0;

  const duplicateGroups =
    duplicateData?.duplicate_groups || 0;

  const wastedStorage =
    duplicateData?.wasted_storage || 0;

  const duplicateFiles =
    duplicateData?.duplicates || [];

  const allScans =
    historyData?.history || [];

  const recentScans = showAllScans
    ? allScans
    : allScans.slice(0, 5);

  const allDuplicatePaths = duplicateFiles.flatMap(
    (group) =>
      group.files?.map((file) => file.path) || []
  );

  /* ===================== Helpers ===================== */

  const formatSize = (bytes) => {
    const value = Number(bytes) || 0;

    if (value < 1024) {
      return `${value} bytes`;
    }

    if (value < 1024 * 1024) {
      return `${(value / 1024).toFixed(1)} KB`;
    }

    if (value < 1024 * 1024 * 1024) {
      return `${(
        value / (1024 * 1024)
      ).toFixed(1)} MB`;
    }

    return `${(
      value / (1024 * 1024 * 1024)
    ).toFixed(1)} GB`;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "-";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleString();
  };

  const wastedDisplay =
    formatSize(wastedStorage);

  const recoveredDisplay =
    formatSize(recoveredStorage);

  /* ===================== File Selection ===================== */

  const toggleFileSelection = (filePath) => {
    setSelectedFiles((previous) => {
      if (previous.includes(filePath)) {
        return previous.filter(
          (path) => path !== filePath
        );
      }

      return [
        ...previous,
        filePath,
      ];
    });
  };

  const handleSelectAll = () => {
    if (
      allDuplicatePaths.length > 0 &&
      selectedFiles.length === allDuplicatePaths.length
    ) {
      setSelectedFiles([]);
      return;
    }

    setSelectedFiles(allDuplicatePaths);
  };

  /* ===================== Scan Folder ===================== */

  const handleScan = async () => {
    const newFolderPath =
      inputFolderPath.trim();

    if (!newFolderPath) {
      setError("Please enter a folder path.");
      return;
    }

    try {
      setScanLoading(true);
      setError("");
      setCleanupMessage("");

      const scan =
        await scanFolder(newFolderPath);

      const duplicates =
        await findDuplicates(newFolderPath);

      const history =
        await getScanHistory();

      setScanData(scan);
      setDuplicateData(duplicates);
      setHistoryData(history);

      setFolderPath(newFolderPath);
      setSelectedFiles([]);
      setShowAllScans(false);

      setActivePage("dashboard");
      setShowScanInput(false);
    } catch (err) {
      console.error("Scan error:", err);

      setError(
        err.response?.data?.detail ||
          err.message ||
          "Could not scan folder."
      );
    } finally {
      setScanLoading(false);
    }
  };

  /* ===================== Cleanup ===================== */

  const handleCleanup = async () => {
    if (selectedFiles.length === 0) {
      setError(
        "Please select at least one duplicate file."
      );
      return;
    }

    if (!folderPath) {
      setError(
        "Scan a folder before cleaning duplicate files."
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${
        selectedFiles.length
      } selected file${
        selectedFiles.length !== 1 ? "s" : ""
      }?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setCleanupLoading(true);
      setError("");
      setCleanupMessage("");

      let totalRecovered = 0;

      for (const filePath of selectedFiles) {
        const result = await cleanupFile(
          folderPath,
          filePath
        );

        totalRecovered +=
          result?.recovered_storage || 0;
      }

      setRecoveredStorage(
        (previous) =>
          previous + totalRecovered
      );

      setCleanupMessage(
        `Cleanup complete! ${
          selectedFiles.length
        } file${
          selectedFiles.length !== 1 ? "s" : ""
        } deleted. Storage recovered: ${formatSize(
          totalRecovered
        )}.`
      );

      setSelectedFiles([]);

      const scan =
        await scanFolder(folderPath);

      const duplicates =
        await findDuplicates(folderPath);

      const history =
        await getScanHistory();

      setScanData(scan);
      setDuplicateData(duplicates);
      setHistoryData(history);
    } catch (err) {
      console.error("Cleanup error:", err);

      setError(
        err.response?.data?.detail ||
          err.message ||
          "Could not clean selected files."
      );
    } finally {
      setCleanupLoading(false);
    }
  };

  /* ===================== Loading ===================== */

  if (loading) {
    return (
      <div className="sf-loading-screen">
        <div className="sf-loading-content">
          <div className="sf-loading-spinner" />

          <h2>Loading SMARTFIE...</h2>

          <p>
            Preparing your dashboard.
          </p>
        </div>
      </div>
    );
  }

  /* ===================== UI ===================== */

  return (
    <div className="sf-shell">

      {/* Top Bar */}
      <header className="sf-topbar">
        <div className="sf-brand">
          <img
            src={smartfieLogo}
            alt="SMARTFIE"
            className="sf-brand-logo"
          />
        </div>

        <button
          className="sf-scan-btn"
          type="button"
          onClick={() => {
            setError("");
            setInputFolderPath(folderPath);
            setShowScanInput(true);
          }}
        >
          <ScanIcon className="sf-icon" />
          <span>Scan Folder</span>
        </button>
      </header>

      <div className="sf-body">

        {/* Sidebar */}
        <nav
          className="sf-sidebar"
          aria-label="Primary navigation"
        >
          <div className="sf-nav-list">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`sf-nav-item${
                  activePage === item.key
                    ? " sf-nav-item--active"
                    : ""
                }`}
                onClick={() => {
                  setActivePage(item.key);
                  setError("");
                }}
              >
                <item.icon className="sf-icon" />

                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="sf-main">

          {/* ================= Dashboard Page ================= */}

          {activePage === "dashboard" && (
            <>
              <div className="sf-page-head">
                <h1>Storage Overview</h1>

                <p>
                  Dashboard data from your latest scan.
                </p>
              </div>

              {error && (
                <div className="sf-page-error">
                  {error}
                </div>
              )}

              <section
                className="sf-stats"
                aria-label="Summary statistics"
              >
                <div className="sf-stat-card sf-tone-blue">
                  <div className="sf-stat-icon">
                    <FilesIcon className="sf-icon" />
                  </div>

                  <div className="sf-stat-value">
                    {totalFiles}
                  </div>

                  <div className="sf-stat-label">
                    Files Scanned
                  </div>

                  <div className="sf-stat-sub">
                    Total files found
                  </div>
                </div>

                <div className="sf-stat-card sf-tone-purple">
                  <div className="sf-stat-icon">
                    <DuplicateIcon className="sf-icon" />
                  </div>

                  <div className="sf-stat-value">
                    {duplicateGroups}
                  </div>

                  <div className="sf-stat-label">
                    Duplicate Groups
                  </div>

                  <div className="sf-stat-sub">
                    Matching file groups
                  </div>
                </div>

                <div className="sf-stat-card sf-tone-red">
                  <div className="sf-stat-icon">
                    <StorageIcon className="sf-icon" />
                  </div>

                  <div className="sf-stat-value">
                    {wastedDisplay}
                  </div>

                  <div className="sf-stat-label">
                    Wasted Storage
                  </div>

                  <div className="sf-stat-sub">
                    Space used by duplicates
                  </div>
                </div>

                <div className="sf-stat-card sf-tone-green">
                  <div className="sf-stat-icon">
                    <CheckIcon className="sf-icon" />
                  </div>

                  <div className="sf-stat-value">
                    {recoveredDisplay}
                  </div>

                  <div className="sf-stat-label">
                    Storage Recovered
                  </div>

                  <div className="sf-stat-sub">
                    From cleaned duplicates
                  </div>
                </div>
              </section>

              <section className="sf-duplicates-section">
                <div className="sf-section-header">
                  <div>
                    <h2>Duplicate Files</h2>

                    <p>
                      Select duplicate files to clean up safely.
                    </p>
                  </div>

                  <div className="sf-duplicates-header-actions">
                    {allDuplicatePaths.length > 0 && (
                      <button
                        type="button"
                        className="sf-select-all-btn"
                        onClick={handleSelectAll}
                        disabled={cleanupLoading}
                      >
                        {selectedFiles.length ===
                          allDuplicatePaths.length
                          ? "Clear Selection"
                          : "Select All"}
                      </button>
                    )}

                    <span className="sf-panel-total">
                      {duplicateGroups} groups
                    </span>
                  </div>
                </div>

                <div className="sf-duplicate-panel">
                  {duplicateFiles.length === 0 ? (
                    <div className="sf-empty-state">
                      <DuplicateIcon className="sf-empty-icon" />

                      <h3>
                        No duplicate files found
                      </h3>

                      <p>
                        Scan a folder to check for exact duplicates.
                      </p>
                    </div>
                  ) : (
                    duplicateFiles.map(
                      (group, groupIndex) => (
                        <div
                          className="sf-duplicate-group"
                          key={
                            group.hash ||
                            groupIndex
                          }
                        >
                          <div className="sf-duplicate-group-head">
                            <div>
                              <h3>
                                Group {groupIndex + 1}
                              </h3>

                              <span>
                                {group.files?.length || 0} files
                              </span>
                            </div>

                            <strong>
                              {formatSize(
                                group.files?.[0]?.size || 0
                              )}
                            </strong>
                          </div>

                          <div className="sf-duplicate-files">
                            {group.files?.map(
                              (file, fileIndex) => (
                                <label
                                  className={`sf-duplicate-file${
                                    selectedFiles.includes(
                                      file.path
                                    )
                                      ? " sf-duplicate-file--selected"
                                      : ""
                                  }`}
                                  key={
                                    file.path ||
                                    `${groupIndex}-${fileIndex}`
                                  }
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedFiles.includes(
                                      file.path
                                    )}
                                    disabled={cleanupLoading}
                                    onChange={() =>
                                      toggleFileSelection(
                                        file.path
                                      )
                                    }
                                  />

                                  <div className="sf-duplicate-file-info">
                                    <FolderIcon className="sf-icon sf-icon--folder" />

                                    <div className="sf-file-text">
                                      <div className="sf-duplicate-file-name">
                                        {file.name ||
                                          "Unknown file"}
                                      </div>

                                      <div className="sf-duplicate-file-path">
                                        {file.path}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="sf-duplicate-file-size">
                                    {formatSize(
                                      file.size || 0
                                    )}
                                  </div>
                                </label>
                              )
                            )}
                          </div>
                        </div>
                      )
                    )
                  )}
                </div>

                {cleanupMessage && (
                  <div className="sf-cleanup-success">
                    {cleanupMessage}
                  </div>
                )}

                {selectedFiles.length > 0 && (
                  <div className="sf-cleanup-actions">
                    <span>
                      {selectedFiles.length} file
                      {selectedFiles.length !== 1
                        ? "s"
                        : ""}{" "}
                      selected
                    </span>

                    <button
                      type="button"
                      className="sf-cleanup-btn"
                      disabled={cleanupLoading}
                      onClick={handleCleanup}
                    >
                      <TrashIcon className="sf-icon" />

                      {cleanupLoading
                        ? "Cleaning..."
                        : "Clean Selected"}
                    </button>
                  </div>
                )}
              </section>
            </>
          )}

          {/* ================= History Page ================= */}

          {activePage === "history" && (
            <>
              <div className="sf-page-head">
                <h1>Scan History</h1>

                <p>
                  View your previous folder scans.
                </p>
              </div>

              {error && (
                <div className="sf-page-error">
                  {error}
                </div>
              )}

              <section
                className="sf-history-section"
                aria-label="Scan history"
              >
                <div className="sf-section-header sf-history-header">
                  <div>
                    <h2>Recent Scans</h2>

                    <p>
                      Your latest folder scanning activity.
                    </p>
                  </div>

                  <div className="sf-history-header-actions">
                    <span className="sf-panel-total">
                      {allScans.length} scans
                    </span>

                    {allScans.length > 5 && (
                      <button
                        type="button"
                        className="sf-view-all-btn"
                        onClick={() =>
                          setShowAllScans(
                            (previous) =>
                              !previous
                          )
                        }
                      >
                        {showAllScans
                          ? "Show Less"
                          : "View All"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="sf-history-card">
                  {recentScans.length === 0 ? (
                    <div className="sf-history-empty">
                      <HistoryIcon className="sf-empty-icon" />

                      <h3>
                        No scan history available
                      </h3>

                      <p>
                        Your completed folder scans will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="sf-table">
                      <table className="sf-history-table">
                        <thead>
                          <tr>
                            <th>Folder</th>
                            <th>Date & Time</th>
                            <th>Files</th>
                            <th>Scan ID</th>
                            <th>Status</th>
                          </tr>
                        </thead>

                        <tbody>
                          {recentScans.map(
                            (scan) => (
                              <tr key={scan.id}>
                                <td>
                                  <div className="sf-history-folder">
                                    <FolderIcon className="sf-history-folder-icon" />

                                    <span
                                      title={
                                        scan.folder ||
                                        scan.folder_path ||
                                        "Unknown folder"
                                      }
                                    >
                                      {scan.folder ||
                                        scan.folder_path ||
                                        "Unknown folder"}
                                    </span>
                                  </div>
                                </td>

                                <td className="sf-history-date">
                                  {formatDate(
                                    scan.created_at
                                  )}
                                </td>

                                <td className="sf-history-files">
                                  {scan.files_count ??
                                    scan.files_found ??
                                    0}
                                </td>

                                <td className="sf-history-id">
                                  #{scan.id}
                                </td>

                                <td className="sf-history-status-cell">
                                  <span className="sf-history-status">
                                    Completed
                                  </span>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </main>
      </div>

      {/* Scan Folder Modal */}
      {showScanInput && (
        <div className="sf-scan-modal">
          <div className="sf-scan-box">
            <h2>Scan Folder</h2>

            <p>
              Enter the folder path you want SMARTFIE to scan.
            </p>

            {error && (
              <p className="sf-scan-error">
                {error}
              </p>
            )}

            <input
              type="text"
              value={inputFolderPath}
              onChange={(event) =>
                setInputFolderPath(
                  event.target.value
                )
              }
              placeholder="Enter folder path"
              disabled={scanLoading}
            />

            <div className="sf-scan-actions">
              <button
                type="button"
                disabled={scanLoading}
                onClick={() => {
                  setError("");
                  setShowScanInput(false);
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  scanLoading ||
                  !inputFolderPath.trim()
                }
                onClick={handleScan}
              >
                {scanLoading
                  ? "Scanning..."
                  : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   Icons
========================================================= */

function iconProps(props) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    ...props,
  };
}

function GridIcon(props) {
  return (
    <svg {...iconProps(props)}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function ScanIcon(props) {
  return (
    <svg {...iconProps(props)}>
      <path d="M4 9V5a1 1 0 0 1 1-1h4" />
      <path d="M15 4h4a1 1 0 0 1 1 1v4" />
      <path d="M20 15v4a1 1 0 0 1-1 1h-4" />
      <path d="M9 20H5a1 1 0 0 1-1-1v-4" />
    </svg>
  );
}

function HistoryIcon(props) {
  return (
    <svg {...iconProps(props)}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function FilesIcon(props) {
  return (
    <svg {...iconProps(props)}>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </svg>
  );
}

function DuplicateIcon(props) {
  return (
    <svg {...iconProps(props)}>
      <rect x="7" y="7" width="10" height="12" rx="2" />
      <path d="M5 15H4a1 1 0 0 1-1-1V5a2 2 0 0 1 2-2h8a1 1 0 0 1 1 1v1" />
    </svg>
  );
}

function StorageIcon(props) {
  return (
    <svg {...iconProps(props)}>
      <ellipse cx="12" cy="5" rx="7" ry="3" />
      <path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
      <path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" />
    </svg>
  );
}

function CheckIcon(props) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  );
}

function FolderIcon(props) {
  return (
    <svg {...iconProps(props)}>
      <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

function TrashIcon(props) {
  return (
    <svg {...iconProps(props)}>
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}