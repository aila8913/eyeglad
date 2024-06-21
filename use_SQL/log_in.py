import os
from sqlalchemy import create_engine
from dotenv import load_dotenv

# 加載 .env 文件中的環境變量
load_dotenv()


def log_in_mySQL(database):
    load_dotenv()  # 這行會加載 .env 文件中的所有變量

    host = os.getenv("host")
    user = os.getenv("user")
    password = os.getenv("password")

    # 構建SQLAlchemy引擎
    connection_string = f"mysql+pymysql://{user}:{password}@{host}/{database}"
    engine = create_engine(connection_string)

    print('Log in successful')
    return engine


# 測試連接
if __name__ == "__main__":
    engine = log_in_mySQL()
    with engine.connect() as connection:
        result = connection.execute("SHOW DATABASES;")
        clear_result = [r[0] for r in result if r[0] not in [
            'information_schema', 'mysql', 'performance_schema', 'sys']]
        print(f"clear_result: {clear_result}")
        for database_name in clear_result:
            print(f"database_name: {database_name}")
            result = connection.execute(f"SHOW TABLES FROM {database_name};")
            print(result.fetchall())
