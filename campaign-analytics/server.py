# server.py
from flask import Flask, send_file, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

DATA_DIR = 'C:\python-training\eyeglad\campaign-analytics\data'  # 修改為你的 CSV 文件目錄


@app.route('/api/files')
def list_files():
    try:
        files = [f for f in os.listdir(DATA_DIR) if f.endswith('.csv')]
        print(f"Found files: {files}")
        return jsonify(files)
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/data/<filename>')
def get_file(filename):
    try:
        file_path = os.path.join(DATA_DIR, filename)
        if os.path.exists(file_path):
            return send_file(file_path, mimetype='text/csv')
        return jsonify({"error": "File not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    print(f"Server starting... Data directory: {DATA_DIR}")
    app.run(port=5000, debug=True)
