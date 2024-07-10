import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const ChartComponent = ({ data, options, type }) => {
  const chartContainer = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    chartInstance.current = new Chart(chartContainer.current, {
      type,
      data,
      options,
    });
  }, [data, options]);

  return <canvas ref={chartContainer} />;
};

export default ChartComponent;
