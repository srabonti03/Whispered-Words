import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { GrLanguage } from "react-icons/gr";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import Loader from "../Loader/Loader";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

function ViewBookDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [Data, setData] = useState(null);
    const [isScrolling, setIsScrolling] = useState(false);
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const role = useSelector((state) => state.auth.role);
    const userId = useSelector((state) => state.auth.userId);

    const fetchBookDetails = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3001/api/v1/getbookdetails/${id}`
            );
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching book details:", error);
        }
    };

    useEffect(() => {
        fetchBookDetails();
    }, [id]);

    const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        id: userId,
        bookid: id,
    };

    const handleFavourite = async () => {
        try {
            const response = await axios.put(
                "http://localhost:3001/api/v1/addbooktofav",
                {},
                { headers }
            );
            alert(response.data.message);
            navigate("/profile");
        } catch (error) {
            console.error("Error adding book to favorites:", error);
            if (error.response && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("Failed to add book to favorites.");
            }
        }
    };

    const handleCart = async () => {
        try {
            const response = await axios.put(
                "http://localhost:3001/api/v1/addbooktocart",
                {},
                { headers }
            );
            alert(response.data.message);
            navigate("/Books");
        } catch (error) {
            console.error("Error adding book to cart:", error);
            if (error.response && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("Failed to add book to cart.");
            }
        }
    };

    const handleScroll = (e) => {
        const scrollTop = e.target.scrollTop;
        setIsScrolling(scrollTop > 0);
    };

    return (
        <div className="px-4 sm:px-12 bg-zinc-900 flex flex-col lg:flex-row gap-8">
            {!Data ? (
                <div className="h-screen flex items-center justify-center my-8">
                    <Loader />
                </div>
            ) : (
                <>
                    <motion.div
                        className="relative bg-zinc-800 rounded p-4 w-full lg:w-2/5 flex items-center justify-center my-4"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.img
                            src={`http://localhost:3001${Data.url}`}
                            alt={Data.title || "Book Cover"}
                            className="h-[55vh] w-[90vw] sm:h-[70vh] sm:w-[60vw] lg:w-full lg:max-w-[35vw] object-contain"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                        />
                        <div className="absolute flex gap-4 bottom-4 right-4 lg:top-4 lg:right-4 lg:flex-col">
                            {isLoggedIn && role === "user" && (
                                <>
                                    <motion.button
                                        className="bg-white rounded-full text-xl p-3 shadow-md"
                                        whileHover={{ scale: 1.15, color: "red" }}
                                        transition={{ duration: 0.3 }}
                                        onClick={handleFavourite}
                                        aria-label="Add to favorites"
                                    >
                                        <FaHeart />
                                    </motion.button>
                                    <motion.button
                                        className="bg-white rounded-full text-xl p-3 shadow-md"
                                        whileHover={{ scale: 1.15, color: "green" }}
                                        transition={{ duration: 0.3 }}
                                        onClick={handleCart}
                                        aria-label="Add to cart"
                                    >
                                        <FaShoppingCart />
                                    </motion.button>
                                </>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        className="p-4 w-full lg:w-3/5"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-3xl sm:text-4xl text-yellow-800 font-semibold tracking-tight leading-snug">
                            {Data.title}
                        </h1>
                        <p className="text-zinc-500 mt-2 italic">
                            <span className="text-yellow-800">by</span> {Data.author}
                        </p>
                        <div className="flex flex-row space-x-4">
                            <p className="text-zinc-500 mt-2">
                                <span className="text-zinc-400 font-medium">Genre:</span> {Data.genre}
                            </p>
                            <span className="mx-2 mt-2 text-zinc-500">|</span>
                            <p className="flex mt-2 items-center justify-start text-zinc-500 text-sm">
                                <GrLanguage className="mr-2 mt-1 text-zinc-400" /> <span>{Data.language}</span>
                            </p>
                        </div>
                        <div className="text-zinc-500 mt-4 mb-8 relative overflow-hidden max-h-[18rem]">
                            <div
                                className="overflow-y-auto max-h-[18rem] scrollbar-none pr-2"
                                onScroll={handleScroll}
                            >
                                {Data.desc}
                            </div>
                            {isScrolling && (
                                <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-zinc-900 to-transparent opacity-50 pointer-events-none"></div>
                            )}
                            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-zinc-900 to-transparent opacity-50 pointer-events-none"></div>
                        </div>
                        <p className="mt-4 text-zinc-100 text-2xl sm:text-3xl font-semibold">
                            Price: {Data.price} TK
                        </p>
                    </motion.div>
                </>
            )}
        </div>
    );
}

export default ViewBookDetails;
