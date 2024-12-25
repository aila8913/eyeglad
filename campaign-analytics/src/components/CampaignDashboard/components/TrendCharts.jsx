import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TrendCharts = ({ processedData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-lg shadow" style={{ height: '24rem' }}>
        <h3 className="text-lg font-bold mb-4">銷售趨勢</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" name="銷售額" stroke="#8884d8" />
            <Line type="monotone" dataKey="spend" name="廣告支出" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow" style={{ height: '24rem' }}>
        <h3 className="text-lg font-bold mb-4">ACOS 趨勢</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="ACOS" name="ACOS %" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendCharts;