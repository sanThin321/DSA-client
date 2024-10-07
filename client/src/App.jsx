import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Header"; // Renamed to Sidebar based on the context
import Login from "./pages/Login";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import Sales from "./pages/Sales";
import Settings from "./pages/Setting";
import Logout from "./pages/Logout";
import InventroryDetail from "./pages/inventoryDeatils";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication

  return (
    <BrowserRouter>
      <HeaderWithConditionalRendering isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
    </BrowserRouter>
  );
};

const HeaderWithConditionalRendering = ({ isAuthenticated, setIsAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = (username, password) => {
    // Add your login logic here
    setIsAuthenticated(true); // Set authentication state
    navigate("/");
  };

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="*" element={<Login onLogin={handleLogin} />} /> {/* Default to login */}
      </Routes>
    );
  }

  return (
    <Sidebar>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/inventory/:id" element={<InventroryDetail />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Sidebar>
  );
};

export default App;
