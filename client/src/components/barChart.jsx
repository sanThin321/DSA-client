import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { useAuth } from "../auth/auth";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
  const { authorizationToken } = useAuth();
  const [barData, setBarData] = useState(null);

  const getBarData = async () => {
    try {
      const res = await axios.get(
        `https://inventory-management-for-4sale-backend.onrender.com/api/stats/product/category-revenue`,
        {
          headers: {
            Authorization: authorizationToken,
          },
        }
      );

      if (res.status === 200) {
        const fetchedData = res.data;

        const data = {
          labels: fetchedData.categories, 
          datasets: [
            {
              label: "Revenue",
              data: fetchedData.totalRevenue, 
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
            {
              label: "Total Sales",
              data: fetchedData.totalSales,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        };

        setBarData(data);
      }
    } catch (error) {
      console.error("Error fetching bar data:", error);
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 2,
        },
      },
    },
  };

  useEffect(() => {
    getBarData();
  }, []);

  return (
    <div>
      {barData ? (
        <Bar data={barData} options={options} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default BarChart;
