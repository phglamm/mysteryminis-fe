import { useState, useMemo, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Select, Card } from "antd";
import api from "./../../config/api";

Chart.register(...registerables);

export default function RevenueChart() {
  const [data, setData] = useState({});
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedWeek, setSelectedWeek] = useState("All");
  a;
  b;
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

  const years = Object.keys(data);
  const months = selectedYear !== "All" ? Object.keys(data[selectedYear]) : [];

  const filteredData = useMemo(() => {
    if (selectedYear === "All") {
      return years.map((year) =>
        Object.values(data[year])
          .flatMap((month) => month.revenue)
          .reduce((acc, val) => acc + val, 0)
      );
    }
    if (selectedMonth === "All") {
      return months.map((month) =>
        data[selectedYear][month].revenue.reduce((acc, val) => acc + val, 0)
      );
    } else if (selectedWeek === "All") {
      return data[selectedYear][selectedMonth].revenue;
    } else {
      return [data[selectedYear][selectedMonth].revenue[selectedWeek - 1]];
    }
  }, [selectedYear, selectedMonth, selectedWeek, data, months, years]);

  const filteredProfitData = useMemo(() => {
    if (selectedYear === "All") {
      return years.map((year) =>
        Object.values(data[year])
          .flatMap((month) => month.profit)
          .reduce((acc, val) => acc + val, 0)
      );
    }
    if (selectedMonth === "All") {
      return months.map((month) =>
        data[selectedYear][month].profit.reduce((acc, val) => acc + val, 0)
      );
    } else if (selectedWeek === "All") {
      return data[selectedYear][selectedMonth].profit;
    } else {
      return [data[selectedYear][selectedMonth].profit[selectedWeek - 1]];
    }
  }, [selectedYear, selectedMonth, selectedWeek, data, months, years]);

  const filteredOrderData = useMemo(() => {
    if (selectedYear === "All") {
      return years.map((year) =>
        Object.values(data[year])
          .flatMap((month) => month.weeklyOrders)
          .reduce((acc, val) => acc + val, 0)
      );
    }
    if (selectedMonth === "All") {
      return months.map((month) =>
        data[selectedYear][month].weeklyOrders.reduce(
          (acc, val) => acc + val,
          0
        )
      );
    } else if (selectedWeek === "All") {
      return data[selectedYear][selectedMonth].weeklyOrders;
    } else {
      return [data[selectedYear][selectedMonth].weeklyOrders[selectedWeek - 1]];
    }
  }, [selectedYear, selectedMonth, selectedWeek, data, months, years]);

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
      selectedYear === "All"
        ? years
        : selectedMonth === "All"
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
    <div className=" bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Revenue, Profit, and Orders Overview
      </h2>

      {/* Filters Section */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Year Selector */}
        <Select
          className="w-40"
          value={selectedYear}
          onChange={(value) => {
            setSelectedYear(value);
            setSelectedMonth("All");
            setSelectedWeek("All");
          }}
          options={[
            { value: "All", label: "All" },
            ...years.map((year) => ({ value: year, label: year })),
          ]}
        />
        {/* Month Selector */}
        {selectedYear !== "All" && (
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
        )}
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
  );
}
