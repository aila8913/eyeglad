import pandas as pd
import matplotlib.pyplot as plt
import ast
# 讀取數據
df = pd.read_csv(
    'C:/python-training/eyeglad/Amazon/data/marketing/240711_AmazonSales_OverFitGlasses.csv')
thing = 'sunglasses+men'
# 檢查數據
# print(df.head())
# print(df.info())
print(df.columns.tolist())  # 第一直列的數據
# print(df.iloc[0].tolist()) # 第一直列的數據

# 檢查是否有缺失值
# print(df.isnull().sum())
# 清理數據（例如填充或移除缺失值）
# 1. 品牌名稱
# 2. 品牌旗艦店
# 3. 商品名稱 (關鍵字)
# 4. 網址
# 5. Price (C)
# 6. Star Rating (C)
# 7. Global Rating Count (C)
# 8. Color Options (C)
# 9. 商品描述 (關鍵字)
# 10. 產品資訊 (關鍵字)
# 11. Global Ranking (C)
# 12. 留言網址
# 13. 圖片文件
# 14. Has Video (C)
# 15. Sales in the Last Month (C)
# 5. Price
# 移除商品定價中的美元符號並轉換為浮點數


def clean_price(df):
    replace_str = [' for Taiwan', '$', '.(.2.44 / Count)', '.Free Return on some sizes and colors',  '.(.23.99 / Count)', '.(.5.86 / Count)', '.(.6.66 / Count)', '.(.63.61 / Pound)',
                   '.(.78.35 / Pound)', '.(.9.00 / Count)', '.FREE Returns', '.(.0.87 / Gram)', '.FREE International Returns']
    # for i in replace_str:
    #     df['Price'] = df['Price'].astype(str).str.replace(i, '')
    # df['Price'] = df['Price'].str.replace(
    #     'Price: See price in cart', '0').astype(float)
    df['Price'] = df['Price'].astype(str).str.replace('$', '')
    df['Price'] = df['Price'].astype(str).str.replace(' ', '.')
    df['Price'] = df['Price'].astype(str).str.replace('\n', '.')
    return df['Price']
# 6/7. 處理評分數量


def clean_star(df):
    df['Star Rating'] = df['Star Rating'].astype(str).str.replace('沒有星等', '0')
    df['Star Rating'] = df['Star Rating'].astype(float)
    replace_star = [',', ' rating']
    for i in replace_star:
        df['Global Rating Count'] = df['Global Rating Count'].astype(
            str).str.replace(i, '')
    df['Global Rating Count'] = df['Global Rating Count'].astype(int)
    return df['Star Rating'], df['Global Rating Count']
# 8. Color Options


def to_list(x):
    if isinstance(x, str):
        return eval(x)
    return x


def clean_color(df):  # 搭配 to_list()
    # 应用函数将'Color Options'列转换为列表
    df['Color Options'] = df['Color Options'].apply(to_list)
    # 计算每个商品的颜色数量
    df['Color Count'] = df['Color Options'].apply(
        lambda x: len(x) if isinstance(x, list) else 0)
    return df['Color Count']


def str_to_dic(data):
    try:
        # 將字符串轉換為字典
        ranking_dict = ast.literal_eval(data)
        return ranking_dict
    except:
        return {}


def clean_ranking(df):  # 搭配 str_to_dic()
    # 應用清洗函數
    df['Global Ranking'] = df['Global Ranking'].apply(str_to_dic)

    # 顯示清洗後的數據
    return df['Global Ranking']
# 14. 影片


def clean_video(df):
    df['Has Video'] = df['Has Video'].fillna(0)
    return df['Has Video']
# 15. Sales in the Last Month


def clean_monthly_sales(df):
    df['Sales in the Last Month'] = df['Sales in the Last Month'].astype(
        str).str.replace('+', '')
    df['Sales in the Last Month'] = df['Sales in the Last Month'].astype(
        str).str.replace('K', '000')
    df['Sales in the Last Month'] = df['Sales in the Last Month'].astype(
        str).str.replace('no data', '0')
    df['Sales in the Last Month'] = df['Sales in the Last Month'].astype(int)
    df['Sales in the Last Month'] = df['Sales in the Last Month'].fillna(
        df['Sales in the Last Month'].mean())
    return df['Sales in the Last Month']
