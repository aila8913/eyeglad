import React from "react";
import PropTypes from "prop-types";
import DataTable from "./DataTable";

const DataTableWrapper = ({ columns, data, onFilterChange }) => {
  return (
    <DataTable columns={columns} data={data} onFilterChange={onFilterChange} />
  );
};

DataTableWrapper.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default DataTableWrapper;
