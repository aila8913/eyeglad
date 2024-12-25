import os


def create_project_structure():
    # 基本目錄結構
    structure = {
        "src": {
            "components": {
                "CampaignDashboard": {
                    "index.jsx": '''import React from 'react';
import CampaignComparison from './CampaignComparison';
import CampaignMetrics from './CampaignMetrics';

const CampaignDashboard = () => {
  return (
    <div>
      <CampaignMetrics />
      <CampaignComparison />
    </div>
  );
};

export default CampaignDashboard;''',

                    "CampaignComparison.jsx": '''import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";

const CampaignComparison = () => {
  return (
    <Card>
      {/* Campaign comparison content */}
    </Card>
  );
};

export default CampaignComparison;''',

                    "CampaignMetrics.jsx": '''import React from 'react';
import MetricCard from '../common/MetricCard';

const CampaignMetrics = () => {
  return (
    <div>
      {/* Metrics content */}
    </div>
  );
};

export default CampaignMetrics;'''
                },
                "common": {
                    "MetricCard.jsx": '''import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const MetricCard = ({ title, value, trend }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;'''
                }
            },
            "utils": {
                "dataTransforms.js": '''export const processData = (rawData) => {
  // Data processing logic here
  return processedData;
};'''
            },
            "App.jsx": '''import React from 'react';
import CampaignDashboard from './components/CampaignDashboard';

function App() {
  return (
    <div className="container mx-auto p-4">
      <CampaignDashboard />
    </div>
  );
}

export default App;'''
        },
        "public": {
            "index.html": '''<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Campaign Analytics Dashboard</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>'''
        }
    }

    def create_files(base_path, structure):
        for item, content in structure.items():
            path = os.path.join(base_path, item)
            if isinstance(content, dict):
                os.makedirs(path, exist_ok=True)
                create_files(path, content)
            else:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)

    # 建立專案根目錄
    project_name = "campaign-analytics"
    os.makedirs(project_name, exist_ok=True)

    # 建立目錄結構和檔案
    create_files(project_name, structure)

    # 建立 package.json
    package_json = '''{
  "name": "campaign-analytics",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "recharts": "^2.10.3"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}'''

    with open(os.path.join(project_name, 'package.json'), 'w', encoding='utf-8') as f:
        f.write(package_json)

    print(f"Project structure created in {project_name}/")


# 執行創建
create_project_structure()
