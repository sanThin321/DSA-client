import React, { useState, useEffect } from "react";
import "./css/dashboard.css";
import sale1 from "../assets/sale1.svg";
import sale2 from "../assets/sale2.svg";
import sale3 from "../assets/sale3.svg";
import sale4 from "../assets/sale4.svg";
import insale1 from "../assets/insale1.svg";
import junk1 from "../assets/junk1.svg";
import BarChart from "../components/barChart";
import Popup from "../components/popup";
import axios from "axios";
import { useAuth } from "../auth/auth";
import { toast } from "react-toastify";
import { useStore } from "../context/Store";

const Dashboard = () => {
  const { authorizationToken } = useAuth();
  const {
    categories,
    refreshCategory,
    refreshTotalRevenue,
    totalRevenue,
    refreshSalesCount,
    salesCount,
    refreshOutOfStockCount,
    outOfStock,
  } = useStore();
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [categoryId, setCategoryId] = useState(0);
  const getLowStockProducts = async (date) => {
    try {
      const res = await axios.get(
        `https://inventory-management-for-4sale-backend.onrender.com/api/sale/top-selling-products-by-date/${date}`,
        {
          headers: {
            Authorization: authorizationToken,
          },
        }
      );

      if (res.status === 200) {
        setData(res.data.products);
      }

      console.log("highest: ", data);
    } catch (error) {
      console.error("Error fetching low stock products: ", error);
    }
  };

  const fetchLowStockItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://inventory-management-for-4sale-backend.onrender.com/api/stats/product/low-stock",
        {
          headers: {
            Authorization: authorizationToken,
          },
        }
      );
      if (response.status === 200) {
        setLowStockItems(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch low stock items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const request = await axios.delete(
        `https://inventory-management-for-4sale-backend.onrender.com/api/category/${categoryId}`,
        {
          headers: {
            Authorization: authorizationToken,
          },
        }
      );

      if (request.status === 200) {
        toast.success("Category deleted successfully.");
        refreshCategory();
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const currentDate = getCurrentDate();
  const [popupType, setPopupType] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const openPopup = (type) => setPopupType(type);
  const closePopup = () => setPopupType(null);
  const { count, refreshCategoryCount, pcount, refreshProductCount } =
    useStore();

  useEffect(() => {
    refreshCategoryCount();
    refreshProductCount();
    refreshTotalRevenue();
    refreshSalesCount();
    refreshOutOfStockCount();
  }, []);

  useEffect(() => {
    getLowStockProducts(currentDate);
    refreshCategory();
    fetchLowStockItems();
  }, [currentDate]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const category = { name: newCategory };

    if (category.name === "") {
      toast.error("Category name cannot be empty.");
      return;
    }

    try {
      const request = await axios.post(
        "https://inventory-management-for-4sale-backend.onrender.com/api/addCategory",
        category,
        {
          headers: {
            Authorization: authorizationToken,
          },
        }
      );

      if (request.status === 201) {
        toast.success("Category added successfully.");
        setNewCategory("");
        refreshCategory();
      }
    } catch (error) {
      toast.error("Category already exists.");
      setNewCategory("");
    }
  };

  const isPopupOpen = popupType !== null;
  return (
    <div>
      <div className="container1">
        <div className="bg-white rounded p-3 d-flex justify-content-between align-items-center">
          <div className="d-flex gap-3">
            <img src={sale1} width={43} alt="icon" />
            <div>
              <h5 className="mb-0">{salesCount}</h5>

              <p className="mb-0">
                <small>Sales Count</small>
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
          <div className="d-flex gap-3">
            <img src={sale3} width={43} alt="icon" />
            <div>
              <h5 className="mb-0">{count}</h5>

              <p className="mb-0">
                <small>Category</small>
              </p>
            </div>
          </div>
          <div className="Hline" />
          <div className="d-flex gap-2">
            <img src={sale4} width={43} alt="icon" />
            <div>
              <h5 className="mb-0">{pcount}</h5>

              <p className="mb-0">
                <small>Products</small>
              </p>
            </div>
          </div>
        </div>
        <div className="contain2 p-3 d-flex justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <img src={insale1} alt="icon" width={43} />
            <div>
              <h4 className="mb-0">{lowStockItems.length}</h4>

              <p className="mb-0">
                <small>Low Stock</small>
              </p>
            </div>
          </div>
          <div className="Hline" />

          <div className="d-flex align-items-center gap-3">
            <img src={insale1} alt="icon" width={43} />
            <div>
              <h4 className="mb-0">{outOfStock}</h4>

              <p className="mb-0">
                <small>Out of Stock</small>
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-3 rounded">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5>Top Selling Products </h5>
            <button
              className="btn btn-sm"
              onClick={() => openPopup("TopSStock")}
            >
              see all
            </button>
          </div>

          {popupType === "TopSStock" && (
            <Popup
              show={true}
              onClose={closePopup}
              title="Top Selling Stock"
              content={
                <div>
                  <table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity Sold</th>
                        <th>Remaining Quantity</th>
                        <th>Total Revenue (BTN)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, index) => (
                        <tr key={index} className="on-hover rounded">
                          <td className="d-flex align-items-center">
                            <img
                              src={item.imageUrl}
                              alt="product image"
                              width={35}
                            />
                            <p className="mb-0">{item.productName}</p>
                          </td>
                          <td className="text-center">
                            {item.totalQuantitySold}
                          </td>
                          <td className="text-center">
                            {item.remainingQuantity}
                          </td>
                          <td className="text-center">{item.totalRevenue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              }
            />
          )}
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity Sold</th>
                <th>Remaining Quantity</th>
                <th>Total Revenue (BTN)</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 3).map((item, index) => (
                <tr key={index} className="trow">
                  <td className="d-flex align-items-center">
                    <img src={item.imageUrl} alt="product image" width={35} />
                    <p className="mb-0">{item.productName}</p>
                  </td>
                  <td className="text-center">{item.totalQuantitySold}</td>
                  <td className="text-center">{item.remainingQuantity}</td>
                  <td className="text-center">{item.totalRevenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white p-3 rounded">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5>Low Quantity Products </h5>
            <button
              className="btn btn-sm"
              onClick={() => openPopup("lowQStock")}
            >
              see all
            </button>
          </div>

          {popupType === "lowQStock" && (
            <Popup
              show={true}
              onClose={closePopup}
              title="Low Quantity Stock"
              content={
                <div>
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <div className="list-items">
                      {lowStockItems.length === 0 ? (
                        <p>No low stock items found.</p>
                      ) : (
                        lowStockItems?.map((item, index) => (
                          <div
                            key={index}
                            className="list-item on-hover rounded"
                          >
                            <img
                              src={item.imageData}
                              alt={item.name}
                              className="item-image"
                              width={30}
                            />
                            <div className="item-details">
                              <h4>{item.name}</h4>
                              <p>Remaining Quantity: {item?.quantity}</p>
                            </div>
                            <span className="outOfStock py-1 px-2 rounded">
                              Low
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              }
            />
          )}
          <div className="list-items">
            {loading ? (
              <p>Loading...</p>
            ) : (
              lowStockItems.slice(0, 3).map((item, index) => (
                <div key={index} className="list-item">
                  <img
                    src={item.imageData || junk1}
                    alt={item.name}
                    className="item-image"
                  />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Remaining Quantity: {item.quantity}</p>
                  </div>
                  <span className="py-1 px-3 rounded outOfStock">Low</span>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="bg-white p-3 rounded">
          <h2 className={`topic graph ${isPopupOpen ? "" : "Scroll"} mb-0`}>
            Total Sale & Revenue
          </h2>
          <BarChart />
        </div>
        <div className="p-2 px-3 bg-white rounded">
          <div className="d-flex justify-content-between py-2">
            <h5>Category </h5>
            <button
              className="btn btn-primary p-1 px-2 addButton"
              data-bs-toggle="modal"
              data-bs-target="#addCategoryModal"
            >
              Add Category
            </button>
          </div>

          <ul
            className="category-list"
            style={{ maxHeight: "25em", height: "100%", overflowX: "auto" }}
          >
            {categories.length === 0 ? (
              <li className="placeholder-container">
                <span className="placeHolder">Add Categories</span>
              </li>
            ) : (
              categories.map((category, index) => (
                <li key={index}>
                  <div className="line"></div>
                  <div className="category-item">
                    <span>{category.name}</span>
                    <span
                      onClick={() => setCategoryId(category.categoryId)}
                      className="delete-Button"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      Delete
                    </span>
                  </div>
                </li>
              ))
            )}
          </ul>
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
              <h5>
                Are you sure you want to delete this category? This action
                cannot be undone.
              </h5>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn" data-bs-dismiss="modal">
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleDelete}
                data-bs-dismiss="modal"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="addCategoryModal"
        tabIndex="-1"
        aria-labelledby="addCategoryModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addCategoryModalLabel">
                New Category
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleAddCategory}>
                <div>
                  <label className="label mb-1">Category Name</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter category name"
                    required
                    className="form-control no-focus"
                  />
                </div>

                <div className="Return mt-4">
                  <button className="btn" type="button" data-bs-dismiss="modal">
                    Discard
                  </button>
                  <button
                    className="btn btn-primary"
                    type="submit"
                    data-bs-dismiss="modal"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
