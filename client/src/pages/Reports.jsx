import React, { useEffect, useState } from "react";
import ProfitAndRevenueChart from "../components/chart";
import "./css/report.css";
import Popup from "../components/popup";
import { useStore } from "../context/Store";
import { getCurrentDate } from "../utils/CurrentDate";
import { useAuth } from "../auth/auth";
import axios from "axios";
import sale1 from "../assets/sale1.svg";
import sale2 from "../assets/sale2.svg";
import sale3 from "../assets/sale3.svg";
import sale4 from "../assets/sale4.svg";
import insale1 from "../assets/insale1.svg";

const Reports = () => {
  const today = getCurrentDate();
  const { authorizationToken } = useAuth();
  const [popupType, setPopupType] = useState(null);
  const openPopup = (type) => setPopupType(type);
  const closePopup = () => setPopupType(null);
  const isPopupOpen = popupType !== null;
  const {
    count,
    refreshCategoryCount,
    pcount,
    refreshProductCount,
    totalRevenue,
    refreshSalesCount,
    salesCount,
    refreshOutOfStockCount,
    outOfStock,
    refreshTotalRevenue,
    refreshLowStock,
    lowStock,
  } = useStore();

  const [data, setData] = useState([]);

  const getBestSellingProducts = async (date) => {
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

    } catch (error) {
      console.error("Error fetching low stock products: ", error);
    }
  };

  useEffect(() => {
    refreshCategoryCount();
    refreshProductCount();
    getBestSellingProducts(today);
    refreshSalesCount();
    refreshTotalRevenue();
    refreshLowStock();
    refreshOutOfStockCount();
  }, []);
  return (
    <div>
      <div className="report">
        <div className="bg-white rounded p-3">
          <h1 className="topic">Over View</h1>
          <div className="row mt-4">
            <div className="col-4">
              <div className="d-flex align-items-center gap-3">
                <img src={sale1} width={43} alt="icon" />
                <div>
                  <h5 className="mb-0">{totalRevenue}</h5>

                  <p className="mb-0">
                    <small>Revenue (BTN)</small>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="d-flex align-items-center gap-3">
                <img src={sale2} width={43} alt="icon" />
                <div>
                  <h5 className="mb-0">{salesCount}</h5>

                  <p className="mb-0">
                    <small>Sales</small>
                  </p>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3 col-4">
              <img src={insale1} width={45} alt="icon" />
              <div>
                <h5 className="mb-0">{lowStock.length}</h5>

                <p className="mb-0">
                  <small>Low Stock</small>
                </p>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="d-flex align-items-center gap-3 col-4">
              <img src={sale3} width={45} alt="icon" />
              <div>
                <h5 className="mb-0">{count}</h5>

                <p className="mb-0">
                  <small>Category</small>
                </p>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3 col-4">
              <img src={sale4} width={43} alt="icon" />
              <div>
                <h5 className="mb-0">{pcount}</h5>
                <p className="mb-0">
                  <small>Products</small>
                </p>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3 col-4">
              <img src={insale1} width={43} alt="icon" />
              <div>
                <h5 className="mb-0">{outOfStock}</h5>

                <p className="mb-0">
                  <small>Out of Stock</small>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="best">
          <div className="grid-item item2">
            <h2 className={`topic ${isPopupOpen ? "" : "Scroll"}`}>
              Low Stock Products{" "}
              <span className="span" onClick={() => openPopup("lowQStock")}>
                see all
              </span>
            </h2>
            {popupType === "lowQStock" && (
              <Popup
                show={true}
                onClose={closePopup}
                title="Low Stock Products"
                content={
                  <div>
                    <div className="list-items">
                      {lowStock.length === 0 ? (
                        <p>No low stock items found.</p>
                      ) : (
                        lowStock.map((item, index) => (
                          <div key={index} className="list-item p-1 rounded">
                            <img
                              src={item.imageData}
                              alt={item.name}
                              className="item-image"
                            />
                            <div className="item-details">
                              <h4>{item.name}</h4>
                              <p>Remaining Quantity: {item?.quantity}</p>
                            </div>
                            <span className="py-1 px-2 outOfStock rounded">
                              Low
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                }
              />
            )}
            <div className="list-items">
              {lowStock.slice(0, 3).map((item, index) => (
                <div key={index} className="list-item p-1 rounded">
                  <img
                    src={item.imageData}
                    alt={item.name}
                    className="item-image"
                  />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Remaining Quantity: {item.quantity}</p>
                  </div>
                  <span className="py-1 px-2 rounded outOfStock">Low</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="profit">
        <h1 className="topic">Profit & Revenue</h1>
        <ProfitAndRevenueChart />
      </div>
      <div className="selling p-3">
        <h1 className="topic">
          Top Selling Products{" "}
          <span className="span" onClick={() => openPopup("TopSStock")}>
            see more
          </span>
        </h1>
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
              <tr key={index} className="on-hover rounded">
                <td className="d-flex align-items-center gap-2">
                  <img src={item.imageUrl} alt="product image" width={35} />
                  <p className="mb-0">{item.productName}</p>
                </td>
                <td>{item.totalQuantitySold}</td>
                <td>{item.remainingQuantity}</td>
                <td>{item.totalRevenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
                      <tr className="on-hover rounded" key={index}>
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
      </div>
    </div>
  );
};

export default Reports;
