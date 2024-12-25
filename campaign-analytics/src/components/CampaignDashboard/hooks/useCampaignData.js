import { useState, useEffect } from "react";
import { fetchCampaignData } from "../../../utils/api";
import {
  processCampaignData,
  processTrendData,
} from "../../../utils/dataTransforms";

export const useCampaignData = (timeGranularity) => {
  const [campaignData, setCampaignData] = useState([]);
  const [bestPerformers, setBestPerformers] = useState(null);
  const [processedData, setProcessedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchCampaignData();

        const { stats, best } = processCampaignData(data);
        const trendData = processTrendData(data, timeGranularity);

        setCampaignData(stats);
        setBestPerformers(best);
        setProcessedData(trendData);
        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, [timeGranularity]);

  return { campaignData, bestPerformers, processedData, loading, error };
};
