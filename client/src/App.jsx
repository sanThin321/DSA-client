import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Header";
import Login from "./pages/Login";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import Sales from "./pages/Sales";
import Settings from "./pages/Setting";
import InventroryDetail from "./pages/inventoryDeatils";
import ProtectedRoute from "./auth/ProtectedRoute";
import SalesInfo from "./pages/SaleInfo";
import AddSales from "./pages/addSales";
import ForgotPassword from "./pages/forgotPassword";
import Valid from "./pages/validCode";
import ResetPassword from "./pages/resetPassword";
import PageNotFound from "./pages/PageNotFound"; // Import the 404 page

const Layout = () => {
  const location = useLocation();
  const noSidebarRoutes = ["/", "/forgotpassword", "/validcode", "/resetpassword"];
  const showSidebar = !noSidebarRoutes.includes(location.pathname);

  return (
    <>
      {showSidebar ? (
        <Sidebar>
          <Routes>
            {/* Routes that should always be accessible */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/inventory/:id" element={<InventroryDetail />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/add-sale" element={<AddSales />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/sales/:id" element={<SalesInfo />} />
              <Route path="/sales/add-sale" element={<AddSales />} />
            </Route>
            <Route path="*" element={<PageNotFound />} /> {/* Catch-all for 404 */}
          </Routes>
        </Sidebar>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/validcode" element={<Valid />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="*" element={<PageNotFound />} /> 
        </Routes>
      )}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
};

export default App;
