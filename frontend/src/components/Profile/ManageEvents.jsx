import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaEye, FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function ManageEvents() {
  const [data, setData] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  const headers = {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/v1/allevents");
        const events = response.data.data;

        events.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

        setData(events);
        setFilteredEvents(events);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this event?");

    if (isConfirmed) {
      try {
        const response = await axios.delete(`http://localhost:3001/api/v1/deleteevent/${id}`, { headers });
        if (response.status === 200) {
          setFilteredEvents((prevEvents) => prevEvents.filter(event => event._id !== id));
          alert("Event deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Error deleting event.");
      }
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
        Event <span className="text-yellow-300">Scheduler</span>
      </h1>

      <div className="flex justify-end mb-4">
        <Link to="/Profile/addevent">
          <button
            className="flex items-center bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-6 rounded-md text-xl shadow-lg hover:shadow-xl transition duration-300"
          >
            <FaPlus className="mr-3 text-2xl" />
            <span className="text-lg font-semibold">Add Event</span>
          </button>
        </Link>
      </div>

      <div className="mt-4 bg-zinc-800 w-full rounded py-2 px-4 flex gap-2">
        <div className="w-[7%] text-center font-semibold text-yellow-600">#</div>
        <div className="w-[45%] text-center font-semibold text-yellow-600">Event</div>
        <div className="w-[20%] text-center font-semibold text-yellow-600">Event Date</div>
        <div className="w-[13%] text-center font-semibold text-yellow-600">Status</div>
        <div className="w-[20%] text-center font-semibold text-yellow-600">Actions</div>
      </div>

      <div className="max-h-[54vh] overflow-y-auto scrollbar-none">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event._id}
            className="mt-2 bg-zinc-700 rounded py-2 px-4 flex gap-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="w-[7%] text-center">{index + 1}</div>
            <div className="w-[45%] text-center">{event.name}</div>
            <div className="w-[20%] text-center">{new Date(event.eventDate).toLocaleDateString('en-GB')}</div>
            <div className="w-[13%] text-center">{event.isVirtual ? 'Virtual' : 'In-person'}</div>
            <div className="w-[20%] text-center flex justify-center gap-4">
              <Link to={`/eventdetails/${event._id}`}>
                <button className="text-blue-400 hover:text-blue-600 text-xl">
                  <FaEye />
                </button>
              </Link>
              <Link to={`/Profile/updateevent/${event._id}`} className="text-green-400 hover:text-green-600 text-xl">
                <FaEdit />
              </Link>
              <button onClick={() => handleDelete(event._id)} className="text-red-500 hover:text-red-700 text-xl">
                <FaTrashAlt />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default ManageEvents;
