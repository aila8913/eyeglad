import React from 'react';
import CampaignComparison from './components/CampaignDashboard';

function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">廣告活動分析</h1>
      <CampaignComparison />
    </div>
  );
}

export default App;