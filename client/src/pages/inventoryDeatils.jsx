import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./css/inventorydetail.css";
import defaultImage from "../assets/image.gif";
import loadingImage from "../assets/loadingdots2.gif";
import Popup from "../components/popup";
import { useAuth } from "../auth/auth";
import { useStore } from "../context/Store";

const ProductDetail = () => {
  const { categories, refreshCategory } = useStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const { authorizationToken } = useAuth();
  const [product, setProduct] = useState({});
  const [newProduct, setNewProduct] = useState({});
  const [popupType, setPopupType] = useState(null);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const openPopup = (type) => setPopupType(type);
  const closePopup = () => setPopupType(null);

  const getProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/product/${id}`,
        {
          headers: { Authorization: authorizationToken },
        }
      );
      if (response.status === 200) {
        setProduct(response.data);
        setNewProduct({
          ...response.data,
          expirationDate: formatToInputDate(response.data.expirationDate),
        });
        setPreviewUrl(response.data.imageData || defaultImage);
      }
    } catch (error) {
      console.error("Failed to fetch product details.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(defaultImage);
      setImage(null);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "name",
      "quantity",
      "price",
      "category",
      "thresholdValue",
      "expirationDate",
    ];
    for (let field of requiredFields) {
      if (
        !newProduct[field] ||
        (typeof newProduct[field] === "number" && newProduct[field] <= 0)
      ) {
        toast.error(`${field} is invalid!`);
        return;
      }
    }

    const formattedExpirationDate = formatDate(newProduct.expirationDate);

    const formData = new FormData();
    if (image) formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob(
        [
          JSON.stringify({
            ...newProduct,
            expirationDate: formattedExpirationDate,
          }),
        ],
        { type: "application/json" }
      )
    );

    try {
      const response = await axios.put(
        `http://localhost:8081/api/product/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: authorizationToken,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Product updated successfully.");
        getProduct();
        closePopup();
      }
    } catch (error) {
      toast.error("Failed to update product.");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8081/api/product/${id}`,
        {
          headers: { Authorization: authorizationToken },
        }
      );
      if (response.status === 200) {
        navigate("/inventory", { replace: true });
        window.location.reload();

        toast.success("Product deleted successfully.");
      }
    } catch (error) {
      toast.error("Failed to delete product.");
    }
  };

  const formatToInputDate = (dateString) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("-");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  useEffect(() => {
    getProduct();
    refreshCategory();
  }, []);

  return (
    <div className="bg-white p-3 rounded">
      <div className="d-flex justify-content-between">
        <h3 className="">{product.name}</h3>
        <div className="gap-3 d-flex">
          <button
            className="btn border border-dark btn-hover"
            onClick={() => openPopup("editProduct")}
          >
            Edit
          </button>
          <button
            className="btn border border-dark btn-hover"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Delete
          </button>
        </div>
      </div>
      <hr />
      <div className="row gap-5 p-3">
        <div className="col-12 d-flex flex-row flex-lg-column justify-content-around justify-content-lg-start col-lg-4 border rounded p-3">
          <div className="mb-0">
            <div className="mb-4">
              <p className="mb-0">Name</p>
              <h5>{product.name}</h5>
            </div>
            <div className="mb-4">
              <p className="mb-0">Category</p>
              <h5>{product.category}</h5>
            </div>
            <div className="mb-4">
              <p className="mb-0">Selling Price</p>
              <h5>{product.price}</h5>
            </div>
          </div>
          <div>
            <div className="mb-4">
              <p className="mb-0">Expiry Date</p>
              <h5>{product.expirationDate}</h5>
            </div>
            <div className="mb-4">
              <p className="mb-0">Threshold Value</p>
              <h5>{product.thresholdValue}</h5>
            </div>
            <div className="mb-4">
              <p className="mb-0">Remaining Stock</p>
              <h5>{product.quantity}</h5>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7 border rounded p-3">
          <div className="d-flex justify-content-center">
            {product.imageData ? (
              <img
                src={product.imageData}
                loading="lazy"
                alt="Product"
                className="image"
                style={{ objectFit: "fit" }}
              />
            ) : (
              <img src={loadingImage} className="image" />
            )}
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Confirm Delete
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <p>
                Are you sure you want to delete this product? This action cannot
                be undone.
              </p>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn" data-bs-dismiss="modal">
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleDelete}
                aria-label="Close"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {popupType === "editProduct" && (
        <Popup
          show={true}
          onClose={closePopup}
          title="Edit Product"
          content={
            <form onSubmit={handleEditProduct} className="edit-product-form">
              <div className="form-content d-flex justify-content-between flex-wrap">
                <div className="form-section">
                  <div className="mb-3">
                    <label htmlFor="product" className="form-label">
                      Product Name
                    </label>
                    <input
                      name="name"
                      value={newProduct.name}
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
                      value={newProduct.category}
                      onChange={handleInputChange}
                      name="category"
                      id="category"
                    >
                      <option value="">Select category</option>
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>Loading categories...</option>
                      )}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="buy" className="form-label">
                      Buying Price
                    </label>
                    <input
                      name="price"
                      value={newProduct.price}
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
                      value={newProduct.quantity}
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
                      value={newProduct.expirationDate}
                      type="date"
                      className="form-control no-focus"
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
                      value={newProduct.thresholdValue}
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
                  className="btn  me-2"
                  type="button"
                  onClick={closePopup}
                >
                  Discard
                </button>
                <button
                  className="btn btn-primary "
                  data-bs-dismiss="modal"
                  type="submit"
                >
                  Update Product
                </button>
              </div>
            </form>
          }
        />
      )}
    </div>
  );
};

export default ProductDetail;
