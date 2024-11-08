import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../redux/user/userSlice';
import { motion } from 'framer-motion';
import logo from '../assets/Logo/logo.png';
import { HiMenu, HiX } from 'react-icons/hi';

export default function Header() {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showTitle, setShowTitle] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleSignOut = async () => {
        try {
            await fetch("/api/user/signout");
            dispatch(signOut());
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTitle(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const staggeredAnimation = {
        hidden: { opacity: 0, x: -50 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.2,
                type: "spring",
                stiffness: 60
            }
        })
    };

    return (
        <header className="bg-black text-white shadow-lg w-full z-50 relative">
            <div className="container mx-auto flex items-center justify-between py-4 px-6">
                {/* Logo Section */}
                <motion.div
                    className="flex items-center"
                    initial={{ opacity: 0, x: -300 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 60, duration: 1.6 }}
                >
                    <NavLink to="/" className="flex items-center text-2xl md:text-3xl font-bold text-white">
                        <img src={logo} alt="MusicBible logo" className="h-16 w-auto" />
                        <span className="ml-2">aMusicBible</span>
                    </NavLink>
                </motion.div>

                {/* Hamburger Icon for Mobile Menu */}
                <div className="md:hidden">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-white focus:outline-none"
                        aria-label="Toggle navigation menu"
                    >
                        {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
                    </button>
                </div>

                {/* Navigation Links Centered on Desktop */}
                <nav
                    className={`flex-col md:flex-row md:space-x-6 items-center mt-4 md:mt-0 ${menuOpen ? 'flex' : 'hidden'} md:flex absolute md:relative top-full md:top-auto left-0 w-full md:w-auto bg-black md:bg-transparent p-4 md:p-0 transition-all duration-300 md:justify-center`}
                >
                    {["Home", "Musics", "Album", "Membership", "AboutUs", "ContactUs"].map((text, index) => (
                        <motion.div
                            key={text}
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            variants={staggeredAnimation}
                        >
                            <NavLink
                                to={text === "Home" ? "/" : `/${text.toLowerCase()}`}
                                className={({ isActive }) =>
                                    isActive
                                        ? "text-amber-500"
                                        : "text-white hover:text-amber-400 block py-2 md:py-0 px-2 md:px-0"
                                }
                                onClick={() => setMenuOpen(false)} // Close menu on link click
                            >
                                {text}
                            </NavLink>
                        </motion.div>
                    ))}

                    {/* User Profile Dropdown in the Mobile Menu */}
                    {currentUser ? (
                        <div className="relative flex-shrink-0 mt-4 md:mt-0">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center space-x-2 focus:outline-none"
                            >
                                <img
                                    src={currentUser.profilePicture}
                                    alt="user"
                                    className="h-10 w-10 rounded-full"
                                />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                                    <div className="px-4 py-2">
                                        <span className="block text-sm font-medium text-gray-900">{currentUser.username}</span>
                                        <span className="block text-sm text-gray-500">{currentUser.email}</span>
                                    </div>
                                    <Link
                                        to="/dashboard?tab=profile"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        onClick={() => setDropdownOpen(false)} // Close dropdown when clicking the link
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleSignOut();
                                            setDropdownOpen(false); // Close dropdown when signing out
                                        }}
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/sign-in" className="flex-shrink-0 mt-4 md:mt-0">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 md:px-6 rounded-full font-bold shadow-lg"
                                onClick={() => setMenuOpen(false)}
                            >
                                Sign In
                            </motion.button>
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
