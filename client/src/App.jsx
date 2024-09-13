import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import Header from "./components/Header";
import Login from "./pages/Login";
const App = () => {
  return (
    <BrowserRouter>
      <HeaderWithConditionalRendering />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};
const HeaderWithConditionalRendering = () => {
  const location = useLocation();
  const showHeader = location.pathname !== "/login";

  return showHeader ? <Header /> : null;
};

export default App;
