// src/components/DataChart.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { fetchTables, fetchTableData } from "../services/api";

const DataChart = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    // 使用fetchTables和fetchTableData從API獲取數據
    fetchTables().then((response) => {
      const tableName = response.data[0]; // 假設我們只關心第一個表格
      fetchTableData(tableName).then((data) => {
        const labels = data.map((row) => row.Date);
        const sales = data.map((row) => row.Sales);
        const price = data.map((row) => row.Price);

        setChartData({
          labels,
          datasets: [
            {
              label: "Sales",
              data: sales,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
            {
              label: "Price",
              data: price,
              backgroundColor: "rgba(153, 102, 255, 0.6)",
            },
          ],
        });
      });
    });
  }, []);

  return (
    <div>
      <h2>Amazon Marketing</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default DataChart;
