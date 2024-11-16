import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/inventory.css";
import "./css/dashboard.css";
import { FaSearch } from "react-icons/fa";
import filter from "../assets/filter.svg";
import Popup from "../components/popup";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../auth/auth";
import defaultImage from "../assets/image.gif";
import loadingImage from "../assets/loadingdots2.gif";
import formatDate from "../utils/FormateDate";
import { useStore } from "../context/Store";
import sale1 from "../assets/sale1.svg";
import sale2 from "../assets/sale2.svg";
import sale3 from "../assets/sale3.svg";
import sale4 from "../assets/sale4.svg";
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
  const [searchTerm, setSearchTerm] = useState("");
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

  // Calculate current items based on pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Filter products based on search term and availability filter
  const filteredProducts = products
    .filter((p) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((p) =>
      selectedAvailability ? p.productAvailable === selectedAvailability : true
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
  const [popupType, setPopupType] = useState(null);

  const openPopup = (type) => setPopupType(type);
  const closePopup = () => setPopupType(null);

  const isPopupOpen = popupType !== null;
  const [color, setColor] = useState("gray");

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
    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    try {
      const request = await axios.post(
        "http://localhost:8081/api/product",
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

  useEffect(() => {
    refreshProducts();
    refreshCategory();
    refreshProductCount();
    refreshOutOfStockCount();
    refreshLowStock();
    refreshTotalRevenue();
  }, []);

  return (
    <div style={{height: "100vh"}}>
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
                    size="small"
                    content={
                      <div style={{zIndex: "100"}}>
                        <form onSubmit={handleAddProduct}>
                          <div className="product-field">
                            <label htmlFor="product" className="field-name">
                              Product Name
                            </label>
                            <input
                              name="name"
                              value={product.name}
                              type="text"
                              placeholder="Enter product name"
                              className="product-input"
                              onChange={handleInputChange}
                              autoComplete="off"
                            />
                          </div>

                          <div className="product-field">
                            <label htmlFor="category" className="field-name">
                              Category
                            </label>
                            <select
                              className="product-input selectPlaceholder"
                              value={product.category}
                              onChange={handleInputChange}
                              name="category"
                              id="category"
                            >
                              <option value="">Select category</option>
                              {categories.map((category) => {
                                return (
                                  <option value={category.name}>
                                    {category.name}
                                  </option>
                                );
                              })}
                            </select>
                          </div>

                          <div className="product-field">
                            <label htmlFor="buy" className="field-name">
                              Buying Price
                            </label>
                            <input
                              name="price"
                              value={product.price}
                              type="text"
                              placeholder="Enter buying price"
                              className="product-input"
                              onChange={handleInputChange}
                              autoComplete="off"
                            />
                          </div>
                          <div className="product-field">
                            <label htmlFor="quantity" className="field-name">
                              Quantity
                            </label>
                            <input
                              name="quantity"
                              value={product.quantity}
                              type="text"
                              placeholder="Enter product quantity"
                              className="product-input"
                              onChange={handleInputChange}
                              autoComplete="off"
                            />
                          </div>
                          <div className="product-field">
                            <label htmlFor="expire" className="field-name">
                              Expiry Date
                            </label>
                            <input
                              name="expirationDate"
                              value={product.expirationDate}
                              type="date"
                              placeholder="Enter expiry date"
                              className="product-input"
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="product-field">
                            <label htmlFor="threshold" className="field-name">
                              Threshold Value
                            </label>
                            <input
                              name="thresholdValue"
                              type="number"
                              value={product.thresholdValue}
                              placeholder="Enter threshold value"
                              className="product-input "
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="Image-form">
                            <input
                              type="file"
                              id="file"
                              className="imagefile"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                            <label htmlFor="file" className="uploadImage">
                              {previewUrl ? (
                                <img
                                  id="preview"
                                  src={previewUrl}
                                  alt="Selected"
                                  className="fit-image"
                                />
                              ) : (
                                <img
                                  src={defaultImage}
                                  alt="Default"
                                  className="fit-image"
                                /> // Use the imported default image
                              )}
                            </label>
                            <span className="img-des">Browse image</span>
                          </div>

                          <div className="Return">
                            <button
                              className="btn btn-sm"
                              type="cancel"
                              onClick={closePopup}
                            >
                              Discard
                            </button>
                            <button
                              className="btn btn-sm btn-primary"
                              type="submit"
                            >
                              Add Product
                            </button>
                          </div>
                        </form>
                      </div>
                    }
                    hideCloseButton={true}
                  />
                )}
                <div className="d-flex align-items-center">
                  <input
                    type="search"
                    placeholder="Search product..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control form-control-sm no-focus"
                  />
                </div>

                <span className="select">
                  <div
                    className={`dropdown ${
                      isPopupOpen ? "disable-dropdown" : ""
                    }`}
                  >
                    <button
                      className={`btn btn-sm border border-secondary dropdown-toggle ${
                        isPopupOpen ? "disable-dropdown-tog" : ""
                      }`}
                      type="button "
                      id="filterDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
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
                          className="dropdown-item"
                          onClick={() => setSelectedAvailability("")}
                        >
                          All
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => setSelectedAvailability("In-stock")}
                        >
                          In-stock
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() =>
                            setSelectedAvailability("Out of stock")
                          }
                        >
                          Out of stock
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => setSelectedAvailability("Low stock")}
                        >
                          Low stock
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
                      {" "}
                      {/* Center the image */}
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
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <img src={loadingImage} height={200} />
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
              className="btn btn-sm"
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
