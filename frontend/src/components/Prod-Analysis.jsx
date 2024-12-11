import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Bar, Line, Pie, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import regression from 'regression';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);
import { mean, standardDeviation, min, max } from 'simple-statistics';

export default function ProductAnalysis() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const PID = queryParams.get('PID');
  
    const [productData, setProductData] = useState(null);
    const [selectedYear, setSelectedYear] = useState('2024');
    const [chartData, setChartData] = useState({});
    const [regressionLine, setRegressionLine] = useState([]);
    const [statsData, setStatsData] = useState({});
    const [pieChartData, setPieChartData] = useState({});
    const [radarChartData, setRadarChartData] = useState({});
    const [totalUnitsSold, setTotalUnitsSold] = useState(0); 
  
    const FetchProductData = async () => {
      try {
        const resp = await axios.post('https://royalco-api.onrender.com/api/api/getProductById', { Id: PID });
        if (resp.status === 200) {
          setProductData(resp.data.Data);

          processSalesData(resp.data.Data.Sales_History);
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    const processSalesData = (salesHistory) => {
      const filteredData = salesHistory.filter(item => item.Year === parseInt(selectedYear));
      const groupedData = Array(12).fill(0);
  
      filteredData.forEach(item => {
        const monthIndex = item.Month - 1;
        groupedData[monthIndex] += item.Units;
      });

      // Update the total units sold in the selected year
      const totalUnits = groupedData.reduce((acc, val) => acc + val, 0);
      setTotalUnitsSold(totalUnits);
  
      calculateGrowth(groupedData);
      performLinearRegression(groupedData);
      calculateStats(groupedData);
  
      setChartData({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: `Units Sold in ${selectedYear}`,
            data: groupedData,
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)', // Line color
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Transparent fill
            tension: 0.4,
          },
          {
            label: 'Linear Regression',
            data: regressionLine,
            fill: false,
            borderColor: 'rgba(255, 87, 51, 1)', // Regression line color
          },
        ],
      });
  
      setPieChartData({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            data: groupedData,
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
              '#66FF99', '#FF6699', '#6699FF', '#CCFF66', '#FF66CC', '#66CCFF',
            ],
          }
        ],
      });
  
      setRadarChartData({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Monthly Sales Distribution',
            data: groupedData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }
        ],
      });
    };
  
    const calculateGrowth = (data) => {
      const growth = data.slice(1).map((currentMonth, index) => {
        const previousMonthSales = data[index];
        if (previousMonthSales === 0) {
          return currentMonth > 0 ? '∞' : 'N/A';
        }
        return (((currentMonth - previousMonthSales) / previousMonthSales) * 100).toFixed(2);
      });
  
      setStatsData(prevStats => ({
        ...prevStats,
        monthlyGrowth: growth,
      }));
    };
  
    const performLinearRegression = (data) => {
      const months = data.map((_, index) => index);
      const points = months.map((month, index) => [month, data[index]]);
      const result = regression.linear(points);
      const regressionData = months.map(month => result.equation[0] * month + result.equation[1]);
      setRegressionLine(regressionData);
    };
  
    const calculateStats = (data) => {
      setStatsData({
        mean: mean(data).toFixed(2),
        stdev: standardDeviation(data).toFixed(2),
        min: min(data),
        max: max(data),
      });
    };
  
    useEffect(() => {
      if (PID) FetchProductData();
    }, [PID]);
  
    useEffect(() => {
      if (productData) processSalesData(productData.Sales_History);
    }, [selectedYear, productData]);
  
    return (
      <div className="h-screen w-full flex flex-col justify-between bg-white text-gray-800">
        <main className="flex-1 overflow-y-auto p-8">
{/* Product Details Section */}
{productData && (
  <div className="bg-white p-6 shadow-lg rounded-lg">
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        {/* Product Name */}
        <div className="flex flex-col space-y-2">
          <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700 flex items-center space-x-2">
            <span className="font-medium">Name:</span>
            <span className="text-gray-800 font-semibold">{productData.name}</span>
          </div>
        </div>

        {/* Product Category */}
        <div className="flex flex-col space-y-2">
          <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700 flex items-center space-x-2">
            <span className="font-medium">Category:</span>
            <span className="text-gray-800 font-semibold">{productData.category}</span>
          </div>
        </div>

        {/* GST Rate */}
        <div className="flex flex-col space-y-2">
          <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700 flex items-center space-x-2">
            <span className="font-medium">GST Rate:</span>
            <span className="text-gray-800 font-semibold">{productData.GST_RATE}</span>
          </div>
        </div>

        {/* Last Sold Date */}
        {/* <div className="flex flex-col space-y-2">
          <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700 flex items-center space-x-2">
            <span className="font-medium">Last Sold on:</span>
            <span className="text-gray-800 font-semibold">
              {new Date(productData.Last_Sold).toLocaleDateString("en-IN")}
            </span>
          </div>
        </div> */}

        {/* Sales Increase */}
        <div className="flex flex-col space-y-2">
          <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700 flex items-center space-x-2">
            <span className="font-medium">% Increase in Sales:</span>
            <span className="text-gray-800 font-semibold">
              {productData["Sales_History"].length > 1 ? (
                ((productData["Sales_History"][productData["Sales_History"].length - 1]["Units"] /
                productData["Sales_History"][productData["Sales_History"].length - 2]["Units"]) * 100).toFixed(2)
              ) : 0 }%
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
)}




  
          <div className="mt-6 text-center">
            <label htmlFor="yearInput" className="text-lg font-medium text-gray-700 mr-4">Select Year:</label>
            <input
              id="yearInput"
              type="number"
              value={selectedYear}
              min="2024"
              max="2024"
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 text-lg font-medium border-2 border-gray-300 rounded-lg focus:outline-none"
            />
          </div>
  
          {productData && chartData.labels && (
            <div className="mt-8  mx-auto w-full h-auto">
              <div className="h-full flex items-center justify-evenly w-full space-x-4">

                <div className="p-4 rounded-md mb-8 w-1/2 h-200 relative">
                  <h3 className="text-xl font-semibold text-gray-700 bg-gray-100 px-3 py-3  rounded-lg mb-5">Total Sales per Month</h3>
                  {/* Display Total Units Sold in the top-right corner */}
                  <div className="absolute bottom--20 right-4 bg-green-100 text-green-700 p-4 rounded-lg shadow-lg flex items-center justify-between">
                    <span className="font-semibold">Total Units Sold</span>
                    <span className="text-xl font-bold">{totalUnitsSold}</span>
                  </div>
                  <Bar data={chartData} />
                </div>

      
                  <div className="p-4 rounded-md mb-8 w-1/2 h-200">
                    <h3 className="text-xl font-semibold text-gray-700 bg-gray-100 px-3 py-3  rounded-lg mb-5">Sales Trend with Linear Regression</h3>
                    <Line data={chartData} />
                  </div>
                  
              
              </div>





              <div className="h-full flex items-center justify-evenly w-full space-x-4">
  
                <div className="p-4 rounded-md mb-8 w-1/2">
                  <h3 className="text-xl font-semibold text-gray-700 bg-gray-100 px-3 py-3  rounded-lg mb-5">Radar Chart: Monthly Comparison</h3>
                  <div className="h-80 w-full">
                    <Radar data={radarChartData} options={{ maintainAspectRatio: false }} />
                  </div>
                </div>

                <div className="p-4 rounded-md mb-8 w-1/2">
                  <h3 className="text-xl font-semibold text-gray-700 bg-gray-100 px-3 py-3  rounded-lg mb-5">Sales Distribution</h3>
                  <div className="h-80 w-full">
                    <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
                  </div>
                </div>

              </div>


              <hr/>

              <div className="mt-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 bg-gray-100 px-3 py-3  rounded-lg">Statistical Analysis</h3>

                <div className="overflow-hidden rounded-lg shadow-md">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-6 py-4 text-left  text-gray-600 font-bold text-xl">Metric</th>
                        <th className="px-6 py-4 text-left text-xl font-bold text-gray-600">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm text-gray-800">Mean Sales</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{statsData.mean} units</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm text-gray-800">Standard Deviation</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{statsData.stdev} units</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm text-gray-800">Min Sales</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{statsData.min} units</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm text-gray-800">Max Sales</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{statsData.max} units</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

          </div>

            
          )}
          <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center fixed bottom-5 right-5 hover:cursor-pointer" onClick={e=>window.location.href="./"}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#2d2d2d">
                    <path d="M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z"/>
                </svg>
            </div>
        </main>

      </div>

    );
  }
  
