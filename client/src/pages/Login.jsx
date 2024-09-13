import React, { useState } from "react";
import logo from "../assets/logo.svg";
import "./css/login.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();

    let hasError = false;
    let newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required";
      hasError = true;
    
    }

    if (!password) {
      newErrors.password = "Password is required";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
    } else {
      // Handle form submission (e.g., send data to server)
      console.log("Form submitted with:", { email, password });
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
            <label htmlFor="email" className="form">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
