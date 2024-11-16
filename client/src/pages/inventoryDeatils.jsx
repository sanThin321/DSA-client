import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./css/inventorydetail.css";
import edit_update from "../assets/edit.svg";
import edit_delete from "../assets/delete.svg";
import "./css/inventory.css";
import Popup from "../components/popup";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../auth/auth";
import loadingImage from "../assets/loadingdots2.gif";
import formatDate from "../utils/FormateDate";

const ProductDetail = () => {
  const navigate = useNavigate();
  const { authorizationToken } = useAuth();
  const { id } = useParams();
  const [imagePreview, setImagePreview] = useState(null);
  const [product, setProduct] = useState({});

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
  const [color, setColor] = useState("gray");

  const handleChange = (event) => {
    setColor(event.target.value === "" ? "gray" : "black");
  };
  const handleAddProduct = (e) => {
    e.preventDefault();
    setNewProduct(""); // Clear the input field
    closePopup(); // Close the popup
  };

  // get product

  const getProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/product/${id}`,
        {
          headers: {
            Authorization: authorizationToken,
          },
        }
      );

      if (response.status === 200) {
        setProduct(response.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // delete products
  const deletProduct = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8081/api/product/${id}`,
        {
          headers: {
            Authorization: authorizationToken,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Product deleted successfully.");
        navigate("/inventory");
      }
    } catch (error) {
      toast.error("Failed to delete. Try again later.");
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div>
      <div className="p-detail">
        {/* <h2>Product Detail for ID: {id}</h2> */}
        <h2 className="topic over">
          {product.name}
          <span className="editCase">
            <span className="edit" onClick={() => openPopup("addProduct")}>
              <img src={edit_update} alt="" className="image-icon" /> Edit
            </span>
            {popupType === "addProduct" && (
              <Popup
                show={true}
                onClose={closePopup}
                title="New Product"
                size="small"
                content={
                  <div>
                    <form action="" onSubmit={handleAddProduct}>
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
                        <select
                          name="product"
                          id="productSelect"
                          className="product-input selectPlaceholder"
                          style={{ color: color }}
                          onChange={handleChange}
                          defaultValue=""
                        >
                          <option value="" disabled hidden>
                            Select product category
                          </option>
                          <option value="maggi1">Maggi 1</option>
                          <option value="maggi2">Maggi 2</option>
                          <option value="maggi3">Maggi 3</option>
                          <option value="maggi4">Maggi 4</option>
                        </select>
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
            <span
              className="edit"
              onClick={() => deletProduct(product.productId)}
            >
              <img src={edit_delete} alt="delete btn" className="image-icon" />{" "}
              Delete
            </span>

            <span className="edit">Download</span>
          </span>
        </h2>
        <div className="containerforoverview">
          <h3 className="overviewT">Over View</h3>
          <p className="hor"></p>
          <div className="primaryDetails">
            <div>
              <h4 className="prTopic">Primary Details</h4>
              <li className="detail">
                Product name<span className="detailsValue">{product.name}</span>
              </li>
              <li className="detail">
                Product category
                <span className="detailsValue">{product.category}</span>
              </li>
              <li className="detail">
                Expiry Date
                <span className="detailsValue">
                  {formatDate(product.expirationDate)}
                </span>
              </li>

              <li className="detail">
                Threshold Value
                <span className="detailsValue">{product.thresholdValue}</span>
              </li>
              <li className="detail">
                Price<span>{product.price}</span>
              </li>
              <br />
              <h4 className="prTopic">Stock</h4>
              <li className="detail">
                Remaining Stock{" "}
                <span>{product.quantity}</span>
              </li>
            </div>
            <div>
              <div className="image_border rounded">
                {product.imageData ? (
                  <img
                    src={product.imageData}
                    loading="lazy"
                    alt="Product"
                    className="fit-image"
                  />
                ) : (
                  <img src={loadingImage} className="fit-image" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
