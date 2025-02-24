import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import BookCard from '../BookCard/BookCard';
import Loader from '../Loader/Loader';

function RecentlyAdded() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/v1/getrecentbooks");
        setData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='mt-20 px-4'>
      <motion.h4
        className='text-4xl text-yellow-100'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Recently <span className="text-yellow-300">Added Books</span>
      </motion.h4>
      <motion.p
        className='italic text-gray-200'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Here are the latest additions to our collection:
      </motion.p>

      {loading ? (
        <Loader />
      ) : (
        <motion.div
          className='my-4 grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {data && data.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <BookCard data={item} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default RecentlyAdded;
