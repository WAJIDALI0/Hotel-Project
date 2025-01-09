import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingIndicator from "../../components/LoadingIndicator";
import { SERVER_URL } from "../../router";

function Logs() {
  const [isLoading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch assigned and returned logs
      const [assignedResponse, returnedResponse] = await Promise.all([
        axios.get(`${SERVER_URL}/api/v1/get/signed`, { withCredentials: true }),
        axios.get(`${SERVER_URL}/api/v1/get/return`, { withCredentials: true }),
      ]);

      console.log("Assigned Response:", assignedResponse.data); // Log assigned response
      console.log("Returned Response:", returnedResponse.data); // Log returned response

      // Process assigned logs
      const assigned = assignedResponse.data.data.map((item) => ({
        cookName: item.cookName || "Not Assigned",
        productName: item.productName || "Unknown Product",
        quantity: item.quantity || 0, // Default to 0 if quantity is missing
        date: item.updateDate || "N/A", // Default to "N/A" if date is missing
        status: "assigned",
      }));

      // Process returned logs
      const returned = returnedResponse.data.returnedProducts.map((item) => ({
        cookName: item.cook?.name || "Unknown Cook",
        productName: item.product?.name || "Unknown Product",
        quantity: item.quantity || 0, // Default to 0 if quantity is missing
        date: item.returnedDate || "N/A", // Default to "N/A" if date is missing
        status: "returned",
      }));

      // Merge both assigned and returned logs
      setLogs([...assigned, ...returned]);
    } catch (err) {
      console.error("Error fetching logs:", err.message);
      setError(err.response?.data?.error || err.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="m-5">
      <header>
        <h1 className="text-3xl font-semibold text-neutral-900">Logs</h1>
      </header>

      {error && (
        <div className="text-red-500 mt-4">
          {error}{" "}
          <button className="underline" onClick={fetchLogs}>
            Retry
          </button>
        </div>
      )}

      <div className="border rounded-md border-neutral-700 mt-4">
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead className="border-b text-left">
              <tr>
                <th className="px-4 py-2">COOK NAME</th>
                <th className="px-4 py-2">PRODUCT NAME</th>
                <th className="px-4 py-2">QUANTITY</th>
                <th className="px-4 py-2">DATE</th>
                <th className="px-4 py-2">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-2 text-center">
                    <LoadingIndicator />
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-2 text-center text-red-500">
                    No logs available.
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => <LogRow key={index} log={log} />)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function LogRow({ log }) {
  const formattedDate = log.date !== "N/A" ? new Date(log.date).toLocaleDateString() : "N/A";

  const statusMessage =
    log.status === "returned"
      ? `Returned (${log.quantity} )`
      : `Assigned (${log.quantity} )`;

  return (
    <tr className="border-b hover:bg-teal-50 hover:text-teal-700">
      <td className="px-4 py-2">{log.cookName}</td>
      <td className="px-4 py-2">{log.productName}</td>
      <td className="px-4 py-2">{log.quantity}</td>
      <td className="px-4 py-2">{formattedDate}</td>
      <td className="px-4 py-2">{statusMessage}</td>
    </tr>
  );
}

export default Logs;
