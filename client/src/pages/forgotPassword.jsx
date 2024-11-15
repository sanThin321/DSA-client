import React, { useState } from "react";
import logo from "../assets/logo.svg";
import "./css/login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email.trim() === "") {
      toast.error("Email field cannot be empty.");
      return;
    }

    try {
      // Send a request to your backend to initiate the password reset process
      const response = await axios.post(`http://localhost:8081/forgot-password?email=${ email }`);

      if (response.status === 200) {
        toast.success("Reset link sent to your email.");
        navigate("/validcode");
        localStorage.setItem("email", email)
      }
    } catch (error) {
      toast.error("Failed to send reset email. Please try again.");
    }
  };

  return (
    <div className="LoginContainer">
      <img src={logo} alt="Logo" className="logoImage" />
      <div className="formContainer">
        <h3>Forgot Password?</h3>
        <p className="greeting">
          It happens to everyone. Please enter your email to receive a password reset link.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email" className="form">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <button type="submit" className="button login-button">
            Send Code
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
