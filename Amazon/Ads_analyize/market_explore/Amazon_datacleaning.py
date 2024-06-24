import pandas as pd
import matplotlib.pyplot as plt
import ast
# 讀取數據
df = pd.read_csv(
    '爬蟲/0530_Aamazon_sunglasses+men/Amazon商品資料_sunglasses+men_加月銷量.csv')
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
# 5. 商品定價 (C)
# 6. 星星評分 (C)
# 7. 全球評分數量 (C)
# 8. 顏色選項 (C)
# 9. 商品描述 (關鍵字)
# 10. 產品資訊 (關鍵字)
# 11. 全球排名 (C)
# 12. 留言網址
# 13. 圖片文件
# 14. 有無影片 (C)
# 15. 過去一個月銷量 (C)
# 5. 商品定價
# 移除商品定價中的美元符號並轉換為浮點數


def clean_price(df):
    replace_str = [' for Taiwan', '$', '.(.2.44 / Count)', '.Free Return on some sizes and colors',  '.(.23.99 / Count)', '.(.5.86 / Count)', '.(.6.66 / Count)', '.(.63.61 / Pound)',
                   '.(.78.35 / Pound)', '.(.9.00 / Count)', '.FREE Returns', '.(.0.87 / Gram)', '.FREE International Returns']
    for i in replace_str:
        df['商品定價'] = df['商品定價'].astype(str).str.replace(i, '')
    df['商品定價'] = df['商品定價'].str.replace(
        'Price: See price in cart', '0').astype(float)
    return df['商品定價']
# 6/7. 處理評分數量


def clean_star(df):
    df['星星評分'] = df['星星評分'].astype(str).str.replace('沒有星等', '0')
    df['星星評分'] = df['星星評分'].astype(float)
    replace_star = [',', ' rating']
    for i in replace_star:
        df['全球評分數量'] = df['全球評分數量'].astype(str).str.replace(i, '')
    df['全球評分數量'] = df['全球評分數量'].astype(int)
    return df['星星評分'], df['全球評分數量']
# 8. 顏色選項


def to_list(x):
    if isinstance(x, str):
        return eval(x)
    return x


def clean_color(df):  # 搭配 to_list()
    # 应用函数将'顏色選項'列转换为列表
    df['顏色選項'] = df['顏色選項'].apply(to_list)
    # 计算每个商品的颜色数量
    df['顏色數量'] = df['顏色選項'].apply(
        lambda x: len(x) if isinstance(x, list) else 0)
    return df['顏色數量']


def str_to_dic(data):
    try:
        # 將字符串轉換為字典
        ranking_dict = ast.literal_eval(data)
        return ranking_dict
    except:
        return {}


def clean_ranking(df):  # 搭配 str_to_dic()
    # 應用清洗函數
    df['全球排名'] = df['全球排名'].apply(str_to_dic)

    # 顯示清洗後的數據
    return df['全球排名']
# 14. 影片


def clean_video(df):
    df['有無影片'] = df['有無影片'].fillna(0)
    return df['有無影片']
# 15. 過去一個月銷量


def clean_monthly_sales(df):
    df['過去一個月銷量'] = df['過去一個月銷量'].astype(str).str.replace('+', '')
    df['過去一個月銷量'] = df['過去一個月銷量'].astype(str).str.replace('K', '000')
    df['過去一個月銷量'] = df['過去一個月銷量'].astype(str).str.replace('no data', '0')
    df['過去一個月銷量'] = df['過去一個月銷量'].astype(int)
    df['過去一個月銷量'] = df['過去一個月銷量'].fillna(df['過去一個月銷量'].mean())
    return df['過去一個月銷量']
