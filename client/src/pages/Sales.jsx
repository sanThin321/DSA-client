import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import filter from "../assets/filter.svg";
import "./css/sale.css";
import { NavLink } from "react-router-dom";
import { useStore } from "../context/Store";
import sale1 from "../assets/sale1.svg";
import sale2 from "../assets/sale2.svg";
import sale3 from "../assets/sale3.svg";
import sale4 from "../assets/sale4.svg";
import insale1 from "../assets/insale1.svg";

const Sales = () => {
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

  //  const sales = [
  //     {
  //       id: 213,
  //       customername: "Sangay Thinley",
  //       customercontact: 77615421,
  //       payment:"Credit card",
  //       amount: 500,
  //       date: "11/12/22",
  //       jrnl: 3444386,
  //     },
  //     {
  //       id: 214,
  //       customername: "Tenzin Wangchuk",
  //       customercontact: 77615422,
  //       payment:"Credit card",
  //       amount: 700,
  //       date: "12/12/22",
  //       jrnl: 3444387,
  //     },
  //   ];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredProducts = sales.filter((product) => {
    if (selectedColumn === "") {
      // Apply the filter to all columns
      return Object.values(product).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      // Apply the filter to the selected column
      const valueToFilter = product[selectedColumn].toString().toLowerCase();
      return valueToFilter.includes(searchTerm.toLowerCase());
    }
  });

  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const columnMapping = {
    "": "Filter",
    id: "Sale Id",
    customername: "Name",
    customercontact: "Contact No",
    amount: "Total Amount",
    date: "Date",
    jrnl: "Journal No",
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

            <div className="d-flex align-items-center">
              <input
                type="search"
                placeholder="Search sales..."
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control form-control-sm no-focus"
              />
            </div>
            <span className="select">
              <div className="dropdown">
                <button
                  className="btn btn-sm border-dark dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={filter}
                    alt=""
                    className="me-2"
                    style={{ width: "16px", height: "16px" }}
                  />
                  {columnMapping[selectedColumn]}
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  {Object.keys(columnMapping).map((key) => (
                    <li key={key}>
                      <button
                        className="dropdown-item"
                        onClick={() => setSelectedColumn(key)}
                      >
                        {columnMapping[key]}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </span>
          </div>
        </div>

        <table>
          <thead className="head">
            <tr>
              <th>Sale Id</th>
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
                      {sale.journalNumber}
                    </NavLink>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No products found</td>
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
