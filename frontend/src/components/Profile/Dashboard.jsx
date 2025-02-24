import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faCalendarAlt,
  faUser,
  faDollarSign,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import SalesChart from "./SalesChart";
import PieChart from "./PieChart";

function Dashboard() {
  const [booksCount, setBooksCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [todaysSales, setTodaysSales] = useState(0);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/v1/getallbooks"
        );
        setBooksCount(response.data.data.length);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Could not fetch books. Please try again later.");
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/v1/allevents"
        );
        if (response.data && response.data.data) {
          setEventsCount(response.data.data.length);
        } else {
          setError("No events found.");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Could not fetch events. Please try again later.");
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/v1/getallusers"
        );
        setUsersCount(response.data.users.length);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Could not fetch users. Please try again later.");
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchTodaysSales = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/v1/todaysales"
        );

        const totalSales =
          response.data?.data && response.data.data.length > 0
            ? response.data.data[0].totalSales
            : 0;
        setTodaysSales(totalSales);
      } catch (error) {
        console.error("Error fetching today's sales:", error);
        setTodaysSales(0);
      }
    };
    fetchTodaysSales();
  }, []);

  useEffect(() => {
    const fetchTotalOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/v1/todayorders"
        );
        const ordersCount = response.data?.data ?? 0;
        setTotalOrdersCount(ordersCount);
      } catch (error) {
        console.error("Error fetching today's total orders:", error);
        setTotalOrdersCount(0);
      }
    };
    fetchTotalOrders();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-semibold text-center text-yellow-100 mb-8">Dashboard of <span className="text-yellow-300">Insights</span></h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          <div className="basis-[215px] p-6 bg-zinc-800 rounded-xl shadow-lg border border-zinc-700 transition-all hover:shadow-xl flex justify-between items-center">
            <FontAwesomeIcon icon={faBook} className="text-yellow-400 text-5xl mr-4" />
            <div>
              <p className="font-bold text-lg text-yellow-50">Total Books</p>
              <p className="text-2xl font-semibold text-center text-yellow-300">{booksCount}</p>
            </div>
          </div>
          <div className="basis-[215px] p-6 bg-zinc-800 rounded-xl shadow-lg border border-zinc-700 transition-all hover:shadow-xl flex justify-between items-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-400 text-5xl mr-4" />
            <div>
              <p className="font-bold text-lg text-yellow-50">Total Events</p>
              <p className="text-2xl font-semibold text-center text-yellow-300">{eventsCount}</p>
            </div>
          </div>
          <div className="basis-[215px] p-6 bg-zinc-800 rounded-xl shadow-lg border border-zinc-700 transition-all hover:shadow-xl flex justify-between items-center">
            <FontAwesomeIcon icon={faUser} className="text-green-400 text-5xl mr-4" />
            <div>
              <p className="font-bold text-lg text-yellow-50">Total Users</p>
              <p className="text-2xl font-semibold text-center text-yellow-300">{usersCount}</p>
            </div>
          </div>
          <div className="basis-[215px] p-6 bg-zinc-800 rounded-xl shadow-lg border border-zinc-700 transition-all hover:shadow-xl flex justify-between items-center">
            <FontAwesomeIcon icon={faShoppingCart} className="text-purple-400 text-5xl mr-4" />
            <div>
              <p className="font-bold text-lg text-yellow-50 whitespace-nowrap">Today's Orders</p>
              <p className="text-2xl font-semibold text-center text-yellow-300">{totalOrdersCount}</p>
            </div>
          </div>
          <div className="basis-[215px] p-6 bg-zinc-800 rounded-xl shadow-lg border border-zinc-700 transition-all hover:shadow-xl flex justify-between items-center">
            <FontAwesomeIcon icon={faDollarSign} className="text-red-400 text-5xl mr-4" />
            <div>
              <p className="font-bold text-lg text-yellow-50">Today's Sales</p>
              <p className="text-2xl font-semibold text-center text-yellow-300">৳{todaysSales.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 relative flex flex-row justify-between">
        <div className="w-[700px] h-[54vh]">
          <SalesChart />
        </div>
        <div className="w-[470px] h-[54vh] p-6">
          <PieChart />
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
