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
  const [xAxis, setXAxis] = useState("Date");
  const [yAxis, setYAxis] = useState("TACoS");

  useEffect(() => {
    fetchTables()
      .then((response) => {
        console.log("Fetched tables:", response.data);
        setTables(response.data);
        setSelectedTable(response.data[response.data.length - 1]);
      })
      .catch((error) => console.error("Error fetching tables:", error));
  }, []);

  useEffect(() => {
    if (selectedTable) {
      fetchTableData(selectedTable)
        .then((responseData) => {
          if (responseData) {
            console.log("Fetched table data:", responseData);
            if (
              Array.isArray(responseData.columns) &&
              Array.isArray(responseData.data)
            ) {
              setColumns(responseData.columns);
              const sanitizedData = responseData.data.map((row) => {
                const sanitizedRow = {};
                for (const key in row) {
                  sanitizedRow[key] =
                    typeof row[key] === "number" && isNaN(row[key])
                      ? 0
                      : row[key];
                }
                return sanitizedRow;
              });
              console.log("Sanitized data:", sanitizedData);
              setData(sanitizedData);
            } else {
              console.error("Invalid data structure:", responseData);
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
            borderWidth: 0,
            pointRadius: 5,
            pointHoverRadius: 7,
            barThickness: 5, // 固定條形寬度
            barHoverRadius: 10,
          },
        ],
      };
      console.log("Chart data:", chartData);
      setChartData(chartData);
    }
  }, [xAxis, yAxis, data]);

  if (tables.length === 0) {
    return <div>Loading...</div>;
  }

  const renderDropdowns = () => (
    <>
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
    </>
  );

  const renderChart = () => {
    if (data.length > 0) {
      return (
        <ChartComponent
          data={chartData}
          options={{ responsive: true }}
          type="bar"
        />
      );
    } else {
      return <div>Loading chart data...</div>;
    }
  };

  const renderDataTable = () => {
    if (columns.length > 0 && data.length > 0) {
      return <DataTable columns={columns} data={data} />;
    } else {
      return <div>Loading table data...</div>;
    }
  };

  return (
    <div className="container">
      <h1 className="mb-4">EYEGLAD AmazonADs</h1>
      {renderDropdowns()}
      {renderChart()}
      <h2 className="mt-4">數據表</h2>
      {renderDataTable()}
    </div>
  );
};

export default App;
