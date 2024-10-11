import React from "react";
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

const data = [
  { month: "Sep", revenue: 30000, profit: 24000 },
  { month: "Oct", revenue: 40000, profit: 30000 },
  { month: "Nov", revenue: 70000, profit: 50000 },
  { month: "Dec", revenue: 60000, profit: 48000 },
  { month: "Jan", revenue: 50000, profit: 43000 },
  { month: "Feb", revenue: 60000, profit: 45000 },
  { month: "Mar", revenue: 55000, profit: 40000 },
];

const ProfitAndRevenueChart = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 50, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="profit" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProfitAndRevenueChart;
