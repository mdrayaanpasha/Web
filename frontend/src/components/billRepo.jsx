import { useEffect, useState } from "react";
import axios from "axios";

export default function BillRepo() {
    const [interface1, setInterface1] = useState(true);
    const [interface2, setInterface2] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [displayData, setDisplayData] = useState(null);

    async function FetchRepo(data) {
        try {
            const resp = await axios.post("http://localhost:5000/api/retriveTransactions", data);
            console.log(resp.data.D);
            setDisplayData(resp.data.D);
        } catch (error) {
            const status = error.response?.status;
            if (status === 404) {
                alert("NO DATA FOUND!");
            } else if (status === 500) {
                alert("INTERNAL SERVER ERROR!");
            } else {
                alert("An unexpected error occurred!");
            }
        }
    }

    useEffect(() => {
        if (selectedDate) {
            const d = new Date(selectedDate);
            const month = d.getMonth() + 1;
            const day = d.getDate();
            const year = d.getFullYear();

            const Data = {
                Month: month,
                Year: year,
                Day: day,
            };
            FetchRepo(Data);
        }
    }, [selectedDate]);

    return (
        <div className="min-h-screen bg-white text-black p-8">
            {interface1 && (
                <div className="flex flex-col items-center gap-6">
                    <h1 className="text-3xl font-bold">Transaction Viewer</h1>
                    <input
                        type="date"
                        name="date"
                        onChange={(e) => setSelectedDate(e.target.value)}
                        id="date-picker"
                        className="bg-white border border-black rounded-lg p-2 text-black focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                        className="bg-black text-white rounded-lg p-2 font-medium hover:bg-gray-900 transition"
                        onClick={() => {
                            if (selectedDate) {
                                setInterface1(false);
                                setInterface2(true);
                            } else {
                                alert("Please select a date!");
                            }
                        }}
                    >
                        View Transactions
                    </button>
                </div>
            )}

            {interface2 && (
                <div className="flex flex-col gap-6">
                    <h1 className="text-3xl font-bold text-center">Transactions</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {displayData && displayData.length > 0 ? (
                            displayData.map((ele) => (
                                <div
                                    key={ele._id}
                                    className="bg-white border border-black p-4 rounded-lg shadow-md"
                                >
                                    <p className="text-sm text-black">
                                        Date: {ele.D}/{ele.M}/{ele.Y}
                                    </p>
                                    <p className="text-lg font-bold text-black">
                                        Invoice: {ele._id}
                                    </p>
                                    <p className="text-sm text-black">
                                        Credit Owed: <span className="font-medium">{ele.Credit}</span>
                                    </p>
                                    <p className="text-sm text-black">
                                        Net Amount: <span className="font-medium">{ele.NetAmt}</span>
                                    </p>
                                    <button
                                        className="mt-2 bg-black text-white rounded-lg px-4 py-2 text-sm hover:bg-gray-900 transition"
                                        onClick={() =>
                                            (window.location.href = `./invoice?id=${ele._id}`)
                                        }
                                    >
                                        View Details
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-black">
                                No data found for the selected date.
                            </p>
                        )}
                    </div>
                    <div className="flex justify-center">
                        <button
                            className="bg-black text-white rounded-lg p-2 font-medium hover:bg-gray-900 transition"
                            onClick={() => {
                                setInterface1(true);
                                setInterface2(false);
                            }}
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
