import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function CustomerAnalysis() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
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
                } else {
                    console.log("No customer data found or empty array");
                }
            }
        } catch (error) {
            console.log("Error fetching customer data: ", error);
        }
    };

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
        

        return monthlyData;
    };

    useEffect(() => {
        if (CustomerNumber) {
            FetchCustomerData();
        }
    }, [CustomerNumber]);

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
    );
}
