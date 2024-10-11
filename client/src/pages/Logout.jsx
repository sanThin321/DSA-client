import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Reset authentication state
    setIsAuthenticated(false);

    // Redirect to login page
    navigate("/login");
  }, [navigate, setIsAuthenticated]);

  return null; // Optional: You can display a "Logging out..." message if desired
};

export default Logout;
