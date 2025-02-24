import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTrashAlt } from "react-icons/fa";
import axios from "axios";

function BookCard({ data, favourite, handleRemove }) {
  const [isBestSeller, setIsBestSeller] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/v1/markbestsellers");
        const bestSellers = response.data.data;

        const foundBestSeller = bestSellers.find(book => book._id === data._id);
        setIsBestSeller(!!foundBestSeller);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [data._id]);

  return (
    <div className="bg-zinc-800 rounded-lg p-4 flex flex-col h-full relative">
      {isBestSeller && (
        <motion.div
          className="absolute top-4 right-4 bg-red-600 text-white py-2 px-4 text-sm font-semibold uppercase transform rotate-12 z-10 flex items-center justify-center rounded-lg shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{ rotate: '12deg' }}
        >
          <Link to={`/viewbookdetails/${data._id}`}>
            <span>Best Seller</span>
          </Link>
        </motion.div>
      )}

      <Link to={`/viewbookdetails/${data._id}`}>
        <motion.div
          className="bg-zinc-900 rounded-lg overflow-hidden h-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-zinc-900 rounded flex items-center justify-center">
            <img
              src={`http://localhost:3001${data.url}` || "https://via.placeholder.com/150"}
              alt={data.title || "Book Cover"}
              className="h-48 w-full object-cover"
            />
          </div>
          <div className="p-4 flex-1">
            <h2 className="mt-4 text-xl font-semibold text-yellow-500">
              {data.title}
            </h2>
            <p className="mt-2 text-zinc-400 font-semibold">by {data.author}</p>
            <p className="mt-2 text-zinc-200 font-semibold text-xl">
              {data.price} TK
            </p>
          </div>
        </motion.div>
      </Link>
      {favourite && (
        <button
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-md text-white mt-4 flex items-center justify-center"
          onClick={() => handleRemove(data._id)}
        >
          <FaTrashAlt className="mr-2" /> Remove from Favourites
        </button>
      )}
    </div>
  );
}

export default BookCard;
