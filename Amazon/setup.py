from setuptools import setup, find_packages

setup(
    name="AmazonProject",  # 專案名稱
    version="0.1",  # 專案版本
    packages=find_packages(),  # 自動尋找所有包
    install_requires=[  # 列出專案的依賴
        'Flask',
        'dash',
        'dash-bootstrap-components',
        'dash-table',
        'pandas',
        'plotly',
        'sqlalchemy',
        'psycopg2',
        'sqlalchemy',
        'python-dotenv',
        'psycopg2',
        'gunicorn'
    ],
)
