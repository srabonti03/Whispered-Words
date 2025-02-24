import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../BookCard/BookCard";
import Loader from "../Loader/Loader";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Favourites() {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const headers = {
    id: localStorage.getItem("id"),
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchFavourites = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:3001/api/v1/favourites",
          { headers }
        );
        setFavourites(response.data.favourites);
      } catch (error) {
        console.error("Error fetching favourites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, []);

  const handleRemove = async (bookid) => {
    try {
      const response = await axios.put(
        "http://localhost:3001/api/v1/removebookfromfav",
        {},
        {
          headers: {
            bookid: bookid,
            id: localStorage.getItem("id"),
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setFavourites((prevFavourites) => {
        const updatedFavourites = prevFavourites.filter((item) => item._id !== bookid);
        return updatedFavourites;
      });

      if (favourites.length === 1) {
        setTimeout(() => {
          navigate("/Books");
        }, 0);
      }
    } catch (error) {
      console.error("Error removing book from favorites:", error);
    }
  };

  return (
    <div className="my-8 px-4 md:px-8 h-[70vh]">
      {favourites.length > 0 && (
        <motion.h1
          className="text-3xl text-yellow-100 font-semibold mb-8 text-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          A Collection of <span className="text-yellow-300">Your Beloved Reads</span>
        </motion.h1>
      )}

      {loading ? (
        <div className="flex items-center justify-center my-8">
          <Loader />
        </div>
      ) : (
        <div>
          {favourites.length === 0 ? (
            <div className="flex items-center justify-center h-screen text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <motion.h1
                  className="text-4xl text-yellow-100 font-semibold mb-10 mt-[-200px] text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  No favourites yet?{" "}
                  <span className="text-yellow-300">
                    Let’s fill this list with your must-reads!
                  </span>
                </motion.h1>
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  width="60"
                  height="60"
                  className="drop-shadow-xl"
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{
                    scale: 1,
                    rotate: 0,
                    transition: { duration: 1, type: "spring", stiffness: 100 },
                  }}
                >
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="10%" style={{ stopColor: "#F8BBD0", stopOpacity: 1 }} />
                      <stop offset="70%" style={{ stopColor: "#F06292", stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: "#FFEB3B", stopOpacity: 0.05 }} />
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#grad1)"
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                </motion.svg>
              </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 h-[500px] overflow-y-auto scrollbar-none">
                {favourites.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <BookCard
                      data={item}
                      favourite={true}
                      handleRemove={handleRemove}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Favourites;
