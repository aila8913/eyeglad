from sqlalchemy import create_engine, inspect
import log_in

# 連接到 MySQL 資料庫
engine = log_in.log_in_mySQL()

# 建立檢查器
inspector = inspect(engine)

# 查詢所有 schema
schemas = inspector.get_schema_names()
print("Schemas:", schemas)

# 查詢所有 table
tables = inspector.get_table_names(schema='public')
print("Tables:", tables)

# 查詢某一 table 的所有 columns
table_name = 'etf_all_info'
columns = inspector.get_columns(table_name, schema='public')
print(f"Columns in {table_name}:", columns)

# 顯示列名稱
for column in columns:
    print(column['name'])
