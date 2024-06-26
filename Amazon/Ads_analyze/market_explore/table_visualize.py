# plot_module.py
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from matplotlib import font_manager as fm
import matplotlib.pyplot as plt
from matplotlib_venn import venn3, venn3_circles
import numpy as np

# 設置 Seaborn 圖表風格
sns.set_theme(style="whitegrid")


# 加載並設置中文字體
def chinese_font():
    plt.rcParams['font.sans-serif'] = ['jf-openhuninn-2.0']
    plt.rcParams['axes.unicode_minus'] = False

# bar 圖


def two_d_bar_plot(data, x, y, color, title=''):
    # 標題關鍵字 X 過去一個月銷量，土法煉鋼

    # 創建一個顏色調色板，顏色深度隨數值變化
    palette = sns.color_palette(color, len(data))[::-1]

    plt.figure(figsize=(14, 8))
    sns.barplot(x=x, y=y, data=data, palette=palette, hue=y)
    plt.gca().invert_yaxis()
    # plt.gca().invert_xaxis()  # 反轉X軸

    plt.xlabel(x)
    plt.ylabel(y)
    plt.title(f'{title} ({x} X {y})')
    plt.gca().invert_yaxis()
    # plt.legend().remove()
    plt.show()

# 折線圖


def two_d_line_plot(data, x, y, color, title=''):
    # 創建一個顏色調色板，顏色深度隨數值變化
    palette = sns.color_palette(color, len(data))

    plt.figure(figsize=(14, 8))
    sns.lineplot(x=x, y=y, data=data, palette=palette, hue=y, marker='o')

    plt.xlabel(x)
    plt.ylabel(y)
    plt.title(f'{title} ({x} X {y})')
    plt.show()


def plot_venn_diagram(keywords_set_1, keywords_set_2, keywords_set_3, title, label):

    # 計算每個區域的關鍵字
    only_1 = keywords_set_1 - keywords_set_2 - keywords_set_3
    only_2 = keywords_set_2 - keywords_set_1 - keywords_set_3
    only_3 = keywords_set_3 - keywords_set_1 - keywords_set_2

    intersect_12 = keywords_set_1 & keywords_set_2 - keywords_set_3
    intersect_13 = keywords_set_1 & keywords_set_3 - keywords_set_2
    intersect_23 = keywords_set_2 & keywords_set_3 - keywords_set_1

    intersect_123 = keywords_set_1 & keywords_set_2 & keywords_set_3

    dot = '; '
    # 列出每個區域的關鍵字
    print(f"只在 {label[0]} 中出現的關鍵字: ", dot.join(only_1))
    print(f"只在 {label[1]} 中出現的關鍵字: ", dot.join(only_2))
    print(f"只在 {label[2]} 中出現的關鍵字: ", dot.join(only_3))

    print(f"在 {label[0]} 和 {label[1]} 中出現的關鍵字: ", dot.join(intersect_12))
    print(f"在 {label[0]} 和 {label[2]} 中出現的關鍵字: ", dot.join(intersect_13))
    print(f"在 {label[1]} 和 {label[2]} 中出現的關鍵字: ", dot.join(intersect_23))

    print("在所有數據集中出現的關鍵字: ", dot.join(intersect_123))

    # 繪製三組集合的交集圖
    fig, ax = plt.subplots(figsize=(14, 10))

    # 左側繪製Venn圖
    ax_venn = plt.subplot(211)
    venn = venn3([keywords_set_1, keywords_set_2, keywords_set_3], label)
    venn_circles = venn3_circles(
        [keywords_set_1, keywords_set_2, keywords_set_3], linestyle='solid')

    # 添加標題
    plt.title(title)

    # 右側添加表格
    ax_table = plt.subplot(212)
    plt.axis('off')
    regions = [
        (f"只在 {label[0]} 中出現的關鍵字", only_1),
        (f"只在 {label[1]} 中出現的關鍵字", only_2),
        (f"只在 {label[2]} 中出現的關鍵字", only_3),
        (f"在 {label[0]} 和 {label[1]} 中出現的關鍵字", intersect_12),
        (f"在 {label[0]} 和 {label[2]} 中出現的關鍵字", intersect_13),
        (f"在 {label[1]} 和 {label[2]} 中出現的關鍵字", intersect_23),
        (f"在所有數據集中出現的關鍵字", intersect_123)
    ]
    table_data = [[region, ', '.join(keywords)]
                  for region, keywords in regions]
    table = plt.table(cellText=table_data, colLabels=[
                      '區域', '關鍵字'], loc='center', cellLoc='left')
    table.auto_set_font_size(False)
    table.set_fontsize(10)
    table.auto_set_column_width([0, 0.8])

    # 調整表格佈局
    plt.subplots_adjust(left=0.2, right=0.8, top=0.8, bottom=0.2, hspace=0.3)

    # 顯示圖表
    plt.show()
