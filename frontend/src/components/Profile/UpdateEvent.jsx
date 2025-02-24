import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import { motion } from "framer-motion";

function UpdateEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    name: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    isVirtual: false,
    location: "",
    description: "",
    eventUrl: "",
    image: null,
  });

  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3001/api/v1/eventdetails/${id}`);
        const fetchedData = response.data.data;
        setEventData({
          ...fetchedData,
          eventDate: new Date(fetchedData.eventDate).toISOString().split("T")[0],
        });
        setExistingImageUrl(fetchedData.imageUrl || "");
      } catch (err) {
        setError("Failed to fetch event data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setEventData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", eventData.name);
    formData.append("eventDate", eventData.eventDate);
    formData.append("startTime", eventData.startTime);
    formData.append("endTime", eventData.endTime);
    formData.append("isVirtual", eventData.isVirtual);

    if (eventData.isVirtual) {
      formData.append("eventUrl", eventData.eventUrl);
    } else {
      formData.append("location", eventData.location);
    }

    formData.append("description", eventData.description);

    if (eventData.image) {
      formData.append("image", eventData.image);
    }

    try {
      const response = await axios.put(
        `http://localhost:3001/api/v1/updateevent/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Event updated successfully!");
      navigate("/Profile/manageevents");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update event";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-4 bg-zinc-900 text-zinc-100 flex justify-center items-center">
      <motion.div
        className="w-full max-w-6xl bg-zinc-800 p-3 rounded-lg shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-xl text-yellow-300 font-semibold mb-3 text-center">
          Update Event
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 mb-3">
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

            <div className="flex gap-3">
              <div className="flex-1">
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
              </div>

              <div className="flex-1">
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
              </div>
            </div>

            <label htmlFor="isVirtual" className="text-yellow-500 text-xs flex items-center">
            <input
              type="checkbox"
              id="isVirtual"
              name="isVirtual"
              checked={eventData.isVirtual}
              onChange={handleChange}
              className="form-checkbox h-4 w-4 text-yellow-500 border-zinc-600 rounded focus:ring-2 focus:ring-yellow-500 mr-2"
            />
            Will this event be hosted virtually?
            </label>

            {eventData.isVirtual ? (
              <div>
                <label htmlFor="eventUrl" className="text-yellow-500 text-xs">
                  Event URL
                </label>
                <input
                  type="url"
                  id="eventUrl"
                  name="eventUrl"
                  value={eventData.eventUrl}
                  onChange={handleChange}
                  required
                  className="w-full p-1 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            ) : (
              <div>
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
              </div>
            )}

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

            <label htmlFor="image" className="text-yellow-500 text-xs">
              Event Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-1 bg-zinc-700 text-white rounded-md"
            />
          </div>

          <div className="flex justify-end">
            <motion.button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              Update Event
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default UpdateEvent;
