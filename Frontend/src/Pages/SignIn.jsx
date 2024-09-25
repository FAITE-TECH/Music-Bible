import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInStart, signInSuccess, singInFailure } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuthenticate from "../Components/OAuthenticate";
import logo from '../assets/Logo/logo.png';
import video from '../assets/Logo/design.mp4'; 
import { motion } from "framer-motion"; 

export default function SignIn() {
    const [formData, setFormData] = useState({});
    const { loading, error } = useSelector((state) => state.user);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            dispatch(singInFailure("Please fill all fields"));
            return;
        }
        try {
            dispatch(signInStart());
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    photo: formData.profilePicture,
                }),
            });

            const data = await res.json();
            if (data.success === false) {
                dispatch(singInFailure(data.message));
                return;
            }
            dispatch(signInSuccess(data));
            navigate('/');
        } catch (error) {
            dispatch(singInFailure(error.message));
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="relative min-h-screen bg-black">
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
            >
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Background Overlay for better visibility */}
            <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

            {/* Content */}
            <div className="relative flex p-6 max-w-5xl mx-auto flex-col md:flex-row items-center justify-between gap-20 z-10">
                {/* Left Side */}
                <motion.div
                    className="flex-1 text-center md:text-left"
                    initial={{ opacity: 0, x: -100 }} // Initial position (hidden to the left)
                    animate={{ opacity: 1, x: 0 }} // Animate to visible and its position
                    transition={{ duration: 1 }} // Animation duration
                >
                    <Link to="/" className="text-5xl font-bold text-white">
                        <img
                            src={logo}
                            alt="MusicBible logo"
                            className="h-40 sm:h-28 md:h-40 lg:h-72 xl:h-96 w-auto mx-auto md:mx-0"
                        />
                    </Link>
                    <p className="text-sm font-cinzel text-gray-200 mt-5">
                        Music expresses that which cannot be said and on which it is impossible to be silent. 
                        Music in itself is healing. It's an explosive expression of humanity. 
                        It's something we are all touched by. No matter what culture we're from, 
                        everyone loves music.
                    </p>
                </motion.div>

                {/* Right Side - Sign In Form */}
                <div className="flex-1 mt-5 md:mt-0">
                    <p className="text-center text-2xl font-cinzel font-semibold text-white">Sign In</p>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-5">
                        <div>
                            <Label value="Your email" className="text-white" />
                            <TextInput type="email" placeholder="name@company.com" id="email" onChange={handleChange} />
                        </div>
                        <div>
                            <Label value="Your password" className="text-white" />
                            <div className="relative">
                                <TextInput
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    id="password"
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="absolute top-2 right-3 focus:outline-none"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5c5.185 0 9.448 4.014 9.95 9.048a.944.944 0 0 1 0 .904C21.448 16.486 17.185 20.5 12 20.5S2.552 16.486 2.05 13.452a.944.944 0 0 1 0-.904C2.552 8.514 6.815 4.5 12 4.5zM12 6a9 9 0 0 0-8.72 6.752.944.944 0 0 1 0 .496A9 9 0 0 0 12 18a9 9 0 0 0 8.72-4.752.944.944 0 0 1 0-.496A9 9 0 0 0 12 6z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12.75a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15a7 7 0 01-7-7M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        <Button className="bg-amber-600" disabled={loading} type="submit">
                            {loading ? (
                                <>
                                    <Spinner size="sm" />
                                    <span className="pl-3">Loading</span>
                                </>
                            ) : 'Sign In'}
                        </Button>
                        <OAuthenticate />
                    </form>
                    <div className="flex gap-2 text-sm mt-5 text-white">
                        <span>Forget Password?</span>
                        <Link to='/forgetPassword' className="text-blue-500">Click Here</Link>
                    </div>
                    <div className="flex gap-2 text-sm mt-5 text-white">
                        <span>Don't have an account?</span>
                        <Link to='/sign-up' className="text-blue-500">Sign Up</Link>
                    </div>
                    <div className="text-red-600">
                        {error && (
                            <Alert className="mt-5" color='failure'>
                                {error}
                            </Alert>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
