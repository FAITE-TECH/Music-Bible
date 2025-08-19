import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../redux/user/userSlice';
import { AnimatePresence, motion } from 'framer-motion';
import logo from '../assets/Logo/newlogo.png';
import txtLogo from '../assets/Logo/txtnewlogo.png';
import { HiMenu, HiX, HiHome, HiMusicNote, HiBookOpen, HiMail, HiCollection, HiUser, HiUserGroup, HiUserCircle } from 'react-icons/hi';
import { FaPhone } from 'react-icons/fa';

export default function Header() {
    const { currentUser } = useSelector((state) => state.user);
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
        // { name: "AboutUs", path: "/about", icon: <HiBookOpen size={20} /> },
        { name: "Musics", path: "/musics", icon: <HiMusicNote size={20} /> },
        { name: "Album", path: "/album", icon: <HiCollection size={20} /> },
         { name: "Blog", path: "/blog", icon: <HiBookOpen size={20} /> },
        { name: "Membership", path: "/membership", icon: <HiUserGroup size={20} /> },
        { name: "Contact Us", path: "/contactus", icon: <FaPhone size={20} /> },
    ];

    function MobileMenu({ menuOpen, setMenuOpen, navigate, currentUser }) {
        return (
            <AnimatePresence>
                {menuOpen && (
                    <motion.div 
                        className="fixed top-16 right-4 bg-gray-900 rounded-lg shadow-xl p-3 z-40 flex flex-col space-y-2 w-56"
                        initial={{ opacity: 0, y: -10, x: 20 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, y: -10, x: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {navItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => { navigate(item.path); setMenuOpen(false); }}
                                className="flex items-center space-x-2 p-2 text-white hover:bg-gray-800 rounded-md transition-colors"
                            >
                                <span>{item.icon}</span>
                                <span className="text-sm">{item.name}</span>
                            </button>
                        ))}
                        
                        <button
                            onClick={() => { navigate('/bible/ai'); setMenuOpen(false); }}
                            className="bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white px-3 py-2 rounded-md font-bold text-sm text-center"
                        >
                            Bible/AI
                        </button>
                         <button
                            onClick={() => { navigate('/bible/ai'); setMenuOpen(false); }}
                            className="bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white px-3 py-2 rounded-md font-bold text-sm text-center"
                        >
                            Reading Bible
                        </button>

                        {currentUser ? (
                            <>
                                <button 
                                    onClick={() => setDropdownOpen(!dropdownOpen)} 
                                    className="flex items-center space-x-2 p-2 text-white hover:bg-gray-800 rounded-md transition-colors"
                                >
                                    <img src={currentUser.profilePicture} alt="user" className="h-6 w-6 rounded-full" />
                                    <span className="text-sm">Profile</span>
                                </button>
                                {dropdownOpen && (
                                    <motion.div 
                                        className="bg-gray-800 rounded-md p-2 mt-1"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        <Link 
                                            to="/dashboard?tab=profile" 
                                            className="block px-3 py-2 text-sm text-white hover:bg-gray-700 rounded"
                                            onClick={() => {
                                                setDropdownOpen(false);
                                                setMenuOpen(false);
                                            }}
                                        >
                                            Dashboard
                                        </Link>
                                        <button 
                                            onClick={() => {
                                                handleSignOut();
                                                setDropdownOpen(false);
                                                setMenuOpen(false);
                                            }}
                                            className="block w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 rounded"
                                        >
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </>
                        ) : (
                            <Link 
                                to="/sign-in" 
                                className="flex items-center space-x-2 p-2 text-white hover:bg-gray-800 rounded-md transition-colors"
                                onClick={() => setMenuOpen(false)}
                            >
                                <HiUserCircle size={20} />
                                <span className="text-sm">Sign In</span>
                            </Link>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    return (
        <div className='pt-14'>
            <header className="bg-black text-white shadow-lg w-full fixed top-0 left-0 z-50 h-14">

                <div className="container mx-auto flex items-center justify-between h-full px-4">
                    <motion.div className="flex items-center gap-x-4 md:gap-x-6">
                        <NavLink to="/" className="flex items-center text-2xl font-bold text-white">
                            <img src={logo} alt="MusicBible logo" className="h-8 w-auto" />
                            <img src={txtLogo} alt="MusicBible logo" className="h-6 w-auto mt-3" />
                        </NavLink>
                    </motion.div>

                    <div className="md:hidden z-50 relative">
                        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white focus:outline-none">
                            {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
                        </button>
                    </div>

                    {/* Desktop navigation */}
                    <nav className="hidden md:flex items-center h-full">
                        <div className="flex items-center space-x-1 h-full">
                            {navItems.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => { navigate(item.path); }}
                                    onMouseEnter={() => setHoveredNav(item.name)}
                                    onMouseLeave={() => setHoveredNav(null)}
                                    className="relative flex items-center justify-center px-2 py-1 rounded-full bg-transparent text-sm transition-all duration-300 h-6"
                                >
                                    {hoveredNav === item.name ? (
                                        <motion.span 
                                            className="text-base font-semibold text-white px-3 py-1 rounded-full shadow-lg bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] h-6 flex items-center justify-center"
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.8, opacity: 0 }}
                                        >
                                            {item.name}
                                        </motion.span>
                                    ) : (
                                        <span className="bg-gray-700 rounded-full p-2 flex items-center justify-center">
                                            {item.icon}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center ml-1">
                            {currentUser ? (
                                <div className="relative">
                                    <button 
                                        onClick={() => setDropdownOpen(!dropdownOpen)} 
                                        className="flex items-center justify-center h-8 w-8 rounded-full overflow-hidden"
                                    >
                                        <img src={currentUser.profilePicture} alt="user" className="h-full w-full object-cover" />
                                    </button>
                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg py-2 z-50">
                                            <div className="px-4 py-2">
                                                <span className="block text-sm font-medium text-gray-900">{currentUser.username}</span>
                                                <span className="block text-sm text-gray-500">{currentUser.email}</span>
                                            </div>
                                            <Link 
                                                to="/dashboard?tab=profile" 
                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                Profile
                                            </Link>
                                            <button 
                                                onClick={handleSignOut} 
                                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link to="/sign-in" className="ml-1">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white p-2 rounded-full shadow-lg flex items-center justify-center h-8 w-8"
                                        title="Sign In"
                                    >
                                       <HiUser size={18} />
                                    </motion.button>
                                </Link>
                            )}
                        </div>

                        {/* Bible/AI button at the end */}
                        <button
                            onClick={() => { navigate('/bible/ai'); }}
                            className="bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white px-3 py-1 rounded-full font-bold shadow-lg text-sm h-8 transition-all duration-300 ml-2"
                        >
                            Bible/AI
                        </button>
                        <button
                            onClick={() => { navigate('/bible/ai'); }}
                            className="bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white px-3 py-1 rounded-full font-bold shadow-lg text-sm h-8 transition-all duration-300 ml-2"
                        >
                            Reading Bible
                        </button>
                    </nav>
                </div>

                <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} navigate={navigate} currentUser={currentUser} />
            </header>
        </div>
    );
}