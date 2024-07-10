import axios from "axios";

const API_URL = "http://localhost:5000/api"; // 修改為你的後端API URL

export const fetchTables = () => {
  return axios.get(`${API_URL}/tables`);
};

export const fetchTableData = (tableName) => {
  return axios.get(`${API_URL}/table/${tableName}`);
};
