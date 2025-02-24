import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../BookCard/BookCard";
import Loader from "../Loader/Loader";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

function AllBooks() {
  const [Data, setData] = useState(null);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    if (genre === "All") {
      setFilteredBooks(Data);
    } else {
      const filtered = Data.filter((item) => item.genre?.toLowerCase() === genre.toLowerCase());
      setFilteredBooks(filtered);
    }
  };

  const genres = [...new Set(Data?.map((item) => item.genre).filter(Boolean))];

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      alert("Please enter a search term.");
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = Data.filter(
      (item) =>
        item.author.toLowerCase().includes(lowerCaseQuery) ||
        item.title.toLowerCase().includes(lowerCaseQuery) ||
        item.genre?.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredBooks(filtered);
    setSuggestions([]);
    setIsSearchClicked(true);
    const genreMatch = genres.find((genre) => lowerCaseQuery.includes(genre.toLowerCase()));
    if (genreMatch) {
      setSelectedGenre(genreMatch);
    } else {
      setSelectedGenre("All");
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (isSearchClicked) setIsSearchClicked(false);
    if (debounceTimeout) clearTimeout(debounceTimeout);
    if (query.trim() === "") {
      setFilteredBooks(Data);
      setSuggestions([]);
      setSelectedGenre("All");
    } else {
      const timeout = setTimeout(() => {
        const lowerCaseQuery = query.toLowerCase();
        const filteredSuggestions = Data.filter(
          (item) =>
            item.author.toLowerCase().includes(lowerCaseQuery) ||
            item.title.toLowerCase().includes(lowerCaseQuery) ||
            item.genre?.toLowerCase().includes(lowerCaseQuery)
        );
        setSuggestions(filteredSuggestions);
      }, 500);
      setDebounceTimeout(timeout);
    }
  };

  const handleSuggestionClick = (item) => {
    setSearchQuery(item.title);
    setSuggestions([]);
    const lowerCaseQuery = item.title.toLowerCase();
    const filtered = Data.filter(
      (book) =>
        book.author.toLowerCase().includes(lowerCaseQuery) ||
        book.title.toLowerCase().includes(lowerCaseQuery) ||
        book.genre?.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredBooks(filtered);
    setIsSearchClicked(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className={`flex ${isSidebarOpen ? "h-[80vh]" : "h-auto"} flex-col sm:flex-row`}>
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className={`p-2 bg-yellow-300 text-black shadow-lg z-50 fixed ${
            !isSidebarOpen ? "top-28 left-4" : "items-center justify-center left-4"
          }`}
        >
          <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} />
        </button>
      </div>
      {isSidebarOpen && (
        <motion.div
          className="w-64 bg-zinc-800 text-white p-4 overflow-y-auto max-h-[100vh]"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.h3
            className="text-lg text-center font-semibold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Genres
          </motion.h3>
          <ul>
            <li
              className={`cursor-pointer text-center p-2 hover:bg-yellow-300 transition-all duration-30 ${
                selectedGenre === "All" ? "bg-yellow-300 text-black" : ""
              }`}
              onClick={() => handleGenreClick("All")}
            >
              All Genres
            </li>
            {genres.map((genre, index) => (
              <li
                key={index}
                className={`cursor-pointer text-center p-2 hover:bg-yellow-300 transition-all duration-30 ${
                  selectedGenre === genre ? "bg-yellow-300 text-black" : ""
                }`}
                onClick={() => handleGenreClick(genre)}
              >
                {genre}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
      <div className="flex-1 p-6 bg-zinc-900">
        <motion.h2
          className="text-4xl text-yellow-100 font-semibold mb-3 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Our Complete <span className="text-yellow-300">Collection</span>
        </motion.h2>
        <motion.p
          className="text-gray-300 mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Browse through every book we offer in our library, from classics to the latest releases.
        </motion.p>
        <motion.div
          className="mb-6 flex items-center justify-center relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by author, title, or genre..."
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="p-2 w-full rounded-l-lg border border-zinc-600 bg-zinc-800 text-white"
            />
            <button
              onClick={handleSearch}
              className="absolute p-2 bg-yellow-300 text-black rounded-r-lg hover:bg-yellow-400"
            >
              Search
            </button>
            {suggestions.length > 0 && (
              <div className="absolute w-full bg-zinc-800 text-white shadow-lg rounded-lg max-h-48 overflow-y-auto z-10 mt-1 scrollbar-none">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-yellow-300 cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
        <div
          className={`grid ${
            isSidebarOpen
              ? "grid-cols-3"
              : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
          } gap-8 ${isSidebarOpen ? "max-h-[55vh] overflow-y-auto" : "h-auto"} scrollbar-none`}
        >
          {!Data ? (
            <div className="flex items-center justify-center my-8">
              <Loader />
            </div>
          ) : filteredBooks.length === 0 ? (
            <p className="text-red-500 text-center my-8">
              No books matched your search.
            </p>
          ) : (
            filteredBooks.map((item, i) => <BookCard key={i} data={item} />)
          )}
        </div>
      </div>
    </div>
  );
}

export default AllBooks;
