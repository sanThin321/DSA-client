import React from "react";
import { useParams } from "react-router-dom";
import edit_delete from "../assets/delete.svg";
import "./css/saleinfo.css";
const SalesInfo = () => {
  const { id } = useParams();
  const data = [
    {
      name: "Surf Excel",
      sold: 30,
      price: 12,
    },
    {
      name: "Surf Excel",
      sold: 30,
      price: 12,
    },
    {
      name: "Surf Excel",
      sold: 30,
      price: 12,
    },
    {
      name: "Surf Excel",
      sold: 30,
      price: 12,
    },
  ];
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
            <div>
              <h4 className="prTopic">Primary Details</h4>
              <li className="detail">
                Product ID<span className="detailsValue">h</span>
              </li>
              <li className="detail">
                Customer Name<span className="detailsValue">h</span>
              </li>
              <li className="detail">
                Customer Contact No.<span className="detailsValue">h</span>
              </li>
              <li className="detail">
                Date<span className="detailsValue">h</span>
              </li>
              <li className="detail">
                Total Amount BTN<span className="detailsValue">h</span>
              </li>
              <li className="detail">
                Journal Number<span>h</span>
              </li>
              <br />
              <h4 className="prTopic">Product sold</h4>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Sold Quantity</th>
                    <th>Selling Price BTN</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.sold}</td>
                      <td>{item.price}</td>
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
