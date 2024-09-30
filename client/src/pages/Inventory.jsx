import React, { useState } from "react";
import "./css/inventory.css";
import "./css/dashboard.css";
import { FaSearch } from "react-icons/fa";
import filter from "../assets/filter.svg";
import Popup from "../components/popup";
import { NavLink } from "react-router-dom";
const Inventory = () => {
  const productsData = [
    {
      product: "Maggi",
      price: 430,
      quantity: "43 Packets",
      threshold: "12 Packets",
      expiry: "11/12/22",
      availability: "In-stock",
    },
    {
      product: "Picpic",
      price: 257,
      quantity: "22 Packets",
      threshold: "12 Packets",
      expiry: "21/12/22",
      availability: "Out of stock",
    },
    {
      product: "Red Bull",
      price: 405,
      quantity: "36 Packets",
      threshold: "9 Packets",
      expiry: "5/12/22",
      availability: "In-stock",
    },
    {
      product: "Red Bull",
      price: 405,
      quantity: "36 Packets",
      threshold: "9 Packets",
      expiry: "5/12/22",
      availability: "In-stock",
    },
    {
      product: "Red Bull",
      price: 405,
      quantity: "36 Packets",
      threshold: "9 Packets",
      expiry: "5/12/22",
      availability: "In-stock",
    },
    {
      product: "Red Bull",
      price: 405,
      quantity: "36 Packets",
      threshold: "9 Packets",
      expiry: "5/12/22",
      availability: "In-stock",
    },
    {
      product: "Red Bull",
      price: 405,
      quantity: "36 Packets",
      threshold: "9 Packets",
      expiry: "5/12/22",
      availability: "In-stock",
    },
    {
      product: "Red Bull",
      price: 405,
      quantity: "36 Packets",
      threshold: "9 Packets",
      expiry: "5/12/22",
      availability: "In-stock",
    },
    {
      product: "Red Bull",
      price: 405,
      quantity: "36 Packets",
      threshold: "9 Packets",
      expiry: "5/12/22",
      availability: "In-stock",
    },
    {
      product: "Red Bull",
      price: 405,
      quantity: "36 Packets",
      threshold: "9 Packets",
      expiry: "5/12/22",
      availability: "In-stock",
    },
    {
      product: "Red Bull",
      price: 405,
      quantity: "36 Packets",
      threshold: "9 Packets",
      expiry: "5/12/22",
      availability: "In-stock",
    },
    {
      product: "Coca cola",
      price: 205,
      quantity: "41 Packets",
      threshold: "10 Packets",
      expiry: "11/11/22",
      availability: "Low stock",
    },
  ];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState(""); // New state for availability filter
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate current items based on pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Filter products based on search term and availability filter
  const filteredProducts = productsData
    .filter((product) =>
      product.product.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) =>
      selectedAvailability
        ? product.availability === selectedAvailability
        : true
    );

  // Get current page items after filtering
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calculate total pages
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
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl); // Update state with the new image URL
    }
  };
  const [popupType, setPopupType] = useState(null);

  const openPopup = (type) => setPopupType(type);
  const closePopup = () => setPopupType(null);

  const isPopupOpen = popupType !== null;
  return (
    <div>
      <div className="incontainer">
        <div className="Container-item iT-1">
          <h2 className="topic">Overall Inventory</h2>
          <div className="inventory-details">
            <div className="details">
              <h3 className="Subtopic category">Categories</h3>
              <p className="describeinN">14</p>
              <p className="describe">
                Last <span>7</span> days
              </p>
            </div>
            <div className="Line" />
            <div className="details">
              <h3 className="Subtopic product">Total Products</h3>
              <div className="dayandRevenue">
                <div className="day">
                  <p className="describeinN">868</p>
                  <p className="describe">
                    Last <span>7</span> days
                  </p>
                </div>
                <div className="revenue">
                  <p className="describeinN">
                    BTN<span>14</span>
                  </p>
                  <p className="describe">Revenue</p>
                </div>
              </div>
            </div>
            <div className="Line" />
            <div className="details">
              <h3 className="Subtopic top">Top Selling</h3>
              <div className="productandcost">
                <div className="product">
                  <p className="describeinN">Maggi</p>
                  <p className="describe">
                    Last <span>7</span> days
                  </p>
                </div>
                <div className="cost">
                  <p className="describeinN">
                    BTN<span>14</span>
                  </p>
                  <p className="describe">Cost</p>
                </div>
              </div>
            </div>
            <div className="Line" />
            <div className="details">
              <h3 className="Subtopic low">Low Stocks</h3>
              <div className="lowStock">
                <div className="product">
                  <p className="describeinN">12</p>
                  <p className="describe">Low Stock</p>
                </div>
                <div className="cost">
                  <p className="describeinN">2</p>
                  <p className="describe">Not in stock</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="Container-item iT-2">
          <h2 className="topic search-1">
            Products
            <span className="pan">
              <span
                className="addButton"
                onClick={() => openPopup("addProduct")}
              >
                AddButton
              </span>
              {popupType === "addProduct" && (
                <Popup
                  show={true}
                  onClose={closePopup}
                  title="New Product"
                  size="small"
                  content={
                    <div>
                      <form action="">
                        <div className="Image-form">
                          <input
                            type="file"
                            id="file"
                            className="imagefile"
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                          />
                          <label htmlFor="file" className="uploadImage">
                            {imagePreview ? (
                              <img
                                id="preview"
                                src={imagePreview}
                                alt="Selected"
                              />
                            ) : (
                              ""
                            )}
                          </label>
                          <span className="img-des">Browse image</span>
                        </div>
                        <div className="product-field">
                          <label htmlFor="product" className="field-name">
                            Product Name
                          </label>
                          <input
                            type="text"
                            placeholder="Enter product name"
                            required
                            className="product-input"
                          />
                        </div>
                        <div className="product-field">
                          <label htmlFor="Product-id" className="field-name">
                            Product ID
                          </label>
                          <input
                            type="text"
                            placeholder="Enter product ID"
                            required
                            className="product-input"
                          />
                        </div>
                        <div className="product-field">
                          <label htmlFor="category" className="field-name">
                            Category
                          </label>
                          <input
                            type="text"
                            placeholder="Select product category"
                            required
                            className="product-input"
                          />
                        </div>
                        <div className="product-field">
                          <label htmlFor="buy" className="field-name">
                            Buying Price
                          </label>
                          <input
                            type="text"
                            placeholder="Enter buying price"
                            required
                            className="product-input"
                          />
                        </div>
                        <div className="product-field">
                          <label htmlFor="quantity" className="field-name">
                            Quantity
                          </label>
                          <input
                            type="text"
                            placeholder="Enter product quantity"
                            required
                            className="product-input"
                          />
                        </div>
                        <div className="product-field">
                          <label htmlFor="unit" className="field-name">
                            Unit
                          </label>
                          <input
                            type="text"
                            placeholder="Enter product unit"
                            required
                            className="product-input"
                          />
                        </div>
                        <div className="product-field">
                          <label htmlFor="expire" className="field-name">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            placeholder="Enter expiry date"
                            required
                            className="product-input"
                          />
                        </div>
                        <div className="product-field">
                          <label htmlFor="threshold" className="field-name">
                            Threshold Value
                          </label>
                          <input
                            type="text"
                            placeholder="Enter threshold value"
                            required
                            className="product-input"
                          />
                        </div>

                        <div className="Return">
                          <button
                            className="send cancel re"
                            type="cancel"
                            onClick={closePopup}
                          >
                            Discard
                          </button>
                          <button className="send add re" type="submit">
                            Add Category
                          </button>
                        </div>
                      </form>
                    </div>
                  }
                  hideCloseButton={true}
                />
              )}
              <span className="search">
                <span>
                  <FaSearch className="icon-search" />
                </span>
                <input
                  type="text"
                  placeholder="Search product..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </span>

              {/* Filter by Availability */}
              <span className="select">
                <div className="filter-dropdown">
                  <button
                    className={`dropdown-tog ${
                      isPopupOpen ? "disable-dropdown-tog" : ""
                    }`}
                  >
                    <img src={filter} alt="" className="image-filter" />
                    {selectedAvailability || "Filter"}
                  </button>
                  <ul
                    className={`dropdown-men ${
                      isPopupOpen ? "disable-dropdown" : ""
                    }`}
                  >
                    <li onClick={() => setSelectedAvailability("")}>All</li>
                    <li onClick={() => setSelectedAvailability("In-stock")}>
                      In-stock
                    </li>
                    <li onClick={() => setSelectedAvailability("Out of stock")}>
                      Out of stock
                    </li>
                    <li onClick={() => setSelectedAvailability("Low stock")}>
                      Low stock
                    </li>
                  </ul>
                </div>
              </span>
            </span>
          </h2>
          <table>
            <thead className="head">
              <tr>
                <th>Products</th>
                <th>Buying Price BTN</th>
                <th>Quantity</th>
                <th>Threshold Value</th>
                <th>Expiry Date</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody className="Contain">
              {currentItems.length > 0 ? (
                currentItems.map((product, index) => (
                  <tr key={index}>
                    {/* Each cell should be wrapped individually in NavLink */}
                    <td>
                      <NavLink
                        to={`/inventory/${product.product}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {product.product}
                      </NavLink>
                    </td>
                    <td>
                      <NavLink
                        to={`/inventory/${product.product}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {product.price}
                      </NavLink>
                    </td>
                    <td>
                      <NavLink
                        to={`/inventory/${product.product}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {product.quantity}
                      </NavLink>
                    </td>
                    <td>
                      <NavLink
                        to={`/inventory/${product.product}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {product.threshold}
                      </NavLink>
                    </td>
                    <td>
                      <NavLink
                        to={`/inventory/${product.product}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {product.expiry}
                      </NavLink>
                    </td>
                    <td
                      className={
                        product.availability === "In-stock"
                          ? "instock"
                          : product.availability === "Out of stock"
                          ? "outofstock"
                          : "lowstock"
                      }
                    >
                      <NavLink
                        to={`/inventory/${product.product}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {product.availability}
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
    </div>
  );
};

export default Inventory;
