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
  const [filterColumn, setFilterColumn] = useState("Targeting"); // 篩選條件的列
  // const [filterValue, setFilterValue] = useState(""); // 篩選值
  const [pointSizeColumn, setPointSizeColumn] = useState("Spend"); // 點大小的列
  const [startDate, setStartDate] = useState(""); // 開始日期
  const [endDate, setEndDate] = useState(""); // 結束日期

  useEffect(() => {
    fetchTables()
      .then((response) => {
        console.log("Fetched tables:", response.data);
        setTables(response.data);
        if (response.data.length > 0) {
          setSelectedTable(response.data[response.data.length - 1]);
        }
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
    let filteredData = data;

    if (startDate && endDate) {
      filteredData = filteredData.filter((row) => {
        const date = new Date(row.Date);
        return date >= new Date(startDate) && date <= new Date(endDate);
      });
    }

    const uniqueValues = [
      ...new Set(filteredData.map((row) => row[filterColumn])),
    ];
    const colorMap = {};
    const colors = [
      "rgba(255, 99, 132, 0.6)",
      "rgba(54, 162, 235, 0.6)",
      "rgba(255, 206, 86, 0.6)",
      "rgba(75, 192, 192, 0.6)",
      "rgba(153, 102, 255, 0.6)",
      "rgba(255, 159, 64, 0.6)",
    ];

    uniqueValues.forEach((value, index) => {
      colorMap[value] = colors[index % colors.length];
    });

    const backgroundColors = filteredData.map(
      (row) => colorMap[row[filterColumn]] || "rgba(75, 192, 192, 0.6)"
    );
    const pointSizes = pointSizeColumn
      ? filteredData.map((row) => row[pointSizeColumn] || 5)
      : filteredData.map(() => 5);

    if (xAxis && yAxis && filteredData.length > 0) {
      const chartData = {
        labels: filteredData.map((row) => row[xAxis]),
        datasets: [
          {
            label: yAxis,
            data: filteredData.map((row) => ({
              x: row[xAxis],
              y: row[yAxis],
              ...row,
            })),
            backgroundColor: backgroundColors,
            borderWidth: 0,
            pointRadius: pointSizes,
            pointHoverRadius: 7,
            barThickness: 30,
            maxBarThickness: 30,
          },
        ],
      };
      console.log("Chart data:", chartData);
      setChartData(chartData);
    }
  }, [xAxis, yAxis, data, filterColumn, pointSizeColumn, startDate, endDate]);

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
      <Dropdown
        id="filter-column-select"
        label="篩選條件"
        options={
          columns.length > 0
            ? columns.map((col) => ({ label: col, value: col }))
            : [{ label: "Loading...", value: "" }]
        }
        value={filterColumn}
        onChange={setFilterColumn}
      />
      <Dropdown
        id="point-size-column-select"
        label="選擇點大小列"
        options={
          columns.length > 0
            ? columns.map((col) => ({ label: col, value: col }))
            : [{ label: "Loading...", value: "" }]
        }
        value={pointSizeColumn}
        onChange={setPointSizeColumn}
      />
      <div className="form-group mb-2">
        <label>選擇時間範圍</label>
        <div className="d-flex">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="form-control"
          />
          <span className="mx-2">→</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="form-control"
          />
        </div>
      </div>
    </>
  );

  const renderChart = () => {
    if (data.length > 0 && xAxis && yAxis) {
      return (
        <ChartComponent
          data={chartData}
          options={{ responsive: true }}
          type="bar"
          xAxis={xAxis}
          filterColumn={filterColumn}
          pointSizeColumn={pointSizeColumn}
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
