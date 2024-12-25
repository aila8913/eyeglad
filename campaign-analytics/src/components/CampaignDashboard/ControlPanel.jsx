import React from 'react';

const ControlPanel = ({ 
  timeGranularity, 
  setTimeGranularity, 
  compareMode, 
  setCompareMode 
}) => {
  return (
    <div className="flex gap-4 mb-4">
      <select 
        className="p-2 border rounded"
        value={timeGranularity}
        onChange={(e) => setTimeGranularity(e.target.value)}
      >
        <option value="day">每日</option>
        <option value="week">每週</option>
        <option value="month">每月</option>
      </select>
      
      <select
        className="p-2 border rounded"
        value={compareMode}
        onChange={(e) => setCompareMode(e.target.value)}
      >
        <option value="combined">合併數據</option>
        <option value="separate">分開比較</option>
      </select>
    </div>
  );
};

export default ControlPanel;