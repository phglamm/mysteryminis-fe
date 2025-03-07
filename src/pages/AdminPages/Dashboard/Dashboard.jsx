import React, { useState, useMemo, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Select, Card } from "antd";
import api from "./../../../config/api";

Chart.register(...registerables);

export default function Dashboard() {
  const [data, setData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedWeek, setSelectedWeek] = useState("All");

  const fetchRevenue = async () => {
    try {
      const response = await api.get("dashboard/revenue");
      setData(response.data.monthlyData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  const months = Object.keys(data);

  const filteredData = useMemo(() => {
    if (selectedMonth === "All") {
      return Object.values(data).flatMap((month) => month.revenue);
    } else if (selectedWeek === "All") {
      return data[selectedMonth].revenue;
    } else {
      return [data[selectedMonth].revenue[selectedWeek - 1]];
    }
  }, [selectedMonth, selectedWeek, data]);

  const filteredProfitData = useMemo(() => {
    if (selectedMonth === "All") {
      return Object.values(data).flatMap((month) => month.profit);
    } else if (selectedWeek === "All") {
      return data[selectedMonth].profit;
    } else {
      return [data[selectedMonth].profit[selectedWeek - 1]];
    }
  }, [selectedMonth, selectedWeek, data]);

  const filteredOrderData = useMemo(() => {
    if (selectedMonth === "All") {
      return Object.values(data).flatMap((month) => month.weeklyOrders);
    } else if (selectedWeek === "All") {
      return data[selectedMonth].weeklyOrders;
    } else {
      return [data[selectedMonth].weeklyOrders[selectedWeek - 1]];
    }
  }, [selectedMonth, selectedWeek, data]);

  const totalRevenue = useMemo(
    () => filteredData.reduce((acc, val) => acc + val, 0),
    [filteredData]
  );

  const totalProfit = useMemo(
    () => filteredProfitData.reduce((acc, val) => acc + val, 0),
    [filteredProfitData]
  );

  const totalOrders = useMemo(
    () => filteredOrderData.reduce((acc, val) => acc + val, 0),
    [filteredOrderData]
  );

  const chartData = {
    labels:
      selectedMonth === "All"
        ? months
        : selectedWeek === "All"
        ? ["Week 1", "Week 2", "Week 3", "Week 4"]
        : [`Week ${selectedWeek}`],
    datasets: [
      {
        label: "Revenue (vnđ)",
        data: filteredData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.3,
      },
      {
        label: "Profit (vnđ)",
        data: filteredProfitData,
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
        tension: 0.3,
      },
      {
        label: "Orders",
        data: filteredOrderData,
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
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
    <div className="p-6 min-h-screen">
      <div className=" p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Revenue, Profit, and Orders Overview
        </h2>

        {/* Filters Section */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Month Selector */}
          <Select
            className="w-40"
            value={selectedMonth}
            onChange={(value) => {
              setSelectedMonth(value);
              setSelectedWeek("All");
            }}
            options={[
              { value: "All", label: "All" },
              ...months.map((month) => ({ value: month, label: month })),
            ]}
          />
          {/* Week Selector */}
          {selectedMonth !== "All" && (
            <Select
              className="w-40"
              value={selectedWeek}
              onChange={(value) => setSelectedWeek(value)}
              options={[
                { value: "All", label: "All" },
                { value: 1, label: "Week 1" },
                { value: 2, label: "Week 2" },
                { value: 3, label: "Week 3" },
                { value: 4, label: "Week 4" },
              ]}
            />
          )}
        </div>

        {/* Widgets */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 shadow-md">
            <h3 className="text-lg font-medium">Total Revenue</h3>
            <p className="text-xl font-bold text-green-600">
              {totalRevenue.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
          </Card>
          <Card className="p-4 shadow-md">
            <h3 className="text-lg font-medium">Total Profit</h3>
            <p className="text-xl font-bold text-blue-600">
              {totalProfit.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
          </Card>
          <Card className="p-4 shadow-md">
            <h3 className="text-lg font-medium">Total Orders</h3>
            <p className="text-xl font-bold text-orange-600">{totalOrders}</p>
          </Card>
        </div>

        {/* Revenue, Profit, and Orders Chart */}
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
