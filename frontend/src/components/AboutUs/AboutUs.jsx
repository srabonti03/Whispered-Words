import React from 'react';
import { motion } from 'framer-motion';

function AboutUs() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className='max-w-screen-2xl w-full mx-auto md:px-20 px-4 my-10'>
      <motion.h2
        className='text-4xl font-bold text-center mb-8 text-yellow-50'
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.6 }}
      >
        The Story Behind <span className='text-yellow-300'>Whispered Words</span>
      </motion.h2>

      <motion.p
        className='text-lg mb-6 text-justify text-yellow-50'
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Welcome to <span className="font-bold text-yellow-300">Whispered Words</span>, where stories come to life and imagination knows no bounds. Founded with a passion for books and a love for community, our store has become a haven for book lovers of all kinds. From timeless classics to the latest bestsellers, we strive to offer a diverse selection of books that cater to every reader’s taste.
      </motion.p>

      <motion.p
        className='text-lg mb-6 text-justify text-yellow-50'
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        At <span className="font-bold text-yellow-300">Whispered Words</span>, we believe that books have the power to connect, inspire, and transform. That’s why we’re dedicated to curating a collection that reflects not only popular demand but also the unique stories and voices that deserve to be heard. Whether you're here to dive into new worlds, explore fresh ideas, or simply relax with a good read, we have something just for you.
      </motion.p>

      <motion.p
        className='text-lg mb-6 text-justify text-yellow-50'
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        Our journey began in 2024 with a simple goal: to create a space where readers can explore, discover, and fall in love with books all over again. Over the years, we've grown into more than just a bookstore. We’re a community hub, a cultural destination, and a home for book enthusiasts of all ages. Our events, author signings, and book clubs bring people together, sparking meaningful conversations and lasting friendships.
      </motion.p>

      <motion.p
        className='text-lg mb-6 text-justify text-yellow-50'
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        We take pride in our exceptional customer service, with a team of dedicated staff who share a deep passion for literature. Whether you need a recommendation or help finding a specific title, we’re here to assist. Every customer that walks through our doors becomes a part of the <span className="font-bold text-yellow-300">Whispered Words</span> family.
      </motion.p>

      <motion.p
        className='text-lg mb-6 text-justify text-yellow-50'
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        Thank you for choosing us as your literary companion. We’re excited to continue sharing the magic of books with you, and we look forward to seeing you in-store or online!
      </motion.p>

      <div className='flex justify-center'>
        <motion.img
          src='https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&h=500&q=80'
          alt='Bookstore'
          className='rounded-lg shadow-lg w-full md:w-full'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        />
      </div>
    </div>
  );
}

export default AboutUs;
