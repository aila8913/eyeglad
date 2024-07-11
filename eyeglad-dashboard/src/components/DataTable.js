import React from "react";
import PropTypes from "prop-types";

const DataTable = ({ columns, data }) => (
  <table className="table">
    <thead>
      <tr>
        {columns.map((col) => (
          <th key={col}>{col}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.length > 0 ? (
        data.map((row, index) => (
          <tr key={index}>
            {columns.map((col) => (
              <td key={col}>{row[col]}</td>
            ))}
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={columns.length} className="text-center">
            無數據
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

DataTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default DataTable;
