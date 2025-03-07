import React, { useState, useMemo, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Select, Card } from "antd";
import api from "../../../config/api";

Chart.register(...registerables);

export default function Dashboard() {
  const [revenueData, setRevenueData] = useState({});
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await api.get("dashboard/revenue");
        setRevenueData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch revenue data: ", error);
      }
    };
    fetchRevenue();
  }, []);
  // Sample revenue data (for each month)
  // const revenueData = {
  //   January: [1200, 1500, 1800, 2000],
  //   February: [1100, 1400, 1600, 1900],
  //   March: [1300, 1600, 2000, 2400],
  //   April: [1700, 1900, 2200, 2500],
  //   May: [1800, 2100, 2300, 2700],
  //   June: [2000, 2300, 2500, 3000],
  //   July: [2200, 2500, 2700, 3200],
  //   August: [2400, 2700, 2900, 3400],
  //   September: [2600, 2900, 3100, 3600],
  //   October: [2800, 3100, 3300, 3800],
  //   November: [3000, 3300, 3500, 4000],
  //   December: [3200, 3500, 3700, 4200],
  // };

  const months = Object.keys(revenueData);

  // State for selected month (default: all months)
  const [selectedMonth, setSelectedMonth] = useState("All");

  // Calculate filtered revenue
  const filteredData = useMemo(() => {
    if (selectedMonth === "All") {
      return Object.values(revenueData).flat(); // Show all months
    } else {
      return revenueData[selectedMonth];
    }
  }, [selectedMonth]);

  // Calculate total revenue based on filter
  const totalRevenue = useMemo(
    () => filteredData.reduce((acc, val) => acc + val, 0),
    [filteredData]
  );

  // Chart data
  const data = {
    labels:
      selectedMonth === "All"
        ? months
        : ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Revenue (vnđ)",
        data:
          selectedMonth === "All"
            ? months.map((m) => revenueData[m].reduce((a, b) => a + b, 0))
            : filteredData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="p-6  min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Revenue Overview
        </h2>

        {/* Filters Section */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Month Selector */}
          <Select
            className="w-40"
            value={selectedMonth}
            onChange={(value) => setSelectedMonth(value)}
            options={[
              { value: "All", label: "All" },
              ...months.map((month) => ({ value: month, label: month })),
            ]}
          />
        </div>

        {/* Revenue Widget */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 shadow-md">
            <h3 className="text-lg font-medium">Total Revenue</h3>
            <p className="text-xl font-bold text-green-600">
              {totalRevenue.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
