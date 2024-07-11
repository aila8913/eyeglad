import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api"; // 更新為 Flask 後端服務的地址

export const fetchTables = () => {
  return axios.get(`${API_URL}/tables`);
};

export const fetchTableData = (tableName) => {
  return axios
    .get(`${API_URL}/table/${tableName}`)
    .then((response) => {
      console.log("API response:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching table data:", error);
      throw error;
    });
};
