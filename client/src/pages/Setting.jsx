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
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored) {
      const user = JSON.parse(stored);
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
          <form className="" onSubmit={handleUsernameUpdate}>
            <h5 className="mb-3">Change Username</h5>
            <div className="mb-3">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter new username"
                required
                className="form-control no-focus"
                autoComplete="off"
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="off"
                className="form-control no-focus"
              />
            </div>
            <div className="d-flex justify-content-end mt-4">
              <button className="btn btn-sm btn-primary" type="submit">
                Update Username
              </button>
            </div>
          </form>
        );

      case "email":
        return (
          <form onSubmit={handleEmailUpdate}>
            <h5 className="mb-3">Change Email</h5>
            <div className="mb-3">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter new email"
                required
                className="form-control no-focus"
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="form-control no-focus"
              />
            </div>
            <div className="d-flex justify-content-end mt-4">
              <button className="btn btn-sm btn-primary" type="submit">
                Change Email
              </button>
            </div>
          </form>
        );

      case "password":
        if (isCodeValidated) {
          return (
            <form onSubmit={handlePasswordReset}>
              <h5 className="mb-3">Reset Password</h5>
              <div className="mb-3">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  className=" form-control no-focus"
                  autoComplete="off"
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className=" form-control no-focus"
                  autoComplete="off"
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className=" form-control no-focus"
                  autoComplete="off"
                />
              </div>

              <div className="d-flex justify-content-end mt-4">
                <button className="btn btn-sm btn-primary" type="submit">
                  Change Password
                </button>
              </div>
            </form>
          );
        }
        return (
          <form className="form_container" onSubmit={handleCodeValidation}>
            <h5 className="mb-3">Change Password</h5>
            <div className="border mb-3 p-2 rounded">
              <p className="mb-0">
                A verification code has been send to your email. Please check
                your email.
              </p>
            </div>
            <div className="mb-3">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification code"
                required
                className="form-control no-focus"
              />
            </div>
            <div className="d-flex justify-content-end mt-4">
              <button className="btn btn-sm btn-primary" type="submit">
                Validate Code
              </button>
            </div>
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
        stored.email = newEmail;
        localStorage.setItem("user", JSON.stringify(stored));
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
    console.log(stored.email);
    try {
      const response = await axios.post(
        `http://localhost:8081/forgot-password?email=${stored.email}`
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
      const response = await axios.post(
        `http://localhost:8081/verify-code?code=${verificationCode}&email=${storedUser.email}`
      );
      if (response.status === 200) {
        localStorage.setItem("code", verificationCode);
        toast.success("Verification successful!");
        setIsCodeValidated(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid code!");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    const code = localStorage.getItem("code");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser?.email || !code) {
      toast.error("Invalid session or missing data. Please try again.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8081/change-password`,
        null, // No request body; only query parameters are used
        {
          params: {
            email: storedUser.email,
            code: code,
            currentPassword: currentPassword,
            newPassword: newPassword,
          },
          headers: {
            Authorization: authorizationToken,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Password changed successfully!");
        setActiveForm("logo");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred! Please try again."
      );
    }
  };

  return (
    <div className="set_container p-3">
      <h4>Account Details</h4>
      <div className="row mt-4 px-3 gap-3">
        <div className="col-5 border rounded p-3">
          <div className="set_change">
            <div>
              <p className="mb-0">Username</p>
              <h5 className="">{currentUsername}</h5>{" "}
            </div>
            <button
              className="btn btn-sm btn-primary"
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
              <p className="mb-0">Email</p>
              <h5 className="">{currentEmail}</h5>{" "}
            </div>
            <button
              className="btn btn-sm btn-primary"
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
              <p className="mb-0">Password</p>
              <h5 className="">***********</h5> {/* Password is hidden */}
            </div>
            {/**/}
            <button
              className="btn btn-sm btn-primary"
              onClick={() => {
                setActiveForm("password");
                setIsCodeValidated(false);
                sendCode();
              }}
            >
              {/*hello */}
              Change
            </button>
          </div>
        </div>

        <div className="col-6">
          <div className="border rounded p-3 w-75 h-100">{renderForm()}</div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
