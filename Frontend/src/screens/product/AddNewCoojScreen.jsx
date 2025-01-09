import React, { useEffect, useState } from "react";
import axios from "axios";
import ShowSuccessMesasge from "../../components/ShowSuccessMesasge";
import { SERVER_URL } from "../../router";

function AddNewCookScreen() {
  const [formData, setFormData] = useState({
    name: "",
   
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      console.log("formData", formData);
      
      const response = await axios.post(
        `${SERVER_URL}/api/v1/cooks/cook`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSuccessMessage("Cook added successfully");
      setFormData({
        name: "",
        
      });
    } catch (error) {
      setError("This Same Name Cook Already Exist");
    }
    setIsLoading(false);
  };

  return (
    <div className="m-5">
      <h1 className="text-3xl font-semibold text-neutral-900">Add New Cook</h1>
      {error && <div className="text-red-500">{error}</div>}
      {successMessage && <div className="text-green-500">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1  gap-4 mt-4">
          <div>
            <label
              htmlFor="name"
              className="block text-lg font-semibold text-neutral-800 mb-1"
            >
             Cook Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border border-neutral-500 rounded-md px-3 py-2 w-full outline-none"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600 transition duration-300"
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add Cook"}
        </button>
      </form>
      <br />
      {successMessage && (
        <ShowSuccessMesasge
          children={<div className="text-gray-900 text-lg">{successMessage}</div>}
        />
      )}
    </div>
  );
}

export default AddNewCookScreen;
