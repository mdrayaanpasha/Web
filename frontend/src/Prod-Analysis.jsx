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
  
    const FetchProductData = async () => {
      try {
        const resp = await axios.post('http://localhost:5000/api/getProductById', { Id: PID });
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
          {productData && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Product Details</h2>
              <p><strong>Name:</strong> {productData.name}</p>
              <p><strong>Category:</strong> {productData.category}</p>
              <p><strong>GST Rate:</strong> {productData.GST_RATE}</p>
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
            <div className="mt-8 max-w-4xl mx-auto">
              <div className="p-4 rounded-md mb-8">
                <h3 className="text-xl font-semibold text-gray-700">Total Sales per Month</h3>
                <Bar data={chartData} />
              </div>
  
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-700">Sales Trend with Linear Regression</h3>
                <Line data={chartData} />
              </div>
  
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-700">Sales Distribution</h3>
                <Pie data={pieChartData} />
              </div>
  
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-700">Radar Chart: Monthly Comparison</h3>
                <Radar data={radarChartData} />
              </div>
  
              <div className="mt-8">
                <h3 className="text-xl font-semibold">Statistical Analysis</h3>
                <p><strong>Mean Sales:</strong> {statsData.mean} units</p>
                <p><strong>Standard Deviation:</strong> {statsData.stdev} units</p>
                <p><strong>Min Sales:</strong> {statsData.min} units</p>
                <p><strong>Max Sales:</strong> {statsData.max} units</p>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }
  