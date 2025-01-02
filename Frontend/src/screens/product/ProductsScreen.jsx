import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import LoadingIndicator from "../../components/LoadingIndicator";
import { Link, NavLink, useOutletContext } from "react-router-dom";
import { SERVER_URL } from "../../router";

function ProductsScreen() {
  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage, searchTerm]);

  // Fetch products data
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${SERVER_URL}/api/v1/products`, {
        params: {
          page: currentPage,
          itemsperpage: itemsPerPage,
          search: searchTerm,
        },
      });

      // Ensure that 'price' and 'perUnitPrice' are valid numbers
      const sanitizedData = response.data.data.map((product) => ({
        ...product,
        price: isNaN(Number(product.price)) ? 0 : Number(product.price),  // Defaults to 0 if invalid
        perUnitPrice: isNaN(Number(product.perUnitPrice)) ? 0 : Number(product.perUnitPrice),
      }));

      setProducts(sanitizedData);
      setTotalPages(response.data.pages_count);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Handle page changes
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleItemsPerPageChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) setItemsPerPage(value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="m-5">
      <header>
        <h1 className="text-3xl font-semibold text-neutral-900">Products</h1>
        <p className="text-lg text-neutral-600">Here are your products!</p>
      </header>

      <div className="flex gap-3 items-center justify-between mt-4">
        <input
          type="text"
          className="outline-none px-3 py-1 border-neutral-500 border-2 rounded-md text-lg"
          placeholder="Search products"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <NavLink
          className="text-lg font-semibold text-neutral-800 hover:bg-teal-50 hover:text-teal-800 px-4 py-1 border rounded-md"
          to="new"
        >
          Create Product
        </NavLink>
      </div>

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
                <th className="px-4 py-2">NAME</th>
                <th className="px-4 py-2">WEIGHT</th>
                <th className="px-4 py-2">QUANTITY</th>
                <th className="px-4 py-2">PRICE</th>
                <th className="px-4 py-2">PER UNIT PRICE</th>
                <th className="px-4 py-2">DATE OF PURCHASE</th>
                <th className="px-4 py-2">HISTORY</th>
                <th className="px-4 py-2">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="px-4 py-2 text-center">
                    <LoadingIndicator />
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <ProductRow key={product._id} product={product} />
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between py-4 px-5">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              className="border rounded-md aspect-square w-10 text-center"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            />
            <span>Per Page</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="flex gap-2 items-center border rounded-md py-1 text-lg font-semibold px-3 hover:bg-teal-50 hover:text-teal-700 text-center"
            >
              <IoIosArrowBack />
              <span>Prev</span>
            </button>
            <span>{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="flex gap-2 items-center border rounded-md py-1 text-lg font-semibold px-3 hover:bg-teal-50 hover:text-teal-700 text-center"
            >
              <span>Next</span>
              <IoIosArrowForward />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductRow({ product }) {
  const [_, user] = useOutletContext();
  return (
    <tr className="border-b hover:bg-teal-50 hover:text-teal-700">
      <td className="px-4 py-2">{product.name}</td>
      <td className="px-4 py-2">{product.weight}</td>
      <td className="px-4 py-2">{product.quantity}</td>
      <td className="px-4 py-2">{product.price}</td>
      <td className="px-4 py-2">{product.perUnitPrice}</td>
      <td className="px-4 py-2">{product.dateOfPurchase.split("T")[0]}</td>
      <td className="px-4 py-2">
        <Link
          to={`history/${product._id}`}
          className="px-4 py-1 bg-neutral-800 text-slate-100 text-sm rounded-md hover:bg-neutral-600"
        >
          View
        </Link>
      </td>
      <td className="px-4 py-2">
        <NavLink
          to={user._id !== product.createdBy ? "" : `edit/${product._id}`}
          className="px-4 py-1 bg-neutral-800 text-slate-100 text-sm rounded-md hover:bg-neutral-600"
        >
          {user._id === product.createdBy ? "Edit" : "Not Allowed"}
        </NavLink>
      </td>
    </tr>
  );
}

export default ProductsScreen;
