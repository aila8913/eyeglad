import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Chart } from "chart.js/auto";

const ChartComponent = ({ data, options, type }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = new Chart(chartRef.current, {
        type: type,
        data: data,
        options: {
          ...options,
          elements: {
            bar: {
              barThickness: 7, // 固定條形寬度
            },
            line: {
              borderWidth: 0,
            },
            point: {
              radius: 5,
              hoverRadius: 7,
            },
          },
        },
      });

      return () => {
        chart.destroy();
      };
    }
  }, [data, options, type]);

  return <canvas ref={chartRef}></canvas>;
};

ChartComponent.propTypes = {
  data: PropTypes.object.isRequired,
  options: PropTypes.object,
  type: PropTypes.string.isRequired,
};

export default ChartComponent;
