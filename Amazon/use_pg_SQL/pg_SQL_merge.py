import pandas as pd
from sqlalchemy import create_engine, text
import log_in


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


def get_table_names(engine, pattern):
    query = text(f"""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name LIKE :pattern
    """)
    with engine.connect() as conn:
        result = conn.execute(query, {'pattern': pattern})
        table_names = [row[0] for row in result]
    return table_names


def clean_and_merge_tables(engine, pattern, merged_table_name):
    table_names = get_table_names(engine, pattern)
    combined_df = pd.DataFrame()

    not_merged_tables = []

    for table_name in table_names:
        try:
            query = f"SELECT * FROM \"{table_name}\""
            df = pd.read_sql(query, engine)
            combined_df = pd.concat([combined_df, df], ignore_index=True)
        except Exception as e:
            print(f"Error merging table {table_name}: {e} \n")
            not_merged_tables.append(table_name)

    # Remove duplicate rows in the DataFrame
    combined_df = combined_df.drop_duplicates()

    # Replace NaN with None for SQL compatibility
    combined_df = combined_df.where(pd.notnull(combined_df), None)

    # Generate SQL table creation query
    create_table_query = f"CREATE TABLE IF NOT EXISTS \"{merged_table_name}\" (\n"
    for column_name in combined_df.columns:
        sql_type = infer_sqlalchemy_type(combined_df[column_name])
        create_table_query += f'    "{column_name}" {sql_type},\n'
    create_table_query = create_table_query.rstrip(",\n") + "\n);"

    # Create the merged table in the database
    try:
        with engine.connect() as conn:
            conn.execute(text(create_table_query))
        # print(f"Table {merged_table_name} created successfully")
    except Exception as e:
        print(f"Error creating table {merged_table_name}: {e}\n")

    # Insert data into the merged table
    try:
        combined_df.to_sql(merged_table_name, engine,
                           if_exists='append', index=False, method='multi')
        # print(f"Data inserted successfully into table {merged_table_name}")
    except Exception as e:
        print(f"Error inserting data into table {merged_table_name}: {e}\n")

    if not_merged_tables:
        print(
            f"Warning: The following tables were not merged: {not_merged_tables}\n")
    else:
        print("All tables merged successfully.")


# Connect to PostgreSQL database
engine = log_in.log_in_pgSQL()  # 假設您有一個PostgreSQL的連接函數

# Pattern to match table names (e.g., '%_test_Sponsored_Products_Search_term_report')
pattern = '%_Sponsored_Products_Search_term_report'

# Name of the merged table
merged_table_name = 'Sponsored_Products_Search_term_report'

# Clean and merge tables
clean_and_merge_tables(engine, pattern, merged_table_name)
