import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "./Nav";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

export default function Home() {
  const [monthRevenue, setMonthRevenue] = useState({});
  const [topProducts, setTopProducts] = useState([]);
  const [bottomProducts, setBottomProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);

  const currentYear = new Date().getFullYear();
  const generateMonths = () => {
    return Array.from({ length: 12 }, (_, i) => `${currentYear}-${String(i + 1).padStart(2, "0")}`);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("https://royalco-api.onrender.com/api/central");
      const data = response.data;

      const allMonths = generateMonths();
      const filledRevenue = allMonths.reduce((acc, month) => {
        acc[month] = data.YearBased[month] || 0;
        return acc;
      }, {});

      setMonthRevenue(filledRevenue);
      setTopProducts(data.MostSold.slice(0, 5));
      setBottomProducts(data.LeastSold.slice(0, 3));
      setTopCustomers(data.TopCustomers.slice(0, 3));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate Total Sales for the year so far
  const totalSales = Object.values(monthRevenue).reduce((sum, revenue) => sum + revenue, 0);

  const calculateRegression = (x, y) => {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi ** 2, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
    const intercept = (sumY - slope * sumX) / n;

    return x.map((xi) => slope * xi + intercept);
  };

  const chartLabels = Object.keys(monthRevenue);
  const chartData = Object.values(monthRevenue);

  const regressionData = calculateRegression(chartLabels.map((_, i) => i), chartData);

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: "Monthly Revenue",
        data: chartData,
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.4,
      },
      {
        label: "Trend Line",
        data: regressionData,
        borderColor: "rgba(255, 99, 132, 0.8)",
        borderDash: [5, 5],
      },
    ],
  };

  return (
    <>
      <Nav />
      <div className="p-8 space-y-12">
        {/* Revenue Chart + Total Sales Card inside the graph area */}
        <div className="flex flex-wrap gap-8">
          <div className="w-full md:w-7/12 bg-white rounded-lg p-6 relative">
            {/* Overlay Total Sales on top of the chart */}
            <div className="absolute top-4 right-4 bg-green-100 text-green-800 p-4 rounded-lg shadow-lg flex items-center justify-between">
              <span className="font-semibold">Total Sales</span>
              <span className="text-xl font-bold">₹{totalSales.toLocaleString()}</span>
            </div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700 bg-gray-100 p-2 rounded-lg">
              Monthly Revenue
            </h2>
            <Line data={data} />
          </div>

          {/* Table Cards */}
          <div className="w-full md:w-4/12 bg-white rounded-lg p-6 border border-gray-300 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 bg-gray-100 p-2 rounded-lg">
              Top Selling Products
            </h2>
            <div className="overflow-x-auto rounded-t-lg">
              <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                <thead className="bg-gradient-to-r from-blue-200 to-blue-100 text-gray-900 text-lg">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-2 font-medium">Product</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium">Quantity Sold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topProducts.map(([id, quantity, name]) => (
                    <tr key={id}>
                      <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{name}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Least Selling Products + Top Customers */}
        <div className="flex flex-wrap gap-8">
          <div className="w-full md:w-4/12 bg-white rounded-lg p-6 border border-gray-300 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 bg-gray-100 p-2 rounded-lg">
              Least Selling Products
            </h2>
            <div className="overflow-x-auto rounded-t-lg">
              <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                <thead className="bg-gradient-to-r from-yellow-200 to-yellow-100 text-gray-900 text-lg">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-2 font-medium">Product</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium">Quantity Sold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bottomProducts.map(([id, quantity, name]) => (
                    <tr key={id}>
                      <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{name}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="w-full md:w-4/12 bg-white rounded-lg p-6 border border-gray-300 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 bg-gray-100 p-2 rounded-lg">
              Top Customers
            </h2>
            <div className="overflow-x-auto rounded-t-lg">
              <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                <thead className="bg-gradient-to-r from-green-200 to-green-100 text-gray-900 text-lg">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-2 font-medium">Customer</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium">Total Spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topCustomers.map(([id, amount, name]) => (
                    <tr key={id}>
                      <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{name || "Customer"}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">₹{amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* buttons section  */}
          
          <div className="w-full md:w-1/5 bg-white rounded-lg p-6 border border-gray-300 shadow-lg flex items-center flex-col justify-evenly">
          
            
                <a
                className="w-full group flex items-center justify-between gap-4 rounded-lg border border-current px-5 py-3 text-black transition-colors hover:bg-black focus:outline-none focus:ring active:bg-indigo-500"
                href="./PA"
                >
                <span className="font-medium transition-colors group-hover:text-white"> Product Analysis </span>

                <span
                    className="shrink-0 rounded-full border border-black bg-white p-2 group-active:border-indigo-500"
                >
                    <svg
                    className="size-5 rtl:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                    </svg>
                </span>
                </a>

                


                
                <a
                className="w-full group flex items-center justify-between gap-4 rounded-lg border border-current px-5 py-3 text-black transition-colors hover:bg-black focus:outline-none focus:ring active:bg-indigo-500"
                href="./CA"
                >
                <span className="font-medium transition-colors group-hover:text-white"> Customer Analysis </span>

                <span
                    className="shrink-0 rounded-full border border-black bg-white p-2 group-active:border-indigo-500"
                >
                    <svg
                    className="size-5 rtl:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                    </svg>
                </span>
                </a>
                <a
                className="w-full group flex items-center justify-between gap-4 rounded-lg border border-current px-5 py-3 text-black transition-colors hover:bg-black focus:outline-none focus:ring active:bg-indigo-500"
                href="./userAdd"
                >
                <span className="font-medium transition-colors group-hover:text-white"> Add Customer </span>

                <span
                    className="shrink-0 rounded-full border border-black bg-white p-2 group-active:border-indigo-500"
                >
                    <svg
                    className="size-5 rtl:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                    </svg>
                </span>
                </a>

         </div>


        </div>
      </div>
      <button class="fixed bottom-5 right-10 bg-black text-white p-4 rounded-full flex items-center space-x-2 shadow-lg hover:bg-gray-800 transition-all duration-200" onClick={e=>window.location.href="./billing"}>
  
  <span className="font-bold">Create Bill</span>
  <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="m216-160-56-56 464-464H360v-80h400v400h-80v-264L216-160Z"/></svg>
</button>

    </>
  );
}
