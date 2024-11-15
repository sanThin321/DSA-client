import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../auth/auth";
import { toast } from "react-toastify";
import axios from "axios";

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const { authorizationToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sales, setSales] = useState([]);
  const [count, setCount] = useState([]);
  const [pcount, setpCount] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [salesCount, setSalesCount] = useState(0);

  const getcategoriescount = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/stats/product/category/count",
        {
          headers: {
            Authorization: authorizationToken,
          },
        }
      );

      if (response.status === 200) {
        setCount(response.data);
      }
    } catch (error) {
      toast.error("Could not fetch products.");
    }
  };

  const refreshCategoryCount = () => {
    getcategoriescount();
  };

  const getproductcount = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/stats/product/count",
        {
          headers: {
            Authorization: authorizationToken,
          },
        }
      );

      if (response.status === 200) {
        setpCount(response.data);
      }
    } catch (error) {
      toast.error("Could not fetch products.");
    }
  };
  const refreshProductCount = () => {
    getproductcount();
  };

  const getTotalRevenue = async () => {
    try {
      const today = getCurrentDate();
      const response = await axios.get(
        `http://localhost:8081/api/sale/revenue-by-date?saleDate=${today}`,
        {
          headers: {
            Authorization: authorizationToken,
          },
        }
      );

      if (response.status === 200) {
        setTotalRevenue(response.data);
      }
    } catch (error) {
      toast.error("Could not fetch products.");
    }
  };

  const getSalesCount = async () => {
    try {
      const today = getCurrentDate();
      const response = await axios.get(
        `http://localhost:8081/api/sale/sales-count-by-date?saleDate=${today}`,
        {
          headers: {
            Authorization: authorizationToken,
          },
        }
      );

      if (response.status === 200) {
        setSalesCount(response.data);
      }
    } catch (error) {
      toast.error("Could not fetch products.");
    }
  };


  const refreshTotalRevenue = () => {
    getTotalRevenue();
  };

  const refreshSalesCount = () => {
    getSalesCount();
  };

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

  // get cateSales
  const getSales = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/sale/all", {
        headers: {
          Authorization: authorizationToken,
        },
      });

      if (response.status === 200) {
        setSales(response.data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const refreshSales = () => {
    getSales();
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  return (
    <StoreContext.Provider
      value={{
        products,
        refreshProducts,
        categories,
        refreshCategory,
        sales,
        refreshSales,
        count,
        refreshCategoryCount,
        pcount,
        refreshProductCount,
        refreshTotalRevenue,
        totalRevenue,
        refreshSalesCount,
        salesCount
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
