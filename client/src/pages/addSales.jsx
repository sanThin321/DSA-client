import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/addsale.css";
import "./css/dashboard.css";
import { useStore } from "../context/Store";
import { useAuth } from "../auth/auth";
import axios from "axios";

const AddSales = () => {
  const { authorizationToken } = useAuth();
  const { products, refreshProducts } = useStore();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState("");
  const [journalNumber, setJournalNumber] = useState("");

  const [sale, setSale] = useState({
    product: { id: null, name: "" },
    quantity: 0,
    price: 0,
    totalPrice: 0,
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sales, setSales] = useState([]);

  const handleSaleChange = (e) => {
    const { name, value } = e.target;
    if (name === "quantity" && value < 1) return; // Prevent invalid quantity
    setSale((prevSale) => ({
      ...prevSale,
      [name]: value,
    }));
  };

  // Update total price when quantity or selected product changes
  useEffect(() => {
    if (selectedProduct) {
      setSale((prevSale) => ({
        ...prevSale,
        price: selectedProduct.price,
        totalPrice: prevSale.quantity * selectedProduct.price,
      }));
    }
  }, [sale.quantity, selectedProduct]);

  const addSaleToList = () => {
    if (selectedProduct && sale.quantity > 0) {
      const newSale = {
        product: {
          productId: selectedProduct.productId,
          name: selectedProduct.name,
        },
        quantity: sale.quantity,
        totalPrice: sale.totalPrice,
      };

      setSales((prevSales) => [...prevSales, newSale]);

      // Reset the sale state
      setSale({
        product: { id: null, name: "" },
        quantity: 0,
        price: 0,
        totalPrice: 0,
      });
      setSelectedProduct(null); // Clear selected product
    } else {
      alert("Please complete all product details before adding.");
    }
  };

  const calculateNetTotal = () =>
    sales.reduce((total, sale) => total + parseFloat(sale.totalPrice), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerName || !customerContact || !paymentMethod) {
      alert("Please fill in all required fields.");
      return;
    }

    if (paymentMethod === "online" && !journalNumber) {
      alert("Please provide the journal number for online payment.");
      return;
    }

    const saleData = {
      saleDate: date,
      customerName,
      contactNumber: customerContact,
      paymentMethod,
      journalNumber,
      totalAmount: calculateNetTotal(),
      sales,
    };

    try {
      const response = await axios.post(
        "http://localhost:8081/api/sale/add",
        saleData,
        {
          headers: {
            Authorization: authorizationToken,
          },
        }
      );

      if (response.status === 201) {
        alert("Sale added successfully!");
        navigate("/sales");
      } else {
        alert(`Failed to add sale: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the sale.");
    }
  };

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  return (
    <div className="add-sale-container">
      <h2 className="topic">Add new sale details</h2>
      <form onSubmit={handleSubmit}>
        <div className="customer_details">
          <div>
            <label>Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Customer Contact No</label>
            <input
              type="text"
              value={customerContact}
              onChange={(e) => setCustomerContact(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="products_section">
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price BTN</th>
                <th>Total Price BTN</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale, index) => (
                <tr key={index}>
                  <td>{sale.product.name}</td>
                  <td>{sale.quantity}</td>
                  <td>{sale.price}</td>
                  <td>{sale.totalPrice}</td>
                </tr>
              ))}
              <tr>
                <td>
                  <select
                    value={sale.product?.id || ""}
                    onChange={(e) => {
                      const productId = parseInt(e.target.value);
                      const product = products.find(
                        (p) => p.productId === productId
                      );

                      if (product) {
                        setSelectedProduct(product);
                        setSale((prevSale) => ({
                          ...prevSale,
                          product: {
                            id: product.productId,
                            name: product.name,
                          },
                          price: product.price, // Set the price immediately
                        }));
                      }
                    }}
                  >
                    <option value="">Select Product</option>
                    {products.map((product) => (
                      <option key={product.productId} value={product.productId}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={sale.quantity}
                    name="quantity"
                    onChange={handleSaleChange}
                    min="1"
                  />
                </td>
                <td>{sale.price}</td>
                <td>{sale.totalPrice}</td>
              </tr>
            </tbody>
          </table>
          <button type="button" className="addrow" onClick={addSaleToList}>
            + Add
          </button>
        </div>

        <div className="net-total">
          <h3 className="topic">Net Total Amount BTN: {calculateNetTotal()}</h3>
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
              />
            </div>
          )}
        </div>

        <div className="action1">
          <button
            type="button"
            className="discard-btn"
            onClick={() => navigate("/sales")}
          >
            Discard
          </button>
          <button type="submit" className="add-sale-btn">
            Add Sale
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSales;
