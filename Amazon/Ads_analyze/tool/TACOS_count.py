import os  # noqa: E402
import sys  # noqa E402
# 直接設置 use_pg_SQL 資料夾的絕對路徑
use_pg_SQL_dir = r'C:/python-training/eyeglad/Amazon'  # noqa E402

# 將 use_pg_SQL 資料夾添加到系統路徑
sys.path.append(use_pg_SQL_dir)  # noqa E402

from sqlalchemy import text
from use_pg_SQL import log_in


def add_tacos_column_if_not_exists(table):
    engine = log_in.log_in_pgSQL()
    add_column_query = f"""
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='{table}' AND column_name='TACoS') THEN
            ALTER TABLE public."{table}" ADD COLUMN "TACoS" FLOAT;
        END IF;
    END
    $$;
    """
    with engine.connect() as connection:
        connection.execute(text(add_column_query))
    print(f"Checked and added TACoS column if not exists in table {table}.")


def list_columns(table):
    engine = log_in.log_in_pgSQL()
    query = f"""
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name='{table}';
    """
    with engine.connect() as connection:
        result = connection.execute(text(query))
        columns = [row[0] for row in result]
    print(f"Columns in table {table}: {columns}")
    return columns


def calculate_and_update_tacos_directly(table):
    engine = log_in.log_in_pgSQL()

    # Add TACoS column if it does not exist
    add_tacos_column_if_not_exists(table)

    # List columns to ensure TACoS column exists
    columns = list_columns(table)
    if "TACoS" not in columns:
        print("Error: TACoS column was not added successfully.")
        return

    # Update the original table with TACoS values
    update_query = f"""
    UPDATE public."{table}"
    SET "TACoS" = CASE
        WHEN "seven_Day_Total_Sales" != 0 THEN "Spend" / "seven_Day_Total_Sales"
        ELSE 0
    END
    """
    print(update_query)  # Print the query for debugging

    with engine.connect() as connection:
        connection.execute(text(update_query))
    print(f"Original table {table} updated with TACoS values successfully.")

    print("TACoS calculation completed and updated in the database.")


date = '240702'
# Example usage to add TACoS column:
add_tacos_column_if_not_exists(f'{date}_Sponsored_Products_Search_term_report')

# List columns to verify
list_columns(f'{date}_Sponsored_Products_Search_term_report')

# Example usage to calculate TACoS and update the database:
calculate_and_update_tacos_directly(
    f'{date}_Sponsored_Products_Search_term_report')
