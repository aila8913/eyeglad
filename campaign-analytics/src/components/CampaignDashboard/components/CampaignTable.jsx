import React, { useMemo } from 'react';

const CampaignTable = ({ campaignData, handleSort, sortConfig }) => {
  // 1. 首先放置 formatValue 這個輔助函數
  const formatValue = (value, type) => {
    if (value === null) return '-';
    if (type === 'money') return `$${parseFloat(value).toFixed(2)}`;
    if (type === 'percent') return `${value}%`;
    if (type === 'number') return parseInt(value).toLocaleString();
    return value;
  };
  // 2. 接著放置 useMemo hook
  const sortedData = useMemo(() => {
    if (!Array.isArray(campaignData)) {
      return [];
    }

    return [...campaignData].sort((a, b) => {
      const aValue = parseFloat(a[sortConfig.key]) || 0;
      const bValue = parseFloat(b[sortConfig.key]) || 0;
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [campaignData, sortConfig]);
  
  // 3. 定義表格欄位
  const tableColumns = [
    { key: 'name', label: '活動名稱', align: 'left' },
    { key: 'impressions', label: '曝光次數', type: 'number' },
    { key: 'clicks', label: '點擊次數', type: 'number' },
    { key: 'CTR', label: 'CTR', type: 'percent' },
    { key: 'CPC', label: 'CPC', type: 'money' },
    { key: 'orders', label: '訂單數', type: 'number' },
    { key: 'spend', label: '花費', type: 'money' },
    { key: 'sales', label: '銷售額', type: 'money' },
    { key: 'ACOS', label: 'ACOS', type: 'percent' },
    { key: 'ROAS', label: 'ROAS', type: 'number', unit: 'x' },
    { key: 'conversionRate', label: '轉換率', type: 'percent' }
  ];

  // 4. 資料檢查放在渲染邏輯前
  if (!Array.isArray(campaignData)) {
    console.error('campaignData is not an array:', campaignData);
    return <div>資料格式錯誤</div>;
  }

  // 5. 返回主要的渲染內容
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold">廣告活動詳細比較</h2>
      </div>
      <div className="p-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              {tableColumns.map((col) => (
                <th 
                  key={col.key} 
                  className={`py-2 px-3 text-${col.align || 'right'} ${col.key !== 'name' ? 'cursor-pointer' : ''}`}
                  onClick={() => col.key !== 'name' && handleSort(col.key)}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((campaign, index) => (
              <tr key={campaign.name} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                {tableColumns.map((col) => (
                  <td 
                    key={col.key} 
                    className={`py-2 px-3 text-${col.align || 'right'}`}
                  >
                    {formatValue(campaign[col.key], col.type)}
                    {col.unit || ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
};

export default CampaignTable;