import sys  # noqa E402
import os  # noqa E402

# 获取上一级目录路径
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))  # noqa: E402
# 将上一级目录添加到 sys.path
sys.path.insert(0, parent_dir)  # noqa: E402

# 打印调试信息，确保路径正确
print(f"Parent directory: {parent_dir}")  # noqa: E402
print(f"Files in parent directory: {os.listdir(parent_dir)}")  # noqa: E402

# 設定工作目錄
from sqlalchemy import inspect
from use_SQL import getdata, log_in
import plotly.express as px
import pandas as pd
import dash_bootstrap_components as dbc
from dash import dash_table, dcc, html, Input, Output, State
import dash

database = 'amazon'

# 連接到 MySQL 資料庫
engine = log_in.log_in_mySQL(database)

# 建立檢查器
inspector = inspect(engine)

# 查詢所有表格
tables = inspector.get_table_names()
print("Tables:", '\n'.join(tables))

# 初始化Dash應用
app = dash.Dash(__name__, external_stylesheets=[dbc.themes.BOOTSTRAP])

# 應用佈局
app.layout = dbc.Container([
    dbc.Row(dbc.Col(html.H1("EYEGLAD AmazonADs"), className="mb-4")),

    dbc.Row([
        dbc.Col([
            html.Label("選擇表格"),
            dcc.Dropdown(
                id='table-dropdown',
                options=[{'label': table, 'value': table} for table in tables],
                value=tables[0],  # 默認選擇第一個表格
                className="mb-2"
            ),
        ], width=4)
    ]),

    dbc.Row([
        dbc.Col([
            html.Label("選擇X軸"),
            dcc.Dropdown(
                id='x-axis',
                className="mb-2"
            ),
            html.Label("選擇Y軸"),
            dcc.Dropdown(
                id='y-axis',
                className="mb-2"
            ),
            html.Label("篩選條件"),
            dcc.Dropdown(
                id='filter-column',
                className="mb-2"
            ),
            html.Label("選擇點大小列"),
            dcc.Dropdown(
                id='size-column',
                className="mb-2"
            ),
            dcc.Input(
                id='filter-value',
                placeholder='輸入篩選值...',
                type='text',
                className="mb-2"
            ),
            html.Label("選擇時間範圍"),
            dcc.DatePickerRange(
                id='date-picker-range',
                start_date_placeholder_text='開始日期',
                end_date_placeholder_text='結束日期',
                display_format='YYYY-MM-DD',
                className="mb-2"
            )
        ], width=4),

        dbc.Col(dcc.Graph(id='scatter-plot'), width=8)
    ]),

    dbc.Row(dbc.Col(html.H2("數據表"), className="mt-4")),

    dbc.Row(dbc.Col(dash_table.DataTable(
        id='table',
        page_size=10
    )))
], fluid=True)

# 合併回調函數，動態加載表格數據和更新圖表和表格


@app.callback(
    [Output('x-axis', 'options'),
     Output('x-axis', 'value'),
     Output('y-axis', 'options'),
     Output('y-axis', 'value'),
     Output('filter-column', 'options'),
     Output('filter-column', 'value'),
     Output('table', 'columns'),
     Output('table', 'data'),
     Output('scatter-plot', 'figure'),
     Output('size-column', 'options'),
     Output('size-column', 'value')],
    [Input('table-dropdown', 'value'),
     Input('x-axis', 'value'),
     Input('y-axis', 'value'),
     Input('filter-column', 'value'),
     Input('filter-value', 'value'),
     Input('date-picker-range', 'start_date'),
     Input('date-picker-range', 'end_date'),
     Input('size-column', 'value')]
)
def update_all(table_name, x_axis, y_axis, filter_column, filter_value, start_date, end_date, size_column):
    # 獲取數據
    df = getdata.fetch_data_from_db(database=database, table=table_name)

    # 為下拉菜單選項創建選項
    options = [{'label': col, 'value': col} for col in df.columns]
    columns = [{"name": i, "id": i} for i in df.columns]
    data = df.to_dict('records')

    # 確認初始值
    if not x_axis or x_axis not in df.columns:
        x_axis = df.columns[0]
    if not y_axis or y_axis not in df.columns:
        y_axis = df.columns[1]
    if not filter_column or filter_column not in df.columns:
        filter_column = df.columns[2] if len(df.columns) > 2 else df.columns[0]
    if not size_column or size_column not in df.columns:
        size_column = None

    # 過濾數據
    if filter_value:
        filtered_df = df[df[filter_column].astype(
            str).str.contains(filter_value)]
    else:
        filtered_df = df

    # 根據時間範圍過濾數據
    if start_date and end_date:
        filtered_df = filtered_df[(filtered_df['Date'] >= start_date) & (
            filtered_df['Date'] <= end_date)]

    # 創建圖表
    if size_column:
        fig = px.scatter(filtered_df, x=x_axis, y=y_axis,
                         color=filter_column, size=size_column)
    else:
        fig = px.scatter(filtered_df, x=x_axis, y=y_axis, color=filter_column)

    return options, x_axis, options, y_axis, options, filter_column, columns, data, fig, options, size_column


# 運行應用
if __name__ == '__main__':
    app.run_server(debug=True)
