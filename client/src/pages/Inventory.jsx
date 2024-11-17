import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/inventory.css";
import "./css/dashboard.css";
import filter from "../assets/filter.svg";
import Popup from "../components/popup";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../auth/auth";
import defaultImage from "../assets/image.gif";
import formatDate from "../utils/FormateDate";
import { useStore } from "../context/Store";
import sale2 from "../assets/sale2.svg";
import sale3 from "../assets/sale3.svg";
import insale1 from "../assets/insale1.svg";

const Inventory = () => {
  const {
    products,
    refreshProducts,
    categories,
    refreshCategory,
    pcount,
    refreshProductCount,
    totalRevenue,
    refreshOutOfStockCount,
    outOfStock,
    refreshLowStock,
    lowStock,
    refreshTotalRevenue,
  } = useStore();
  const navigate = useNavigate();
  const { authorizationToken } = useAuth();
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [product, setProduct] = useState({
    name: "",
    quantity: 0,
    price: 0,
    category: "",
    thresholdValue: 0,
    expirationDate: "",
    productAvailable: true,
  });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentDate = new Date();

  const filteredProducts = products.filter((product) => {
    switch (selectedAvailability) {
      case "":
        return true;
      case "Out of stock":
        return product.quantity <= 0;
      case "Low stock":
        return product.quantity <= product.thresholdValue;
      case "Expired": {
        const [day, month, year] = product.expirationDate
          .split("-")
          .map(Number);
        const productExpirationDate = new Date(year, month - 1, day);
        return productExpirationDate < currentDate;
      }
      default:
        return true;
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
  const [popupType, setPopupType] = useState(null);

  const openPopup = (type) => setPopupType(type);
  const closePopup = () => setPopupType(null);

  const isPopupOpen = popupType !== null;

  // add product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!product.name.trim()) {
      toast.error("Product name is required!");
      return;
    }
    if (!product.quantity || product.quantity <= 0) {
      toast.error("Quantity must be greater than 0!");
      return;
    }

    if (!product.price || product.price <= 0) {
      toast.error("Price must be greater than 0!");
      return;
    }
    if (!product.category.trim()) {
      toast.error("Category is required!");
      return;
    }
    if (!product.thresholdValue || product.thresholdValue <= 0) {
      toast.error("Threshold value must be greater than 0!");
      return;
    }

    if (!product.expirationDate.trim()) {
      toast.error("Expiration date is required!");
      return;
    }

    if (!image) {
      toast.error("Product image is required!");
      return;
    }

    const formattedDate = new Date(product.expirationDate)
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-");

    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob(
        [JSON.stringify({ ...product, expirationDate: formattedDate })],
        { type: "application/json" }
      )
    );

    try {
      const request = await axios.post(
        "https://inventory-management-for-4sale-backend.onrender.com/api/product",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: authorizationToken,
          },
        }
      );

      if (request.status === 201) {
        toast.success("Product added successfully.");
        refreshProducts();
      }
    } catch (error) {
      toast.error("Error adding product.");
    }
    closePopup();
  };

  const handleSearch = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true);
      try {
        const response = await axios.get(
          `https://inventory-management-for-4sale-backend.onrender.com/api/product/search?query=${value}`,
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
    refreshProducts();
    refreshCategory();
    refreshProductCount();
    refreshOutOfStockCount();
    refreshLowStock();
    refreshTotalRevenue();
  }, [products]);

  return (
    <div style={{ height: "100vh" }}>
      <div className="incontainer">
        <div className="bg-white rounded p-3 d-flex justify-content-between align-items-center">
          <div className="d-flex gap-3">
            <img src={sale3} width={43} alt="icon" />
            <div>
              <h5 className="mb-0">{pcount}</h5>

              <p className="mb-0">
                <small>Total Products</small>
              </p>
            </div>
          </div>
          <div className="Hline" />
          <div className="d-flex gap-3">
            <img src={sale2} alt="icon" width={43} />
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
              <h5 className="mb-0">{lowStock.length}</h5>
              <p className="mb-0">
                <small>Low Stock</small>
              </p>
            </div>
          </div>
          <div className="Hline" />
          <div className="d-flex gap-3">
            <img src={insale1} width={43} alt="icon" />
            <div>
              <h5 className="mb-0">{outOfStock}</h5>

              <p className="mb-0">
                <small>Out of Stock</small>
              </p>
            </div>
          </div>
        </div>
        <div className="Container-item iT-2 p-3">
          <div className="d-flex justify-content-between align-items-center py-0 mb-3">
            <h4 className="py-0">Products</h4>
            <div>
              <div className="d-flex gap-3 py-0">
                <button
                  className="btn btn-primary py-0"
                  onClick={() => openPopup("addProduct")}
                >
                  Add Product
                </button>
                {popupType === "addProduct" && (
                  <Popup
                    show={true}
                    onClose={closePopup}
                    title="Add New Product"
                    content={
                      <form
                        onSubmit={handleAddProduct}
                        className="add-product-form"
                      >
                        <div className="form-content d-flex justify-content-between flex-wrap">
                          <div className="form-section">
                            <div className="mb-3">
                              <label htmlFor="product" className="form-label">
                                Product Name
                              </label>
                              <input
                                name="name"
                                value={product.name}
                                type="text"
                                placeholder="Enter product name"
                                className="form-control no-focus"
                                onChange={handleInputChange}
                                autoComplete="off"
                              />
                            </div>

                            <div className="mb-3">
                              <label htmlFor="category" className="form-label">
                                Category
                              </label>
                              <select
                                className="form-control no-focus"
                                value={product.category}
                                onChange={handleInputChange}
                                name="category"
                                id="category"
                              >
                                <option value="">Select category</option>
                                {categories.length > 0 ? (
                                  categories.map((category) => (
                                    <option
                                      key={category.name}
                                      value={category.name}
                                    >
                                      {category.name}
                                    </option>
                                  ))
                                ) : (
                                  <option disabled>
                                    Loading categories...
                                  </option>
                                )}
                              </select>
                            </div>

                            <div className="mb-3">
                              <label htmlFor="buy" className="form-label">
                                Buying Price
                              </label>
                              <input
                                name="price"
                                value={product.price}
                                type="text"
                                placeholder="Enter buying price"
                                className="form-control no-focus"
                                onChange={handleInputChange}
                                autoComplete="off"
                              />
                            </div>

                            <div className="mb-3">
                              <label htmlFor="quantity" className="form-label">
                                Quantity
                              </label>
                              <input
                                name="quantity"
                                value={product.quantity}
                                type="text"
                                placeholder="Enter product quantity"
                                className="form-control no-focus"
                                onChange={handleInputChange}
                                autoComplete="off"
                              />
                            </div>

                            <div className="mb-3">
                              <label htmlFor="expire" className="form-label">
                                Expiry Date
                              </label>
                              <input
                                name="expirationDate"
                                value={product.expirationDate}
                                type="date"
                                className="form-control no-focus"
                                min={new Date().toISOString().split("T")[0]}
                                onChange={handleInputChange}
                              />
                            </div>

                            <div className="mb-3">
                              <label htmlFor="threshold" className="form-label">
                                Threshold Value
                              </label>
                              <input
                                name="thresholdValue"
                                type="number"
                                value={product.thresholdValue}
                                placeholder="Enter threshold value"
                                className="form-control no-focus"
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>

                          <div className="image-section">
                            <div className="image-upload mt-3">
                              <input
                                type="file"
                                id="file"
                                accept="image/*"
                                onChange={handleImageChange}
                              />
                              <label htmlFor="file" className="image-label">
                                {previewUrl ? (
                                  <img
                                    id="preview"
                                    src={previewUrl}
                                    alt="Selected"
                                    className="image-preview"
                                  />
                                ) : (
                                  <img
                                    src={defaultImage}
                                    alt="Default"
                                    className="image-preview"
                                  />
                                )}
                              </label>
                              <span className="img-des">Browse image</span>
                            </div>
                          </div>
                        </div>
                        <hr />
                        <div className="form-footer d-flex justify-content-end">
                          <button
                            className="btn me-2 btn-sm"
                            type="button"
                            onClick={closePopup}
                          >
                            Discard
                          </button>
                          <button
                            className="btn btn-primary btn-sm"
                            type="submit"
                          >
                            Add Product
                          </button>
                        </div>
                      </form>
                    }
                  />
                )}

                <div className="d-flex flex-column align-items-center position-relative">
                  <input
                    type="search"
                    placeholder="Search product..."
                    onChange={(e) => handleSearch(e.target.value)}
                    className="form-control no-focus text-dark"
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
                                  <img
                                    src={result.imageData}
                                    alt="product-image"
                                    width={20}
                                  />
                                  <p className="mb-0">{result.name}</p>
                                </div>
                              </NavLink>
                            </li>
                          ))
                        : noResults && (
                            <li className="list-group-item text-muted text-center">
                              No Product with such Name
                            </li>
                          )}
                    </ul>
                  )}
                </div>

                <span className="select">
                  <div
                    className={`dropdown ${
                      isPopupOpen ? "disable-dropdown" : ""
                    }`}
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
                      <img src={filter} alt="" className="image-filter" />
                      {selectedAvailability || "Filter"}
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="filterDropdown"
                    >
                      <li>
                        <button
                          className="dropdown-item on-hover"
                          onClick={() => setSelectedAvailability("")}
                        >
                          All
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item on-hover"
                          onClick={() =>
                            setSelectedAvailability("Out of stock")
                          }
                        >
                          Out of stock
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item on-hover"
                          onClick={() => setSelectedAvailability("Low stock")}
                        >
                          Low stock
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item on-hover"
                          onClick={() => setSelectedAvailability("Expired")}
                        >
                          Expired
                        </button>
                      </li>
                    </ul>
                  </div>
                </span>
              </div>
            </div>
          </div>

          <table>
            <thead className="head">
              <tr>
                <th>Image</th>
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
                  <tr
                    key={index}
                    onClick={() => navigate(`/inventory/${product.productId}`)}
                    style={{ cursor: "pointer" }}
                    className="on-hover"
                  >
                    <td style={{ textAlign: "center" }}>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <img
                          src={product.imageData}
                          loading="lazy"
                          alt="Product"
                          width={40}
                        />
                      </div>
                    </td>
                    <td>
                      <NavLink
                        to={`/inventory/${product.name}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {product.name}
                      </NavLink>
                    </td>
                    <td>{product.price}</td>
                    <td>{product.quantity}</td>
                    <td>{product.thresholdValue}</td>
                    <td>{formatDate(product.expirationDate)}</td>
                    <td>
                      <p
                        className={`mb-0 py-1 rounded px-0 w-75 ${
                          product.quantity > 0
                            ? "instock inStock"
                            : "outofstock outOfStock"
                        }`}
                      >
                        {product.quantity > 0 ? "Available" : "Out of stock"}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    <p>No products available.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* <hr /> */}
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
              className="btn btn-sm border border-dark"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
