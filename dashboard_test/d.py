import pandas as pd
import numpy as np
from datetime import datetime


class CampaignAnalyzer:
    def __init__(self):
        # 定義標籤判斷標準
        self.TAG_CRITERIA = {
            'HIGH_TRAFFIC': {'impressions': 5000, 'label': '流量高'},
            'LOW_ACOS': {'acos': 20, 'label': 'ACOS優'},
            'HIGH_CONVERSION': {'conversion': 15, 'label': '高轉換'},
            'POOR_PERFORMANCE': {
                'minSales': 10,
                'minClicks': 10,
                'maxAcos': 100,
                'label': '低成效'
            }
        }

    def load_data(self, file1_path, file2_path):
        """載入並合併兩個CSV檔案的數據"""
        df1 = pd.read_csv(file1_path)
        df2 = pd.read_csv(file2_path)
        return pd.concat([df1, df2])

    def clean_numeric_column(self, value):
        """清理數值欄位，移除貨幣符號等"""
        if pd.isna(value) or value == '':
            return 0
        return float(str(value).replace('$', '').replace('%', '').replace(',', ''))

    def process_data(self, df):
        """處理數據，計算各項指標"""
        # 清理數值欄位
        df['Sales'] = df['7 Day Total Sales '].apply(self.clean_numeric_column)
        df['Spend'] = df['Spend'].apply(self.clean_numeric_column)
        df['ACOS'] = df['Total Advertising Cost of Sales (ACOS) '].apply(
            self.clean_numeric_column)

        # 計算每個廣告活動的指標
        campaign_metrics = df.groupby('Campaign Name').agg({
            'Sales': 'sum',
            'Spend': 'sum',
            '7 Day Total Orders (#)': 'sum',
            'Impressions': 'sum',
            'Clicks': 'sum',
            'ACOS': lambda x: x[x > 0].mean() if len(x[x > 0]) > 0 else 0
        }).reset_index()

        # 計算其他指標
        campaign_metrics['CTR'] = (
            campaign_metrics['Clicks'] / campaign_metrics['Impressions'] * 100).fillna(0)
        campaign_metrics['Conversion_Rate'] = (
            campaign_metrics['7 Day Total Orders (#)'] / campaign_metrics['Clicks'] * 100).fillna(0)

        return campaign_metrics

    def get_campaign_tags(self, row):
        """為每個廣告活動添加標籤"""
        tags = []

        if row['Impressions'] >= self.TAG_CRITERIA['HIGH_TRAFFIC']['impressions']:
            tags.append(self.TAG_CRITERIA['HIGH_TRAFFIC']['label'])

        if 0 < row['ACOS'] < self.TAG_CRITERIA['LOW_ACOS']['acos']:
            tags.append(self.TAG_CRITERIA['LOW_ACOS']['label'])

        if row['Conversion_Rate'] >= self.TAG_CRITERIA['HIGH_CONVERSION']['conversion']:
            tags.append(self.TAG_CRITERIA['HIGH_CONVERSION']['label'])

        if (row['Sales'] < self.TAG_CRITERIA['POOR_PERFORMANCE']['minSales'] and
            row['Clicks'] < self.TAG_CRITERIA['POOR_PERFORMANCE']['minClicks'] and
                (row['ACOS'] == 0 or row['ACOS'] > self.TAG_CRITERIA['POOR_PERFORMANCE']['maxAcos'])):
            tags.append(self.TAG_CRITERIA['POOR_PERFORMANCE']['label'])

        return tags

    def analyze_campaigns(self, file1_path, file2_path):
        """執行完整的分析流程"""
        # 載入數據
        df = self.load_data(file1_path, file2_path)

        # 處理數據
        campaign_metrics = self.process_data(df)

        # 添加標籤
        campaign_metrics['Tags'] = campaign_metrics.apply(
            self.get_campaign_tags, axis=1)

        # 過濾掉低成效的廣告活動
        valid_campaigns = campaign_metrics[~campaign_metrics['Tags'].apply(
            lambda x: self.TAG_CRITERIA['POOR_PERFORMANCE']['label'] in x)]

        return valid_campaigns

    def print_campaign_summary(self, campaign_data):
        """印出廣告活動摘要"""
        for _, campaign in campaign_data.iterrows():
            print(f"\n廣告活動: {campaign['Campaign Name']}")
            print(f"標籤: {', '.join(campaign['Tags'])}")
            print(f"總銷售額: ${campaign['Sales']:.2f}")
            print(f"總支出: ${campaign['Spend']:.2f}")
            print(f"ACOS: {campaign['ACOS']:.2f}%")
            print(f"總曝光數: {int(campaign['Impressions'])}")
            print(f"總點擊數: {int(campaign['Clicks'])}")
            print(f"總訂單數: {int(campaign['7 Day Total Orders (#)'])}")
            print(f"轉換率: {campaign['Conversion_Rate']:.2f}%")
            print(f"點擊率: {campaign['CTR']:.2f}%")
            print("-" * 50)


# 使用範例
if __name__ == "__main__":
    analyzer = CampaignAnalyzer()

    # 替換成您的檔案路徑
    file1_path = "./data/241216_Sponsored Products Campaign report.csv"
    file2_path = "./data/241223_Sponsored Products Campaign report.csv"

    campaign_data = analyzer.analyze_campaigns(file1_path, file2_path)
    analyzer.print_campaign_summary(campaign_data)
