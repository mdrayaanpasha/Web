import { useEffect, useState } from "react";
<<<<<<< HEAD
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend);
=======
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
>>>>>>> 2d2404216954b994c2e3b28f33d332de75b3c5be

export default function CustomerAnalysis() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
<<<<<<< HEAD
    const CustomerNumber = queryParams.get("CN");
    const [CustomerInfo, setCustomerInfo] = useState(null);
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [selectedYear, setSelectedYear] = useState(2024); // Default to 2024
    const [credit, setCredit] = useState(0);

    const FetchCustomerData = async () => {
        try {
            const resp = await axios.post("http://localhost:5000/api/getCustomerData", { CN: CustomerNumber });
            if (resp.status === 200) {
                const data = resp.data.Data;
                if (Array.isArray(data) && data.length > 0) {
                    setPurchaseHistory(data[0]?.Purchase_History || []);
                    setCustomerInfo({
                        CID: data[0]._id,
                        Email: data[0].Email,
                        Phone: data[0].Phone,
                        Name: data[0].Name,
                    });
=======
    const CustomerNumber = queryParams.get('CN');

    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());  // Default to current year

    // Fetch customer data
    const FetchCustomerData = async () => {
        try {
            const resp = await axios.post('http://localhost:5000/api/getCustomerData', { CN: CustomerNumber });
            if (resp.status === 200) {
                const data = resp.data.Data;
                if (Array.isArray(data) && data.length > 0) {
                    console.log(data[0]?.Purchase_History || [])
                    setPurchaseHistory(data[0]?.Purchase_History || []); // Set purchase history
>>>>>>> 2d2404216954b994c2e3b28f33d332de75b3c5be
                } else {
                    console.log("No customer data found or empty array");
                }
            }
        } catch (error) {
            console.log("Error fetching customer data: ", error);
        }
    };

<<<<<<< HEAD
    const getDebtData = async (cid) => {
        try {
            const resp = await axios.post("http://localhost:5000/api/getCustomerDebt", { CID: cid });
            if (resp.status === 200) {
                setCredit(resp.data.Credit);
            }
        } catch (error) {
            console.log(error);
            alert("Error loading credit");
        }
    };

    const groupDataByMonth = () => {
        const monthlyData = Array(12).fill(0);

        purchaseHistory.forEach((purchase) => {
            if (purchase.Year === selectedYear) {
                const monthIndex = purchase.Month - 1;
                purchase.Products.forEach((product) => {
                    monthlyData[monthIndex] += product.Unit;
                });
            }
        });
=======
    // Group purchase data by month and sum units for the selected year
    const groupDataByMonth = () => {
        const monthlyData = Array(12).fill(0);  // Initialize an array for 12 months

        purchaseHistory.forEach((product) => {
            if (product.Year === selectedYear){
                    // Add units to the corresponding month
                    const monthIndex = product.Month - 1;  // Month is 1-12, index is 0-11
                    monthlyData[monthIndex] += product[1];
                }
        })
        
>>>>>>> 2d2404216954b994c2e3b28f33d332de75b3c5be

        return monthlyData;
    };

<<<<<<< HEAD
    const linearRegression = (data) => {
        const n = data.length;
        const x = Array.from({ length: n }, (_, i) => i + 1);
        const y = data;

        const sumX = x.reduce((acc, val) => acc + val, 0);
        const sumY = y.reduce((acc, val) => acc + val, 0);
        const sumXY = x.reduce((acc, val, idx) => acc + val * y[idx], 0);
        const sumX2 = x.reduce((acc, val) => acc + val * val, 0);

        const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const b = (sumY - m * sumX) / n;

        return x.map((month) => m * month + b);
    };

    const prepareBarChartData = () => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December",
        ];

        const purchases = groupDataByMonth();

        return {
            labels: months,
            datasets: [
                {
                    label: "Monthly Purchases",
                    data: purchases,
                    backgroundColor: "rgba(75, 192, 192, 0.5)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
            ],
        };
    };

    const prepareLineChartData = () => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December",
        ];

        const purchases = groupDataByMonth();
        const predicted = linearRegression(purchases);

        return {
            labels: months,
            datasets: [
                {
                    label: "Actual Sales",
                    data: purchases,
                    backgroundColor: "rgba(75, 192, 192, 0.5)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                    fill: false,
                    tension: 0.2,
                    type: "line",
                },
                {
                    label: "Linear Regression Prediction",
                    data: predicted,
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1,
                    fill: false,
                    tension: 0.2,
                    type: "line",
                },
            ],
        };
    };

    const barChartOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const lineChartOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const prepareTableData = () => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December",
        ];

        const purchases = groupDataByMonth();

        const monthData = months.map((month, index) => ({
            month,
            units: purchases[index],
        }));

        const sortedData = monthData.sort((a, b) => b.units - a.units);

        return sortedData.slice(0, 3);
    };

    const formatCredit = (credit) => {
        return new Intl.NumberFormat("en-IN").format(credit);
    };

=======
>>>>>>> 2d2404216954b994c2e3b28f33d332de75b3c5be
    useEffect(() => {
        if (CustomerNumber) {
            FetchCustomerData();
        }
    }, [CustomerNumber]);

<<<<<<< HEAD
    useEffect(() => {
        if (CustomerInfo) {
            getDebtData(CustomerInfo.CID);
        }
    }, [CustomerInfo]);

    return (
        <div className=" min-h-screen">
            {/* Navbar */}
            <div className="bg-white p-6 shadow-lg rounded-lg">
    <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
            {/* Customer Name */}
            <div className="flex flex-col space-y-2">
                <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700 flex items-center space-x-2">
                    <span className="font-medium">Name:</span>
                    <span className="text-gray-800 font-semibold">{CustomerInfo?.Name || "Customer Name"}</span>
                </div>
            </div>

            {/* Customer Info Labels */}
            <div className="flex flex-col md:flex-row md:space-x-6 mt-4 md:mt-0">
                {/* Email */}
                <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700 flex items-center space-x-2">
                    <span className="font-medium">Email:</span>
                    <span className="text-gray-600">{CustomerInfo?.Email || "Not available"}</span>
                </div>
                {/* Phone */}
                <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700 flex items-center space-x-2">
                    <span className="font-medium">Phone:</span>
                    <span className="text-gray-600">{CustomerInfo?.Phone || "Not available"}</span>
                </div>
            </div>
        </div>
    </div>
</div>



            <div className="container mx-auto py-8">
                {/* Year Selection */}
                <div className="text-center mb-6">
                    <label className="text-lg font-medium text-gray-700 mr-2">
                        Select Year:
                    </label>
                    <input
                        type="number"
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        value={selectedYear}
                        min="2023"
                        max="2025"
                        className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Charts Section */}
                {purchaseHistory.length > 0 ? (
                    <div className="flex flex-wrap justify-center gap-6 mb-8">
                        {/* Bar Chart */}
                        <div className="bg-white shadow-md rounded-lg p-4 w-full lg:w-5/12">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Monthly Purchases (Bar Chart)
                            </h3>
                            <Bar data={prepareBarChartData()} options={barChartOptions} />
                        </div>

                        {/* Line Chart */}
                        <div className="bg-white shadow-md rounded-lg p-4 w-full lg:w-5/12">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Actual Sales & Predictions (Line Chart)
                            </h3>
                            <Line data={prepareLineChartData()} options={lineChartOptions} />
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-700">No purchase history found for this customer.</p>
                )}

                {/* Top 3 Months Table */}
                {purchaseHistory.length > 0 && (
                    <div className="bg-white shadow-md rounded-lg p-4 mb-8">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            Top 3 Months with Highest Purchases
                        </h3>
                        <table className="min-w-full table-auto border-collapse text-left">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-2 px-4 text-gray-600">Month</th>
                                    <th className="py-2 px-4 text-gray-600">Units Purchased</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prepareTableData().map((data, index) => (
                                    <tr
                                        key={index}
                                        className="border-t hover:bg-gray-50 transition-all duration-150"
                                    >
                                        <td className="py-2 px-4">{data.month}</td>
                                        <td className="py-2 px-4">{data.units}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Credit Section */}
                {credit !== 0 && (
                    <div className="bg-white shadow-md rounded-lg p-4 text-center">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            Amount Owed (Credit)
                        </h3>
                        <p className="text-2xl font-bold text-red-500">
                            ₹{formatCredit(credit)}
                        </p>
                    </div>
                )}
            </div>
        </div>
=======
    // Prepare data for the graph
    const prepareGraphData = () => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const purchases = groupDataByMonth();  // Get total units for each month

        return {
            labels: months,
            datasets: [
                {
                    label: 'Monthly Purchases',
                    data: purchases,
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        };
    };

    // Options for the Bar chart
    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,  // Ensure the y-axis starts at 0
                ticks: {
                    stepSize: 1,  // Adjust this for better visualization based on data
                },
            },
        },
    };

    return (
        <>
            <h2>Monthly Purchases for Customer {CustomerNumber}</h2>
            {/* Dropdown to select year */}
            <select onChange={(e) => setSelectedYear(Number(e.target.value))} value={selectedYear}>
                {[2023, 2024, 2025].map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>

            {/* Render the chart if data exists */}
            {purchaseHistory.length > 0 ? (
                <Bar data={prepareGraphData()} options={options} />
            ) : (
                <p>No purchase history available for this customer.</p>
            )}
        </>
>>>>>>> 2d2404216954b994c2e3b28f33d332de75b3c5be
    );
}
