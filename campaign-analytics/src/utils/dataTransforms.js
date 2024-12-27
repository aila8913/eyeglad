import _ from "lodash";

// 共用的工具函數
const parseCurrencyValue = (value) => {
  if (typeof value !== "string") return 0;
  return parseFloat(value.replace("$", "")) || 0;
};

const calculateRate = (numerator, denominator, decimals = 2) => {
  if (typeof numerator !== "number" || typeof denominator !== "number") {
    return null;
  }
  return denominator > 0
    ? ((numerator / denominator) * 100).toFixed(decimals)
    : null;
};

const findBestPerformers = (stats) => {
  if (!Array.isArray(stats) || stats.length === 0) {
    return null;
  }

  return {
    highestROAS: _.maxBy(stats, (s) => parseFloat(s.ROAS) || 0),
    lowestACOS: _.minBy(
      stats.filter((c) => parseFloat(c.ACOS) > 0),
      (s) => parseFloat(s.ACOS) || Infinity
    ),
    highestCTR: _.maxBy(stats, (s) => parseFloat(s.CTR) || 0),
    highestConversion: _.maxBy(stats, (s) => parseFloat(s.conversionRate) || 0),
  };
};

export const processCampaignData = (data) => {
  // 加入除錯訊息
  console.log("processCampaignData - Raw data length:", data?.length);
  console.log("processCampaignData - Sample data item:", data?.[0]);

  if (!Array.isArray(data)) {
    console.error("Input data is not an array");
    return { stats: [], best: null };
  }

  try {
    const stats = _(data)
      .groupBy("Campaign Name")
      .map((campaign, name) => {
        // 使用 Number 確保數值類型
        const totalImpressions = _.sumBy(
          campaign,
          (row) => Number(row.Impressions) || 0
        );
        const totalClicks = _.sumBy(campaign, (row) => Number(row.Clicks) || 0);
        const totalOrders = _.sumBy(
          campaign,
          (row) => Number(row["7 Day Total Orders (#)"]) || 0
        );
        const totalSpend = _.sumBy(campaign, (row) =>
          parseCurrencyValue(row.Spend)
        );
        const totalSales = _.sumBy(campaign, (row) =>
          parseCurrencyValue(row["7 Day Total Sales "])
        );

        // 預先計算避免重複運算
        const ctr = calculateRate(totalClicks, totalImpressions);
        const cpc = totalClicks ? (totalSpend / totalClicks).toFixed(2) : "0";
        const acos = calculateRate(totalSpend, totalSales);
        const roas = totalSpend ? (totalSales / totalSpend).toFixed(2) : "0";
        const convRate = calculateRate(totalOrders, totalClicks);

        return {
          name,
          impressions: totalImpressions,
          clicks: totalClicks,
          orders: totalOrders,
          spend: totalSpend,
          sales: totalSales,
          CTR: ctr,
          CPC: cpc,
          ACOS: acos,
          ROAS: roas,
          conversionRate: convRate,
        };
      })
      .value();

    return {
      stats,
      best: findBestPerformers(stats),
    };
  } catch (error) {
    console.error("Error processing campaign data:", error);
    return { stats: [], best: null };
  }
};

const getDateKey = (dateStr, hour, timeGranularity) => {
  if (!dateStr) return null;

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;

    switch (timeGranularity) {
      case "hour": {
        const formattedHour = String(hour || 0).padStart(2, "0");
        return `${dateStr} ${formattedHour}:00`;
      }
      case "week": {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        return weekStart.toISOString().split("T")[0];
      }
      case "month": {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
      }
      default: // day
        return dateStr;
    }
  } catch (error) {
    console.error("Error generating date key:", error);
    return null;
  }
};

export const processTrendData = (
  data,
  timeGranularity = "day",
  compareMode = "combined"
) => {
  if (!Array.isArray(data)) {
    console.error("Input data is not an array");
    return [];
  }

  try {
    const processedData = _(data)
      .groupBy((row) => {
        const dateKey = getDateKey(
          row["Start Date"],
          row["Hour"],
          timeGranularity
        );
        return dateKey || "invalid_date";
      })
      .map((group, dateTime) => {
        if (dateTime === "invalid_date") return null;

        // 計算該時間點的總計數據
        const totalSales = _.sumBy(group, (row) =>
          parseCurrencyValue(row["7 Day Total Sales "])
        );
        const totalSpend = _.sumBy(group, (row) =>
          parseCurrencyValue(row["Spend"])
        );
        const acos = calculateRate(totalSpend, totalSales);

        const result = {
          date: dateTime,
          sales: totalSales,
          spend: totalSpend,
          ACOS: acos,
        };

        if (compareMode === "separate") {
          result.campaignData = _(group)
            .groupBy("Campaign Name")
            .mapValues((campaign) => ({
              sales: _.sumBy(campaign, (row) =>
                parseCurrencyValue(row["7 Day Total Sales "])
              ),
              spend: _.sumBy(campaign, (row) =>
                parseCurrencyValue(row["Spend"])
              ),
            }))
            .value();
        }

        return result;
      })
      .compact() // 移除無效的數據
      .orderBy(["date"], ["asc"])
      .value();

    return processedData;
  } catch (error) {
    console.error("Error processing trend data:", error);
    return [];
  }
};
