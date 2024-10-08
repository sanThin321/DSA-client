import React, { useState } from "react";
import ProfitAndRevenueChart from "../components/chart";
import "./css/report.css";
import Popup from "../components/popup";
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
  return (
    <div>
      <div className="report">
        <div className="view">
          <h1 className="topic">Over View</h1>
          <div className="view_details">
            <div>
              <p className="describeinN">
                BTN <span>21,190</span>
              </p>
              <p className="totalP">Total Profit</p>
            </div>
            <div>
              <p className="describeinN">
                BTN <span>21,190</span>
              </p>
              <p className="Revenue">Revenue</p>
            </div>
            <div>
              <p className="describeinN">
                BTN <span>21,190</span>
              </p>
              <p className="sale">Sales</p>
            </div>
          </div>
          <div className="view_details">
            <div>
              <p className="describeinN">
                BTN <span>21,190</span>
              </p>
              <p className="des">Net sales value</p>
            </div>
            <div>
              <p className="describeinN">
                BTN <span>21,190</span>
              </p>
              <p className="des">Monthly Profit</p>
            </div>
            <div>
              <p className="describeinN">
                BTN <span>21,190</span>
              </p>
              <p className="des">Yearly Profit</p>
            </div>
          </div>
        </div>
        <div className="best">
          <h1 className="topic">Best selling category</h1>
          <li className="bsale">
            Category <span>Revenue</span>
            <span>Increase By</span>
          </li>
          <li className="bsale">
            <span>Vegetable</span>{" "}
            <span>
              BTN <span>26,000</span>
            </span>{" "}
            <span>3.2%</span>
          </li>
          <li className="bsale">
            <span>Instant Food</span>{" "}
            <span>
              BTN <span>22,000</span>
            </span>
            <span>2%</span>
          </li>
          <li className="bsale">
            <span>Household</span>
            <span>
              BTN <span>22,000</span>
            </span>
            <span>1.5%</span>
          </li>
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
