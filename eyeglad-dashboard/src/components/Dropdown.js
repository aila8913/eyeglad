import React from "react";
import PropTypes from "prop-types";

const Dropdown = ({ id, label, options, value, onChange }) => (
  <div className="mb-2">
    <label htmlFor={id}>{label}</label>
    <select
      id={id}
      name={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="form-control"
    >
      {options.length > 0 ? (
        options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))
      ) : (
        <option value="" disabled>
          無可選擇的項目
        </option>
      )}
    </select>
  </div>
);

Dropdown.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Dropdown;
