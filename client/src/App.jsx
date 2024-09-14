import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Header";
import Login from "./pages/Login";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import Sales from "./pages/Sales";
import Settings from "./pages/Setting";
import Logout from "./pages/Logout";

const App = () => {
  return (
    <BrowserRouter>
      <HeaderWithConditionalRendering />
    </BrowserRouter>
  );
};

const HeaderWithConditionalRendering = () => {
  const location = useLocation();
  const showSidebar = location.pathname !== "/login"; // Hide Sidebar on login page

  return showSidebar ? (
    <Sidebar>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Sidebar>
  ) : (
    <Routes>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default App;
