import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

function ViewEventDetails() {
  const { eventId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/v1/eventdetails/${eventId}`);
        if (response.data.status === "success") {
          setData(response.data.data);
        } else {
          setError("Event not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Could not fetch event details. Please try again later.");
      }
    };
    fetchData();
  }, [eventId]);

  const isEventUpcoming = () => {
    if (data && data.startTime) {
      const eventDateTime = new Date(`${data.eventDate}T${data.startTime}`);
      return new Date() < eventDateTime;
    }
    return false;
  };

  useEffect(() => {
    if (data && isEventUpcoming()) {
      alert(`The event will happen on ${new Date(data.eventDate).toLocaleDateString()} at ${data.startTime}. Please wait!`);
    }
  }, [data]);

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    setIsScrolling(scrollTop > 0);
  };

  return (
    <div className="px-4 sm:px-12 bg-zinc-900 flex flex-col sm:flex-row gap-4 py-4">
      {error ? (
        <div className="text-red-500 text-center my-4">{error}</div>
      ) : !data ? (
        <div className="h-screen flex items-center justify-center my-4">
          <Loader />
        </div>
      ) : (
        <>
          <motion.div
            className="bg-zinc-800 rounded-lg shadow-md flex items-center justify-center my-2 w-full sm:w-2/5"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={`http://localhost:3001${data.imageUrl}`}
              alt={data.name || "Event Image"}
              className="h-[500px] w-full object-cover rounded-lg"
            />
          </motion.div>

          <motion.div
            className="p-4 w-full sm:w-3/5"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl text-yellow-800 font-semibold mb-2">
              {data.name}
            </h1>
            <p className="mt-2 text-zinc-100 text-xl sm:text-2xl font-medium">
              {new Date(data.eventDate).toLocaleDateString()} | {data.startTime} to {data.endTime}
            </p>
            <div className="relative overflow-hidden max-h-[18rem]">
              <div
                className="overflow-y-auto max-h-[18rem] scrollbar-none pr-2"
                onScroll={handleScroll}
              >
                <p className="mt-10 mb-10 text-zinc-500">{data.description}</p>
              </div>
              {isScrolling && (
                <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-zinc-900 to-transparent opacity-50 pointer-events-none"></div>
              )}
              <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-zinc-900 to-transparent opacity-50 pointer-events-none"></div>
            </div>
            <p className="text-zinc-400 mt-2">
              {data.isVirtual ? (
                role === "user" && (
                  <a
                    href={data.eventUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-2"
                  >
                    Join Virtual Event
                  </a>
                )
              ) : (
                `Location: ${data.location}`
              )}
            </p>
          </motion.div>
        </>
      )}
    </div>
  );
}

export default ViewEventDetails;
