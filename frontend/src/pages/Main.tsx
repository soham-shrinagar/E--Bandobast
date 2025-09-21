import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonnelMap from "../components/InteractiveMap";

export default function PersonnelDashboard() {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [geofences, setGeofences] = useState<any[]>([]);
  const [selectedGeofence, setSelectedGeofence] = useState<any>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
    fetchAllGeofences();
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

  const fetchAllGeofences = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/geofences", {
        headers: { token: localStorage.getItem("token") || "" },
      });
      if (!res.ok) throw new Error("Failed to fetch geofences");
      const all = await res.json();
      setGeofences(all);
    } catch (err) {
      console.error("Error fetching geofences:", err);
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
    if (newSet.size !== data.length) setSelectAll(false);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelected(new Set());
      setSelectAll(false);
    } else {
      const allPhones = data.map((row) => row.phoneNumber);
      setSelected(new Set(allPhones));
      setSelectAll(true);
    }
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
      setSelectAll(false);
    } catch (err) {
      console.error("Error deploying OTPs:", err);
      alert("Failed to deploy OTPs");
    }
  };

  const deletePersonnel = async () => {
    if (selected.size === 0) return;
    try {
      const res = await fetch("http://localhost:3000/api/delete-personnel", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || "",
        },
        body: JSON.stringify({ phoneNumbers: Array.from(selected) }),
      });
      if (!res.ok) throw new Error("Delete failed");
      const payload = await res.json();
      console.log("Delete result:", payload);
      alert("Personnel deleted successfully!");
      await fetchAll();
      setSelected(new Set());
      setSelectAll(false);
    } catch (err) {
      console.error("Error deleting personnel:", err);
      alert("Failed to delete personnel");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login-email"); // change to your desired route
  };

  const deployPersonnelToGeofence = async () => {
    if (selected.size === 0) return;
    if (!selectedGeofence) {
      alert("Please select a sector/geofence first");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/deploy-personnel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || "",
        },
        body: JSON.stringify({
          phoneNumbers: Array.from(selected),
          geofenceId: selectedGeofence.id,
        }),
      });

      if (!res.ok) throw new Error("Deployment failed");

      const payload = await res.json();
      console.log("Deploy result:", payload);
      alert(`Personnel deployed successfully (${payload.count})`);

      // Optionally refresh table or reset selection
      setSelected(new Set());
      setSelectAll(false);
      await fetchAll();
    } catch (err) {
      console.error(err);
      alert("Failed to deploy personnel");
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 p-6">
      {/* Top bar */}
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-green-800 drop-shadow">
          📋 Personnel Records
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/notification")}
            className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition"
          >
            message
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
          >
            logout
          </button>
        </div>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-2 gap-6 w-full max-w-7xl mx-auto">
        {/* Left column: Table + Actions */}
        <div className="flex flex-col space-y-6">
          {/* Table */}
          <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="max-h-60 overflow-y-auto">
              <table className="w-full border-collapse">
                <thead className="bg-green-200 text-green-900">
                  <tr>
                    <th className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 accent-green-600"
                      />
                    </th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Phone</th>
                    <th className="px-4 py-2">Age</th>
                    <th className="px-4 py-2">Gender</th>
                  </tr>
                </thead>

                <tbody>
                  {data.length > 0 ? (
                    data.map((row, idx) => (
                      <tr
                        key={idx}
                        className={`text-center ${
                          idx % 2 === 0 ? "bg-green-50" : "bg-yellow-50"
                        } hover:bg-yellow-100 transition`}
                      >
                        <td className="px-4 py-2">
                          <input
                            type="checkbox"
                            checked={selected.has(row.phoneNumber)}
                            onChange={() => toggleSelect(row.phoneNumber)}
                            className="w-4 h-4 accent-green-600"
                          />
                        </td>
                        <td className="px-4 py-2">{row.name}</td>
                        <td className="px-4 py-2">{row.phoneNumber}</td>
                        <td className="px-4 py-2">{row.age}</td>
                        <td className="px-4 py-2">{row.gender}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-6 text-gray-500"
                      >
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Geofences Table */}
          <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden mb-6">
            <div className="max-h-40 overflow-y-auto">
              <table className="w-full border-collapse">
                <thead className="bg-green-200 text-green-900 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Select</th>
                  </tr>
                </thead>

                <tbody>
                  {geofences.length > 0 ? (
                    geofences.map((fence, idx) => (
                      <tr
                        key={idx}
                        className={`text-center ${
                          idx % 2 === 0 ? "bg-green-50" : "bg-yellow-50"
                        } hover:bg-yellow-100 transition`}
                      >
                        <td className="px-4 py-2">{fence.name}</td>
                        <td className="px-4 py-2">{fence.type}</td>
                        <td className="px-4 py-2">
                          <input
                            type="radio"
                            name="selectedGeofence"
                            checked={selectedGeofence?.id === fence.id}
                            onChange={() => setSelectedGeofence(fence)}
                            className="accent-green-600"
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center py-6 text-gray-500"
                      >
                        No geofences available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-6">
            <label className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md cursor-pointer hover:bg-green-700 transition">
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
              className={`px-6 py-2 rounded-lg font-semibold shadow-md transition ${
                selected.size === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-yellow-500 text-white hover:bg-yellow-600"
              }`}
            >
              🚀 Deploy OTP
            </button>
            <button
              onClick={deletePersonnel}
              disabled={selected.size === 0}
              className={`px-6 py-2 rounded-lg font-semibold shadow-md transition ${
                selected.size === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              🗑️ Delete
            </button>
            <button
              onClick={deployPersonnelToGeofence}
              disabled={selected.size === 0 || !selectedGeofence}
              className={`px-6 py-2 rounded-lg font-semibold shadow-md transition ${
                selected.size === 0 || !selectedGeofence
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              📡 Deploy
            </button>
          </div>
        </div>

        {/* Right column: Map placeholder */}
        <div className="h-[80vh] bg-gray-200 rounded-xl shadow-lg overflow-hidden">
          {/* Replace with your map component */}
          <PersonnelMap geofence={selectedGeofence} />
          {/* <span>🗺️ Map goes here</span> */}
        </div>
      </div>
    </div>
  );
}
