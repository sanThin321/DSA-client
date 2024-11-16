import React, { useState } from "react";
import logo from "../assets/logo.svg";
import "./css/login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.trim() === "" || confirmPassword.trim() === "") {
      toast.error("Fields cannot be empty.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const email = localStorage.getItem("email")
      const code = localStorage.getItem("code")

      const request = await axios.post(`https://inventory-management-for-4sale-backend.onrender.com/reset-password?email=${email}&code=${code}&newPassword=${password}`);

      if (request.status === 200) {
        toast.success("Password reset successful.");
        navigate("/login");
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("Invalid or expired reset link.");
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="LoginContainer">
      <img src={logo} alt="Logo" className="logoImage" />
      <div className="formContainer">
        <h3>Reset Password</h3>
        <p className="greeting">
          Please create a strong new password.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="password" className="form">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="inputField"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="confirmPassword" className="form">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="inputField"
              required
            />
          </div>

          <button type="submit" className="button login-button">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
