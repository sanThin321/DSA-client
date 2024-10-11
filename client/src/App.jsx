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


const Layout = () => {
  const location = useLocation();
  const showSidebar = location.pathname !== "/login"; 

  return (
    <>
      {showSidebar ? (
        <Sidebar>
          <Routes>
            <Route path="/login" element={<Login />} />
            {/* <Route path="*" element={<PageNotfound />} /> */}


            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/inventory/:id" element={<InventroryDetail />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/reports" element={<Reports />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/sales/:id" element={<SalesInfo />} />
        <Route path="/sales/add-sale" element={<AddSales />}/>
        <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </Sidebar>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
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
