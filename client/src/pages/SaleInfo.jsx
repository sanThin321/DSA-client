import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./css/saleinfo.css";
import axios from "axios";
import { useAuth } from "../auth/auth";
import { toast } from "react-toastify";

const SalesInfo = () => {
  const { authorizationToken } = useAuth();
  const { id } = useParams();
  const [salesDetail, setSalesDetail] = useState({});
  const navigate = useNavigate();

  const getSalesDetails = async (id) => {
    const res = await axios.get(`http://localhost:8081/api/sale/get/${id}`, {
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

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8081/api/sale/delete/${id}`,
        {
          headers: { Authorization: authorizationToken },
        }
      );
      if (response.status === 200) {
        toast.success("Sale deleted successfully.");
        navigate("/sales");
      }
    } catch (error) {
      console.error("Failed to delete sale.");
    }
  };

  return (
    <div className="bg-white p-3 rounded">
      <div className="d-flex justify-content-between">
        <h3 className="">{salesDetail.customerName}</h3>
        <div className="gap-3 d-flex">
          <button
            className="btn border border-dark btn-hover"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Delete
          </button>
        </div>
      </div>
      <hr />
      <div className="row gap-5 p-3">
        <div className="col-12 d-flex flex-row flex-lg-column justify-content-around justify-content-lg-start col-lg-4 border rounded p-3">
          <div className="mb-0">
            <div className="mb-4">
              <p className="mb-0">Customer Name</p>
              <h5>{salesDetail.customerName}</h5>
            </div>
            <div className="mb-4">
              <p className="mb-0">Customer Contact No.</p>
              <h5>{salesDetail.contactNumber}</h5>
            </div>
            <div className="mb-4">
              <p className="mb-0">Date</p>
              <h5>{salesDetail.saleDate}</h5>
            </div>
          </div>
          <div>
            <div className="mb-4">
              <p className="mb-0">Total Amount BTN</p>
              <h5>{salesDetail.totalAmount}</h5>
            </div>
            <div className="mb-4">
              <p className="mb-0">Payment Method</p>
              <h5> {salesDetail.paymentMethod}</h5>
            </div>
            {salesDetail.paymentMethod === "online" ? (
              <div className="mb-4">
                <p className="mb-0">Journal Number</p>
                <h5>{salesDetail.journalNumber}</h5>
              </div>
            ) : null}
          </div>
        </div>

        <div className="col-12 col-lg-7 border rounded p-3">
          <h5 className="mb-3">Product Sold</h5>
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
                  <tr key={index} className="on-hover">
                    <td style={{ textAlign: "center" }}>
                      {" "}
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
              <p>
                Are you sure you want to delete this sale details? This action
                cannot be undone.
              </p>
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
    </div>
  );
};

export default SalesInfo;
