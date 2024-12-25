import React from 'react';

const BestPerformersCard = ({ bestPerformers }) => {
  const cardData = [
    { 
      label: '最佳 ROAS', 
      value: bestPerformers.highestROAS.ROAS, 
      unit: 'x', 
      campaignName: bestPerformers.highestROAS.name,
      bgColor: 'bg-green-50' 
    },
    { 
      label: '最低 ACOS', 
      value: bestPerformers.lowestACOS.ACOS, 
      unit: '%', 
      campaignName: bestPerformers.lowestACOS.name,
      bgColor: 'bg-blue-50' 
    },
    { 
      label: '最高點擊率', 
      value: bestPerformers.highestCTR.CTR, 
      unit: '%', 
      campaignName: bestPerformers.highestCTR.name,
      bgColor: 'bg-purple-50' 
    },
    { 
      label: '最高轉換率', 
      value: bestPerformers.highestConversion.conversionRate, 
      unit: '%', 
      campaignName: bestPerformers.highestConversion.name,
      bgColor: 'bg-yellow-50' 
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardData.map((card, index) => (
        <div key={index} className={`p-4 rounded-lg shadow ${card.bgColor}`}>
          <div className="text-sm font-bold mb-2">{card.label}</div>
          <p className="font-bold text-xl">{card.value}{card.unit}</p>
          <p className="text-sm text-gray-600 truncate">{card.campaignName}</p>
        </div>
      ))}
    </div>
  );
};

export default BestPerformersCard;