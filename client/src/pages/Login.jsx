import React, { useState } from "react";
import logo from "../assets/logo.svg";
import "./css/login.css";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
    navigate("/");
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
              required
            />
            {/* {errors.email && <p className="error">{errors.email}</p>} */}
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
              required
            />
            {/* {errors.password && <p className="error">{errors.password}</p>} */}
          </div>
          <p className="field forgot-password" onClick={()=>{navigator}}>Forgot Password?</p>
          <button type="submit" className="button">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
