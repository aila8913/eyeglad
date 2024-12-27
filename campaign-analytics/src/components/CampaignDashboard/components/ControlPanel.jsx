// ControlPanel.jsx
import React from 'react';

const ControlPanel = ({ 
  timeGranularity, 
  setTimeGranularity, 
  compareMode, 
  setCompareMode,
  campaigns = [], // 所有可用的廣告活動
  selectedCampaigns = [], // 已選擇的廣告活動
  setSelectedCampaigns, // 設置選擇的廣告活動
  dateRange,
  setDateRange
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 日期範圍選擇 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            日期範圍
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({
                ...prev,
                startDate: e.target.value
              }))}
            />
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({
                ...prev,
                endDate: e.target.value
              }))}
            />
          </div>
        </div>
        {/* 時間粒度選擇 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            時間粒度
          </label>
          <select 
            className="w-full p-2 border rounded"
            value={timeGranularity}
            onChange={(e) => setTimeGranularity(e.target.value)}
          >
            <option value="hour">每小時</option>
            <option value="day">每日</option>
            <option value="week">每週</option>
            <option value="month">每月</option>
          </select>
        </div>
        
        {/* 比較模式選擇 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            比較模式
          </label>
          <select
            className="w-full p-2 border rounded"
            value={compareMode}
            onChange={(e) => setCompareMode(e.target.value)}
          >
            <option value="combined">合併數據</option>
            <option value="separate">分開比較</option>
          </select>
        </div>

        {/* 廣告活動選擇 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            廣告活動選擇
          </label>
          <div className="max-h-40 overflow-y-auto border rounded p-2">
            {campaigns.map((campaign) => (
              <div key={campaign} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  id={campaign}
                  checked={selectedCampaigns.includes(campaign)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCampaigns([...selectedCampaigns, campaign]);
                    } else {
                      setSelectedCampaigns(
                        selectedCampaigns.filter(c => c !== campaign)
                      );
                    }
                  }}
                  className="mr-2"
                />
                <label htmlFor={campaign} className="text-sm">
                  {campaign}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;