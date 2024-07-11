import React from "react";

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
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default Dropdown;
