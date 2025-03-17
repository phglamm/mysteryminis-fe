import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { getBestSellers } from "../../services/AdminServices/DashboardServices/DashboardServices";

Chart.register(...registerables);

export default function BestSellerChart() {
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    const fetchBestSeller = async () => {
      try {
        const bestSellersData = await getBestSellers();
        setBestSellers(bestSellersData);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
      }
    };

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
