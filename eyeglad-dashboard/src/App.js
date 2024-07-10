import React, { useState, useEffect } from "react";
import { fetchTables, fetchTableData } from "./services/api";
import Dropdown from "./components/Dropdown";
import ChartComponent from "./components/Chart";
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
    fetchTables().then((response) => {
      setTables(response.data);
      setSelectedTable(response.data[0]);
    });
  }, []);

  useEffect(() => {
    if (selectedTable) {
      fetchTableData(selectedTable).then((response) => {
        setColumns(response.data.columns);
        setData(response.data.data);
      });
    }
  }, [selectedTable]);

  useEffect(() => {
    if (xAxis && yAxis) {
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

  return (
    <div className="container">
      <h1 className="mb-4">EYEGLAD AmazonADs</h1>
      <Dropdown
        label="選擇表格"
        options={tables.map((table) => ({ label: table, value: table }))}
        value={selectedTable}
        onChange={setSelectedTable}
      />
      <Dropdown
        label="選擇X軸"
        options={columns.map((col) => ({ label: col, value: col }))}
        value={xAxis}
        onChange={setXAxis}
      />
      <Dropdown
        label="選擇Y軸"
        options={columns.map((col) => ({ label: col, value: col }))}
        value={yAxis}
        onChange={setYAxis}
      />
      <ChartComponent
        data={chartData}
        options={{ responsive: true }}
        type="bar"
      />
      <h2 className="mt-4">數據表</h2>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default App;
