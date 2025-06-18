import { Button, Label, TextInput, Spinner, Alert } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import logo from '../assets/Logo/newlogo.png';
import video from '../assets/Logo/design.mp4';
import { motion } from "framer-motion";

export default function ResetPassword() {
    const { id, token } = useParams();
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const userValid = async () => {
        try {
            const res = await fetch(`https://amusicbible.com/api/user/resetpassword/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!res.ok) {
                throw new Error(`Error: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();

            if (data.status === 201) {
                console.log("User is valid");
            } else {
                setError("Invalid user or token.");
                console.error("Invalid user or token.");
            }
        } catch (error) {
            setError("Failed to validate user. Please try again.");
            console.error("Validation error:", error);
        }
    };

    useEffect(() => {
        userValid();
    }, []);

    const handleChange = (e) => {
        setPassword(e.target.value);
        setError(""); // Clear error when user types
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{5,}$/;
        
        if (!passwordRegex.test(password)) {
            setError("Password must contain at least one uppercase letter, one number, one symbol, and be at least 5 characters long.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`https://amusicbible.com/api/user/updateResetPassword/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ password })
            });

            const data = await res.json();

            if (data.status === 201) {
                setPassword("");
                setMessage("Password updated successfully!");
            } else {
                setError("Token expired. Please generate a new link.");
            }
        } catch (error) {
            console.error("An error occurred while updating password:", error);
            setError("An error occurred while updating password.");
        } finally {
            setLoading(false);
        }
    };
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="relative min-h-screen bg-black">
            {/* Background Video */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0 opacity-50"
            >
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Content */}
            <div className="relative z-10 flex p-6 max-w-6xl mx-auto flex-col md:flex-row items-center justify-between gap-12">
                {/* Left Side - Logo and Description */}
                <motion.div
                    className="flex-1 text-center md:text-left"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
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

                {/* Right Side - Reset Password Form */}
                <div className="flex-1 w-full max-w-md mt-8 md:mt-0">
                    <p className="text-center text-2xl font-cinzel font-semibold text-white mb-8">Reset Your Password</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-white" value="New Password"/>
                            <div className="relative">
                                <TextInput 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="Enter your new password" 
                                    id="password" 
                                    onChange={handleChange}
                                    value={password}
                                    className="w-full"
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
                            <p className="text-xs text-gray-400">
                                Password must contain: uppercase, number, symbol (min 5 chars)
                            </p>
                        </div>

                        <Button 
                            className="bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] w-3/4 mx-auto py-1"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner size="sm" />
                                    <span className="pl-3">Updating...</span>
                                </>
                            ) : 'Reset Password'}
                        </Button>

                        {/* Messages */}
                        {error && (
                            <Alert color="failure" className="mt-4">
                                {error}
                            </Alert>
                        )}
                        {message && (
                            <Alert color="success" className="mt-4">
                                {message}
                            </Alert>
                        )}

                        <div className="text-center text-sm text-white">
                            <Link to='/sign-in' className="text-blue-500 hover:underline">
                                Back to Sign In
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}