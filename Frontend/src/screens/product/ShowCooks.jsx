import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingIndicator from "../../components/LoadingIndicator";
import { SERVER_URL } from "../../router";

function ShowAllCooks() {
  const [isLoading, setLoading] = useState(false);
  const [cooks, setCooks] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${SERVER_URL}/api/v1/get/cooks`, {
        withCredentials: true,
      });

      console.log("API Response Data:", response.data);

      // Ensure response data is valid and has the expected structure
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid or empty data from API.");
      }

      // Map API response to extract cooks' names and creation dates
      const cooksData = response.data.map((cook) => ({
        cookName: cook.name || "Unknown Cook",
        createdAt: cook.createdAt || "N/A",
      }));

      setCooks(cooksData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.error || err.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="m-5">
      <header>
        <h1 className="text-3xl font-semibold text-neutral-900">All Cooks</h1>
      </header>

      {error && (
        <div className="text-red-500 mt-4">
          {error}{" "}
          <button className="underline" onClick={fetchData}>
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
                <th className="px-4 py-2">CREATED DATE</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="2" className="px-4 py-2 text-center">
                    <LoadingIndicator />
                  </td>
                </tr>
              ) : cooks.length === 0 ? (
                <tr>
                  <td colSpan="2" className="px-4 py-2 text-center text-red-500">
                    No data found.
                  </td>
                </tr>
              ) : (
                cooks.map((cook, index) => <CookRow key={index} cook={cook} />)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CookRow({ cook }) {
  const formattedDate = cook.createdAt !== "N/A"
    ? new Date(cook.createdAt).toLocaleDateString()
    : "N/A";

  return (
    <tr className="border-b hover:bg-teal-50 hover:text-teal-700">
      <td className="px-4 py-2">{cook.cookName}</td>
      <td className="px-4 py-2">{formattedDate}</td>
    </tr>
  );
}

export default ShowAllCooks;
