import React, { useState, useEffect, useMemo } from 'react';
import _ from 'lodash';
import { fetchCampaignData } from '../../utils/api';
import { processCampaignData, processTrendData } from '../../utils/dataTransforms';

// 導入子元件
import BestPerformersCard from './components/BestPerformersCard';
import CampaignTable from './components/CampaignTable';
import TrendCharts from './components/TrendCharts';
import ControlPanel from './components/ControlPanel';

const CampaignComparison = () => {
  // 初始化狀態
  const [campaignData, setCampaignData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'ROAS', direction: 'desc' });
  const [bestPerformers, setBestPerformers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [timeGranularity, setTimeGranularity] = useState('hour');
  const [compareMode, setCompareMode] = useState('combined');
  const [rawData, setRawData] = useState([]);
  const [availableCampaigns, setAvailableCampaigns] = useState([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [processedData, setProcessedData] = useState([]);

  // 修改後的資料載入邏輯
  useEffect(() => {
    let isMounted = true; // 避免在元件卸載後更新狀態

    const loadInitialData = async () => {
      if (loading) return; // 避免重複載入

      try {
        setLoading(true);
        setError(null);
        
        // 取得資料
        console.log('Fetching campaign data...');
        const response = await fetchCampaignData();
        
        // 檢查元件是否還在
        if (!isMounted) return;

        // 驗證回應資料
        if (!response || !Array.isArray(response)) {
          throw new Error('Invalid data format received');
        }

        // 設置原始資料
        setRawData(response);

        // 處理日期範圍
        if (response.length > 0) {
          const dates = response
            .map(item => new Date(item["Start Date"]))
            .filter(date => !isNaN(date.getTime()));

          if (dates.length > 0) {
            const minDate = new Date(Math.min(...dates));
            const maxDate = new Date(Math.max(...dates));

            setDateRange({
              startDate: minDate.toISOString().split('T')[0],
              endDate: maxDate.toISOString().split('T')[0]
            });
          }
        }

        // 處理活動資料
        console.log('Processing campaign data...');
        const processedResult = processCampaignData(response);
        
        if (!isMounted) return;
        
        setCampaignData(processedResult.stats);
        setBestPerformers(processedResult.best);
        
        // 設置可用活動
        const campaigns = processedResult.stats.map(item => item.name);
        setAvailableCampaigns(campaigns);
        setSelectedCampaigns(campaigns);

        // 處理趨勢資料
        const trends = processTrendData(response, timeGranularity, compareMode);
        setProcessedData(trends);

      } catch (error) {
        console.error('資料載入錯誤:', error);
        if (isMounted) {
          setError(error.message || '資料載入失敗');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadInitialData();

    // 清理函數
    return () => {
      isMounted = false;
    };
  }, []); // 空依賴陣列，只在元件掛載時執行一次

  // 處理排序
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  // 處理資料過濾
  const filteredData = useMemo(() => {
    if (selectedCampaigns.length === 0 || !processedData) return [];
    
    return processedData.map(data => {
      if (compareMode === 'separate') {
        return {
          ...data,
          campaignData: _.pick(data.campaignData || {}, selectedCampaigns)
        };
      }
      return data;
    });
  }, [processedData, selectedCampaigns, compareMode]);

  // 載入中狀態
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // 錯誤狀態
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold">載入失敗</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // 渲染主要內容
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
        campaigns={availableCampaigns}
        selectedCampaigns={selectedCampaigns}
        setSelectedCampaigns={setSelectedCampaigns}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      
      <TrendCharts 
        processedData={filteredData}
        compareMode={compareMode}
        timeGranularity={timeGranularity}
      />
      
      <CampaignTable 
        campaignData={campaignData}
        handleSort={handleSort}
        sortConfig={sortConfig}
      />
    </div>
  );
};

export default CampaignComparison;