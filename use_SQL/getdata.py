# import os  # noqa: E402
# os.chdir('C:/python-training/eyeglad')  # noqa: E402
# print(os.getcwd())  # noqa: E402
import pandas as pd
import log_in


def fetch_data_from_db(database, table):
    engine = log_in.log_in_mySQL(database)
    query = f"SELECT * FROM {table}"
    with engine.connect() as conn:
        df = pd.read_sql_query(query, conn)
    return df
