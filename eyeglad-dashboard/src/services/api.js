// src/services/api.js
import axios from "axios";

const API_URL = "http://127.0.0.1:5000";

export const fetchTables = async () => {
  try {
    const response = await axios.get(`${API_URL}/tables`);
    console.log("fetchTables response:", response.data); // 添加日誌
    return response.data;
  } catch (error) {
    console.error("Error fetching tables:", error);
    throw error;
  }
};

export const fetchTableData = async (tableName) => {
  try {
    const response = await axios.get(`${API_URL}/tables/${tableName}`);
    console.log("fetchTableData response:", response.data); // 添加日誌
    return response.data;
  } catch (error) {
    console.error("Error fetching table data:", error);
    throw error;
  }
};
