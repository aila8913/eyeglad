# import os  # noqa: E402
# os.chdir(os.path.abspath(os.path.join(os.path.dirname(__file__))))  # noqa: E402
# print(os.getcwd())  # noqa: E402
# 获取上一级目录路径
# import sys  # noqa E402
# import os  # noqa E402

# parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))  # noqa: E402
# # 将上一级目录添加到 sys.path
# sys.path.insert(0, parent_dir)  # noqa: E402

# # 打印调试信息，确保路径正确
# print(f"Parent directory: {parent_dir}")  # noqa: E402
# print(f"Files in parent directory: {os.listdir(parent_dir)}")  # noqa: E402

import pandas as pd
from . import log_in


def fetch_data_from_db(database, table):
    engine = log_in.log_in_mySQL(database)
    query = f"SELECT * FROM {table}"
    with engine.connect() as conn:
        df = pd.read_sql_query(query, conn)
    return df
