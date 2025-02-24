import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function SalesChart() {
    const [salesData, setSalesData] = useState({
        labels: [],
        datasets: [
            {
                label: "Sales",
                data: [],
                borderColor: "#EC4899",
                backgroundColor: "#FBCFE8",
                fill: true,
                tension: 0.3,
            },
        ],
    });
    const [activeTab, setActiveTab] = useState("Weekly");
    const [currentInfo, setCurrentInfo] = useState("");

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const fetchSalesData = async (type) => {
        try {
            let endpoint = "";
            if (type === "Weekly") {
                endpoint = "http://localhost:3001/api/v1/weeklysales";
            } else if (type === "Yearly") {
                endpoint = "http://localhost:3001/api/v1/yearlysales";
            } else if (type === "Monthly") {
                endpoint = "http://localhost:3001/api/v1/monthlysales";
            }

            const response = await axios.get(endpoint);
            const data = response.data?.data || [];

            let labels = [];
            let totalOrders = [];

            if (type === "Weekly") {
                labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                totalOrders = data.map((item) => Math.max(0, item.totalOrders));

                const currentDay = new Date().getDay();
                for (let i = currentDay + 1; i < labels.length; i++) {
                    totalOrders[i] = 0;
                }
                const fullDayName = new Date().toLocaleString('en-US', { weekday: 'long' });  // Full day name
                setCurrentInfo(
                    <span style={{ color: "#F56DB2" }}>{fullDayName}</span>
                );
            } else if (type === "Yearly") {
                labels = [
                    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                ];
                totalOrders = data.map((item) => Math.max(0, item.totalOrders));
                const currentMonth = new Date().getMonth();
                for (let i = currentMonth + 1; i < labels.length; i++) {
                    totalOrders[i] = 0;
                }
                const fullMonthName = new Date().toLocaleString('en-US', { month: 'long' });  // Full month name
                setCurrentInfo(
                    <span style={{ color: "#34D299" }}>{fullMonthName}</span>
                );
            } else if (type === "Monthly") {
                labels = Array.from({ length: 31 }, (_, i) => i + 1);
                totalOrders = data.dailySales.map(item => Math.max(0, item.totalOrders));
                const currentDate = new Date().getDate();
                for (let i = currentDate; i < labels.length; i++) {
                    totalOrders[i] = 0;
                }
                const currentDateFormatted = new Date().toLocaleDateString('en-GB');
                setCurrentInfo(
                    <span style={{ color: "#4A90E2" }}>{currentDateFormatted}</span>
                );
            }

            setSalesData({
                labels,
                datasets: [
                    {
                        label: `${type} Sales`,
                        data: totalOrders,
                        borderColor:
                            type === "Weekly" ? "#EC4899" :
                            type === "Yearly" ? "#10B981" : "#3B82F6",
                        backgroundColor:
                            type === "Weekly" ? "#FBCFE8" :
                            type === "Yearly" ? "#D1FAE5" : "#BFDBFE",
                        fill: true,
                        tension: 0.3,
                    },
                ],
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            min: 0,
                            ticks: {
                                stepSize: 1,
                                color: "#D1D5DB",
                            },
                            grid: {
                                borderColor: "#4B5563",
                                color: "#374151",
                            },
                        },
                        x: {
                            ticks: {
                                color: "#D1D5DB",
                            },
                            grid: {
                                borderColor: "#4B5563",
                                color: "#374151",
                            },
                        },
                    },
                },
            });
        } catch (error) {
            console.error(`Error fetching ${type.toLowerCase()} sales:`, error);
        }
    };

    useEffect(() => {
        fetchSalesData(activeTab);
    }, [activeTab]);

    return (
        <div className="flex items-center relative">
            <div className="mt-20">
                <ul className="text-left list-none">
                    <li>
                        <button
                            className={`bg-transparent text-left ${activeTab === "Weekly" ? "text-pink-500" : "text-gray-500"}`}
                            onClick={() => setActiveTab("Weekly")}
                        >
                            Weekly
                        </button>
                    </li>
                    <li>
                        <button
                            className={`bg-transparent text-left ${activeTab === "Monthly" ? "text-blue-500" : "text-gray-500"}`}
                            onClick={() => setActiveTab("Monthly")}
                        >
                            Monthly
                        </button>
                    </li>
                    <li>
                        <button
                            className={`bg-transparent text-left ${activeTab === "Yearly" ? "text-green-500" : "text-gray-500"}`}
                            onClick={() => setActiveTab("Yearly")}
                        >
                            Yearly
                        </button>
                    </li>
                </ul>
            </div>
            <div className="ml-4">
                <Line
                    data={salesData}
                    options={salesData.options}
                    className="w-full mt-10 h-[70vh]"
                />
            </div>
            <div className="absolute top-0 right-5 text-lg font-semibold">
                {currentInfo}
            </div>
        </div>
    );
}

export default SalesChart;
