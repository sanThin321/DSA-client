import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./auth/auth.jsx";
import { StoreProvider } from "./context/Store.jsx";
import "./index.css"
createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <StoreProvider>
      <StrictMode>
        <App />
        <ToastContainer
          position="bottom-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          bodyClassName="toastBody"
        />
      </StrictMode>
    </StoreProvider>
  </AuthProvider>
);
