import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaSync } from "react-icons/fa";
import Loader from "../Loader/Loader";

function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [statusOptions] = useState(["Pending", "Out for Delivery", "Completed", "Cancelled"]);

  const headers = {
    authorization: `Bearer ${localStorage.getItem("token")}`,
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-yellow-400";
      case "Out for Delivery":
        return "text-blue-400";
      case "Completed":
        return "text-green-400";
      case "Cancelled":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/v1/allorders", {
          headers,
        });
        setOrders(response.data.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred while fetching orders");
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const groupedOrders = orders.reduce((groups, order) => {
    const groupKey = `${order.orderID}_${new Date(order.placeOrderTimestamp).toLocaleString()}`;
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(order);
    return groups;
  }, {});

  const handleDropdownToggle = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleStatusChange = async (newStatus, order) => {
    try {
      await axios.put(`http://localhost:3001/api/v1/orders/status`, {
        placeOrderTimestamp: order.placeOrderTimestamp,
        newStatus,
      }, { headers });

      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.placeOrderTimestamp === order.placeOrderTimestamp
            ? { ...o, status: newStatus }
            : o
        )
      );

      alert(`Status updated to "${newStatus}"`);
    } catch (error) {
      console.error("Error updating status:", error.response?.data?.message || error.message);
      alert("Failed to update status");
    }
    setDropdownOpen(null);
  };

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-[70vh]">
          <Loader />
        </div>
      ) : (
        <motion.div
          className="h-full p-4 text-zinc-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl text-yellow-100 font-semibold mb-10 text-center">
            All <span className="text-yellow-300">Orders</span>
          </h1>

          <div className="mt-4 bg-zinc-800 w-full rounded py-2 px-4 grid grid-cols-8 gap-2">
            <div className="font-semibold text-yellow-600 text-center col-span-1">Order No.</div>
            <div className="font-semibold text-yellow-600 text-center col-span-2">Books</div>
            <div className="font-semibold text-yellow-600 text-center col-span-1">Price</div>
            <div className="font-semibold text-yellow-600 text-center col-span-1">Mode</div>
            <div className="font-semibold text-yellow-600 text-center col-span-1">Status</div>
            <div className="font-semibold text-yellow-600 text-center col-span-2">User Details</div>
          </div>

          <div className="max-h-[62vh] overflow-y-auto scrollbar-none">
            {Object.keys(groupedOrders)
              .sort((a, b) => new Date(b.split("_")[1]) - new Date(a.split("_")[1]))
              .map((groupKey, idx) => {
                const ordersInGroup = groupedOrders[groupKey];
                const timestamp = groupKey.split("_")[1];

                return (
                  <div key={idx}>
                    <div className="flex justify-between mb-2 mt-2">
                      <span className="text-sm text-gray-400">
                        {new Date(timestamp).toLocaleDateString("en-GB")}{" "}
                        {new Date(timestamp).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>

                    <motion.div
                      className="mt-2 bg-zinc-700 rounded py-2 px-4 grid grid-cols-8 gap-2"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                    >
                      <div className="text-left col-span-1 flex items-center justify-center text-yellow-300">
                        {ordersInGroup[0].orderNumber}
                      </div>

                      <div className="col-span-2 text-center">
                        <div className={ordersInGroup.flatMap((order) => order.bookDetails || []).length === 1 ? "flex flex-col items-center justify-center h-full" : ""}>
                          {ordersInGroup
                            .flatMap((order) => order.bookDetails || [])
                            .map((book, bookIdx) => (
                              <div key={bookIdx} className="font-normal text-zinc-200">
                                <p>{book.title}</p>
                              </div>
                            ))}
                        </div>
                        {ordersInGroup.flatMap((order) => order.bookDetails || []).length > 1 && (
                          <hr className="my-2 border-t-2 border-zinc-600 w-[70%] mx-auto" />
                        )}
                        {ordersInGroup.flatMap((order) => order.bookDetails || []).length > 1 ? (
                          <span className="text-yellow-400 font-semibold">
                            {ordersInGroup
                              .flatMap((order) => order.bookDetails || [])
                              .length}{" "}
                            Books
                          </span>
                        ) : null}
                      </div>

                      <div className="text-center col-span-1">
                        <span className="text-white font-normal">
                          <div
                            className={
                              ordersInGroup.flatMap((order) => order.bookDetails || []).length === 1
                                ? "flex flex-col items-center justify-center h-full"
                                : ""
                            }
                          >
                            {ordersInGroup
                              .flatMap((order) => order.bookDetails || [])
                              .map((book, bookIdx) => (
                                <div key={bookIdx} className="text-zinc-200">
                                  <p>{book.price} TK</p>
                                </div>
                              ))}
                          </div>
                          {ordersInGroup.flatMap((order) => order.bookDetails || []).length > 1 && (
                            <hr className="my-2 border-t-2 border-zinc-600" />
                          )}
                          {ordersInGroup.flatMap((order) => order.bookDetails || []).length > 1 ? (
                            <span className="text-yellow-400 font-semibold">
                              {ordersInGroup.reduce((total, order) => total + (order.total || 0), 0)} TK
                            </span>
                          ) : (
                            <span className="text-white font-normal">
                              {ordersInGroup[0].bookDetails[0]?.price}
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="text-center col-span-1 flex items-center justify-center relative">
                        <span
                          className={`text-md font-semibold ${getPaymentMethodColor(
                            ordersInGroup[0].paymentMethod
                          )}`}
                        >
                          {ordersInGroup[0].paymentMethod || "Unknown"}
                        </span>
                      </div>

                      <div className="text-center col-span-1 flex items-center justify-center relative">
                        <div className="flex justify-center items-center space-x-2">
                          <span
                            className={`font-semibold ${getStatusColor(ordersInGroup[0].status)}`}
                          >
                            {ordersInGroup[0].status || "Unknown"}
                          </span>
                          {ordersInGroup[0].status !== "Completed" && ordersInGroup[0].status !== "Cancelled" && (
                            <FaSync
                              className="text-green-500 text-lg cursor-pointer"
                              title="Update"
                              onClick={() => handleDropdownToggle(idx)}
                            />
                          )}
                        </div>

                        {dropdownOpen === idx && (
                          <div className="absolute right-0 mt-2 w-40 bg-zinc-800 rounded shadow-lg z-10">
                            {statusOptions
                              .filter((status) =>
                                ordersInGroup[0].status === "Pending"
                                ? status !== "Pending" && status !== "Completed"
                                : ordersInGroup[0].status === "Out for Delivery"
                                ? status !== "Out for Delivery" && status !== "Pending"
                                : true
                              )
                              .map((status) => (
                                <div
                                  key={status}
                                  className="px-4 py-2 text-white hover:bg-zinc-600 cursor-pointer transition duration-200 ease-in-out"
                                  onClick={() => handleStatusChange(status, ordersInGroup[0])}
                                >
                                  {status}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>

                      <div className="text-center col-span-2 flex flex-col items-center justify-center space-y-2">
                        <span>{ordersInGroup[0].userDetails?.username || "Unknown"}</span>
                        <span>{ordersInGroup[0].userDetails?.email || "No email"}</span>
                        <span>{ordersInGroup[0].userDetails?.address || "No address"}</span>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
          </div>
        </motion.div>
      )}
    </>
  );
}

export default AllOrders;
