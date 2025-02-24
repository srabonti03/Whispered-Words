import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MdOutlineSort, MdHome, MdBook, MdShoppingCart, MdInfo, MdContactMail, MdPerson, MdEvent, MdDashboard } from "react-icons/md";
import { motion } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const role = useSelector((state) => state.auth.role);

    const links = [
        { title: "Home", link: "/", icon: <MdHome /> },
        { title: "All Books", link: "/Books", icon: <MdBook /> },
        isLoggedIn && role === "user" && { title: "Cart", link: "/Cart", icon: <MdShoppingCart /> },
        isLoggedIn && role === "user" && { title: "About", link: "/About", icon: <MdInfo /> },
        isLoggedIn && role === "user" && { title: "Contact", link: "/Contact", icon: <MdContactMail /> },
        isLoggedIn && { title: "Events", link: "/Events", icon: <MdEvent /> },
        isLoggedIn && role === "user" && { title: "Profile", link: "/Profile", icon: <MdPerson /> },
        isLoggedIn && role === "admin" && { title: "Dashboard", link: "/Profile", icon: <MdDashboard /> },
    ].filter(Boolean);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleScroll = () => setIsSticky(window.scrollY > 0);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    }, [isOpen]);

    return (
        <>
            <nav className={`z-50 relative flex text-white px-8 py-4 items-center justify-between transition-all duration-300 ${isSticky ? 'bg-zinc-800 shadow-lg backdrop-blur-md bg-opacity-70 sticky top-0' : 'bg-zinc-800'}`}>
                <Link to="/" className='flex items-center'>
                    <img className='h-10 me-4' src="./logo.png" alt="Whispered Words Logo" />
                    <h1 className='text-2xl font-bold tracking-wide'>Whispered Words</h1>
                </Link>
                <div className='hidden md:flex items-center gap-6'>
                    {links.map((item, i) => (
                        <Link 
                            key={i} 
                            to={item.link} 
                            className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-lg font-medium relative after:content-[''] after:block after:w-0 after:h-[2px] after:bg-blue-400 after:transition-all after:duration-300 hover:after:w-full"
                        >
                            <span className="ml-1">{item.title}</span>
                        </Link>
                    ))}
                    {!isLoggedIn && (
                        <>
                            <Link to="/Login" className='px-4 py-2 border border-blue-500 rounded-md text-gray-200 hover:bg-blue-600 hover:text-white transition-all duration-300'>Login</Link>
                            <Link to="/Signup" className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-all duration-300'>Sign up</Link>
                        </>
                    )}
                </div>
                <button className="text-white text-3xl hover:text-blue-400 md:hidden" onClick={toggleMenu}>
                    <MdOutlineSort />
                </button>
            </nav>
            {isOpen && (
                <motion.div 
                    className='bg-zinc-900 h-screen w-full absolute top-0 left-0 z-40 flex flex-col items-center justify-center shadow-lg'
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3 }}
                >
                    {links.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                        >
                            <Link 
                                className="text-white text-3xl mb-6 font-semibold hover:text-blue-400 transition-colors duration-300 flex items-center" 
                                to={item.link} 
                                onClick={toggleMenu}
                            >
                                {item.icon}
                                <span className="ml-2">{item.title}</span>
                            </Link>
                        </motion.div>
                    ))}
                    {!isLoggedIn && (
                        <>
                            <Link to="/Login" className='mb-6 text-xl font-semibold px-8 py-2 border border-blue-500 rounded-md text-white hover:bg-blue-600 transition-all duration-300' onClick={toggleMenu}>Login</Link>
                            <Link to="/Signup" className='mb-6 text-xl font-semibold px-8 py-2 bg-blue-500 rounded-md text-white hover:bg-blue-700 transition-all duration-300' onClick={toggleMenu}>Sign up</Link>
                        </>
                    )}
                </motion.div>
            )}
        </>
    );
};

export default Navbar;
