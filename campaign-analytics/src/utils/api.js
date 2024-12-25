import Papa from "papaparse";

export const fetchCampaignData = async () => {
  try {
    const filesResponse = await fetch("http://localhost:5000/api/files");
    if (!filesResponse.ok) {
      throw new Error(`HTTP error! status: ${filesResponse.status}`);
    }
    const files = await filesResponse.json();

    const allData = await Promise.all(
      files.map(async (file) => {
        const response = await fetch(`http://localhost:5000/api/data/${file}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${file}`);
        }
        const text = await response.text();
        return Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        }).data;
      })
    );

    return allData.flat();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
