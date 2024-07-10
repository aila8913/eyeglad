from flask import Flask, jsonify
import pandas as pd

app = Flask(__name__)

# 模擬數據庫表
tables = {
    'table1': pd.DataFrame({
        'col1': [1, 2, 3],
        'col2': [4, 5, 6],
        'col3': [7, 8, 9]
    }),
    'table2': pd.DataFrame({
        'colA': ['A', 'B', 'C'],
        'colB': ['D', 'E', 'F'],
        'colC': ['G', 'H', 'I']
    })
}


@app.route('/api/tables')
def get_tables():
    return jsonify(list(tables.keys()))


@app.route('/api/table/<table_name>')
def get_table_data(table_name):
    if table_name in tables:
        df = tables[table_name]
        data = df.to_dict(orient='records')
        columns = df.columns.tolist()
        return jsonify({'columns': columns, 'data': data})
    else:
        return jsonify({'error': 'Table not found'}), 404


if __name__ == '__main__':
    app.run(debug=True)
