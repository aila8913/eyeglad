# setup.py
from setuptools import setup, find_packages

setup(
    name='table_visualize',
    version='0.1',
    packages=find_packages(),
    install_requires=[
        'pandas',
        'matplotlib',
        'seaborn',
        'matplotlib-venn',
        'numpy'
    ],
    description='A package for visualizing tables and data',
    author='Your Name',
    author_email='your.email@example.com',
    url='https://github.com/yourusername/table_visualize',  # 替換為你的GitHub鏈接
    classifiers=[
        'Programming Language :: Python :: 3',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
    ],
)
