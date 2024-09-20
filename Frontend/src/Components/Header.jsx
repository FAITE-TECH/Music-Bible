import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Dropdown, DropdownDivider, DropdownHeader, DropdownItem } from 'flowbite-react';
import { signOut } from '../redux/user/userSlice';
import { motion } from 'framer-motion';
import logo from '../assets/Logo/logo.png';


export default function Header() {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showTitle, setShowTitle] = useState(false);

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
        // Delay showing the title to create the sliding-in effect
        const timer = setTimeout(() => {
            setShowTitle(true);
        }, 500); // Adjust the delay time as needed
        return () => clearTimeout(timer);
    }, []);

    // Animation variants for staggered animations
    const staggeredAnimation = {
        hidden: { opacity: 0, x: -50 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.2, // delay based on index to create a stagger effect
                type: "spring",
                stiffness: 60
            }
        })
    };

    return (
        <header className="bg-black text-white relative z-50 shadow-lg w-full">
            <div className="container mx-auto flex flex-wrap items-center justify-between py-4 px-6">
                {/* Sliding MusicBible Title, initially hidden */}
                {showTitle && (
                    <motion.div
                    className="flex items-center"
                    initial={{ opacity: 0, x: -300 }}
                    animate={{ opacity: 5, x: 0 }}
                    transition={{ type: "spring", stiffness: 60, duration: 1.6 }}
                >
                    <NavLink to="/" className="flex items-center text-2xl md:text-3xl font-bold text-white">
                        <img 
                            src={logo} 
                            alt="MusicBible logo" 
                            className="h-16 w-auto" 
                        />
                        <span className="ml-2">MusicBible</span>
                    </NavLink>
                </motion.div>
                )}

                {/* Animated Navigation Links */}
                <nav className="flex flex-col md:flex-row md:space-x-6 items-center mt-4 md:mt-0">
                    {["Home", "New", "Musics","Album", "Contact"].map((text, index) => (
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
                                    isActive ? "text-gray-300" : "text-white hover:text-gray-300"
                                }
                            >
                                {text}
                            </NavLink>
                        </motion.div>
                    ))}
                </nav>

                {/* Animated User Section */}
                <motion.div
                    className="flex space-x-4 items-center mt-4 md:mt-0"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.7, type: "spring", stiffness: 80 }}
                >
                    {currentUser ? (
                        <Dropdown arrowIcon={false} inline label={
                            <Avatar alt="user" img={currentUser.profilePicture} rounded className="h-10 w-10" />
                        }>
                            <DropdownHeader>
                                <span className="block text-sm">{currentUser.username}</span>
                                <span className="block text-sm font-medium truncate">{currentUser.email}</span>
                            </DropdownHeader>
                            <Link to={'/dashboard?tab=profile'}>
                                <DropdownItem>Profile</DropdownItem>
                            </Link>
                            <DropdownDivider/>
                            <DropdownItem onClick={handleSignOut}>Sign Out</DropdownItem>
                        </Dropdown>
                    ) : (
                        <Link to="/sign-in">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="bg-black-600 hover:bg-slate-900 text-white py-2 px-4 md:px-6 rounded-full font-bold shadow-lg"
                            >
                                Sign In
                            </motion.button>
                        </Link>
                    )}
                </motion.div>
            </div>
        </header>
    );
}
