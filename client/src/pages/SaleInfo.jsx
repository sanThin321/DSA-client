import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import edit_delete from "../assets/delete.svg";
import "./css/saleinfo.css";
import axios from "axios";
import { useAuth } from "../auth/auth";
import { toast } from "react-toastify";

const SalesInfo = () => {
  const { authorizationToken } = useAuth();
  const { id } = useParams();
  const [salesDetail, setSalesDetail] = useState({});

  const getSalesDetails = async (id) => {
    const res = await axios.get(`https://inventory-management-for-4sale-backend.onrender.com/api/sale/get/${id}`, {
      headers: {
        Authorization: authorizationToken,
      },
    });

    if (res.status === 200) {
      setSalesDetail(res.data);
    }
  };

  useEffect(() => {
    getSalesDetails(id);
  }, [id]);

  return (
    <div>
      <div className="saleInfo">
        <h2 className="topic over">
          Sale {id}
          <span className="editCase">
            <span className="edit">
              <img src={edit_delete} alt="" className="image-icon" /> Delete
            </span>
            <span className="edit">Download</span>
          </span>
        </h2>
        <div className="containerforoverview">
          <h3 className="overviewT">Over View</h3>
          <p className="hor"></p>
          <div className="primaryDetails">
            <div className="w-100">
              <h4 className="prTopic">Primary Details</h4>
              <li className="detail">
                Customer Name
                <span className="detailsValue">{salesDetail.customerName}</span>
              </li>
              <li className="detail">
                Customer Contact No.
                <span className="detailsValue">
                  {salesDetail.contactNumber}
                </span>
              </li>
              <li className="detail">
                Date<span className="detailsValue">{salesDetail.saleDate}</span>
              </li>
              <li className="detail">
                Total Amount BTN
                <span className="detailsValue">{salesDetail.totalAmount}</span>
              </li>
              <li className="detail">
                Journal Number
                <span className="detailsValue">
                  {salesDetail.journalNumber}
                </span>
              </li>
              <br />
              <h4 className="prTopic">Product Sold</h4>
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Sold Quantity</th>
                    <th>Total amount BTN</th>
                  </tr>
                </thead>
                <tbody>
                  {salesDetail.sales &&
                    salesDetail.sales.map((item, index) => (
                      <tr key={index}>
                        <td style={{ textAlign: "center" }}>
                          {" "}
                          {/* Center the image */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <img
                              src={item.product.imageData}
                              loading="lazy"
                              alt="Product"
                              width={35}
                              height={35}
                            />
                          </div>
                        </td>
                        <td>{item.product?.name}</td>
                        <td>{item.product?.price}</td>
                        <td>{item.quantity}</td>
                        <td>{item.totalPrice}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesInfo;
