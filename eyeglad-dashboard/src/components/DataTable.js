import React, { useState, useEffect } from "react";
import { useTable, useExpanded, useFilters, useSortBy } from "react-table";
import PropTypes from "prop-types";
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

const DataTable = ({ columns, data, onFilterChange }) => {
  const [columnWidths, setColumnWidths] = useState({});

  useEffect(() => {
    const initialWidths = {};
    columns.forEach((column) => {
      initialWidths[column.accessor] = 150; // 設置每列的初始寬度
    });
    setColumnWidths(initialWidths);
  }, [columns]);

  const handleMouseDown = (e, accessor) => {
    e.preventDefault();
    document.addEventListener("mousemove", (event) =>
      handleMouseMove(event, accessor)
    );
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e, accessor) => {
    setColumnWidths((prevWidths) => ({
      ...prevWidths,
      [accessor]: Math.max(
        e.clientX - e.target.getBoundingClientRect().left,
        50
      ), // 設置最小寬度
    }));
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const defaultColumn = {
    Filter: DefaultColumnFilter,
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useFilters, // 使用篩選功能
    useSortBy, // 使用排序功能
    useExpanded, // 使用行擴展功能
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "expander", // 注意這裡需要一個唯一的 id
          Header: ({ getToggleAllRowsExpandedProps }) => (
            <span {...getToggleAllRowsExpandedProps()}>Expand</span>
          ),
          Cell: ({ row }) => (
            <span {...row.getToggleRowExpandedProps()} role="button">
              {row.isExpanded ? "👇" : "👉"}
            </span>
          ),
        },
        ...columns,
      ]);
    }
  );

  return (
    <table {...getTableProps()} className="table">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                style={{
                  position: "relative",
                  width: `${columnWidths[column.accessor]}px`,
                }}
              >
                {column.render("Header")}
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: "5px",
                    cursor: "col-resize",
                  }}
                  onMouseDown={(e) => handleMouseDown(e, column.accessor)}
                />
                <div>{column.canFilter ? column.render("Filter") : null}</div>
                <span>
                  {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <React.Fragment key={row.id}>
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      width: `${columnWidths[cell.column.id]}px`,
                    }}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
              {row.isExpanded ? (
                <tr className="expanded-row">
                  <td colSpan={columns.length}>
                    {/* 渲染擴展內容 */}
                    <ExpandedRowContent row={row.original} columns={columns} />
                  </td>
                </tr>
              ) : null}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

const ExpandedRowContent = ({ row, columns }) => {
  // Get the list of all columns that are not in the main display
  const extraColumns = columns.filter(
    (col) =>
      ![
        "Date",
        "Campaign_Name",
        "Ad_Group_Name",
        "Targeting",
        "Total_Advertising_Cost_of_Sales_ACOS",
        "TACoS",
      ].includes(col.accessor)
  );

  return (
    <div>
      <p>
        <strong>Additional Information:</strong>
      </p>
      {extraColumns.map((col) => (
        <p key={col.accessor}>
          {col.Header}: {row[col.accessor]}
        </p>
      ))}
    </div>
  );
};

ExpandedRowContent.propTypes = {
  row: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onFilterChange: PropTypes.func,
};

export default DataTable;
