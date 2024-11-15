import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Make sure you have this installed
import "react-toastify/dist/ReactToastify.css"; // Import Toast styles
import "./css/Settings.css"; // Ensure this path is correct
import logo from "../assets/logo.svg";

const Settings = () => {
  const [activeForm, setActiveForm] = useState("logo");
  const [isCodeValidated, setIsCodeValidated] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  // States to hold fetched user data
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");

  // Fetch the current username and email when the component mounts
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("/api/user-details"); // Adjust the endpoint as needed
        setCurrentUsername(response.data.username); // Assuming the response contains 'username'
        setCurrentEmail(response.data.email); // Assuming the response contains 'email'
      } catch (error) {
        toast.error("Error fetching user details!");
      }
    };
    
    fetchUserDetails();
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

  // Handle username update
  const handleUsernameUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/update-username", {
        username: newUsername,
        password: currentPassword,
      });
      if (response.status === 200) {
        toast.success("Username updated successfully!");
        setActiveForm("logo");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred!");
    }
  };

  // Handle email update
  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/update-email", {
        email: newEmail,
        password: currentPassword,
      });
      if (response.status === 200) {
        toast.success("Email updated successfully!");
        setActiveForm("logo");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred!");
    }
  };

  // Handle code validation
  const handleCodeValidation = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/verify-code", { code: verificationCode });
      if (response.status === 200) {
        toast.success("Verification successful!");
        setIsCodeValidated(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid code!");
    }
  };

  // Handle password reset
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
    } catch (error)      {
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
                <p className="set_detail">{currentUsername}</p> {/* Displaying fetched username */}
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
                <p className="set_detail">{currentEmail}</p> {/* Displaying fetched email */}
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
                <p className="set_detail">***********</p> {/* Password is hidden */}
              </div>
              <button
                className="set_btn"
                onClick={() => {
                  setActiveForm("password");
                  setIsCodeValidated(false);
                }}
              >
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
