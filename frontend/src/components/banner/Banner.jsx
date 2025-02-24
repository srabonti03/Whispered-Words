import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Banner() {
  return (
    <div className="flex flex-col-reverse lg:flex-row h-auto lg:h-[75vh]">
      <motion.div
        className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center px-6 lg:px-12 py-10 lg:py-0"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl lg:text-6xl font-semibold text-yellow-100 text-center lg:text-left">
          Where Every Book Tells a <span className="text-yellow-300">Masterpiece</span>
        </h1>
        <p className="mt-4 text-sm lg:text-base text-zinc-300 text-center lg:text-left space-y-10">
        At Whispered Words, we believe that every book is more than just pages and ink—it’s a window into new worlds, fresh ideas, and untold adventures. Whether you’re looking for the latest bestseller or a hidden treasure you didn’t know you were missing, we’ve got something for every reader. Each book we offer has the power to take you somewhere unexpected—whether it’s to a distant land, a new way of thinking, or a journey deep into your own imagination.
        <br/>
        We’re not just here to sell books; we’re here to help you find your next adventure, to inspire those “Aha!” moments, and to spark the kind of curiosity that keeps you turning pages long after the world has gone quiet. At Whispered Words, every book is an invitation to explore, to dream, and to discover a new part of yourself. So, come on in—your next favorite read is waiting for you.
        </p>
        <div className="mt-8">
          <Link to="/Books" className="text-yellow-100 text-lg lg:text-xl font-semibold border border-yellow-100 px-8 py-2 hover:bg-zinc-800 rounded-full">
            Discover books
          </Link>
        </div>
      </motion.div>
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end px-4 lg:px-0"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src="./banner.png"
          alt="banner"
          className="w-full h-auto lg:h-[90%] object-cover max-h-[300px] sm:max-h-[400px] lg:max-h-none"
        />
      </motion.div>
    </div>
  );
}

export default Banner;
