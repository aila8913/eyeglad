import _ from "lodash";

export const processCampaignData = (data) => {
  const stats = _(data)
    .groupBy("Campaign Name")
    .map((campaign, name) => {
      const totalImpressions = _.sumBy(campaign, "Impressions");
      const totalClicks = _.sumBy(campaign, "Clicks");
      const totalOrders = _.sumBy(campaign, "7 Day Total Orders (#)");
      const totalSpend = _.sumBy(
        campaign,
        (row) => parseFloat(row["Spend"].replace("$", "")) || 0
      );
      const totalSales = _.sumBy(
        campaign,
        (row) => parseFloat(row["7 Day Total Sales "].replace("$", "")) || 0
      );

      return {
        name,
        impressions: totalImpressions,
        clicks: totalClicks,
        orders: totalOrders,
        spend: totalSpend,
        sales: totalSales,
        CTR: totalImpressions
          ? ((totalClicks / totalImpressions) * 100).toFixed(2)
          : 0,
        CPC: totalClicks ? (totalSpend / totalClicks).toFixed(2) : 0,
        ACOS: totalSales ? ((totalSpend / totalSales) * 100).toFixed(2) : 0,
        ROAS: totalSpend ? (totalSales / totalSpend).toFixed(2) : 0,
        conversionRate: totalClicks
          ? ((totalOrders / totalClicks) * 100).toFixed(2)
          : 0,
      };
    })
    .value();

  const best = {
    highestROAS: _.maxBy(stats, "ROAS"),
    lowestACOS: _.minBy(
      stats.filter((c) => parseFloat(c.ACOS) > 0),
      "ACOS"
    ),
    highestCTR: _.maxBy(stats, (c) => parseFloat(c.CTR)),
    highestConversion: _.maxBy(stats, (c) => parseFloat(c.conversionRate)),
  };

  return { stats, best };
};

export const processTrendData = (data, timeGranularity) => {
  return _(data)
    .groupBy((row) => {
      const date = new Date(row["Start Date"]);
      if (timeGranularity === "week") {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        return weekStart.toISOString().split("T")[0];
      } else if (timeGranularity === "month") {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
      }
      return row["Start Date"];
    })
    .map((group, date) => ({
      date,
      sales: _.sumBy(
        group,
        (row) => parseFloat(row["7 Day Total Sales "].replace("$", "")) || 0
      ),
      spend: _.sumBy(
        group,
        (row) => parseFloat(row["Spend"].replace("$", "")) || 0
      ),
      ACOS: (
        (_.sumBy(
          group,
          (row) => parseFloat(row["Spend"].replace("$", "")) || 0
        ) /
          _.sumBy(
            group,
            (row) => parseFloat(row["7 Day Total Sales "].replace("$", "")) || 1
          )) *
        100
      ).toFixed(2),
    }))
    .value();
};
