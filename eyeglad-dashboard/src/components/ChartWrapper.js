import React from "react";
import PropTypes from "prop-types";
import ChartComponent from "./ChartComponent";

const ChartWrapper = ({ data, type, xAxis }) => {
  return <ChartComponent data={data} type={type} xAxis={xAxis} />;
};

ChartWrapper.propTypes = {
  data: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  xAxis: PropTypes.string.isRequired,
};

export default ChartWrapper;
