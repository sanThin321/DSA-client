import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from "recharts";
import { useAuth } from "../auth/auth";

const ProfitAndRevenueChart = () => {
  const {authorizationToken} = useAuth();
  const [data, setData] = useState([]);

  const chartData = async () => {
    const res = await axios.get("https://inventory-management-for-4sale-backend.onrender.com/api/sale/sale-stats/monthly", {
      headers: {
        Authorization: authorizationToken,
      },
    })

    if(res.status === 200) {
      setData(res.data);
    }
  }

  useEffect(() => {
    chartData();
  }, [])

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 50, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" activeDot={{ r: 8 }}/>
        <Line type="monotone" dataKey="totalProductSold" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProfitAndRevenueChart;
