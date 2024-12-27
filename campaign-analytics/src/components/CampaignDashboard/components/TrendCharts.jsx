import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TrendCharts = ({ processedData = [], compareMode, timeGranularity }) => {
  if (!processedData || !Array.isArray(processedData)) {
    return <div>No trend data available</div>;
  }

  const formatXAxis = (dateTime) => {
    if (!dateTime) return '';

    if (timeGranularity === 'hour') {
      const parts = dateTime.split(' ');
      if (parts.length < 2) return dateTime; // 如果無法分割，返回原始值
      const time = parts[1];
      return time ? time.substring(0, 5) : parts[0];
    }
    return dateTime;
  };

  // 添加 console.log 來調試數據
  console.log('First data point:', processedData.slice(0, 10));

  // 計算 ACOS 最大值
  const maxACOS = Math.max(...processedData
    .filter(d => d.ACOS !== null)
    .map(d => parseFloat(d.ACOS) || 0));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 銷售趨勢圖表 */}
      <div className="bg-white p-4 rounded-lg shadow" style={{ height: '24rem' }}>
        <h3 className="text-lg font-bold mb-4">銷售趨勢</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date"
              tickFormatter={formatXAxis}
              interval="preserveStartEnd"
            />
            <YAxis />
            <Tooltip
              labelFormatter={(label) => formatXAxis(label)}
              formatter={(value) => [`$${parseFloat(value).toFixed(2)}`, '']}
            />
            <Legend />
            {compareMode === "separate" ? (
              Object.keys(processedData[0]?.campaignData || {}).map((campaign) => (
                <Line
                  key={campaign}
                  type="monotone"
                  dataKey={`campaignData.${campaign}.sales`}
                  name={`${campaign} 銷售額`}
                  stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`}
                  dot={false}
                  strokeWidth={2}
                />
              ))
            ) : (
              <>
                <Line
                  type="monotone"
                  dataKey="sales"
                  name="銷售額"
                  stroke="#8884d8"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="spend"
                  name="廣告支出"
                  stroke="#82ca9d"
                  dot={false}
                  strokeWidth={2}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ACOS 趨勢圖表 */}
      <div className="bg-white p-4 rounded-lg shadow" style={{ height: '24rem' }}>
        <h3 className="text-lg font-bold mb-4">ACOS 趨勢</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date"
              tickFormatter={formatXAxis}
              interval="preserveStartEnd"
            />
            <YAxis 
              domain={[0, Math.ceil(maxACOS / 100) * 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              labelFormatter={(label) => formatXAxis(label)}
              formatter={(value) => [`${parseFloat(value).toFixed(2)}%`, 'ACOS']}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="ACOS"
              name="ACOS"
              stroke="#82ca9d"
              dot={false}
              strokeWidth={2}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendCharts;