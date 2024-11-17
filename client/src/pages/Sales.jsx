import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import filter from "../assets/filter.svg";
import "./css/sale.css";
import { NavLink } from "react-router-dom";
import { useStore } from "../context/Store";
import sale1 from "../assets/sale1.svg";
import sale2 from "../assets/sale2.svg";
import sale3 from "../assets/sale3.svg";
import insale1 from "../assets/insale1.svg";
import axios from "axios";
import { useAuth } from "../auth/auth";

const Sales = () => {
  const { authorizationToken } = useAuth();

  const {
    sales,
    refreshSales,
    count,
    refreshCategoryCount,
    pcount,
    refreshProductCount,
    totalRevenue,
    refreshSalesCount,
    salesCount,
    refreshTotalRevenue,
  } = useStore();
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const [date, setDate] = useState(null);

  const filteredSales = sales.filter((sale) => {
    const paymentFilter =
      selectedAvailability === ""
        ? true
        : sale.paymentMethod.toLowerCase() ===
          selectedAvailability.toLowerCase();
    const dateFilter = date ? sale.saleDate === date : true;

    return paymentFilter && dateFilter;
  });

  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const currentItems = filteredSales.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const [popupType, setPopupType] = useState(null);
  const isPopupOpen = popupType !== null;

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearch = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true);
      try {
        const response = await axios.get(
          `https://inventory-management-for-4sale-backend.onrender.com/api/sale/search?query=${value}`,
          {
            headers: {
              Authorization: authorizationToken,
            },
          }
        );
        setSearchResults(response.data);
        setNoResults(response.data.length === 0);
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  useEffect(() => {
    refreshSales();
    refreshTotalRevenue();
    refreshSalesCount();
    refreshCategoryCount();
    refreshProductCount();
  }, []);

  return (
    <div>
      <div className="overall">
        <div className="bg-white rounded p-3 d-flex justify-content-between align-items-center">
          <div className="d-flex gap-3">
            <img src={sale3} width={43} alt="icon" />
            <div>
              <h5 className="mb-0">{salesCount}</h5>

              <p className="mb-0">
                <small>Total Sales</small>
              </p>
            </div>
          </div>
          <div className="Hline" />
          <div className="d-flex gap-3">
            <img src={sale1} alt="icon" width={43} />
            <div>
              <h5 className="mb-0">Nu {totalRevenue}</h5>
              <p className="mb-0">
                <small>Revenue</small>
              </p>
            </div>
          </div>

          <div className="Hline" />
          <div className="d-flex gap-2">
            <img src={insale1} width={43} alt="icon" />
            <div>
              <h5 className="mb-0">{pcount}</h5>
              <p className="mb-0">
                <small>Products</small>
              </p>
            </div>
          </div>
          <div className="Hline" />
          <div className="d-flex gap-3">
            <img src={sale2} width={43} alt="icon" />
            <div>
              <h5 className="mb-0">{count}</h5>

              <p className="mb-0">
                <small>Category</small>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="salesadd p-2 px-3">
        <div className="d-flex justify-content-between align-items-center py-0 mb-3">
          <h4 className="">Sales</h4>
          <div className="d-flex gap-3 py-0">
            <button className="btn btn-primary py-0">
              <NavLink
                to={`/sales/add-sale`}
                className="text-white text-decoration-none"
              >
                Add Sale
              </NavLink>
            </button>

            <div className="d-flex flex-column align-items-center position-relative">
              <input
                type="search"
                placeholder="Search product..."
                onChange={(e) => handleSearch(e.target.value)}
                className="form-control no-focus"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                aria-label="Search"
                value={input}
              />
              {showSearchResults && (
                <ul className="list-group position-absolute search-result">
                  {searchResults.length > 0
                    ? searchResults.map((result) => (
                        <li
                          key={result.id}
                          className="list-group-item list-group-item-action on-hover"
                        >
                          <NavLink
                            to={`/inventory/${result.productId}`}
                            style={{
                              textDecoration: "none",
                              color: "inherit",
                            }}
                            className="text-decoration-none text-dark"
                          >
                            <div className="d-flex align-items-center gap-3">
                              <p className="mb-0">{result.customerName}</p>
                            </div>
                          </NavLink>
                        </li>
                      ))
                    : noResults && (
                        <li className="list-group-item text-muted text-center">
                          No sale with such customer name
                        </li>
                      )}
                </ul>
              )}
            </div>
            <span className="select">
              <div
                className={`dropdown ${isPopupOpen ? "disable-dropdown" : ""}`}
              >
                <button
                  className={`btn border border-secondary dropdown-toggle ${
                    isPopupOpen ? "disable-dropdown-tog" : ""
                  }`}
                  type="button"
                  id="filterDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ width: "9.2em" }}
                >
                  <img src={filter} alt="Filter" className="image-filter" />
                  {selectedAvailability || (date ? `Date: ${date}` : "Filter")}
                </button>
                <ul className="dropdown-menu" aria-labelledby="filterDropdown">
                  <li className="px-3 py-2">
                    <label htmlFor="dateFilter" className="form-label">
                      Filter by Date:
                    </label>
                    <input
                      type="date"
                      id="dateFilter"
                      className="form-control"
                      onChange={(e) => setDate(e.target.value)}
                      value={date || ""}
                    />
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item on-hover"
                      onClick={() => {
                        setSelectedAvailability("");
                        setDate(null);
                      }}
                    >
                      All
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item on-hover"
                      onClick={() => setSelectedAvailability("Cash")}
                    >
                      Cash
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item on-hover"
                      onClick={() => setSelectedAvailability("Online")}
                    >
                      Online
                    </button>
                  </li>
                </ul>
              </div>
            </span>
          </div>
        </div>

        <table>
          <thead className="head">
            <tr>
              <th>Sale</th>
              <th>Customer Name</th>
              <th>Customer Contact No</th>
              <th>Total Amount BTN</th>
              <th>Date</th>
              <th>Payment Method</th>
              <th>Jrnl. No</th>
            </tr>
          </thead>
          <tbody className="Contain">
            {currentItems.length > 0 ? (
              currentItems.map((sale, index) => (
                <tr key={index} className="on-hover">
                  <td>
                    <NavLink
                      to={`/sales/${sale.saleId}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {sale.saleId}
                    </NavLink>
                  </td>
                  <td>
                    <NavLink
                      to={`/sales/${sale.saleId}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {sale.customerName}
                    </NavLink>
                  </td>
                  <td>
                    <NavLink
                      to={`/sales/${sale.saleId}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {sale.contactNumber}
                    </NavLink>
                  </td>

                  <td>
                    <NavLink
                      to={`/sales/${sale.saleId}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {sale.totalAmount}
                    </NavLink>
                  </td>
                  <td>
                    <NavLink
                      to={`/sales/${sale.saleId}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {sale.saleDate}
                    </NavLink>
                  </td>
                  <td>
                    <NavLink
                      to={`/sales/${sale.saleId}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                      className="text-center d-flex justidy-content-center align-itemas-center"
                    >
                      <p
                        className={`mb-0 py-1 w-75 mx-auto rounded ${
                          sale.paymentMethod === "offline"
                            ? "outOfStock"
                            : "inStock "
                        }`}
                      >
                        {" "}
                        {sale.paymentMethod}
                      </p>{" "}
                    </NavLink>
                  </td>
                  <td>
                    <NavLink
                      to={`/sales/${sale.saleId}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {sale.journalNumber ? (
                        <p className="mb-0">{sale.journalNumber}</p>
                      ) : (
                        <p className="mb-0">-</p>
                      )}
                    </NavLink>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No sales found</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="text-end mt-3 d-flex justify-content-end gap-3">
          <button
            className="btn btn-sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            {" "}
            Page {currentPage} of {totalPages}{" "}
          </span>
          <button
            className="btn btn-sm border-secondary"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sales;
