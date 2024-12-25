import React from "react";
import PropTypes from "prop-types";

const DateRangeFilter = ({ startDate, setStartDate, endDate, setEndDate }) => (
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
);

DateRangeFilter.propTypes = {
  startDate: PropTypes.string.isRequired,
  setStartDate: PropTypes.func.isRequired,
  endDate: PropTypes.string.isRequired,
  setEndDate: PropTypes.func.isRequired,
};

export default DateRangeFilter;
