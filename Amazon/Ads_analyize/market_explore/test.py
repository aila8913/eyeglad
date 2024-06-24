import os
import subprocess

# 設定測試資料夾和程式名稱
test_folder = 'W10HW5/文句處理'
program_name = 'W10HW5-1_test.py'

# 取得測試資料夾中的所有 .in 檔案
test_files = [f for f in os.listdir(test_folder) if f.endswith('.in')]


def decode_output(output):
    encodings = ['utf-8', 'big5', 'gbk']
    for encoding in encodings:
        try:
            return output.decode(encoding)
        except UnicodeDecodeError:
            continue
    return None


for test_file in test_files:
    # 讀取 .in 檔案的內容
    with open(os.path.join(test_folder, test_file), 'r', encoding='utf-8') as f:
        input_data = f.read()

    # 執行程式並將 .in 檔案的內容作為標準輸入
    process = subprocess.Popen(['python', program_name], stdin=subprocess.PIPE,
                               stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate(input=input_data.encode('utf-8'))

    # 嘗試解碼標準輸出和標準錯誤
    decoded_stdout = decode_output(stdout)
    decoded_stderr = decode_output(stderr)

    if decoded_stdout is None:
        print(
            f"Error decoding stdout for {test_file}: Unable to decode using utf-8, big5, or gbk")
        decoded_stdout = ''
    if decoded_stderr is None:
        print(
            f"Error decoding stderr for {test_file}: Unable to decode using utf-8, big5, or gbk")
        decoded_stderr = ''

    # 取得對應的 .out 檔案
    output_file = test_file.replace('.in', '.out')
    with open(os.path.join(test_folder, output_file), 'r', encoding='utf-8') as f:
        expected_output = f.read()

    # # 比較程式的輸出和預期的輸出
    # if decoded_stdout.strip() == expected_output.strip():
    #     print(f'Test {test_file} passed.')
    # else:
    #     print(f'Test {test_file} failed.')
    #     print(f'Expected output:\n{expected_output}')
    #     print(f'Actual output:\n{decoded_stdout}')
    #     print(f'Standa
