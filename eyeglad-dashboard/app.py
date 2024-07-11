import sys  # noqa E402
import sys  # noqa E402
import os  # noqa E402
# 获取上一级目录路径
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))  # noqa: E402
# 将上一级目录添加到 sys.path
sys.path.insert(0, parent_dir)  # noqa: E402

from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import inspect
import pandas as pd
import dash
import dash_bootstrap_components as dbc
from use_pg_SQL import log_in
from tool.layout import create_layout
from tool.callbacks import register_callbacks

# 获取上一级目录路径
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))  # noqa: E402
# 将上一级目录添加到 sys.path
sys.path.insert(0, parent_dir)  # noqa: E402

# 初始化 Flask 伺服器
server = Flask(__name__)
# 啟用 CORS，允許所有來源的請求
CORS(server, resources={r"/*": {"origins": "*"}})

# 初始化 Dash 应用
app = dash.Dash(__name__, server=server,
                external_stylesheets=[dbc.themes.BOOTSTRAP])


# 连接到 PostgreSQL 数据库
engine = log_in.log_in_pgSQL()

# 建立检查器
inspector = inspect(engine)

# 查询所有表格
tables = inspector.get_table_names()
print("Tables:", '\n'.join(tables))

# 设置工作目录
app.layout = create_layout(tables)

# 注册回调函数
register_callbacks(app)

# 定义 API 路由


@server.route('/api/tables')
def get_tables():
    return jsonify(tables)


@server.route('/api/table/<table_name>')
def get_table_data(table_name):
    try:
        if table_name in tables:
            query = f'SELECT * FROM "{table_name}"'
            data = pd.read_sql(query, engine)
            columns = list(data.columns)
            print(
                f"Returning data for table {table_name}: columns={columns}, data={data.to_dict(orient='records')}")
            return jsonify({'columns': columns, 'data': data.to_dict(orient='records')})
        else:
            return jsonify({'error': 'Table not found'}), 404
    except Exception as e:
        print(f"Error retrieving data for table {table_name}: {e}")
        return jsonify({'error': str(e)}), 500

    try:
        if table_name in tables:
            query = f'SELECT * FROM "{table_name}"'
            data = pd.read_sql(query, engine)
            columns = list(data.columns)
            return jsonify({'columns': columns, 'data': data.to_dict(orient='records')})
        else:
            return jsonify({'error': 'Table not found'}), 404
    except Exception as e:
        print(f"Error retrieving data for table {table_name}: {e}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    server.run(debug=True, port=5000)
