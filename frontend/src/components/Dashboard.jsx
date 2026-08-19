import React, { useEffect, useState } from "react";
import "./Dashboard.css";

import {
  scanFolder,
  findDuplicates,
  getScanHistory,
  cleanupFile,
} from "../api/api";

/* ---------------------------- navigation ---------------------------- */

const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: GridIcon,
    active: true,
  },
  {
    key: "scan",
    label: "Scan Files",
    icon: ScanIcon,
    active: false,
  },
  {
    key: "history",
    label: "History",
    icon: HistoryIcon,
    active: false,
  },
];

/* ---------------------------- component ---------------------------- */

export default function Dashboard() {
  // Stores scan results
  const [scanData, setScanData] = useState(null);

  // Stores duplicate results
  const [duplicateData, setDuplicateData] = useState(null);

  // Stores scan history
  const [historyData, setHistoryData] = useState(null);

  // Controls initial/scan loading screen
  const [loading, setLoading] = useState(true);

  // Controls cleanup loading
  const [cleanupLoading, setCleanupLoading] = useState(false);

  // Stores error messages
  const [error, setError] = useState("");

  // Stores total storage recovered from latest cleanup
  const [recoveredStorage, setRecoveredStorage] = useState(0);

  // Shows cleanup success message
  const [cleanupMessage, setCleanupMessage] = useState("");

  // Successfully scanned folder
  const [folderPath, setFolderPath] = useState(
    "C:\\Users\\ASUS\\SmartFie\\backend\\TestFiles"
  );

  // Folder currently entered in the scan popup
  const [inputFolderPath, setInputFolderPath] = useState(
    "C:\\Users\\ASUS\\SmartFie\\backend\\TestFiles"
  );

  // Controls scan popup
  const [showScanInput, setShowScanInput] = useState(false);

  // Stores files selected for cleanup
  const [selectedFiles, setSelectedFiles] = useState([]);

  /* ---------------------------- load dashboard data ---------------------------- */

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("Testing /scan...");

        const scan = await scanFolder(inputFolderPath);

        console.log("Scan successful:", scan);

        console.log("Testing /duplicates...");

        const duplicates =
          await findDuplicates(inputFolderPath);

        console.log(
          "Duplicates successful:",
          duplicates
        );

        console.log("Testing /history...");

        const history = await getScanHistory();

        console.log(
          "History successful:",
          history
        );

        // Update dashboard
        setScanData(scan);
        setDuplicateData(duplicates);
        setHistoryData(history);

        // Save successfully scanned path
        setFolderPath(inputFolderPath);
      } catch (err) {
        console.error(
          "Dashboard API error:",
          err
        );

        if (err.response) {
          console.error(
            "Status:",
            err.response.status
          );

          console.error(
            "Response:",
            err.response.data
          );
        }

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

  /* ---------------------------- loading state ---------------------------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">
            Scanning folder...
          </h2>

          <p className="mt-2 text-gray-500">
            SMARTFIE is analyzing your files.
          </p>
        </div>
      </div>
    );
  }

  /* ---------------------------- error state ---------------------------- */

  if (error && !showScanInput) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold">
            {error}
          </p>

          <button
            type="button"
            className="mt-4 px-4 py-2 rounded-lg border"
            onClick={() => {
              setError("");
              window.location.reload();
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* ---------------------------- dashboard values ---------------------------- */

  const totalFiles =
    scanData?.files_found || 0;

  const duplicateGroups =
    duplicateData?.duplicate_groups || 0;

  const wastedStorage =
    duplicateData?.wasted_storage || 0;

  const recentScans =
    historyData?.history || [];

  const duplicateFiles =
    duplicateData?.duplicates || [];

  /* ---------------------------- storage formatting ---------------------------- */

  const wastedDisplay =
    wastedStorage >= 1024 * 1024 * 1024
      ? `${(
          wastedStorage /
          (1024 * 1024 * 1024)
        ).toFixed(1)} GB`
      : wastedStorage >= 1024 * 1024
      ? `${(
          wastedStorage /
          (1024 * 1024)
        ).toFixed(1)} MB`
      : wastedStorage >= 1024
      ? `${(
          wastedStorage / 1024
        ).toFixed(1)} KB`
      : `${wastedStorage} bytes`;

  /* ---------------------------- recovered storage formatting ---------------------------- */

  const recoveredDisplay =
    recoveredStorage >= 1024 * 1024 * 1024
      ? `${(
          recoveredStorage /
          (1024 * 1024 * 1024)
        ).toFixed(1)} GB`
      : recoveredStorage >= 1024 * 1024
      ? `${(
          recoveredStorage /
          (1024 * 1024)
        ).toFixed(1)} MB`
      : recoveredStorage >= 1024
      ? `${(
          recoveredStorage / 1024
        ).toFixed(1)} KB`
      : `${recoveredStorage} bytes`;

  /* ---------------------------- UI ---------------------------- */

  return (
    <div className="sf-shell">

      {/* ---------------- Top bar ---------------- */}

      <header className="sf-topbar">
        <div className="sf-brand">
          <span
            className="sf-brand-dot"
            aria-hidden="true"
          />

          <span className="sf-brand-name">
            SMARTFIE
          </span>
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
          Scan Folder
        </button>
      </header>

      <div className="sf-body">

        {/* ---------------- Scan folder modal ---------------- */}

        {showScanInput && (
          <div className="sf-scan-modal">
            <div className="sf-scan-box">

              <h2>Scan Folder</h2>

              <p>
                Enter the folder path you want
                SMARTFIE to scan.
              </p>

              {/* Scan error */}

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
              />

              <div className="sf-scan-actions">

                {/* Cancel */}

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setError("");
                    setShowScanInput(false);
                  }}
                >
                  Cancel
                </button>

                {/* Continue */}

                <button
                  type="button"
                  disabled={loading}
                  onClick={async () => {
                    try {
                      setLoading(true);
                      setError("");

                      console.log(
                        "Starting scan..."
                      );

                      const scan =
                        await scanFolder(
                          inputFolderPath
                        );

                      console.log(
                        "Scan complete:",
                        scan
                      );

                      const duplicates =
                        await findDuplicates(
                          inputFolderPath
                        );

                      console.log(
                        "Duplicates complete:",
                        duplicates
                      );

                      const history =
                        await getScanHistory();

                      console.log(
                        "History complete:",
                        history
                      );

                      // Update dashboard
                      setScanData(scan);

                      setDuplicateData(
                        duplicates
                      );

                      setHistoryData(history);

                      // Save successfully scanned path
                      setFolderPath(
                        inputFolderPath
                      );

                      // Clear previously selected files
                      setSelectedFiles([]);

                      // Close popup only after success
                      setShowScanInput(false);
                    } catch (err) {
                      console.error(
                        "Scan error:",
                        err
                      );

                      const message =
                        err.response?.data
                          ?.detail ||
                        err.message ||
                        "Could not scan folder";

                      setError(message);
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  {loading
                    ? "Scanning..."
                    : "Continue"}
                </button>

              </div>
            </div>
          </div>
        )}

        {/* ---------------- Sidebar ---------------- */}

        <nav
          className="sf-sidebar"
          aria-label="Primary"
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`sf-nav-item${
                item.active
                  ? " sf-nav-item--active"
                  : ""
              }`}
            >
              <item.icon
                className="sf-icon"
              />

              <span>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* ---------------- Main content ---------------- */}

        <main className="sf-main">

          {/* Page header */}

          <div className="sf-page-head">
            <h1>
              Storage Overview
            </h1>

            <p>
              Dashboard data from your latest scan
            </p>
          </div>

          {/* ---------------- Stat cards ---------------- */}

          <section
            className="sf-stats"
            aria-label="Summary statistics"
          >

            {/* Files scanned */}

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

            {/* Duplicate groups */}

            <div className="sf-stat-card sf-tone-purple">
              <div className="sf-stat-icon">
                <CopyIcon
                  className="sf-icon"
                />
              </div>

              <div className="sf-stat-value">
                {duplicateGroups.toLocaleString()}
              </div>

              <div className="sf-stat-label">
                Duplicate Groups
              </div>

              <div className="sf-stat-sub">
                Duplicate groups found
              </div>
            </div>

            {/* Wasted storage */}

            <div className="sf-stat-card sf-tone-green">
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

            {/* Recovered storage */}

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

          {/* ---------------- Storage composition ---------------- */}

          <section
            className="sf-panel"
            aria-label="Storage composition"
          >
            <div className="sf-panel-head">
              <h2>
                Duplicate Storage
              </h2>

              <span className="sf-panel-total">
                {wastedDisplay} wasted
              </span>
            </div>

            <div className="sf-bar-track">
              <div
                className="sf-bar-segment sf-bar-duplicate"
                style={{
                  width: "100%",
                }}
              />

              <div className="sf-bar-sweep" />
            </div>

            <div className="sf-bar-legend">
              <div className="sf-legend-item">
                <span className="sf-legend-swatch sf-legend-duplicate" />

                Duplicate storage —{" "}
                {wastedDisplay}
              </div>
            </div>
          </section>

          {/* ---------------- Recent scans ---------------- */}

          <section
            className="sf-panel"
            aria-label="Recent scan activity"
          >
            <div className="sf-panel-head">
              <h2>
                Recent Scans
              </h2>

              <span className="sf-panel-total">
                {recentScans.length} scans
              </span>
            </div>

            <div className="sf-table">

              {/* Table header */}

              <div className="sf-table-row sf-table-row--head">
                <span>Folder</span>
                <span>Scanned</span>
                <span>Files</span>
                <span>Scan ID</span>
                <span>Status</span>
              </div>

              {/* History records */}

              {recentScans.length === 0 ? (
                <div className="sf-table-row">
                  <span>
                    No scan history available.
                  </span>
                </div>
              ) : (
                recentScans.map((scan) => (
                  <div
                    className="sf-table-row"
                    key={scan.id}
                  >
                    <span className="sf-cell-folder">
                      <FolderIcon
                        className="sf-icon sf-icon--folder"
                      />

                      {scan.folder
                        ?.split("\\")
                        .pop()}
                    </span>

                    <span className="sf-cell-mono sf-cell-dim">
                      {scan.created_at
                        ? new Date(
                            scan.created_at
                          ).toLocaleString()
                        : "-"}
                    </span>

                    <span className="sf-cell-mono">
                      {scan.files_count ?? 0}
                    </span>

                    <span className="sf-cell-mono">
                      #{scan.id}
                    </span>

                    <span>
                      <span className="sf-badge sf-badge--complete">
                        Completed
                      </span>
                    </span>
                  </div>
                ))
              )}

            </div>
          </section>

          {/* ---------------- Duplicate files ---------------- */}

          <section
            className="sf-panel"
            aria-label="Duplicate files"
          >
            <div className="sf-panel-head">
              <h2>
                Duplicate Files
              </h2>

              <span className="sf-panel-total">
                {duplicateGroups} groups
              </span>
            </div>

            {/* Duplicate groups */}

            {duplicateFiles.length === 0 ? (
              <div className="sf-empty-state">
                <p>
                  No duplicate files found.
                </p>
              </div>
            ) : (
              <div className="sf-duplicate-groups">

                {duplicateFiles.map(
                  (group, groupIndex) => (
                    <div
                      className="sf-duplicate-group"
                      key={
                        group.hash ||
                        groupIndex
                      }
                    >

                      {/* Duplicate group header */}

                      <div className="sf-duplicate-group-head">
                        <div>
                          <h3>
                            Duplicate Group{" "}
                            {groupIndex + 1}
                          </h3>

                          <p>
                            {group.files?.length ??
                              0}{" "}
                            identical files
                          </p>
                        </div>

                        <span className="sf-duplicate-size">
                          {group.files?.[0]
                            ?.size ?? 0}{" "}
                          bytes each
                        </span>
                      </div>

                      {/* Files inside group */}

                      <div className="sf-duplicate-files">

                        {group.files?.map(
                          (file) => {
                            const isSelected =
                              selectedFiles.includes(
                                file.path
                              );

                            return (
                              <div
                                className="sf-duplicate-file"
                                key={file.path}
                              >

                                <div className="sf-duplicate-file-select">

                                  <input
                                    type="checkbox"
                                    className="sf-duplicate-checkbox"
                                    checked={
                                      isSelected
                                    }
                                    disabled={
                                      cleanupLoading
                                    }
                                    onChange={(
                                      event
                                    ) => {
                                      if (
                                        event
                                          .target
                                          .checked
                                      ) {
                                        setSelectedFiles(
                                          (previous) => [
                                            ...previous,
                                            file.path,
                                          ]
                                        );
                                      } else {
                                        setSelectedFiles(
                                          (previous) =>
                                            previous.filter(
                                              (path) =>
                                                path !==
                                                file.path
                                            )
                                        );
                                      }
                                    }}
                                  />

                                  <div className="sf-duplicate-file-info">

                                    <FolderIcon
                                      className="sf-icon sf-icon--folder"
                                    />

                                    <div>
                                      <div className="sf-duplicate-file-name">
                                        {file.name}
                                      </div>

                                      <div className="sf-duplicate-file-path">
                                        {file.path}
                                      </div>
                                    </div>

                                  </div>
                                </div>

                                <div className="sf-duplicate-file-size">
                                  {file.size}{" "}
                                  bytes
                                </div>

                              </div>
                            );
                          }
                        )}

                      </div>
                    </div>
                  )
                )}

              </div>
            )}

            {/* ---------------- Cleanup actions ---------------- */}

            {cleanupMessage && (
              <div className="sf-cleanup-success">
                <strong>✓ Cleanup Complete</strong>
                <span>{cleanupMessage}</span>
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
                  onClick={async () => {
                    // Safety check: never allow every copy in a group to be deleted
                    for (const group of duplicateFiles) {
                    const selectedInGroup = group.files.filter(
                      (file) => selectedFiles.includes(file.path)
                    );

                    if (
                      selectedInGroup.length >= group.files.length
                    ) {
                      setError(
                        `Cannot delete all copies in Duplicate Group ${
                          duplicateFiles.indexOf(group) + 1
                        }. Please keep at least one copy.`
                      );

                      return;
                    }
                  }
                    const confirmed =
                      window.confirm(
                        `Are you sure you want to permanently delete ${selectedFiles.length} selected file${
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

                      console.log(
                        "Starting cleanup:",
                        selectedFiles
                      );

                      // Store total recovered storage
                      let totalRecovered = 0;

                      // Delete each selected file
                      for (const filePath of selectedFiles) {
                        const result =
                          await cleanupFile(
                            folderPath,
                            filePath
                          );

                        console.log(
                          "Cleanup result:",
                          result
                        );

                        totalRecovered +=
                          result.recovered_storage ||
                          0;
                      }

                      setRecoveredStorage(totalRecovered);

                      // Save total recovered storage

                      console.log(
                        "Total storage recovered:",
                        totalRecovered
                      );

                      // Show completion message
                      setCleanupMessage(
                      `Cleanup complete! ${
                        selectedFiles.length
                      } file${
                        selectedFiles.length !== 1
                          ? "s"
                          : ""
                      } deleted. Storage recovered: ${
                        totalRecovered
                      } bytes.`
                    );

                      // Clear selections
                      setSelectedFiles([]);

                      // Refresh scan data
                      const scan =
                        await scanFolder(
                          folderPath
                        );

                      // Refresh duplicate data
                      const duplicates =
                        await findDuplicates(
                          folderPath
                        );

                      // Refresh history
                      const history =
                        await getScanHistory();

                      // Update dashboard
                      setScanData(scan);

                      setDuplicateData(
                        duplicates
                      );

                      setHistoryData(
                        history
                      );

                    } catch (err) {
                      console.error(
                        "Cleanup error:",
                        err
                      );

                      setError(
                        err.response?.data
                          ?.detail ||
                          err.message ||
                          "Could not clean selected files."
                      );
                    } finally {
                      setCleanupLoading(false);
                    }
                  }}
                >
                  {cleanupLoading
                    ? "Cleaning..."
                    : "Clean Selected"}
                </button>

              </div>
            )}

            {/* Cleanup error */}

            {error && (
              <p className="sf-scan-error">
                {error}
              </p>
            )}

          </section>

        </main>
      </div>
    </div>
  );
}

/* ------------------------------ icons ------------------------------ */

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

/* ---------------- Grid Icon ---------------- */

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

/* ---------------- Scan Icon ---------------- */

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

/* ---------------- History Icon ---------------- */

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

/* ---------------- Files Icon ---------------- */

function FilesIcon(props) {
  return (
    <svg {...iconProps(props)}>
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />

      <path d="M14 3v5h5" />
    </svg>
  );
}

/* ---------------- Copy Icon ---------------- */

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

/* ---------------- Disk Icon ---------------- */

function DiskIcon(props) {
  return (
    <svg {...iconProps(props)}>
      <ellipse
        cx="12"
        cy="6"
        rx="8"
        ry="3"
      />

      <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />

      <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
    </svg>
  );
}

/* ---------------- Folder Icon ---------------- */

function FolderIcon(props) {
  return (
    <svg {...iconProps(props)}>
      <path d="M3 7a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Z" />
    </svg>
  );
}