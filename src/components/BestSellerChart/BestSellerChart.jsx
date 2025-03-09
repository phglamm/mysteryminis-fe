import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import api from "../../config/api";

Chart.register(...registerables);

export default function BestSellerChart() {
  const [bestSellers, setBestSellers] = useState([]);

  const fetchBestSeller = async () => {
    try {
      const response = await api.get("Dashboard/bestSellers");
      setBestSellers(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchBestSeller();
  }, []);

  const chartData = {
    labels: bestSellers.map((item) => item.boxName),
    datasets: [
      {
        label: "Sold Quantity",
        data: bestSellers.map((item) => item.soldQuantity),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className=" bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Top 10 Best Seller Boxes
      </h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}
