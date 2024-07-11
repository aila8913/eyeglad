import plotly.express as px
import pandas as pd
from dash import Input, Output, State
from use_pg_SQL import getdata


def register_callbacks(app):
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
        df = getdata.fetch_data_from_db(table=table_name)

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
            filter_column = df.columns[2] if len(
                df.columns) > 2 else df.columns[0]
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
            fig = px.scatter(filtered_df, x=x_axis,
                             y=y_axis, color=filter_column)

        fig.update_layout(
            xaxis={'title': x_axis, 'tickangle': 45, 'automargin': True},
            yaxis={'title': y_axis, 'automargin': True},
            margin={'t': 50, 'l': 50, 'r': 50, 'b': 150},
            height=700
        )

        return options, x_axis, options, y_axis, options, filter_column, columns, data, fig, options, size_column

    @app.callback(
        [Output('keyword-impressions', 'figure'),
         Output('keyword-clicks', 'figure'),
         Output('keyword-ctr', 'figure'),
         Output('keyword-tacos', 'figure')],
        Input('table-dropdown', 'value')
    )
    def update_keyword_performance(table_name):
        # 獲取數據
        df = getdata.fetch_data_from_db(table=table_name)

        # 關鍵字表現分析
        keyword_performance = df.groupby('Customer_Search_Term').agg({
            'Impressions': 'sum',
            'Clicks': 'sum',
            'Click-Thru_Rate_CTR': 'mean',
            'TACoS': 'mean'
        }).reset_index()

        # 顯示前10個表現最好的關鍵字
        top_keywords = keyword_performance.sort_values(
            by='Impressions', ascending=False).head(10)

        fig_impressions = px.bar(top_keywords, x='Customer_Search_Term',
                                 y='Impressions', title='Top 10 Keywords by Impressions')
        fig_impressions.update_layout(
            xaxis={'title': 'Customer Search Term',
                   'tickangle': 45, 'automargin': True},
            yaxis={'title': 'Impressions', 'automargin': True},
            margin={'t': 50, 'l': 50, 'r': 50, 'b': 150},
            height=700
        )

        fig_clicks = px.bar(top_keywords, x='Customer_Search_Term',
                            y='Clicks', title='Top 10 Keywords by Clicks')
        fig_clicks.update_layout(
            xaxis={'title': 'Customer Search Term',
                   'tickangle': 45, 'automargin': True},
            yaxis={'title': 'Clicks', 'automargin': True},
            margin={'t': 50, 'l': 50, 'r': 50, 'b': 150},
            height=700
        )

        fig_ctr = px.bar(top_keywords, x='Customer_Search_Term',
                         y='Click-Thru_Rate_CTR', title='Top 10 Keywords by CTR')
        fig_ctr.update_layout(
            xaxis={'title': 'Customer Search Term',
                   'tickangle': 45, 'automargin': True},
            yaxis={'title': 'CTR', 'automargin': True},
            margin={'t': 50, 'l': 50, 'r': 50, 'b': 150},
            height=700
        )

        fig_tacos = px.bar(top_keywords, x='Customer_Search_Term',
                           y='TACoS', title='Top 10 Keywords by TACoS')
        fig_tacos.update_layout(
            xaxis={'title': 'Customer Search Term',
                   'tickangle': 45, 'automargin': True},
            yaxis={'title': 'TACoS', 'automargin': True},
            margin={'t': 50, 'l': 50, 'r': 50, 'b': 150},
            height=700
        )

        return fig_impressions, fig_clicks, fig_ctr, fig_tacos
