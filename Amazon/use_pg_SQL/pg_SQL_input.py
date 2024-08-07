import os
import pandas as pd
from sqlalchemy import create_engine, text
import log_in
# from use_pg_SQL import log_in
# import getdata


def infer_sqlalchemy_type(column):
    if pd.api.types.is_integer_dtype(column):
        return 'INTEGER'
    elif pd.api.types.is_float_dtype(column):
        return 'FLOAT'
    elif pd.api.types.is_datetime64_any_dtype(column):
        return 'TIMESTAMP'
    elif pd.api.types.is_bool_dtype(column):
        return 'BOOLEAN'
    else:
        return 'VARCHAR(255)'


def contains_chinese(string):
    # Check if a string contains Chinese characters
    for ch in string:
        if '\u4e00' <= ch <= '\u9fff':
            return True
    return False


def get_clean_column_name(column_name):
    if contains_chinese(column_name):
        new_name = input(
            f"Column name '{column_name}' contains Chinese characters. Please provide an English name: ")
        return new_name.strip().replace(' ', '_').replace('(', '').replace(')', '').replace('#', '').replace('7_', 'seven_')
    else:
        return column_name.strip().replace(' ', '_').replace('(', '').replace(')', '').replace('#', '').replace('7_', 'seven_')


def get_clean_table_name(table_name):
    if contains_chinese(table_name):
        new_name = input(
            f"Table name '{table_name}' contains Chinese characters. Please provide an English name: ")
        return new_name.strip().replace(' ', '_').replace('(', '').replace(')', '').replace('#', '')
    else:
        return table_name.strip().replace(' ', '_').replace('(', '').replace(')', '').replace('#', '')


def clean_and_insert_to_sql(file_path, original_table_name, engine):
    # Read the file into a DataFrame
    if file_path.endswith('.xlsx'):
        df = pd.read_excel(file_path)
    elif file_path.endswith('.csv'):
        df = pd.read_csv(file_path)
    else:
        print(f"Unsupported file type for {file_path}")
        return

    # Clean column names
    df.columns = [get_clean_column_name(col) for col in df.columns]

    # Clean table name
    table_name = f'{get_clean_table_name(original_table_name)}'
    print(f'TABLE_NAME: {table_name}')
    # Generate SQL table creation query
    create_table_query = f"CREATE TABLE IF NOT EXISTS \"{table_name}\" (\n"
    for column_name in df.columns:
        sql_type = infer_sqlalchemy_type(df[column_name])
        create_table_query += f'    "{column_name}" {sql_type},\n'
    create_table_query = create_table_query.rstrip(",\n") + "\n);"

    # Create the table in the database
    try:
        with engine.connect() as conn:
            conn.execute(text(create_table_query))
        print(f"Table {table_name} created successfully")
    except Exception as e:
        print(f"Error creating table {table_name}: {e}")

    # Remove duplicate rows
    df = df.drop_duplicates()

    # Insert data into the table
    try:
        df.to_sql(table_name, engine, if_exists='append',
                  index=False, method='multi')
        print(f"Data inserted successfully into table {table_name}")
    except Exception as e:
        print(f"Error inserting data into table {table_name}: {e}")


# Set working directory
os.chdir('C:/python-training/eyeglad/Amazon/data')
print(os.getcwd())

# # Amazon 市場調查
file_name = '240711_AmazonSales_OverFitGlasses'
file_path = f'C:/python-training/eyeglad/Amazon/data/{file_name}.csv'
# Connect to PostgreSQL database
engine = log_in.log_in_pgSQL()  # 假設您有一個PostgreSQL的連接函數

# Get the table name by removing the file extension
original_table_name = os.path.splitext(file_name)[0]

# Clean and insert data into SQL
clean_and_insert_to_sql(file_path, original_table_name, engine)


# # 一個檔案匯進 SQL
# date = '240702'
# target_folder = f'{date}_AmazonAds_data'
# file_name = 'Sponsored Products Search term report'
# file_path = f'{target_folder}/Sponsored Products Search term report.xlsx'

# # Connect to PostgreSQL database
# engine = log_in.log_in_pgSQL()  # 假設您有一個PostgreSQL的連接函數

# # Get the table name by removing the file extension
# original_table_name = os.path.splitext(file_name)[0]

# # Clean and insert data into SQL
# clean_and_insert_to_sql(file_path, original_table_name, engine, target_folder)

# 批量匯入
# # Define target folder
# target_folder = '240621_AmazonAds_data'
# folder_path = f'C:/python-training/eyeglad/Amazon/data/{target_folder}'

# # Connect to PostgreSQL database
# engine = log_in.log_in_pgSQL()  # 假設您有一個PostgreSQL的連接函數

# # Iterate through all files in the folder
# for file_name in os.listdir(folder_path):
#     file_path = os.path.join(folder_path, file_name)

#     # Get the table name by removing the file extension
#     original_table_name = os.path.splitext(file_name)[0]

#     # Clean and insert data into SQL
#     clean_and_insert_to_sql(
#         file_path, original_table_name, engine, target_folder)
# print()
# # 從資料庫讀取數據
# table_name = "financial_data".lower()  # 替換為你的表名
# df = getdata.fetch_data_from_db(table_name)

# # 檢查讀取的資料
# print(df)
