import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../redux/user/userSlice';
import { AnimatePresence, motion } from 'framer-motion';
import logo from '../assets/Logo/newlogo.png';
import txtLogo from '../assets/Logo/txtnewlogo.png';
import { HiMenu, HiX, HiHome, HiMusicNote, HiBookOpen, HiMail, HiCollection, HiUserGroup } from 'react-icons/hi';
import { FaPhone } from 'react-icons/fa';

export default function Header() {
    const { currentUser } = useSelector((state) => state.user); // Get current user from redux
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [hoveredNav, setHoveredNav] = useState(null);

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
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMenuOpen(false); 
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navItems = [
        { name: "Home", path: "/", icon: <HiHome size={20} /> },
        { name: "Musics", path: "/musics", icon: <HiMusicNote size={20} /> },
        { name: "Album", path: "/album", icon: <HiCollection size={20} /> },
        { name: "Membership", path: "/membership", icon: <HiUserGroup size={20} /> },
        { name: "Bible/AI", path: "/bible/ai", icon: <HiBookOpen size={20} /> },
        { name: "Contact Us", path: "/contactus", icon: <FaPhone size={20} /> },
    ];

    function MobileMenu({ menuOpen, setMenuOpen, navigate, currentUser }) {
        return (
            <AnimatePresence>
                {menuOpen && (
                    <motion.div 
                        className="fixed top-32 left-0 w-full bg-black p-4 z-40 flex flex-col items-center space-y-4"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {navItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => { navigate(item.path); setMenuOpen(false); }}
                                onMouseEnter={() => setHoveredNav(item.name)}
                                onMouseLeave={() => setHoveredNav(null)}
                                className="relative flex items-center justify-center p-3 rounded-full text-white bg-gray-800 transition-all duration-300 hover:bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0]"
                            >
                                {hoveredNav === item.name ? (
                                    <motion.span 
                                        className="text-sm font-semibold text-white px-4 rounded-full shadow-lg"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                    >
                                        {item.name}
                                    </motion.span>
                                ) : (
                                    <motion.div initial={{ scale: 1 }} whileHover={{ scale: 1.2 }}>
                                        {item.icon}
                                    </motion.div>
                                )}
                            </button>
                        ))}

                        {/* Show Profile if currentUser is available, otherwise show Sign In */}
                        {currentUser ? (
                            <div className="relative">
                                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center">
                                    <img src={currentUser.profilePicture} alt="user" className="h-10 w-10 rounded-full" />
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                                        <div className="px-4 py-2">
                                            <span className="block text-sm font-medium text-gray-900">{currentUser.username}</span>
                                            <span className="block text-sm text-gray-500">{currentUser.email}</span>
                                        </div>
                                        <Link to="/dashboard?tab=profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                            Profile
                                        </Link>
                                        <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/sign-in">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-full font-bold shadow-lg"
                                >
                                    Sign In
                                </motion.button>
                            </Link>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    return (
        <>
            <header className="bg-black text-white shadow-lg w-full z-50 relative">
                <div className="container mx-auto flex items-center justify-between py-4 px-6">
                    <motion.div className="flex items-center">
                        <NavLink to="/" className="flex items-center text-2xl font-bold text-white">
                            <img src={logo} alt="MusicBible logo" className="h-16 w-auto" />
                            <img src={txtLogo} alt="MusicBible logo" className="h-14 w-auto mt-8" />
                        </NavLink>
                    </motion.div>

                    <div className="md:hidden z-50 relative">
                        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white focus:outline-none">
                            {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
                        </button>
                    </div>

                    {/* Desktop navigation */}
                    <nav className="hidden md:flex items-center space-x-4">
                        {navItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => { navigate(item.path); }}
                                onMouseEnter={() => setHoveredNav(item.name)}
                                onMouseLeave={() => setHoveredNav(null)}
                                className="relative flex items-center justify-center p-3 rounded-full bg-gray-800 transition-all duration-300 hover:bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0]"
                            >
                                {hoveredNav === item.name ? (
                                    <motion.span 
                                        className="text-sm font-semibold text-white px-4 rounded-full shadow-lg"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                    >
                                        {item.name}
                                    </motion.span>
                                ) : (
                                    <motion.div initial={{ scale: 1 }} whileHover={{ scale: 1.2 }}>
                                        {item.icon}
                                    </motion.div>
                                )}
                            </button>
                        ))}

                        {/* Desktop Profile */}
                        {currentUser ? (
                            <div className="relative">
                                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center">
                                    <img src={currentUser.profilePicture} alt="user" className="h-10 w-10 rounded-full" />
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                                        <div className="px-4 py-2">
                                            <span className="block text-sm font-medium text-gray-900">{currentUser.username}</span>
                                            <span className="block text-sm text-gray-500">{currentUser.email}</span>
                                        </div>
                                        <Link to="/dashboard?tab=profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                            Profile
                                        </Link>
                                        <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/sign-in">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white py-2 px-4 rounded-full font-bold shadow-lg"

                                >
                                    Sign In
                                </motion.button>
                            </Link>
                        )}
                    </nav>
                </div>

                {/* Mobile Menu */}
                <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} navigate={navigate} currentUser={currentUser} />
            </header>
        </>
    );
}
