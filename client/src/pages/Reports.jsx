import React, { useEffect, useState } from "react";
import ProfitAndRevenueChart from "../components/chart";
import "./css/report.css";
import Popup from "../components/popup";
import { useStore } from "../context/Store";

const Reports = () => {
  const data = [
    {
      product: "Surf Excel",
      productid: 30,
      category: 12,
      remain: "BTN 100",
      revenue: 50,
      increase: 324,
    },
    {
      product: "Surf Excel",
      productid: 30,
      category: 12,
      remain: "BTN 100",
      revenue: 50,
      increase: 324,
    },
    {
      product: "Surf Excel",
      productid: 30,
      category: 12,
      remain: "BTN 100",
      revenue: 50,
      increase: 324,
    },
    {
      product: "Surf Excel",
      productid: 30,
      category: 12,
      remain: "BTN 100",
      revenue: 50,
      increase: 324,
    },
    {
      product: "Surf Excel",
      productid: 30,
      category: 12,
      remain: "BTN 100",
      revenue: 50,
      increase: 324,
    },
  ];
  const [popupType, setPopupType] = useState(null);
  const openPopup = (type) => setPopupType(type);
  const closePopup = () => setPopupType(null);
  const {
    count,
    refreshCategoryCount,
    pcount,
    refreshProductCount,
    // Revenue_r,
    // refreshrevenue,
  } = useStore();
  useEffect(() => {
    refreshCategoryCount();
    refreshProductCount();
    // refreshrevenue()
  }, []);
  return (
    <div>
      <div className="report">
        <div className="view">
          <h1 className="topic">Over View</h1>
          <div className="view_details">
            <div className="details">
              <h3 className="Subtopic category">Categories</h3>
              <p className="describeinN">{count}</p>
            </div>
            <div className="details">
              <h3 className="Subtopic product">Total Products</h3>
              <p className="describeinN">{pcount}</p>
            </div>
          </div>
          <div className="view_details">
            <div className="details">
              <h3 className="Subtopic low">Low Stocks</h3>
              <p className="describeinN ">12</p>
            </div>
            <div className="details">
              <h3 className="Subtopic no">Not in Stocks</h3>
              <p className="describeinN">2</p>
            </div>
          </div>
        </div>
        <div className="best">
          <h1 className="topic">Best Selling Category</h1>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Revenue</th>
                <th>Increase By</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Vegetable</td>
                <td>
                  BTN <span>26,000</span>
                </td>
                <td>3.2%</td>
              </tr>
              <tr>
                <td>Instant Food</td>
                <td>
                  BTN <span>22,000</span>
                </td>
                <td>2%</td>
              </tr>
              <tr>
                <td>Household</td>
                <td>
                  BTN <span>22,000</span>
                </td>
                <td>1.5%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="profit">
        <h1 className="topic">Profit & Revenue</h1>
        <ProfitAndRevenueChart />
      </div>
      <div className="selling">
        <h1 className="topic">
          Best Selling Product{" "}
          <span className="span" onClick={() => openPopup("TopSStock")}>
            see more
          </span>
        </h1>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Product ID</th>
              <th>Category</th>
              <th>Remaining Quantity</th>
              <th>Revenue</th>
              <th>Increase By</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.product}</td>
                <td>{item.productid}</td>
                <td>{item.category}</td>
                <td>{item.remain}</td>
                <td>{item.revenue}</td>
                <td>{item.increase}</td>
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
                      <th>Product ID</th>
                      <th>Category</th>
                      <th>Remaining Quantity</th>
                      <th>Revenue</th>
                      <th>Increase By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={index}>
                        <td>{item.product}</td>
                        <td>{item.productid}</td>
                        <td>{item.category}</td>
                        <td>{item.remain}</td>
                        <td>{item.revenue}</td>
                        <td>{item.increase}</td>
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
