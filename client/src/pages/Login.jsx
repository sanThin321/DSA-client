import React, { useState } from "react";
import logo from "../assets/logo.svg";
import "./css/login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth/auth";
import { toast } from "react-toastify";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { storeToken } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = { username, password };

    if (user.username === "" || user.password === "") {
      toast.error("Fields cannot be empty.")
      return;
    }

    try {
      const request = await axios.post("http://localhost:8081/login", user);

      if (request.status === 200) {
        storeToken(request.data);
        toast.success("Login successful.")
        navigate("/")
      }
    } catch (error) {
      if (error.status === 401) {
        toast.error("Invalid username or password.")
      }
    }
  };

  return (
    <div className="LoginContainer">
      <img src={logo} alt="Logo" className="logoImage" />
      <div className="formContainer">
        <h3>Log in to your account</h3>
        <p className="greeting">Welcome back! Please enter your details.</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username" className="form">
              Username
            </label>
            <input
            
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="password" className="form">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <p
            className="field forgot-password"
            onClick={() => navigate("/forgotpassword")}
          >
            Forgot Password?
          </p>
          <button type="submit" className="button login-button">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
