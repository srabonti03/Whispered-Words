import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../Loader/Loader";

function UpdateBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bookData, setBookData] = useState({
    image: null,
    title: "",
    author: "",
    price: "",
    desc: "",
    language: "",
    genre: "",
  });

  const [loading, setLoading] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState("");

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3001/api/v1/getbookdetails/${id}`);
      const { data } = response.data;
      setBookData(data);
      setExistingImageUrl(data.url);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching book details:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setBookData({ ...bookData, image: file });
    setExistingImageUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", bookData.title);
    formData.append("author", bookData.author);
    formData.append("price", bookData.price);
    formData.append("desc", bookData.desc);
    formData.append("language", bookData.language);
    formData.append("genre", bookData.genre);
    if (bookData.image) {
      formData.append("image", bookData.image);
    }

    try {
      await axios.put(`http://localhost:3001/api/v1/updatebook/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          id: localStorage.getItem("id"),
        },
      });
      alert("Book Updated Successfully!");
      navigate("/Profile/managebooks");
    } catch (error) {
      console.error("Error updating book:", error);
      alert("Failed to update book");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <motion.div
      className="h-[70vh] p-8 bg-zinc-900 text-zinc-100 flex justify-center items-center"
      style={{ marginTop: '5vh' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-4xl lg:max-w-6xl bg-zinc-800 p-6 rounded-lg shadow-xl">
        <h1 className="text-3xl text-yellow-300 font-semibold mb-4 text-center">
          Update <span className="text-yellow-400">Book</span>
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <label htmlFor="title" className="text-yellow-500 font-semibold">Book Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={bookData.title}
                onChange={handleChange}
                required
                className="w-full p-3 mt-2 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <label htmlFor="author" className="text-yellow-500 font-semibold">Author</label>
              <input
                type="text"
                id="author"
                name="author"
                value={bookData.author}
                onChange={handleChange}
                required
                className="w-full p-3 mt-2 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <label htmlFor="price" className="text-yellow-500 font-semibold">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={bookData.price}
                onChange={handleChange}
                required
                className="w-full p-3 mt-2 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <label htmlFor="language" className="text-yellow-500 font-semibold">Language</label>
              <input
                type="text"
                id="language"
                name="language"
                value={bookData.language}
                onChange={handleChange}
                required
                className="w-full p-3 mt-2 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <label htmlFor="genre" className="text-yellow-500 font-semibold">Genre</label>
              <input
                type="text"
                id="genre"
                name="genre"
                value={bookData.genre}
                onChange={handleChange}
                required
                className="w-full p-3 mt-2 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </motion.div>
          </div>
          <div className="mb-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <label htmlFor="desc" className="text-yellow-500 font-semibold">Description</label>
              <textarea
                id="desc"
                name="desc"
                value={bookData.desc}
                onChange={handleChange}
                required
                rows="4"
                className="w-full p-3 mt-2 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </motion.div>
          </div>
          <div className="mb-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <label htmlFor="image" className="text-yellow-500 font-semibold">Book Image</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-3 mt-2 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </motion.div>
          </div>
          <div className="flex justify-end">
            <motion.button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              Update Book
            </motion.button>
        </div>
        </form>
      </div>
    </motion.div>
  );
}

export default UpdateBook;
