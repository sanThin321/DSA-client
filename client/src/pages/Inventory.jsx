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

const Inventory = () => {
  const {products, refreshProducts, categories, refreshCategory} = useStore();
  const navigate = useNavigate();
  const { authorizationToken } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [product, setProduct] = useState({
    name: "",
    quantity: 0,
    unit: "",
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
  }, []);
  
  return (
    <div>
      <div className="incontainer">
        <div className="Container-item iT-1">
          <h2 className="topic">Overall Inventory</h2>
          <div className="inventory-detail">
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
                      <form onSubmit={handleAddProduct}>
                        <div className="Image-form">
                          <input
                            type="file"
                            id="file"
                            className="imagefile"
                            accept="image/*"
                            // onChange={handleImageChange}
                            onChange={handleImageChange}
                            required
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
                        <div className="product-field">
                          <label htmlFor="product" className="field-name">
                            Product Name
                          </label>
                          <input
                            name="name"
                            value={product.name}
                            type="text"
                            placeholder="Enter product name"
                            required
                            className="product-input"
                            onChange={handleInputChange}
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
                            {
                              categories.map((category) => {
                                return <option value={category.name}>{category.name}</option>
                              })
                            }   
                          </select>
                        </div>

                        <div className="product-field">
                          <label htmlFor="buy" className="field-name">
                            Buying Price
                          </label>
                          <input
                            name="price"
                            value={product.price}
                            type="number"
                            placeholder="Enter buying price"
                            required
                            className="product-input"
                            onChange={handleInputChange}
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
                            required
                            className="product-input"
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="product-field">
                          <label htmlFor="unit" className="field-name">
                            Unit
                          </label>
                          <input
                            name="unit"
                            value={product.unit}
                            type="text"
                            placeholder="Enter product unit"
                            required
                            className="product-input"
                            onChange={handleInputChange}
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
                            required
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
                            required
                            className="product-input"
                            onChange={handleInputChange}
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
                          src={`data:image/jpeg;base64,${product.imageData}`}
                          loading="lazy"
                          alt="Product"
                          width={40}
                          height={40} 
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
                    <td
                      className={
                        product.productAvailable ? "instock" : "outofstock"
                      }
                    >
                      {product.productAvailable ? "Available" : "Out of stock"}
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
