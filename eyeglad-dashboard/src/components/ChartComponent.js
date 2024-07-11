import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Chart from "chart.js/auto";

const ChartComponent = ({
  data,
  options,
  type,
  xAxis,
  filterColumn,
  pointSizeColumn,
}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = new Chart(chartRef.current, {
        type: type,
        data: data,
        options: {
          ...options,
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  const raw = context.raw;

                  const yValue =
                    raw.y !== undefined
                      ? `Y軸 (${context.dataset.label}): ${raw.y}`
                      : "";
                  const xValue =
                    raw[xAxis] !== undefined
                      ? `X軸 (${xAxis}): ${raw[xAxis]}`
                      : "";
                  const filterValue =
                    filterColumn && raw[filterColumn] !== undefined
                      ? `篩選條件 (${filterColumn}): ${raw[filterColumn]}`
                      : "";
                  const pointSizeValue =
                    pointSizeColumn && raw[pointSizeColumn] !== undefined
                      ? `點大小 (${pointSizeColumn}): ${raw[pointSizeColumn]}`
                      : "";

                  return [yValue, xValue, filterValue, pointSizeValue]
                    .filter(Boolean)
                    .join("\n");
                },
              },
            },
          },
        },
      });

      return () => {
        chartInstance.destroy();
      };
    }
  }, [data, options, type, xAxis, filterColumn, pointSizeColumn]);

  return <canvas ref={chartRef}></canvas>;
};

ChartComponent.propTypes = {
  data: PropTypes.object.isRequired,
  options: PropTypes.object,
  type: PropTypes.string.isRequired,
  xAxis: PropTypes.string.isRequired,
  filterColumn: PropTypes.string,
  pointSizeColumn: PropTypes.string,
};

export default ChartComponent;
