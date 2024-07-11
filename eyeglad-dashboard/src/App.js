import React, { useState, useEffect } from "react";
import { fetchTables, fetchTableData } from "./services/api";
import Dropdown from "./components/Dropdown";
import ChartComponent from "./components/ChartComponent";
import DataTable from "./components/DataTable";

const App = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");

  useEffect(() => {
    fetchTables()
      .then((response) => {
        setTables(response.data);
        setSelectedTable(response.data[0]);
        console.log("Fetched tables:", response.data);
      })
      .catch((error) => console.error("Error fetching tables:", error));
  }, []);

  useEffect(() => {
    if (selectedTable) {
      console.log(`Fetching data for table: ${selectedTable}`);
      fetchTableData(selectedTable)
        .then((responseData) => {
          if (responseData) {
            console.log("Table data response:", responseData);

            // 確認 responseData 的結構
            console.log(
              "Response data structure:",
              JSON.stringify(responseData, null, 2)
            );
            console.log("Columns: ", responseData.columns);
            console.log("Data: ", responseData.data);

            // 檢查 responseData.columns 和 responseData.data 是否為數組
            if (
              Array.isArray(responseData.columns) &&
              Array.isArray(responseData.data)
            ) {
              setColumns(responseData.columns);
              setData(responseData.data);
              console.log("Columns set:", responseData.columns);
              console.log("Data set:", responseData.data);
            } else {
              console.error("Invalid data structure");
            }
          } else {
            console.error("No data returned from API");
          }
        })
        .catch((error) => console.error("Error fetching table data:", error));
    }
  }, [selectedTable]);

  useEffect(() => {
    if (xAxis && yAxis && data.length > 0) {
      const chartData = {
        labels: data.map((row) => row[xAxis]),
        datasets: [
          {
            label: yAxis,
            data: data.map((row) => row[yAxis]),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      };
      setChartData(chartData);
    }
  }, [xAxis, yAxis, data]);

  if (tables.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="mb-4">EYEGLAD AmazonADs</h1>
      <Dropdown
        id="table-select"
        label="選擇表格"
        options={tables.map((table) => ({ label: table, value: table }))}
        value={selectedTable}
        onChange={setSelectedTable}
      />
      <Dropdown
        id="x-axis-select"
        label="選擇X軸"
        options={
          columns.length > 0
            ? columns.map((col) => ({ label: col, value: col }))
            : [{ label: "Loading...", value: "" }]
        }
        value={xAxis}
        onChange={setXAxis}
      />
      <Dropdown
        id="y-axis-select"
        label="選擇Y軸"
        options={
          columns.length > 0
            ? columns.map((col) => ({ label: col, value: col }))
            : [{ label: "Loading...", value: "" }]
        }
        value={yAxis}
        onChange={setYAxis}
      />
      {data.length > 0 ? (
        <ChartComponent
          data={chartData}
          options={{ responsive: true }}
          type="bar"
        />
      ) : (
        <div>Loading chart data...</div>
      )}
      {/* 添加loading狀態 */}
      <h2 className="mt-4">數據表</h2>
      {columns.length > 0 && data.length > 0 ? (
        <DataTable columns={columns} data={data} />
      ) : (
        <div>Loading table data...</div>
      )}
    </div>
  );
};

export default App;
