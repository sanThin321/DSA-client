import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../auth/auth";
import { toast } from "react-toastify";
import axios from "axios";

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const { authorizationToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const getAllProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/products", {
        headers: {
          Authorization: authorizationToken,
        },
      });

      if (response.status === 200) {
        setProducts(response.data);
        console.log(response.data);
      }
    } catch (error) {
      toast.error("Could not fetch products.");
    }
  };

  const refreshProducts = () => {
    getAllProducts();
  };

  // get categories
  const getCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/categories", {
        headers: {
          Authorization: authorizationToken,
        },
      });

      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const refreshCategory = () => {
    getCategories();
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        refreshProducts,
        categories,
        refreshCategory,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const StoreContextValue = useContext(StoreContext);
  if (!StoreContextValue) {
    throw new Error("useStore must be used within a StoreProvider.");
  }
  return StoreContextValue;
};
