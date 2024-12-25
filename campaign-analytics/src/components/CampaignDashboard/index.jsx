import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import _ from 'lodash';

// 導入子組件
import BestPerformersCard from './BestPerformersCard';
import CampaignTable from './CampaignTable';
import TrendCharts from './TrendCharts';
import ControlPanel from './ControlPanel';

const CampaignComparison = () => {
  const [campaignData, setCampaignData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'ROAS', direction: 'desc' });
  const [bestPerformers, setBestPerformers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeGranularity, setTimeGranularity] = useState('day');
  const [processedData, setProcessedData] = useState([]);
  const [compareMode, setCompareMode] = useState('combined');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const filesResponse = await fetch('http://localhost:5000/api/files');
        if (!filesResponse.ok) {
          throw new Error(`HTTP error! status: ${filesResponse.status}`);
        }
        const files = await filesResponse.json();

        const allData = await Promise.all(
          files.map(async (file) => {
            const response = await fetch(`http://localhost:5000/api/data/${file}`);
            if (!response.ok) {
              throw new Error(`Failed to fetch ${file}`);
            }
            const text = await response.text();
            return Papa.parse(text, {
              header: true,
              dynamicTyping: true,
              skipEmptyLines: true
            }).data;
          })
        );

        const combinedData = allData.flat();
        
        const campaignStats = _(combinedData)
          .groupBy('Campaign Name')
          .map((campaign, name) => {
            const totalImpressions = _.sumBy(campaign, 'Impressions');
            const totalClicks = _.sumBy(campaign, 'Clicks');
            const totalOrders = _.sumBy(campaign, '7 Day Total Orders (#)');
            const totalSpend = _.sumBy(campaign, row => parseFloat(row['Spend'].replace('$', '')) || 0);
            const totalSales = _.sumBy(campaign, row => parseFloat(row['7 Day Total Sales '].replace('$', '')) || 0);

            return {
              name,
              impressions: totalImpressions,
              clicks: totalClicks,
              orders: totalOrders,
              spend: totalSpend,
              sales: totalSales,
              CTR: totalImpressions ? (totalClicks / totalImpressions * 100).toFixed(2) : 0,
              CPC: totalClicks ? (totalSpend / totalClicks).toFixed(2) : 0,
              ACOS: totalSales ? (totalSpend / totalSales * 100).toFixed(2) : 0,
              ROAS: totalSpend ? (totalSales / totalSpend).toFixed(2) : 0,
              conversionRate: totalClicks ? (totalOrders / totalClicks * 100).toFixed(2) : 0
            };
          })
          .value();

        const best = {
          highestROAS: _.maxBy(campaignStats, 'ROAS'),
          lowestACOS: _.minBy(campaignStats.filter(c => parseFloat(c.ACOS) > 0), 'ACOS'),
          highestCTR: _.maxBy(campaignStats, c => parseFloat(c.CTR)),
          highestConversion: _.maxBy(campaignStats, c => parseFloat(c.conversionRate))
        };

        setBestPerformers(best);
        
        // 處理趨勢數據的函數
        const processTrendData = (data) => {
          return _(data)
            .groupBy(row => {
              const date = new Date(row['Start Date']);
              if (timeGranularity === 'week') {
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - date.getDay());
                return weekStart.toISOString().split('T')[0];
              } else if (timeGranularity === 'month') {
                return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
              }
              return row['Start Date'];
            })
            .map((group, date) => ({
              date,
              sales: _.sumBy(group, row => parseFloat(row['7 Day Total Sales '].replace('$', '')) || 0),
              spend: _.sumBy(group, row => parseFloat(row['Spend'].replace('$', '')) || 0),
              ACOS: (_.sumBy(group, row => parseFloat(row['Spend'].replace('$', '')) || 0) / 
                     _.sumBy(group, row => parseFloat(row['7 Day Total Sales '].replace('$', '')) || 1) * 100).toFixed(2)
            }))
            .value();
        };

        const trendData = processTrendData(combinedData);
        setProcessedData(trendData);
        
        setCampaignData(campaignStats);
        setLoading(false);
      } catch (err) {
        console.error("Error details:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [timeGranularity]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  if (loading) return <div className="p-4">Loading data...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6 p-4">
      {bestPerformers && (
        <BestPerformersCard bestPerformers={bestPerformers} />
      )}

      <ControlPanel
        timeGranularity={timeGranularity}
        setTimeGranularity={setTimeGranularity}
        compareMode={compareMode}
        setCompareMode={setCompareMode}
      />
      <TrendCharts processedData={processedData} />
      <CampaignTable 
        campaignData={campaignData}
        handleSort={handleSort}
        sortConfig={sortConfig}
      />


    </div>
  );
};

export default CampaignComparison;