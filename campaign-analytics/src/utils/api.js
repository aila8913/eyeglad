import Papa from "papaparse";

const parseCSV = (text, filename) => {
  try {
    const result = Papa.parse(text, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      error: (error) => {
        console.error(`CSV parsing error in ${filename}:`, error);
      },
    });

    if (!result.data || !Array.isArray(result.data)) {
      console.error(`Invalid CSV data structure in ${filename}`);
      return [];
    }

    // 驗證資料結構
    return result.data.filter((row) => {
      const hasRequiredFields =
        row["Campaign Name"] &&
        row["Start Date"] &&
        row["Spend"] !== undefined &&
        row["7 Day Total Sales "] !== undefined;

      if (!hasRequiredFields) {
        console.warn(`Skipping invalid row in ${filename}:`, row);
      }
      return hasRequiredFields;
    });
  } catch (error) {
    console.error(`Error parsing ${filename}:`, error);
    return [];
  }
};

const fetchWithTimeout = async (url, options = {}, timeout = 5000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export const fetchCampaignData = async (onProgress) => {
  const progress = (message) => {
    console.log(message);
    onProgress?.(message);
  };

  try {
    progress("開始載入資料");

    // 1. 獲取檔案列表
    let filesResponse;
    try {
      filesResponse = await fetchWithTimeout("http://localhost:5000/api/files");
      progress(`檔案列表回應狀態: ${filesResponse.status}`);
    } catch (error) {
      throw new Error(`無法連接到伺服器: ${error.message}`);
    }

    if (!filesResponse.ok) {
      throw new Error(`獲取檔案列表失敗: ${filesResponse.status}`);
    }

    // 2. 解析檔案列表
    let files;
    try {
      files = await filesResponse.json();
      progress(`取得檔案列表: ${files.length} 個檔案`);
    } catch (error) {
      throw new Error(`解析檔案列表失敗: ${error.message}`);
    }

    if (!Array.isArray(files) || files.length === 0) {
      throw new Error("沒有可用的檔案");
    }

    // 3. 分批處理檔案
    const BATCH_SIZE = 3; // 同時處理的檔案數
    const batches = [];
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      batches.push(files.slice(i, i + BATCH_SIZE));
    }

    // 4. 依序處理每一批檔案
    let allData = [];
    for (let [index, batch] of batches.entries()) {
      progress(`處理第 ${index + 1}/${batches.length} 批檔案`);

      const batchPromises = batch.map(async (file) => {
        try {
          const response = await fetchWithTimeout(
            `http://localhost:5000/api/data/${file}`,
            {},
            10000
          );

          if (!response.ok) {
            progress(`檔案 ${file} 載入失敗: ${response.status}`);
            return [];
          }

          const text = await response.text();
          progress(`解析 ${file} 內容`);

          return parseCSV(text, file);
        } catch (error) {
          console.error(`處理檔案 ${file} 時發生錯誤:`, error);
          progress(`檔案 ${file} 處理失敗: ${error.message}`);
          return [];
        }
      });

      const batchData = await Promise.all(batchPromises);
      allData = allData.concat(batchData.flat());
    }

    // 5. 驗證最終資料
    if (allData.length === 0) {
      throw new Error("沒有有效的資料可供處理");
    }

    progress(`資料處理完成，共 ${allData.length} 筆記錄`);
    return allData;
  } catch (error) {
    console.error("資料載入過程發生錯誤:", error);
    throw new Error(`資料載入失敗: ${error.message}`);
  }
};
