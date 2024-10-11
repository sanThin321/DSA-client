import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./css/addsale.css";
import "./css/dashboard.css";
const AddSales = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Maggie",
      quantity: 12,
      unit: "Packets",
      price: 15,
      discount: "5%",
      total: 171,
    },
    {
      id: 2,
      name: "Koka",
      quantity: 12,
      unit: "Packets",
      price: 15,
      discount: "5%",
      total: 171,
    },
  ]);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [journalNumber, setJournalNumber] = useState("");

  // Function to calculate the total price based on quantity and price
  const calculateTotal = (product) => {
    return product.quantity * product.price;
  };

  // Handle changes in the product fields
  const handleProductChange = (id, field, value) => {
    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        const updatedProduct = { ...product, [field]: value };
        updatedProduct.total = calculateTotal(updatedProduct);
        return updatedProduct;
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  // Handle adding a new product row
  const handleAddProduct = () => {
    const newProduct = {
      id: products.length + 1,
      name: "",
      quantity: 1,
      unit: "Packets",
      price: 0,
      discount: "0%",
      total: 0,
    };
    setProducts([...products, newProduct]);
  };

  const netTotalAmount = products.reduce(
    (acc, product) => acc + product.total,
    0
  );

  // Handle Discard action
  const handleDiscard = () => {
    navigate("/sales"); // Navigate back to the sale page
  };

  // Handle Add Sale action with validation
  const handleAddSale = () => {
    if (!customerName || !customerContact || !paymentMethod) {
      alert("Please fill in all required fields.");
      return;
    }
    if (paymentMethod === "online" && !journalNumber) {
      alert("Please provide the journal number for online payment.");
      return;
    }

    // Navigate back to sale page after successful submission
    navigate("/sales");
  };

  return (
    <div className="add-sale-container">
      <h2 className="topic">Add new sale details</h2>
      <form action="">
        <div className="customer_details">
          <div>
            <label htmlFor="">Customer Name</label>
            <br />
            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="">Customer Contact No</label>
            <input
              type="text"
              placeholder="Customer Contact No"
              value={customerContact}
              onChange={(e) => setCustomerContact(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="">Date</label><br />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="products_section ">
          <table>
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Price BTN</th>
                <th>Total Price BTN</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id} className="row1">
                  <td>{index + 1}</td>
                  <td>
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) =>
                        handleProductChange(product.id, "name", e.target.value)
                      }
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) =>
                        handleProductChange(
                          product.id,
                          "quantity",
                          e.target.value
                        )
                      }
                      required
                      min="1"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={product.unit}
                      onChange={(e) =>
                        handleProductChange(product.id, "unit", e.target.value)
                      }
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={product.price}
                      onChange={(e) =>
                        handleProductChange(product.id, "price", e.target.value)
                      }
                      min="0"
                      required
                    />
                  </td>
                  <td>{product.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p></p>
          <button className="addrow" onClick={handleAddProduct}>+ Add</button>
        </div>

        <div className="net-total">
          <h3 className="topic">Net Total Amount BTN: {netTotalAmount}</h3>
        </div>

        <div className="payment-method">
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Select Payment Method</option>
            <option value="cash">Cash</option>
            <option value="online">Online Payment</option>
          </select>
          {paymentMethod === "online" && (
            <div className="journal-number">
              <label>Journal Number</label>
              <input
                type="text"
                placeholder="Enter Journal Number"
                value={journalNumber}
                onChange={(e) => setJournalNumber(e.target.value)}
                required
              />
            </div>
          )}
        </div>

        <div className="action1">
          <button className="discard-btn" onClick={handleDiscard}>
            Discard
          </button>
          <button
            type="submit"
            className="add-sale-btn"
            onClick={handleAddSale}
          >
            Add Sale
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSales;
