import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import filter from "../assets/filter.svg";
import "./css/sale.css";
import { NavLink } from "react-router-dom";
const Sales = () => {

 const productsData = [
    {
      id: 213,
      customername: "Sangay Thinley",
      customercontact: 77615421,
      payment:"Credit card",
      amount: 500,
      date: "11/12/22",
      jrnl: 3444386,
    },
    {
      id: 214,
      customername: "Tenzin Wangchuk",
      customercontact: 77615422,
      payment:"Credit card",
      amount: 700,
      date: "12/12/22",
      jrnl: 3444387,
    },
  ];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredProducts = productsData.filter((product) => {
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
    "":"Filter",
    id: "Sale Id",
    customername: "Name",
    customercontact: "Contact No",
    amount: "Total Amount",
    date: "Date",
    jrnl: "Journal No",
  };


  return (
    <div>
      <div className="overall">
        <h1 className="topic">Overall Sales</h1>
        <div className="revenue_detail">
          <div>
            <p className="revenue_T">Yearly Revenue</p>
            <p className="revenue_V">
              BTN <span>25,000</span>
            </p>
            <p className="moment">2024</p>
          </div>
          <div>
            <p className="revenue_T">Monthly Revenue</p>

            <p className="revenue_V">
              BTN <span>25,000</span>
            </p>
            <p className="moment">January</p>
          </div>
          <div>
            <p className="revenue_T">Weekly Revenue</p>

            <p className="revenue_V">
              BTN <span>25,000</span>
            </p>
            <p className="moment">1st week</p>
          </div>
          <div>
            <p className="revenue_T">Total Number of Sale</p>

            <p className="revenue_V">
              BTN <span>25,000</span>
            </p>
            <p className="moment">Monthly</p>
          </div>
        </div>
      </div>
      <div className="salesadd">
        <h2 className="topic search-1">
          Sales
          <span className="pan">
            <NavLink
              to={`/sales/add-sale`}
              style={{ textDecoration: "none", color: "inherit", marginTop:"5px" }}
            >
              <span className="addButton">Add sale</span>
            </NavLink>

            <span className="search">
              <span>
                <FaSearch className="icon-search" />
              </span>
              <input
                type="text"
                placeholder="Search sales..."
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </span>
            <span className="select">
              <div className="filter-dropdown">
                <button className="dropdown-tog extended">
                  <img src={filter} alt="" className="image-filter" />
                  {columnMapping[selectedColumn]}
                </button>
                <ul className="dropdown-men">
                  {Object.keys(columnMapping).map((key) => (
                    <li key={key} onClick={() => setSelectedColumn(key)}>
                      {columnMapping[key]}
                    </li>
                  ))}
                </ul>
              </div>
            </span>
          </span>
        </h2>
        <table>
          <thead className="head">
            <tr>
              <th>Sale Id</th>
              <th>Customer Name</th>
              <th>Customer Contact No</th>
              <th>PaymentMethod</th>
              <th>Total Amount BTN</th>
              <th>Date</th>
              <th>Jrnl. No</th>
            </tr>
          </thead>
          <tbody className="Contain">
            {currentItems.length > 0 ? (
              currentItems.map((product, index) => (
                <tr key={index}>
                  {/* Each cell should be wrapped individually in NavLink */}
                  <td>
                    <NavLink
                      to={`/sales/${product.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {product.id}
                    </NavLink>
                  </td>
                  <td>
                    <NavLink
                      to={`/sales/${product.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {product.customername}
                    </NavLink>
                  </td>
                  <td>
                    <NavLink
                      to={`/sales/${product.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {product.customercontact}
                    </NavLink>
                  </td>
                  <td>
                    <NavLink
                      to={`/sales/${product.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {product.payment}
                    </NavLink>
                  </td>
                  <td>
                    <NavLink
                      to={`/sales/${product.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {product.amount}
                    </NavLink>
                  </td>
                  <td>
                    <NavLink
                      to={`/sales/${product.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {product.date}
                    </NavLink>
                  </td>
                  <td>
                    <NavLink
                      to={`/sales/${product.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {product.jrnl}
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

        {/* Pagination controls */}
        <div className="Btn">
          <span
            className="Btn-shape"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </span>
          <span>
            {" "}
            Page {currentPage} of {totalPages}{" "}
          </span>
          <span
            className="Btn-shape"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sales;
