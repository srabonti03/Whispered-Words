import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import { motion } from "framer-motion";
import { FaBox, FaReceipt } from "react-icons/fa";

function UserOrderHistory() {
  const [OrderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: localStorage.getItem("token"),
  };

  if (!headers.id || !headers.authorization) {
    console.error("Missing ID or token in localStorage");
  }

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/v1/orderhistory", {
          headers: {
            Authorization: `Bearer ${headers.authorization}`,
            id: headers.id,
          },
        });
        setOrderHistory(response.data.orders);
      } catch (error) {
        console.error("Error fetching order history:", error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderHistory();
  }, []);

  const groupedOrders = OrderHistory.reduce((groups, order) => {
    const timestamp = new Date(order.placeOrderTimestamp).toLocaleString();
    if (!groups[timestamp]) {
      groups[timestamp] = [];
    }
    groups[timestamp].push(order);
    return groups;
  }, {});

  const navigate = useNavigate();

  const handleViewTransactionReceipt = (timestamp) => {
    const encodedTimestamp = encodeURIComponent(timestamp);
    navigate(`/PaymentInvoice/${encodedTimestamp}`);
  };

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case "COD":
        return "text-green-500";
      case "Card":
        return "text-blue-400";
      case "bKash":
        return "text-pink-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-[70vh]">
          <Loader />
        </div>
      ) : Object.keys(groupedOrders).length === 0 ? (
        <motion.div
          className="h-[80vh] p-4 text-zinc-100 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl text-yellow-100 font-semibold mb-10 text-center">
            Uh-oh! Looks like your <span className="text-yellow-300">order history</span> is a little empty...
          </h1>
          <motion.div
            initial={{ x: "-10%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="inline-block border border-zinc-300 rounded-lg backdrop-blur-md bg-zinc-800 bg-opacity-40 shadow-lg"
          >
            <Link
              to="/Books"
              className="py-3 px-6 rounded text-lg font-semibold flex items-center text-zinc-500"
            >
              <motion.div
                whileHover={{ color: "#FACC15" }}
                animate={{ color: "#FACC15" }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex items-center"
              >
                Shop Now and Make Your Move
                <FaBox className="ml-3 text-yellow-500" />
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          className="h-full p-4 text-zinc-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl text-yellow-100 font-semibold mb-10 text-center">
            Your Journey Through <span className="text-yellow-300">Our Collections</span>
          </h1>

          <div className="mt-4 bg-zinc-800 w-full rounded py-2 px-4 flex gap-2">
            <div className="w-[3%] text-center font-semibold text-yellow-600">#</div>
            <div className="w-[22%] text-left font-semibold text-yellow-600">Books</div>
            <div className="w-[45%] text-left font-semibold text-yellow-600">Description</div>
            <div className="w-[9%] text-center font-semibold text-yellow-600">Price</div>
            <div className="w-[16%] text-center font-semibold text-yellow-600">Status</div>
            <div className="w-none md:w-[5%] hidden md:block text-center font-semibold text-yellow-600">
              Mode
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto scrollbar-none">
            {Object.keys(groupedOrders).map((timestamp, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-2 mt-2">
                  <span className="text-sm text-gray-400">
                    {new Date(timestamp).toLocaleDateString('en-GB')}{' '}
                    {new Date(timestamp).toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true,
                    })}
                  </span>
                  <button
                    className="text-gray-400 hover:text-yellow-300 flex items-center gap-2"
                    onClick={() => handleViewTransactionReceipt(timestamp)}
                  >
                    Transaction Receipt <FaReceipt />
                  </button>
                </div>

                {groupedOrders[timestamp].map((items, i) => (
                  <motion.div
                    key={items?._id || i}
                    className="mt-2 bg-zinc-700 rounded py-2 px-4 flex gap-2"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <div className="w-[3%] text-center">{i + 1}</div>
                    <div className="w-[22%]">
                      {items.book ? (
                        <Link to={`/viewbookdetails/${items.book._id}`} className="hover:text-blue-300">
                          {items.book.title || "Untitled Book"}
                        </Link>
                      ) : (
                        <span className="text-gray-400">No book available</span>
                      )}
                    </div>
                    <div className="w-[45%]">
                      <h1>
                        {items.book?.desc?.length > 0
                          ? items.book.desc.slice(0, 50) + "..."
                          : "No description available"}
                      </h1>
                    </div>
                    <div className="w-[9%] text-center">
                      {items.book?.price || "N/A"} TK
                    </div>
                    <div className="w-[16%] text-center font-semibold">
                      <span
                        className={`${
                          items.status === "Pending" ? "text-yellow-300" : ""
                        } ${
                          items.status === "Completed" ? "text-green-400" : ""
                        } ${
                          items.status === "Out for Delivery" ? "text-blue-500" : ""
                        } ${
                          items.status === "Cancelled" ? "text-red-500" : ""
                        }`}
                      >
                        {items.status}
                      </span>
                    </div>
                    <div className="w-none md:w-[5%] hidden md:block text-center text-sm text-zinc-300">
                      <span className={getPaymentMethodColor(items.paymentMethod)}>
                        {items.paymentMethod || "Unknown"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
}

export default UserOrderHistory;
