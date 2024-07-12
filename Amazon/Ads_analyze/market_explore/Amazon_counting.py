import pandas as pd
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LinearRegression
import Amazon_datacleaning as cl

# 確保第一次使用需要下載相關資源
nltk.download('punkt')
nltk.download('stopwords')


stop_words = list(stopwords.words('english'))
# 增加自定義停用詞列表
custom_stopwords = set(stopwords.words('english')).union(
    {'n', '400', '0', '4', 'al', '3', '2', '6', '100', '80', '54', })


def preprocess_text(text):
    """
    對文本進行預處理，包括轉換為小寫、移除標點符號和停用詞。
    :param text: 需要處理的文本
    :return: 處理後的文本
    """
    text = text.lower()
    tokens = word_tokenize(text)
    tokens = [word for word in tokens if word.isalnum()
              and word not in custom_stopwords]
    return ' '.join(tokens)


def count_words(df, input_text, min_freq=5):
    """
    切詞並統計每個詞出現的頻次，過濾出現頻率過低的詞。
    :param df: 包含文本數據的數據框
    :param input_text: 文本列名
    :param min_freq: 過濾出現頻率低於該值的詞
    :return: 包含關鍵字和頻率的數據框
    """
    all_text = df[input_text].dropna().astype(str)
    all_words = [word.lower() for title in all_text
                 for word in word_tokenize(title)]
    stop_words = custom_stopwords
    all_words = [word for word in all_words if word.isalnum()
                 and word not in stop_words]
    word_counts = Counter(all_words)

    # 過濾出現頻率低於 min_freq 的詞
    filtered_words = {word: count for word,
                      count in word_counts.items() if count >= min_freq}
    common_words_df = dict(
        sorted(filtered_words.items(), key=lambda item: item[1], reverse=True))
    sorted_common_words_df = pd.DataFrame(common_words_df.items(), columns=[
        f'{input_text}Keyword', '頻率'])
    return sorted_common_words_df


def star_comment_count(df):
    """
    計算每個品牌的加權平均評分。
    :param df: 包含評分數據的數據框
    :return: 包含品牌和加權評分的數據框
    """
    df['Weighted Rating'] = df['Star Rating'].astype(
        float) * df['Global Rating Count']
    top_brands_rated = df.groupby('Brand Name')[
        'Weighted Rating'].sum().reset_index()
    return top_brands_rated


def tf_idf_analysis(df, input_text, target_column, top_n_keywords=20, max_features=None):
    """
    使用 TF-IDF 和線性回歸模型分析關鍵字對目標變量的影響。
    :param df: 包含文本和目標變量的數據框
    :param input_text: 文本列名
    :param target_column: 目標變量列名
    :param top_n_keywords: 返回的前 N 個關鍵字數量，默認為 20
    :param max_features: TF-IDF 向量化的最大特徵數，默認為 None
    :return: 包含關鍵字和權重的數據框，以及列名
    """
    df[input_text] = df[input_text].apply(preprocess_text)
    vectorizer = TfidfVectorizer(
        stop_words=stop_words, max_features=max_features)
    X = vectorizer.fit_transform(df[input_text])
    y = df[target_column]
    model = LinearRegression()
    model.fit(X, y)
    feature_names = vectorizer.get_feature_names_out()
    coefficients = model.coef_
    keywords_weights_df = pd.DataFrame(
        {f'{input_text}Keyword': feature_names, f'{target_column}權重': coefficients})
    keywords_weights_df = keywords_weights_df.sort_values(
        by=f'{target_column}權重', ascending=False).head(top_n_keywords)
    return keywords_weights_df


def analyze_keywords_and_sales(df, input_text, target, top_n_keywords=20):
    """
    分析關鍵字與銷量之間的關係。
    :param df: 包含文本和銷量數據的數據框
    :param input_text: 文本列名
    :param target: 目標變量列名
    :param top_n_keywords: 返回的前 N 個關鍵字數量，默認為 20
    :return: 包含關鍵字和銷量的數據框
    """
    df[input_text] = df[input_text].dropna().astype(str).apply(preprocess_text)
    all_words = [word.lower() for title in df[input_text]
                 for word in word_tokenize(title)]
    keywords_sales = {}
    recently_use = {}
    keywords_counts = Counter(all_words)

    for word in keywords_counts.keys():
        df['Word'] = df[input_text].apply(lambda x: word in x)
        total_sales = df[df['Word']][target].sum()
        recently_use[word] = total_sales
        keywords_sales[word] = total_sales / keywords_counts[word]

    sorted_keywords_sales = dict(
        sorted(keywords_sales.items(), key=lambda item: item[1], reverse=True))
    keywordsXsales = pd.DataFrame(list(sorted_keywords_sales.items()), columns=[
                                  f'{input_text}Keyword', f'{target}/關鍵字出現次數']).head(top_n_keywords)
    sorted_recent_use = dict(
        sorted(recently_use.items(), key=lambda item: item[1], reverse=True))
    recently_use_df = pd.DataFrame(list(sorted_recent_use.items()), columns=[
        f'{input_text}Keyword', target]).head(top_n_keywords)
    return keywordsXsales, recently_use_df


def calculate_keyword_sets(a, b, c):
    """
    計算每個關鍵字集的集合差和交集。
    :param tf_idf_S_df: DataFrame，包含小數據的TF-IDF分析結果
    :param tf_idf_B_df: DataFrame，包含大數據的TF-IDF分析結果
    :param keywordsXsales: DataFrame，包含土法煉鋼分析結果
    :return: 各集合的差集和交集
    """
    keywords_set_1 = set(a)
    keywords_set_2 = set(b)
    keywords_set_3 = set(c)

    only_1 = keywords_set_1 - keywords_set_2 - keywords_set_3
    only_2 = keywords_set_2 - keywords_set_1 - keywords_set_3
    only_3 = keywords_set_3 - keywords_set_1 - keywords_set_2

    intersect_12 = keywords_set_1 & keywords_set_2 - keywords_set_3
    intersect_13 = keywords_set_1 & keywords_set_3 - keywords_set_2
    intersect_23 = keywords_set_2 & keywords_set_3 - keywords_set_1

    intersect_123 = keywords_set_1 & keywords_set_2 & keywords_set_3

    return only_1, only_2, only_3, intersect_12, intersect_13, intersect_23, intersect_123


# # 讀取數據
# df = pd.read_csv(
#     'C:/python-training/爬蟲/0530_Aamazon_sunglasses+men/Amazon商品資料_sunglasses+men_加月銷量.csv')
# # 清理資料
# cl.clean_price(df)
# cl.clean_star(df)
# cl.clean_monthly_sales(df)

# # 分析關鍵字與銷量的關係
# keywordsXsales = analyze_keywords_and_sales(
#     df, input_text='商品名稱', target='過去一個月銷量', top_n_keywords=100)
# print('\n'.join(keywordsXsales['標題關鍵字']))


# 示例數據框
# data = {'商品名稱': ['J+S Premium Military Style Classic Aviator Sunglasses, Polarized, 100% UV protection for Men Women',
#  'J+S Military Style Sunglasses, 100% UV protection for Men Women']}
# df = pd.DataFrame(data)

# # 應用預處理
# df['商品名稱'] = df['商品名稱'].apply(preprocess_text)

# # 計算關鍵字頻次
# common_words_df = count_words(df, '商品名稱', min_freq=1)
# # 根據頻率進行排序
# sorted_common_words_df = common_words_df.sort_values(by='頻率', ascending=False)
# print(sorted_common_words_df)
# 土法煉鋼計算
# keywordsXsales, recently_use_df = analyze_keywords_and_sales(
#     df, input_text='商品名稱', target='過去一個月銷量', top_n_keywords=30)
# print(keywordsXsales)
# print(recently_use_df)
