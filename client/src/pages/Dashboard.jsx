import React, { useState } from "react";
import "./css/dashboard.css";
import sale1 from "../assets/sale1.svg";
import sale2 from "../assets/sale2.svg";
import sale3 from "../assets/sale3.svg";
import sale4 from "../assets/sale4.svg";
import insale1 from "../assets/insale1.svg";
import junk1 from "../assets/junk1.svg";
import junk2 from "../assets/junk1.svg";
import junk3 from "../assets/junk1.svg";
import BarChart from "../components/barChart";
import Popup from "../components/popup";
const Dashboard = () => {
  const data = [
    { name: "Surf Excel", sold: 30, remaining: 12, price: "BTN 100" },
    { name: "Rin", sold: 21, remaining: 15, price: "BTN 207" },
    { name: "Parle G", sold: 19, remaining: 17, price: "BTN 105" },
  ];
  const items = [
    { name: "Tata Salt", quantity: "10 Packet", status: "Low", img: junk1 },
    { name: "Lays", quantity: "15 Packet", status: "Low", img: junk2 },
    { name: "Lays", quantity: "15 Packet", status: "Low", img: junk3 },
  ];
  const [categories, setCategories] = useState([
    "Vegetable",
    "Instant Food",
    "Household",
    "Fruit",
    "Fruit",
    "Fruit",
    "Fruit",
    "Fruit",
  ]);

  // Function to delete a category by index
  const handleDelete = (indexToDelete) => {
    const updatedCategories = categories.filter(
      (_, index) => index !== indexToDelete
    );
    setCategories(updatedCategories);
  };
  const [popupType, setPopupType] = useState(null);

  const openPopup = (type) => setPopupType(type);
  const closePopup = () => setPopupType(null);

  const isPopupOpen = popupType !== null;
  return (
    <div>
      <div className="container1">
        <div className="contain1">
          <h2 className="topic">Sales</h2>
          <div className="inneroverview">
            <div className="inner">
              <img src={sale1} alt="" />
              <p className="subtopic">
                <strong className="strong">
                  BTN <span>834</span>{" "}
                </strong>
                Sales
              </p>
            </div>
            <div className="Hline" />
            <div className="inner">
              <img src={sale2} alt="" />
              <p className="subtopic">
                <strong className="strong">
                  BTN <span>18,300</span>{" "}
                </strong>
                Revenue
              </p>
            </div>
            <div className="Hline" />
            <div className="inner">
              <img src={sale3} alt="" />
              <p className="subtopic">
                <strong className="strong">
                  BTN <span>834</span>{" "}
                </strong>
                Profit
              </p>
            </div>
            <div className="Hline" />
            <div className="inner">
              <img src={sale4} alt="" />
              <p className="subtopic">
                <strong className="strong">
                  BTN <span>17,432</span>{" "}
                </strong>
                Cost
              </p>
            </div>
          </div>
        </div>
        <div className="contain2">
          <h2 className="topic">Inventory Summary</h2>
          <div className="inner">
            <img src={insale1} alt="" />
            <p>
              <strong>
                <span className="subtopic">868</span>
              </strong>{" "}
              <br />
              Quantity in Head
            </p>
          </div>
        </div>
        <div className="grid-item item1">
          <h2 className={`topic ${isPopupOpen ? "" : "Scroll"}`}>
            Top Selling Stock{" "}
            <span className="span" onClick={() => openPopup("TopSStock")}>
              see all
            </span>
          </h2>
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
                        <th>Name</th>
                        <th>Sold Quantity</th>
                        <th>Remaining Quantity</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{item.sold}</td>
                          <td>{item.remaining}</td>
                          <td>{item.price}</td>
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
                <th>Name</th>
                <th>Sold Quantity</th>
                <th>Remaining Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.sold}</td>
                  <td>{item.remaining}</td>
                  <td>{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid-item item2">
          <h2 className={`topic ${isPopupOpen ? "" : "Scroll"}`}>
            Low Quantity Stock{" "}
            <span className="span" onClick={() => openPopup("lowQStock")}>
              see all
            </span>
          </h2>
          {popupType === "lowQStock" && (
            <Popup
              show={true}
              onClose={closePopup}
              title="Low Quantity Stock"
              content={
                <div>
                  <div className="list-items">
                    {items.map((item, index) => (
                      <div key={index} className="list-item">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="item-image"
                        />
                        <div className="item-details">
                          <h4>{item.name}</h4>
                          <p>Remaining Quantity: {item.quantity}</p>
                        </div>
                        <span className="item-status">{item.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              }
            />
          )}
          <div className="list-items">
            {items.map((item, index) => (
              <div key={index} className="list-item">
                <img src={item.img} alt={item.name} className="item-image" />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>Remaining Quantity: {item.quantity}</p>
                </div>
                <span className="item-status">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid-item item3">
          <h2 className={`topic graph ${isPopupOpen ? "" : "Scroll"}`}>
            Sales & Revenue
          </h2>
          <BarChart />
        </div>
        <div className="grid-item item4">
          <h2 className={`topic Button ${isPopupOpen ? "" : "Scroll"}`}>
            Categories <span className="addButton"onClick={() => openPopup("addCategory")}>Add Category</span>
          </h2>
          {popupType === "addCategory" && (
            <Popup
              show={true}
              onClose={closePopup}
              title="New Category"
              size="small"
              content={
                <div>
                  <form action="">
                    <div className="form">
                      <label htmlFor="" className="label">
                        Category Name
                      </label>
                      <input
                        className="input"
                        type="text"
                        placeholder="Enter category name"
                        required
                      />
                    </div>
                    <div className="Return">
                      <button className="send cancel re" type="cancel" onClick={closePopup}>
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

          <ul className="category-list">
            {categories.length === 0 ? (
              <li className="placeholder-container">
                <span className="placeHolder">Add Categories</span>
              </li>
            ) : (
              categories.map((category, index) => (
                <li key={index}>
                  <div className="line"></div>
                  <div className="category-item">
                    <span>{category}</span>
                    <span
                      onClick={() => handleDelete(index)}
                      className="delete-Button"
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
    </div>
  );
};

export default Dashboard;
