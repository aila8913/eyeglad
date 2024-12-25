import React, { useState, useEffect, useMemo } from "react";
import { fetchTables, fetchTableData } from "../services/api";
import Dropdown from "./Dropdown";
import DateRangeFilter from "./DateRangeFilter";
import FilterInput from "./FilterInput";
import ChartWrapper from "./ChartWrapper";
import DataTable from "./DataTable";
import "../css/DataTable.css"; // 導入 CSS 文件

const DefaultColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
}) => {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`篩選... (${count})`}
    />
  );
};

const EyegladAmazonADs = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [xAxis, setXAxis] = useState("Targeting");
  const [yAxis, setYAxis] = useState("TACoS");
  const [filterColumn, setFilterColumn] = useState("TACoS");
  const [filterValue, setFilterValue] = useState("");
  const [filterValues, setFilterValues] = useState({});
  const [pointSizeColumn, setPointSizeColumn] = useState("Spend");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchTables()
      .then((response) => {
        const tableData = Array.isArray(response) ? response : [];
        const adTables = tableData.filter(
          (table) => !table.includes("AmazonSales")
        );
        setTables(adTables);
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
          const columnData = Array.isArray(responseData.columns)
            ? responseData.columns.map((col) => ({
                Header: col,
                accessor: col,
              }))
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

  const handleFilterChange = (column, value) => {
    setFilterValues((prev) => ({ ...prev, [column]: value }));
  };

  useEffect(() => {
    let filteredData = data;

    // 應用日期篩選
    if (startDate && endDate) {
      filteredData = filteredData.filter((row) => {
        const date = new Date(row.Date);
        return date >= new Date(startDate) && date <= new Date(endDate);
      });
    }

    // 應用列篩選
    Object.keys(filterValues).forEach((column) => {
      const filterValue = filterValues[column];
      if (filterValue) {
        filteredData = filteredData.filter((row) => {
          const value = row[column];
          if (typeof value === "string") {
            return value.includes(filterValue);
          } else if (typeof value === "number") {
            if (filterValue.startsWith(">")) {
              const minValue = parseFloat(filterValue.slice(1));
              return value > minValue;
            } else if (filterValue.startsWith("<")) {
              const maxValue = parseFloat(filterValue.slice(1));
              return value < maxValue;
            } else if (filterValue.includes("-")) {
              const [min, max] = filterValue.split("-").map(parseFloat);
              return value > min && value < max;
            }
          }
          return true;
        });
      }
    });

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
    setData(filteredData); // 更新篩選後的數據
  }, [data, xAxis, yAxis, startDate, endDate, filterValues]);

  const columnsForTable = useMemo(
    () =>
      columns.map((col) => ({
        Header: col.Header,
        accessor: col.accessor,
        Filter: DefaultColumnFilter,
        filter: "text",
      })),
    [columns]
  );

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
      <Dropdown
        id="x-axis-select"
        label="選擇X軸"
        options={
          columns.map((col) => ({ label: col.Header, value: col.accessor })) ||
          []
        }
        value={xAxis}
        onChange={setXAxis}
      />
      <Dropdown
        id="y-axis-select"
        label="選擇Y軸"
        options={
          columns.map((col) => ({ label: col.Header, value: col.accessor })) ||
          []
        }
        value={yAxis}
        onChange={setYAxis}
      />
      <Dropdown
        id="filter-column-select"
        label="篩選列"
        options={
          columns.map((col) => ({ label: col.Header, value: col.accessor })) ||
          []
        }
        value={filterColumn}
        onChange={setFilterColumn}
      />
      <FilterInput filterValue={filterValue} setFilterValue={setFilterValue} />
      <Dropdown
        id="point-size-column-select"
        label="選擇點大小列"
        options={
          columns.map((col) => ({ label: col.Header, value: col.accessor })) ||
          []
        }
        value={pointSizeColumn}
        onChange={setPointSizeColumn}
      />
      <DateRangeFilter
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />
      <ChartWrapper data={chartData} type="line" xAxis={xAxis} />
      <DataTable
        columns={columnsForTable}
        data={data}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default EyegladAmazonADs;
