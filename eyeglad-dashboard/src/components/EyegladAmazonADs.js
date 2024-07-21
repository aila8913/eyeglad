import React, { useState, useEffect } from "react";
import { fetchTables, fetchTableData } from "../services/api";
import Dropdown from "./Dropdown";
import ChartComponent from "./ChartComponent";
import DataTable from "./DataTable";

const EyegladAmazonADs = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [xAxis, setXAxis] = useState("Date");
  const [yAxis, setYAxis] = useState("TACoS");
  const [filterColumn, setFilterColumn] = useState("Targeting");
  const [pointSizeColumn, setPointSizeColumn] = useState("Spend");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchTables()
      .then((response) => {
        console.log("Tables fetched:", response);
        const tableData = Array.isArray(response) ? response : [];
        const adTables = tableData.filter(
          (table) => !table.includes("AmazonSales")
        );
        setTables(adTables);
        console.log("Filtered AD Tables:", adTables);
        if (adTables.length > 0) {
          setSelectedTable(adTables[0]);
        }
      })
      .catch((error) => console.error("Error fetching tables:", error));
  }, []);

  useEffect(() => {
    if (selectedTable) {
      fetchTableData(selectedTable)
        .then((responseData) => {
          console.log("Table data fetched:", responseData); // 添加日誌
          const columnData = Array.isArray(responseData.columns)
            ? responseData.columns
            : [];
          const tableData = Array.isArray(responseData.data)
            ? responseData.data
            : [];
          setColumns(columnData);
          setData(tableData);
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
        },
      ],
    };
    setChartData(chartData);
  }, [data, xAxis, yAxis, startDate, endDate]);

  return (
    <div>
      <h2>Eyeglad Amazon ADs</h2>
      <Dropdown
        id="table-select"
        label="選擇表格"
        options={tables.map((table) => ({ label: table, value: table })) || []}
        value={selectedTable}
        onChange={setSelectedTable}
      />
      {console.log(
        "Dropdown options:",
        tables.map((table) => ({ label: table, value: table })) || []
      )}
      <Dropdown
        id="x-axis-select"
        label="選擇X軸"
        options={columns.map((col) => ({ label: col, value: col })) || []}
        value={xAxis}
        onChange={setXAxis}
      />
      <Dropdown
        id="y-axis-select"
        label="選擇Y軸"
        options={columns.map((col) => ({ label: col, value: col })) || []}
        value={yAxis}
        onChange={setYAxis}
      />
      <Dropdown
        id="filter-column-select"
        label="篩選條件"
        options={columns.map((col) => ({ label: col, value: col })) || []}
        value={filterColumn}
        onChange={setFilterColumn}
      />
      <Dropdown
        id="point-size-column-select"
        label="選擇點大小列"
        options={columns.map((col) => ({ label: col, value: col })) || []}
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
      <ChartComponent data={chartData} type="line" xAxis={xAxis} />
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default EyegladAmazonADs;
