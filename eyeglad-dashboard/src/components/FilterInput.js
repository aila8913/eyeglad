import React from "react";
import PropTypes from "prop-types";

const FilterInput = ({ filterValue, setFilterValue }) => (
  <div className="form-group mb-2">
    <label htmlFor="filter-value-input">篩選條件</label>
    <input
      type="text"
      id="filter-value-input"
      value={filterValue}
      onChange={(e) => setFilterValue(e.target.value)}
      className="form-control"
      placeholder="例如: >0, <0.2, 0.1-0.5"
    />
  </div>
);

FilterInput.propTypes = {
  filterValue: PropTypes.string.isRequired,
  setFilterValue: PropTypes.func.isRequired,
};

export default FilterInput;
