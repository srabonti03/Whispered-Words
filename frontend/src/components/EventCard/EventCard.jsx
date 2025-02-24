import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function EventCard({ data }) {
  return (
    <motion.div
      className="bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-200 transform hover:scale-105 hover:shadow-lg h-[400px]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/eventdetails/${data._id}`}>
        <img
        src={`http://localhost:3001${data.imageUrl}`}
          alt={data.name}
          className="w-full h-[250px] object-cover transition-opacity duration-300 hover:opacity-90"
        />
      </Link>
      <div className="p-4 flex flex-col justify-between h-full">
        <h3 className="text-xl text-yellow-500 font-bold hover:underline">{data.name}</h3>
        <div className="flex-grow">
          <p className="text-gray-400 text-sm font-bold">
            {new Date(data.eventDate).toLocaleDateString()}
          </p>
          <p className="text-gray-400 text-sm">{data.startTime} - {data.endTime}</p>
          <p className="text-gray-400 text-sm">{data.location}</p>
          <p className="text-gray-200 mt-2 text-sm overflow-hidden overflow-ellipsis whitespace-nowrap">
            {data.description}
          </p>
        </div>
        {data.isVirtual && (
          <p className="text-blue-500 hover:underline mt-2 block text-sm">
            This event is virtual. Please check your email for the link to join.
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default EventCard;
