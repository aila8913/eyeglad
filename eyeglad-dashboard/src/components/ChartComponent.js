import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const ChartComponent = ({ data, options, type }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = new Chart(chartRef.current, {
        type: type,
        data: data,
        options: options,
      });

      return () => {
        chart.destroy();
      };
    }
  }, [data, options, type]); // 確保所有依賴項都包含在依賴數組中

  return <canvas ref={chartRef}></canvas>;
};

export default ChartComponent;
