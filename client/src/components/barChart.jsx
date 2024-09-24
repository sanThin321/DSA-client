import React from "react";
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

// Register the components with ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  // Define your data for sales and revenue
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Revenue",
        data: [
          50000, 45000, 55000, 30000, 40000, 45000, 50000, 55000, 45000, 48000,
          42000, 47000,
        ],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Sales",
        data: [
          40000, 38000, 42000, 27000, 35000, 37000, 42000, 46000, 38000, 43000,
          39000, 41000,
        ],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Define options for the chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom", // Place the legend at the bottom
        labels: {
          usePointStyle: true, // Make the legend markers circular
          pointStyle: "circle", // Set point style to circle
        },
      },
      //   title: {
      //     display: true,
      //     text: 'Sales & Revenue', // Chart title
      //   },
    },
    scales: {
      x: {
        grid: {
          display: false, // Remove the vertical grid lines
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10000, // Step size for the y-axis
        },
      },
    },
  };

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
