from setuptools import setup, find_packages

setup(
    name="AmazonProject",  # 專案名稱
    version="0.1",  # 專案版本
    packages=find_packages(),  # 自動尋找所有包
    install_requires=[  # 列出專案的依賴
        'pandas',
        'sqlalchemy',
        'psycopg2',
        'flask',
        'tqdm',
        'plotly',
        # 添加更多依賴...
    ],
)
