import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaEye, FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function ManageBooks() {
  const [data, setData] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);

  const headers = {
    id: localStorage.getItem('id'),
    authorization: `Bearer ${localStorage.getItem('token')}`,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/v1/getallbooks");
        setData(response.data.data);
        setFilteredBooks(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (bookid) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this book?");
    if (!isConfirmed) {
      return;
    }

    try {
      const response = await axios.delete("http://localhost:3001/api/v1/deletebook", {
        headers: {
          id: localStorage.getItem('id'),
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        data: {
          bookid,
        }
      });

      if (response.status === 200) {
        setData((prevData) => prevData.filter((book) => book._id !== bookid));
        setFilteredBooks((prevFilteredBooks) => prevFilteredBooks.filter((book) => book._id !== bookid));
        alert('Book deleted successfully');
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      alert('Failed to delete the book');
    }
  };

  return (
    <motion.div
      className="h-full p-4 text-zinc-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl text-yellow-100 font-semibold mb-10 text-center">
        Book <span className="text-yellow-300">Inventory</span>
      </h1>

      <div className="flex justify-end mb-4">
        <Link to="/Profile/addbook">
          <button
            className="flex items-center bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-6 rounded-md text-xl shadow-lg hover:shadow-xl transition duration-300"
          >
            <FaPlus className="mr-3 text-2xl" />
            <span className="text-lg font-semibold">Add Book</span>
          </button>
        </Link>
      </div>

      <div className="mt-4 bg-zinc-800 w-full rounded py-2 px-4 flex gap-2">
        <div className="w-[5%] text-center font-semibold text-yellow-600">#</div>
        <div className="w-[24%] text-center font-semibold text-yellow-600">Book</div>
        <div className="w-[20%] text-center font-semibold text-yellow-600">Author</div>
        <div className="w-[20%] text-center font-semibold text-yellow-600">Genre</div>
        <div className="w-[12%] text-center font-semibold text-yellow-600">Price</div>
        <div className="w-[19%] text-center font-semibold text-yellow-600">Actions</div>
      </div>

      <div className="max-h-[54vh] overflow-y-auto scrollbar-none">
        {filteredBooks.map((book, index) => (
          <motion.div
            key={book._id}
            className="mt-2 bg-zinc-700 rounded py-2 px-4 flex gap-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="w-[5%] text-center">{index + 1}</div>
            <div className="w-[24%] text-center">{book.title}</div>
            <div className="w-[20%] text-center">{book.author}</div>
            <div className="w-[20%] text-center">{book.genre}</div>
            <div className="w-[12%] text-center">{book.price} TK</div>
            <div className="w-[19%] text-center flex justify-center gap-4">
              <Link to={`/viewbookdetails/${book._id}`}>
                <button className="text-blue-400 hover:text-blue-600 text-xl">
                  <FaEye />
                </button>
              </Link>
              <Link to={`/Profile/updatebook/${book._id}`} className="text-green-400 hover:text-green-600 text-xl">
                <FaEdit />
              </Link>
              <button onClick={() => handleDelete(book._id)} className="text-red-500 hover:text-red-700 text-xl">
                <FaTrashAlt />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default ManageBooks;
