import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "../EventCard/EventCard";
import Loader from "../Loader/Loader";
import { motion } from "framer-motion";

function AllEvents() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/v1/allevents");
        if (response.data && response.data.data) {
          setData(response.data.data);
        } else {
          setError("No events found.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Could not fetch events. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 bg-zinc-900 rounded-lg">
      <h2 className="text-4xl text-yellow-100 font-semibold mb-4 text-center">
        Upcoming <span className="text-yellow-300">Events</span>
      </h2>
      <p className="text-gray-300 mb-6 text-center">
        Discover our lineup of exciting events, workshops, and gatherings.
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center my-8">
          <Loader />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center my-8">{error}</div>
      ) : data && data.length > 0 ? (
        <div className="my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {data.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: i * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="transition-transform transform hover:scale-105 active:shadow-lg active:scale-98"
            >
              <EventCard data={item} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-gray-300 text-center my-8">No events available at the moment.</div>
      )}
    </div>
  );
}

export default AllEvents;
