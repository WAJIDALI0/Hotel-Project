import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingIndicator from "../../components/LoadingIndicator";
import ShowErrorMessage from "../../components/ShowErrorMessage";
import { useParams } from "react-router-dom";
import { SERVER_URL } from "../../router";

function ProductHistoryScreen() {
  const params = useParams();
  const [isLoading, setLoading] = useState(true);
  const [productData, setData] = useState(null);
  const [isError, setError] = useState("");

  useEffect(() => {
    getDataFromApi();
  }, []);

  async function getDataFromApi() {
    try {
      const { data } = await axios.get(
        `${SERVER_URL}/api/v1/products/${params.id}/history`
      );
      setData(data);
    } catch (e) {
      console.log(e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="p-5 w-full h-full">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Product Information</h1>
        </div>
        <br />

        {isLoading && <LoadingIndicator />}

        {isError && (
          <div>
            <ShowErrorMessage
              children={<span className="underline cursor-pointer" onClick={getDataFromApi}>reload</span>}
            />
          </div>
        )}

        {productData && (
          <div className="border rounded-md border-neutral-700">
            <div className="overflow-x-auto">
              <table className="table-auto w-full border-collapse">
                <thead className="border-b text-left">
                  <tr>
                    <th className="px-4 py-2">DETAILS</th>
                    <th className="px-4 py-2">Weight</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">PerUnitPrice</th>
                    <th className="px-4 py-2">Date of Purchase</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-teal-50 hover:text-teal-700">
                    <td className="px-4 py-2 flex gap-3 items-center">
                      <div className="px-4 py-2 flex flex-col">
                        <h5 className="text-lg font-semibold text-zinc-800">
                          {productData.name}
                        </h5>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-neutral-700">{productData.weight}</td>
                    <td className="px-4 py-2 text-neutral-700">{productData.quantity}</td>
                    <td className="px-4 py-2 text-neutral-700">{productData.price}</td>
                    <td className="px-4 py-2 text-neutral-700">{productData.perUnitPrice}</td>
                    <td className="px-4 py-2 text-neutral-700">
                      {productData.dateOfPurchase.split("T")[0]}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <br />
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Product History</h1>
        </div>
        <br />

        {productData && <HistoryTable historyInformation={productData.history} />}
      </div>
    </div>
  );
}

const HistoryTable = ({ historyInformation }) => {
  return (
    <div className="border rounded-md border-neutral-700">
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead className="border-b text-left">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {historyInformation.map((history) => (
              <tr key={history._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(history.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {history.location.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {history.status.map((status, index) => (
                    <div key={index} className="flex items-center">
                      <span className="mr-2">{status.name}</span>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductHistoryScreen;
