import axios from "axios";

// FastAPI backend URL
const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Scan a folder
export const scanFolder = async (folderPath) => {
  const response = await API.get("/scan", {
    params: {
      folder_path: folderPath,
    },
  });

  return response.data;
};

// Find duplicate files
export const findDuplicates = async (folderPath) => {
  const response = await API.get("/duplicates", {
    params: {
      folder_path: folderPath,
    },
  });

  return response.data;
};

// Get scan history
export const getScanHistory = async () => {
  const response = await API.get("/history");
  return response.data;
};

// Delete a selected duplicate file
export const cleanupFile = async (folderPath, filePath) => {
  const response = await API.delete("/cleanup", {
    params: {
      folder_path: folderPath,
      file_path: filePath,
    },
  });

  return response.data;
};