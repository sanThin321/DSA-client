import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/addsale.css";
import "./css/dashboard.css";
import { useStore } from "../context/Store";
import { useAuth } from "../auth/auth";
import axios from "axios";
import { toast } from "react-toastify";

const AddSales = () => {
  const { authorizationToken } = useAuth();
  const { products, refreshProducts } = useStore();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState("offline");
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

    // Prevent quantity from being less than 1
    if (name === "quantity" && value < 1) return;

    // Update sale details
    setSale((prevSale) => {
      const updatedSale = {
        ...prevSale,
        [name]: value,
      };

      // Calculate total price immediately based on the entered quantity
      if (name === "quantity" && selectedProduct) {
        updatedSale.totalPrice = value * selectedProduct.price;
      }

      return updatedSale;
    });
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
  useEffect(() => {
    calculateNetTotal(); // This will ensure it recalculates whenever sale or sales change
  }, [sale, sales]);

  const addSaleToList = () => {
    if (selectedProduct && sale.quantity > 0) {
      const newSale = {
        product: {
          productId: selectedProduct.productId,
          name: selectedProduct.name,
        },
        quantity: sale.quantity,
        price: selectedProduct.price,
        totalPrice: sale.quantity * selectedProduct.price,
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
      toast.warning("Please complete all product details before adding.");
    }
  };

  const calculateNetTotal = () => {
    const enteredSaleTotal = sale.quantity * sale.price;
    const addedSalesTotal = sales.reduce(
      (total, sale) => total + parseFloat(sale.totalPrice),
      0
    );
    return enteredSaleTotal + addedSalesTotal;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerName || !customerContact) {
      toast.warning("Please fill in all required fields.");
      return;
    }

    if (paymentMethod === "online" && !journalNumber) {
      toast.warning("Please provide the journal number for online payment.");
      return;
    }

    const saleData = {
      saleDate: date,
      customerName,
      contactNumber: customerContact,
      paymentMethod,
      journalNumber: paymentMethod === "online" ? journalNumber : null,
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
        toast.success("Sale added successfully!");
        navigate("/sales");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while adding the sale.");
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
            <br />
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale, index) => (
                <tr key={index}>
                  {sale.isEditing ? (
                    <>
                      {/* Editable row */}
                      <td>
                        <select
                          value={sale.product.id || ""}
                          onChange={(e) => {
                            const productId = parseInt(e.target.value);
                            const product = products.find(
                              (p) => p.productId === productId
                            );

                            if (product) {
                              const updatedSales = [...sales];
                              updatedSales[index] = {
                                ...updatedSales[index],
                                product: {
                                  id: product.productId,
                                  name: product.name,
                                },
                                price: product.price,
                                totalPrice:
                                  product.price * updatedSales[index].quantity,
                              };
                              setSales(updatedSales);
                            }
                          }}
                        >
                          <option value="">Select Product</option>
                          {products.map((product) => (
                            <option
                              key={product.productId}
                              value={product.productId}
                            >
                              {product.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          value={sale.quantity}
                          onChange={(e) => {
                            const quantity = parseInt(e.target.value) || 0;
                            const updatedSales = [...sales];
                            updatedSales[index] = {
                              ...updatedSales[index],
                              quantity,
                              totalPrice: updatedSales[index].price * quantity,
                            };
                            setSales(updatedSales);
                          }}
                          min="1"
                        />
                      </td>
                      <td>{sale.price}</td>
                      <td>{sale.totalPrice}</td>
                      <td>
                        <button
                          className="but but-save"
                          onClick={() => {
                            const updatedSales = [...sales];
                            updatedSales[index].isEditing = false;
                            setSales(updatedSales);
                          }}
                        >
                          Save
                        </button>
                        <button
                          className="but but-delete"
                          onClick={() => {
                            const updatedSales = [...sales];
                            updatedSales.splice(index, 1); // Remove the sale
                            setSales(updatedSales);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      {/* Non-editable row */}
                      <td>{sale.product.name}</td>
                      <td>{sale.quantity}</td>
                      <td>{sale.price}</td>
                      <td>{sale.totalPrice}</td>
                      <td>
                        <button
                          className="but but-edit"
                          onClick={() => {
                            const updatedSales = [...sales];
                            updatedSales[index].isEditing = true;
                            setSales(updatedSales);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="but but-delete"
                          onClick={() => {
                            const updatedSales = [...sales];
                            updatedSales.splice(index, 1); // Remove the sale
                            setSales(updatedSales);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}

              {/* Add new sale row */}
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
                          price: product.price,
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
                <td>{selectedProduct ? selectedProduct.price : sale.price}</td>
                <td>{sale.totalPrice}</td>
                <td>
                  <button type="button" className="but but-add"onClick={addSaleToList}>
                    + Add
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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
