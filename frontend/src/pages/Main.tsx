import { useState } from "react";

export default function Main() {
  const [file, setFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState<Record<string, any>[]>([]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setShowModal(true); // show popup after file selection
    }
  };

  const handleUpload = async (format: "csv" | "excel") => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const endpoint =
      format === "csv"
        ? "http://localhost:3000/api/extract-csv"
        : "http://localhost:3000/api/extract-excel";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          token: localStorage.getItem("token") || "",
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const extractedData = await res.json();
      setData(extractedData); // save data to state
    } catch (err) {
      console.error("Error uploading file:", err);
    } finally {
      setShowModal(false);
      setFile(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Upload CSV/Excel File</h1>
      <input type="file" onChange={handleFileChange} />

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">
              Select File Format
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => handleUpload("csv")}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                CSV
              </button>
              <button
                onClick={() => handleUpload("excel")}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Excel
              </button>
            </div>
          </div>
        </div>
      )}

      {data.length > 0 && (
        <table className="border border-gray-300">
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key} className="border px-2 py-1">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {Object.values(row).map((value, i) => (
                  <td key={i} className="border px-2 py-1">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
