import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/Settings.css";
import logo from "../assets/logo.svg";
import axios from "axios";
import { useAuth } from "../auth/auth";

const Settings = () => {
  const [activeForm, setActiveForm] = useState("logo");
  const [isCodeValidated, setIsCodeValidated] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const { authorizationToken } = useAuth();

  // States to hold user data fetched from localStorage
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");

  // Fetch user details from localStorage when the component mounts
  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored) {
      const user = JSON.parse(stored); // Assuming 'user' is a JSON string in localStorage
      setCurrentUsername(user.username);
      setCurrentEmail(user.email);
    } else {
      toast.error("User details not found in localStorage!");
    }
  }, []);

  const renderForm = () => {
    switch (activeForm) {
      case "username":
        return (
          <form className="form_container" onSubmit={handleUsernameUpdate}>
            <h3>Change Username</h3>
            <label>New Username</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter new username"
              required
            />
            <label>Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <button className="submit_btn" type="submit">
              Update Username
            </button>
          </form>
        );

      case "email":
        return (
          <form className="form_container" onSubmit={handleEmailUpdate}>
            <h3>Change Email</h3>
            <label>New Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email"
              required
            />
            <label>Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <button className="submit_btn" type="submit">
              Update Email
            </button>
          </form>
        );

      case "password":
        if (isCodeValidated) {
          return (
            <form className="form_container" onSubmit={handlePasswordReset}>
              <h3>Reset Password</h3>
              <label>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
              <button className="submit_btn" type="submit">
                Update Password
              </button>
            </form>
          );
        }
        return (
          <form className="form_container" onSubmit={handleCodeValidation}>
            <h3>Change Password</h3>
            <label>Verification Code</label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter verification code"
              required
            />
            <button className="submit_btn" type="submit">
              Validate Code
            </button>
          </form>
        );

      default:
        return (
          <div className="logo_container">
            <img src={logo} alt="Project Logo" className="set_logo" />
          </div>
        );
    }
  };

  const handleUsernameUpdate = async (e) => {
    e.preventDefault();
    const stored = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await axios.post(
        `http://localhost:8081/change-username?email=${stored.email}&currentPassword=${currentPassword}&newUsername=${newUsername}`,
        {
          username: newUsername,
          password: currentPassword,
        },
        {
          headers: {
            Authorization: authorizationToken,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Username updated successfully!");
        // Update localStorage and state
        stored.username = newUsername;
        localStorage.setItem("user", JSON.stringify(stored)); // Update the full user object
        setCurrentUsername(newUsername);
        setActiveForm("logo");
        setNewUsername("");
        setCurrentPassword("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred!");
    }
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    const stored = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await axios.post(
        `http://localhost:8081/change-email?currentEmail=${stored.email}&newEmail=${newEmail} &currentPassword=${currentPassword}`,
        {
          email: newEmail,
          password: currentPassword,
        },
        {
          headers: {
            Authorization: authorizationToken,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Email updated successfully!");
        // Update localStorage and state
        stored.email = newEmail;
        localStorage.setItem("user", JSON.stringify(stored)); // Update the full user object
        setCurrentEmail(newEmail);
        setActiveForm("logo");
        setNewEmail("");
        setCurrentPassword("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred!");
    }
  };
  const sendCode = async () => {
    const stored = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await axios.post(
        `http://localhost:8081/forgot-password?email=${user.email}`
      );
      console.log(stored.email);
      if (response.status === 200) {
        toast.success("Reset code sent to your email.");
      }
    } catch (error) {
      toast.error("Failed to send reset email. Please try again.");
    }
  };
  const handleCodeValidation = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/verify-code", {
        code: verificationCode,
      });
      if (response.status === 200) {
        toast.success("Verification successful!");
        setIsCodeValidated(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid code!");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      const response = await axios.post("/api/reset-password", {
        currentPassword,
        newPassword,
      });
      if (response.status === 200) {
        toast.success("Password updated successfully!");
        setActiveForm("logo");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred!");
    }
  };

  return (
    <div className="set_container">
      <h3 className="set_topic">Account Details</h3>
      <div className="setting_container">
        <div className="set_contain">
          <div className="set_account">
            <div className="set_change">
              <div>
                <h4 className="set_subtopic">Username</h4>
                <p className="set_detail">{currentUsername}</p>{" "}
                {/* Displaying fetched username */}
              </div>
              <button
                className="set_btn"
                onClick={() => {
                  setActiveForm("username");
                  setIsCodeValidated(false);
                }}
              >
                Change
              </button>
            </div>
            <div className="set_change">
              <div>
                <h4 className="set_subtopic">Email</h4>
                <p className="set_detail">{currentEmail}</p>{" "}
                {/* Displaying fetched email */}
              </div>
              <button
                className="set_btn"
                onClick={() => {
                  setActiveForm("email");
                  setIsCodeValidated(false);
                }}
              >
                Change
              </button>
            </div>
            <div className="set_change">
              <div>
                <h4 className="set_subtopic">Password</h4>
                <p className="set_detail">***********</p>{" "}
                {/* Password is hidden */}
              </div>{/**/}
              <button
                className="set_btn"
                onClick={() => {
                  setActiveForm("password");
                  setIsCodeValidated(false);
                  sendCode();
                }}
              >{/*hello */}
                Change
              </button>
            </div>
          </div>
        </div>
        <div className="set_contain form_side">{renderForm()}</div>
      </div>
    </div>
  );
};

export default Settings;
