import dash_bootstrap_components as dbc
from dash import dash_table, dcc, html


def create_layout(tables):
    return dbc.Container([
        dbc.Row(dbc.Col(html.H1("EYEGLAD AmazonADs"), className="mb-4")),

        dbc.Row([
            dbc.Col([
                html.Label("選擇表格"),
                dcc.Dropdown(
                    id='table-dropdown',
                    options=[{'label': table, 'value': table}
                             for table in tables],
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

            dbc.Col(dcc.Graph(id='scatter-plot',
                    style={"height": "80vh"}), width=8)
        ]),

        dbc.Row(dbc.Col(html.H2("數據表"), className="mt-4")),

        dbc.Row(dbc.Col(dash_table.DataTable(
            id='table',
            page_size=10
        ))),

        # 顯示關鍵字表現分析結果
        dbc.Row([
            dbc.Col(dcc.Graph(id='keyword-impressions',
                    style={"height": "80vh"}), width=12)
        ]),
        dbc.Row([
            dbc.Col(dcc.Graph(id='keyword-clicks',
                    style={"height": "80vh"}), width=12)
        ]),
        dbc.Row([
            dbc.Col(dcc.Graph(id='keyword-ctr',
                    style={"height": "80vh"}), width=12)
        ]),
        dbc.Row([
            dbc.Col(dcc.Graph(id='keyword-tacos',
                    style={"height": "80vh"}), width=12)
        ]),
    ], fluid=True)
