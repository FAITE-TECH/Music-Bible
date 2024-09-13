import React from 'react';
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HiUser } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Dropdown, DropdownDivider, DropdownHeader, DropdownItem } from 'flowbite-react';
import { signOut } from '../redux/user/userSlice';

export default function Header() {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
          await fetch("/api/user/signout");
          dispatch(signOut());
          navigate("/");
        } catch (error) {
          console.log(error);
        }
      };
  return (
    <header className="bg-gradient-to-r from-purple-900 via-purple-700 to-pink-500 text-white relative z-50 shadow-lg w-full">
      <div className="container mx-auto flex flex-wrap items-center justify-between py-4 px-6">
        <div className="flex items-center">
          <NavLink to="/" className="text-2xl md:text-3xl font-bold text-white">
            MusicBible
          </NavLink>
        </div>
        
        <nav className="flex flex-col md:flex-row md:space-x-6 items-center mt-4 md:mt-0">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              isActive ? "text-gray-300" : "text-white hover:text-gray-300"
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/category" 
            className={({ isActive }) => 
              isActive ? "text-gray-300" : "text-white hover:text-gray-300"
            }
          >
            New
          </NavLink>
          <NavLink 
            to="/musics" 
            className={({ isActive }) => 
              isActive ? "text-gray-300" : "text-white hover:text-gray-300"
            }
          >
            Musics
          </NavLink>
          <NavLink 
            to="/blogs" 
            className={({ isActive }) => 
              isActive ? "text-gray-300" : "text-white hover:text-gray-300"
            }
          >
            Contact
          </NavLink>
        </nav>
        
        <div className="flex space-x-4 items-center mt-4 md:mt-0">
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
                 
                    <HiUser className="text-white"/>
             
                  </Link>
                )}
          <Link to="/download" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-purple-600 hover:to-pink-500 text-white py-2 px-4 md:px-6 rounded-full font-bold shadow-lg">
            Download
          </Link>
        </div>
      </div>
    </header>
  );
}
