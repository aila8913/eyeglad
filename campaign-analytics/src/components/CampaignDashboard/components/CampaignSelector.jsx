// components/CampaignDashboard/components/CampaignSelector.jsx
const CampaignSelector = () => {
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null
  });

  const [selectedCampaigns, setSelectedCampaigns] = useState([]);

  // 計算每個廣告活動的時間範圍
  const campaignTimeRanges = campaigns.map(campaign => {
    const campaignData = data.filter(d => d.campaign === campaign);
    return {
      campaign,
      startDate: new Date(_.minBy(campaignData, 'date').date),
      endDate: new Date(_.maxBy(campaignData, 'date').date)
    };
  });

  // 篩選在選擇時間範圍內的活動
  const activeCampaigns = campaignTimeRanges.filter(c => 
    (!dateRange.start || c.endDate >= dateRange.start) &&
    (!dateRange.end || c.startDate <= dateRange.end)
  );

  return (
    <div className="p-4">
      {/* 日期範圍選擇 */}
      <div className="mb-4">
        <input
          type="date"
          value={dateRange.start}
          onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
          className="mr-2"
        />
        到
        <input
          type="date"
          value={dateRange.end}
          onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
          className="ml-2"
        />
      </div>

      {/* 廣告活動列表 */}
      <div className="space-y-2">
        {activeCampaigns.map(({ campaign, startDate, endDate }) => (
          <div key={campaign} className="flex items-center gap-2">
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
            />
            <label htmlFor={campaign}>
              <div>{campaign}</div>
              <div className="text-sm text-gray-500">
                {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};