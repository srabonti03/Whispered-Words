import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddEvent = () => {
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    name: "",
    startTime: "",
    endTime: "",
    location: "",
    isVirtual: false,
    description: "",
    eventUrl: "",
    eventDate: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEventData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (eventData.isVirtual && !eventData.eventUrl) {
      alert("Event URL is required for virtual events");
      return;
    }
    if (!eventData.isVirtual && !eventData.location) {
      alert("Location is required for non-virtual events");
      return;
    }

    const formData = new FormData();
    formData.append("name", eventData.name);
    formData.append("startTime", eventData.startTime);
    formData.append("endTime", eventData.endTime);
    formData.append("location", eventData.location);
    formData.append("isVirtual", eventData.isVirtual);
    formData.append("description", eventData.description);
    formData.append("eventUrl", eventData.eventUrl);
    formData.append("eventDate", eventData.eventDate);
    if (eventData.image) {
      formData.append("image", eventData.image);
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/v1/addevent",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: headers.authorization,
            id: headers.id,
          },
        }
      );
      alert("Event Added Successfully!");
      setEventData({
        name: "",
        startTime: "",
        endTime: "",
        location: "",
        isVirtual: false,
        description: "",
        eventUrl: "",
        eventDate: "",
        image: null,
      });
      navigate("/Profile/manageevents");
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to add event");
    }
  };

  return (
    <motion.div
      className="p-4 bg-zinc-900 text-zinc-100 flex justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-6xl bg-zinc-800 p-3 rounded-lg shadow-xl">
        <h1 className="text-xl text-yellow-300 font-semibold mb-3 text-center">
          Add New Event
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 mb-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <label htmlFor="name" className="text-yellow-500 text-xs">
                Event Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={eventData.name}
                onChange={handleChange}
                required
                className="w-full p-1 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <label htmlFor="eventDate" className="text-yellow-500 text-xs">
                Event Date
              </label>
              <input
                type="date"
                id="eventDate"
                name="eventDate"
                value={eventData.eventDate}
                onChange={handleChange}
                required
                className="w-full p-1 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </motion.div>

            <div className="flex gap-3">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-1"
              >
                <label htmlFor="startTime" className="text-yellow-500 text-xs">
                  Start Time
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={eventData.startTime}
                  onChange={handleChange}
                  required
                  className="w-full p-1 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-1"
              >
                <label htmlFor="endTime" className="text-yellow-500 text-xs">
                  End Time
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={eventData.endTime}
                  onChange={handleChange}
                  required
                  className="w-full p-1 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </motion.div>
            </div>

            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
            >
            <input
              type="checkbox"
              id="isVirtual"
              name="isVirtual"
              checked={eventData.isVirtual}
              onChange={(e) =>
                setEventData((prevData) => ({
                  ...prevData,
                  isVirtual: e.target.checked,
                  }))
                }
                className="form-checkbox h-4 w-4 text-yellow-500 border-zinc-600 rounded focus:ring-2 focus:ring-yellow-500"
            />
            <label htmlFor="isVirtual" className="text-yellow-500 text-xs">
            Will this event be hosted virtually?
            </label>
            </motion.div>

            {eventData.isVirtual ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <label htmlFor="eventUrl" className="text-yellow-500 text-xs">
                  Event URL
                </label>
                <input
                  type="url"
                  id="eventUrl"
                  name="eventUrl"
                  value={eventData.eventUrl}
                  onChange={handleChange}
                  className="w-full p-1 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <label htmlFor="location" className="text-yellow-500 text-xs">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={eventData.location}
                  onChange={handleChange}
                  required
                  className="w-full p-1 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <label htmlFor="description" className="text-yellow-500 text-xs">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={eventData.description}
                onChange={handleChange}
                required
                className="w-full p-1 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <label htmlFor="image" className="text-yellow-500 text-xs">
                Event Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                required
                onChange={handleFileChange}
                className="w-full p-1 bg-zinc-700 text-white rounded-md"
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
                        Add Event
                      </motion.button>
                    </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddEvent;
