// src/components/common/MetricCard.jsx
import React from 'react';

const MetricCard = ({ title, value, trend }) => {
  return (
    <div className="p-4 border rounded-lg shadow">
      <div className="text-lg font-bold">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
};

export default MetricCard;