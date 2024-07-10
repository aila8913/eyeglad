import sys  # noqa E402
import os  # noqa E402
# 获取上一级目录路径
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))  # noqa: E402
# 将上一级目录添加到 sys.path
sys.path.insert(0, parent_dir)  # noqa: E402
from sqlalchemy import inspect
from use_pg_SQL import log_in
from flask import Flask
import dash
import dash_bootstrap_components as dbc
from tool.layout import create_layout
from tool.callbacks import register_callbacks

# 初始化 Flask 伺服器
server = Flask(__name__)

# 初始化 Dash 應用
app = dash.Dash(__name__, server=server,
                external_stylesheets=[dbc.themes.BOOTSTRAP])

# 打印调试信息，确保路径正确
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
print(f"Parent directory: {parent_dir}")
print(f"Files in parent directory: {os.listdir(parent_dir)}")

# 連接到 PostgreSQL 資料庫
engine = log_in.log_in_pgSQL()

# 建立檢查器
inspector = inspect(engine)

# 查詢所有表格
tables = inspector.get_table_names()
print("Tables:", '\n'.join(tables))

# 設定工作目錄
app.layout = create_layout(tables)

# 註冊回調函數
register_callbacks(app)

if __name__ == '__main__':
    app.run_server(debug=True)
