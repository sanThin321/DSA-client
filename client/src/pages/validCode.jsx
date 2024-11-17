import React, { useState } from "react";
import logo from "../assets/logo.svg";
import "./css/login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Valid = () => {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (code.trim() === "") {
      toast.error("Code cannot be empty.");
      return;
    }

    try {
      const email = localStorage.getItem("email")
      const request = await axios.post(`http://localhost:8081/verify-code?email=${email}&code=${ code }`);

      if (request.status === 200) {
        localStorage.setItem("code", code)
        toast.success("Code validated successfully.");
        navigate("/resetpassword");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Invalid code. Please try again.");
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="LoginContainer">
      <img src={logo} alt="Logo" className="logoImage" />
      <div className="formContainer">
        <h3>Validate the Code</h3>
        <p className="greeting">
          For confirmation, please enter the code sent to your email.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="code" className="form">
              Verification Code
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter your code"
              className="inputField"
            />
          </div>
          <button type="submit" className="button login-button">
            Validate Code
          </button>
        </form>
      </div>
    </div>
  );
};

export default Valid;
