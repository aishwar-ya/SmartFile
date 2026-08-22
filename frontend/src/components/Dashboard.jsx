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
  /* =========================================================
     State
  ========================================================= */

  const [scanData, setScanData] = useState(null);
  const [duplicateData, setDuplicateData] = useState(null);
  const [historyData, setHistoryData] = useState(null);

  const [activePage, setActivePage] =
    useState("dashboard");

  const [showAllScans, setShowAllScans] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [scanLoading, setScanLoading] =
    useState(false);

  const [cleanupLoading, setCleanupLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [cleanupMessage, setCleanupMessage] =
    useState("");

  const [recoveredStorage, setRecoveredStorage] =
    useState(0);

  const [folderPath, setFolderPath] = useState(
    "C:\\Users\\ASUS\\SmartFie\\backend\\TestFiles"
  );

  const [inputFolderPath, setInputFolderPath] =
    useState(
      "C:\\Users\\ASUS\\SmartFie\\backend\\TestFiles"
    );

  const [showScanInput, setShowScanInput] =
    useState(false);

  const [selectedFiles, setSelectedFiles] =
    useState([]);

  /* =========================================================
     Initial Dashboard Load
  ========================================================= */

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

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
        console.error(
          "Dashboard API error:",
          err
        );

        setError(
          err.response?.data?.detail ||
            err.message ||
            "Could not load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  /* =========================================================
     Dashboard Values
  ========================================================= */

  const totalFiles =
    scanData?.files_found || 0;

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

  /* =========================================================
     Format Storage
  ========================================================= */

  const formatSize = (bytes) => {
    if (!bytes) {
      return "0 bytes";
    }

    if (bytes >= 1024 * 1024 * 1024) {
      return `${(
        bytes /
        (1024 * 1024 * 1024)
      ).toFixed(1)} GB`;
    }

    if (bytes >= 1024 * 1024) {
      return `${(
        bytes /
        (1024 * 1024)
      ).toFixed(1)} MB`;
    }

    if (bytes >= 1024) {
      return `${(
        bytes / 1024
      ).toFixed(1)} KB`;
    }

    return `${bytes} bytes`;
  };

  const wastedDisplay =
    formatSize(wastedStorage);

  const recoveredDisplay =
    formatSize(recoveredStorage);

  /* =========================================================
     Toggle File Selection
  ========================================================= */

  const toggleFileSelection = (
    filePath
  ) => {
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

  /* =========================================================
     Select All
  ========================================================= */

  const handleSelectAll = () => {
    const allDuplicatePaths =
      duplicateFiles.flatMap(
        (group) =>
          group.files?.map(
            (file) => file.path
          ) || []
      );

    if (
      selectedFiles.length ===
      allDuplicatePaths.length
    ) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(
        allDuplicatePaths
      );
    }
  };

  /* =========================================================
     Cleanup Selected Files
  ========================================================= */

  const handleCleanup = async () => {
    if (selectedFiles.length === 0) {
      setError(
        "Please select at least one file to clean up."
      );

      return;
    }

    /* Safety check */

    for (const group of duplicateFiles) {
      const files =
        group.files || [];

      const selectedInGroup =
        files.filter((file) =>
          selectedFiles.includes(
            file.path
          )
        );

      if (
        selectedInGroup.length >=
        files.length
      ) {
        setError(
          "You cannot delete every copy in a duplicate group. Please keep at least one file."
        );

        return;
      }
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to permanently delete ${
          selectedFiles.length
        } selected file${
          selectedFiles.length !== 1
            ? "s"
            : ""
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
        const result =
          await cleanupFile(
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
          selectedFiles.length !== 1
            ? "s"
            : ""
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
      console.error(
        "Cleanup error:",
        err
      );

      setError(
        err.response?.data?.detail ||
          err.message ||
          "Could not clean selected files."
      );
    } finally {
      setCleanupLoading(false);
    }
  };

  /* =========================================================
     Loading Screen
  ========================================================= */

  if (loading) {
    return (
      <div className="sf-loading-screen">
        <div className="sf-loading-content">
          <div className="sf-loading-spinner" />

          <h2>
            Loading SMARTFIE...
          </h2>

          <p>
            Preparing your storage overview.
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="sf-shell">

      {/* =====================================================
          Top Bar
      ===================================================== */}

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
            setCleanupMessage("");
            setInputFolderPath(folderPath);
            setShowScanInput(true);
          }}
        >
          <ScanIcon className="sf-icon" />

          <span>
            Scan Folder
          </span>
        </button>
      </header>

      <div className="sf-body">

        {/* ===================================================
            Sidebar
        =================================================== */}

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
                <item.icon
                  className="sf-icon"
                />

                <span>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </nav>

        {/* ===================================================
            Main Content
        =================================================== */}

        <main className="sf-main">

          {/* ===============================================
              DASHBOARD PAGE
          ================================================ */}

          {activePage === "dashboard" && (
            <>
              {/* Page Header */}

              <div className="sf-page-head">
                <h1>
                  Storage Overview
                </h1>

                <p>
                  Dashboard data from your latest scan
                </p>
              </div>

              {/* Statistics */}

              <section
                className="sf-stats"
                aria-label="Summary statistics"
              >
                {/* Files Scanned */}

                <div className="sf-stat-card sf-tone-blue">
                  <div className="sf-stat-icon">
                    <FilesIcon
                      className="sf-icon"
                    />
                  </div>

                  <div className="sf-stat-value">
                    {totalFiles.toLocaleString()}
                  </div>

                  <div className="sf-stat-label">
                    Files Scanned
                  </div>

                  <div className="sf-stat-sub">
                    Total files found
                  </div>
                </div>

                {/* Duplicate Groups */}

                <div className="sf-stat-card sf-tone-purple">
                  <div className="sf-stat-icon">
                    <CopyIcon
                      className="sf-icon"
                    />
                  </div>

                  <div className="sf-stat-value">
                    {duplicateGroups}
                  </div>

                  <div className="sf-stat-label">
                    Duplicate Groups
                  </div>

                  <div className="sf-stat-sub">
                    Duplicate groups found
                  </div>
                </div>

                {/* Wasted Storage */}

                <div className="sf-stat-card sf-tone-dark">
                  <div className="sf-stat-icon">
                    <DiskIcon
                      className="sf-icon"
                    />
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

                {/* Storage Recovered */}

                <div className="sf-stat-card sf-tone-green">
                  <div className="sf-stat-icon">
                    <DiskIcon
                      className="sf-icon"
                    />
                  </div>

                  <div className="sf-stat-value">
                    {recoveredDisplay}
                  </div>

                  <div className="sf-stat-label">
                    Storage Recovered
                  </div>

                  <div className="sf-stat-sub">
                    From latest cleanup
                  </div>
                </div>
              </section>

              {/* ===========================================
                  Storage Statistics Graph
              =========================================== */}

              <section className="sf-storage-graph-section">
                <div className="sf-section-header">
                  <div>
                    <h2>Storage Statistics</h2>

                    <p>
                      Overview of duplicate files and storage usage.
                    </p>
                  </div>
                </div>

                <div className="sf-storage-graph-card">
                  <div className="sf-graph-info">
                    <div className="sf-graph-title">
                      Storage Waste Analysis
                    </div>

                    <div className="sf-graph-value">
                      {wastedDisplay}
                    </div>

                    <p>
                      Storage currently occupied by duplicate files
                    </p>
                  </div>

                  <div className="sf-graph-bars">
                    <div className="sf-graph-bar-item">
                      <div className="sf-graph-bar-label">
                        <span>Files Scanned</span>

                        <strong>{totalFiles}</strong>
                      </div>

                      <div className="sf-graph-track">
                        <div
                          className="sf-graph-bar sf-graph-bar-blue"
                          style={{
                            width: totalFiles > 0 ? "100%" : "0%",
                          }}
                        />
                      </div>
                    </div>

                    <div className="sf-graph-bar-item">
                      <div className="sf-graph-bar-label">
                        <span>Duplicate Groups</span>

                        <strong>{duplicateGroups}</strong>
                      </div>

                      <div className="sf-graph-track">
                        <div
                          className="sf-graph-bar sf-graph-bar-red"
                          style={{
                            width:
                              totalFiles > 0
                                ? `${Math.max(
                                    8,
                                    (duplicateGroups / totalFiles) * 100
                                  )}%`
                                : "0%",
                          }}
                        />
                      </div>
                    </div>

                    <div className="sf-graph-bar-item">
                      <div className="sf-graph-bar-label">
                        <span>Storage Recovered</span>

                        <strong>{recoveredDisplay}</strong>
                      </div>

                      <div className="sf-graph-track">
                        <div
                          className="sf-graph-bar sf-graph-bar-green"
                          style={{
                            width:
                              recoveredStorage > 0
                                ? "65%"
                                : "0%",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

{/* ===========================================
    Duplicate Files
=========================================== */}

              {/* ===========================================
                  Duplicate Files
              ============================================ */}

              <section className="sf-duplicates-section">

                <div className="sf-section-header">
                  <div>
                    <h2>
                      Duplicate Files
                    </h2>

                    <p>
                      Select duplicate files you want
                      to clean safely.
                    </p>
                  </div>

                  <div className="sf-duplicates-header-actions">
                    <button
                      type="button"
                      className="sf-select-all-btn"
                      onClick={handleSelectAll}
                      disabled={
                        cleanupLoading ||
                        duplicateFiles.length === 0
                      }
                    >
                      {selectedFiles.length ===
                      duplicateFiles.flatMap(
                        (group) =>
                          group.files || []
                      ).length
                        ? "Deselect All"
                        : "Select All"}
                    </button>

                    <span className="sf-panel-total">
                      {duplicateGroups} groups
                    </span>
                  </div>
                </div>

                <div className="sf-duplicates-card">
                  {duplicateFiles.length === 0 ? (
                    <div className="sf-history-empty">
                      No duplicate files found.
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
                                Duplicate Group{" "}
                                {groupIndex + 1}
                              </h3>

                              <p>
                                {
                                  group.files?.length ||
                                  0
                                }{" "}
                                matching files
                              </p>
                            </div>

                            <span>
                              {formatSize(
                                group.files?.[0]
                                  ?.size || 0
                              )}
                            </span>
                          </div>

                          <div className="sf-duplicate-files">
                            {group.files?.map(
                              (
                                file,
                                fileIndex
                              ) => (
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
                                    disabled={
                                      cleanupLoading
                                    }
                                    onChange={() =>
                                      toggleFileSelection(
                                        file.path
                                      )
                                    }
                                  />

                                  <div className="sf-duplicate-file-info">
                                    <FolderIcon
                                      className="sf-icon sf-icon--folder"
                                    />

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

                      <strong>
                        {" "}
                        · Ready to clean
                      </strong>
                    </span>

                    <button
                      type="button"
                      className="sf-cleanup-btn"
                      disabled={cleanupLoading}
                      onClick={handleCleanup}
                    >
                      <TrashIcon
                        className="sf-icon"
                      />

                      {cleanupLoading
                        ? "Cleaning..."
                        : "Clean Selected"}
                    </button>
                  </div>
                )}

                {error && (
                  <p className="sf-scan-error">
                    {error}
                  </p>
                )}
              </section>
            </>
          )}

          {/* ===============================================
              HISTORY PAGE
          ================================================ */}

          {activePage === "history" && (
            <>
              <div className="sf-page-head">
                <h1>
                  Scan History
                </h1>

                <p>
                  View your previous folder scans.
                </p>
              </div>

              <section className="sf-history-section">
                <div className="sf-section-header">
                  <div>
                    <h2>
                      Recent Scans
                    </h2>

                    <p>
                      Your latest scan activity.
                    </p>
                  </div>

                  <div className="sf-duplicates-header-actions">
                    {allScans.length > 5 && (
                      <button
                        type="button"
                        className="sf-select-all-btn"
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

                    <span className="sf-panel-total">
                      {allScans.length} scans
                    </span>
                  </div>
                </div>

                <div className="sf-history-card">
                  <div className="sf-table">
                    {recentScans.length === 0 ? (
                      <div className="sf-history-empty">
                        No scan history available.
                      </div>
                    ) : (
                      <table className="sf-history-table">
                        <thead>
                          <tr>
                            <th>
                              Folder
                            </th>

                            <th>
                              Scanned
                            </th>

                            <th>
                              Files
                            </th>

                            <th>
                              Scan ID
                            </th>

                            <th>
                              Status
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {recentScans.map(
                            (
                              scan,
                              index
                            ) => (
                              <tr
                                key={
                                  scan.id ||
                                  index
                                }
                              >
                                <td>
                                  {scan.folder ||
                                    scan.folder_path ||
                                    "Unknown folder"}
                                </td>

                                <td>
                                  {scan.created_at
                                    ? new Date(
                                        scan.created_at
                                      ).toLocaleString()
                                    : "-"}
                                </td>

                                <td>
                                  {(
                                    scan.files_count ||
                                    scan.files_found ||
                                    0
                                  ).toLocaleString()}
                                </td>

                                <td>
                                  #
                                  {scan.id ||
                                    index + 1}
                                </td>

                                <td>
                                  <span className="sf-history-status">
                                    Completed
                                  </span>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </section>
            </>
          )}

        </main>
      </div>

      {/* ===============================================
          Scan Folder Modal
      ================================================ */}

      {showScanInput && (
        <div className="sf-scan-modal">
          <div className="sf-scan-box">

            <h2>
              Scan Folder
            </h2>

            <p>
              Enter the folder path you want
              to scan for duplicate files.
            </p>

            {error && (
              <p className="sf-scan-error">
                {error}
              </p>
            )}

            <input
              type="text"
              value={inputFolderPath}
              onChange={(e) =>
                setInputFolderPath(
                  e.target.value
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
                onClick={async () => {
                  try {
                    setScanLoading(true);
                    setError("");

                    const newFolderPath =
                      inputFolderPath.trim();

                    const scan =
                      await scanFolder(
                        newFolderPath
                      );

                    const duplicates =
                      await findDuplicates(
                        newFolderPath
                      );

                    const history =
                      await getScanHistory();

                    setScanData(scan);

                    setDuplicateData(
                      duplicates
                    );

                    setHistoryData(
                      history
                    );

                    setFolderPath(
                      newFolderPath
                    );

                    setSelectedFiles([]);

                    setCleanupMessage("");

                    setShowAllScans(false);

                    /* Go back to Dashboard */

                    setActivePage(
                      "dashboard"
                    );

                    setShowScanInput(false);

                  } catch (err) {
                    console.error(
                      "Scan error:",
                      err
                    );

                    setError(
                      err.response?.data
                        ?.detail ||
                        err.message ||
                        "Could not scan folder."
                    );
                  } finally {
                    setScanLoading(false);
                  }
                }}
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
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1.5"
      />

      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1.5"
      />

      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1.5"
      />

      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="1.5"
      />
    </svg>
  );
}

function ScanIcon(props) {
  return (
    <svg {...iconProps(props)}>
      <path d="M4 8V5a1 1 0 0 1 1-1h3" />
      <path d="M20 8V5a1 1 0 0 0-1-1h-3" />
      <path d="M4 16v3a1 1 0 0 0 1 1h3" />
      <path d="M20 16v3a1 1 0 0 1-1 1h-3" />
      <line
        x1="4"
        y1="12"
        x2="20"
        y2="12"
      />
    </svg>
  );
}

function HistoryIcon(props) {
  return (
    <svg {...iconProps(props)}>
      <circle
        cx="12"
        cy="12"
        r="8"
      />

      <path d="M12 8v4l3 2" />
    </svg>
  );
}

function FilesIcon(props) {
  return (
    <svg {...iconProps(props)}>
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />

      <path d="M14 3v5h5" />

      <path d="M12 12v6" />

      <path d="M9 15h6" />
    </svg>
  );
}

function CopyIcon(props) {
  return (
    <svg {...iconProps(props)}>
      <rect
        x="9"
        y="9"
        width="11"
        height="11"
        rx="1.5"
      />

      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </svg>
  );
}

function DiskIcon(props) {
  return (
    <svg {...iconProps(props)}>
      <ellipse
        cx="12"
        cy="5.5"
        rx="7.5"
        ry="2.8"
      />

      <path d="M4.5 5.5v6.5c0 1.55 3.35 2.8 7.5 2.8s7.5-1.25 7.5-2.8V5.5" />

      <path d="M4.5 12v6.5c0 1.55 3.35 2.8 7.5 2.8s7.5-1.25 7.5-2.8V12" />
    </svg>
  );
}

function FolderIcon(props) {
  return (
    <svg {...iconProps(props)}>
      <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
    </svg>
  );
}

function TrashIcon(props) {
  return (
    <svg {...iconProps(props)}>
      <path d="M4 7h16" />

      <path d="M10 11v6" />

      <path d="M14 11v6" />

      <path d="M9 7V4h6v3" />

      <path d="M6 7l1 13h10l1-13" />
    </svg>
  );
}