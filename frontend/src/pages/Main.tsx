import { useEffect, useState } from "react";

export default function PersonnelDashboard() {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/personnel", {
        headers: { token: localStorage.getItem("token") || "" },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const all = await res.json();
      setData(all);
    } catch (err) {
      console.error("Error fetching personnel:", err);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    const ext = file.name.split(".").pop()?.toLowerCase();
    const format = ext === "csv" ? "csv" : "excel";

    const endpoint =
      format === "csv"
        ? "http://localhost:3000/api/extract-csv"
        : "http://localhost:3000/api/extract-excel";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { token: localStorage.getItem("token") || "" },
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      await res.json();
      await fetchAll();
    } catch (err) {
      console.error("Error uploading file:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (phone: string) => {
    const newSet = new Set(selected);
    if (newSet.has(phone)) {
      newSet.delete(phone);
    } else {
      newSet.add(phone);
    }
    setSelected(newSet);
  };

  const deployOtp = async () => {
    if (selected.size === 0) return;
    try {
      const res = await fetch("http://localhost:3000/api/deploy-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || "",
        },
        body: JSON.stringify({ phoneNumbers: Array.from(selected) }),
      });
      if (!res.ok) throw new Error("Deploy failed");
      const payload = await res.json();
      console.log("OTP Deploy result:", payload);
      alert("OTPs deployed successfully!");
      setSelected(new Set());
    } catch (err) {
      console.error("Error deploying OTPs:", err);
      alert("Failed to deploy OTPs");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Personnel Records</h1>

      {/* Table with checkboxes */}
      <table className="border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="border px-2 py-1">Select</th>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Phone</th>
            <th className="border px-2 py-1">Age</th>
            <th className="border px-2 py-1">Gender</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1 text-center">
                  <input
                    type="checkbox"
                    checked={selected.has(row.phoneNumber)}
                    onChange={() => toggleSelect(row.phoneNumber)}
                  />
                </td>
                <td className="border px-2 py-1">{row.name}</td>
                <td className="border px-2 py-1">{row.phoneNumber}</td>
                <td className="border px-2 py-1">{row.age}</td>
                <td className="border px-2 py-1">{row.gender}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-2">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Actions */}
      <div className="flex gap-4 mt-4">
        <label className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
          {loading ? "Uploading..." : "Upload File"}
          <input
            type="file"
            className="hidden"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileChange}
          />
        </label>
        <button
          onClick={deployOtp}
          disabled={selected.size === 0}
          className={`px-4 py-2 rounded ${
            selected.size === 0 ? "bg-gray-400" : "bg-green-500 text-white"
          }`}
        >
          Deploy OTP
        </button>
      </div>
    </div>
  );
}
