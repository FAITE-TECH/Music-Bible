import { Button, Label, TextInput, Spinner } from "flowbite-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from '../assets/Logo/newlogo.png';
import video from '../assets/Logo/design.mp4';
import { motion } from "framer-motion";

export default function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const sendLink = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        
        if (email === "") {
            setError("Email is required!");
            return;
        } 
        if (!email.includes("@")) {
            setError("Please include @ in your email!");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("https://amusicbible.com/api/user/forgetpassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            if (data.status === 201) {
                setEmail("");
                setMessage("Password reset link sent successfully!");
            } else {
                setError("Invalid User");
            }
        } catch(error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
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
                    <p className="text-center text-2xl font-cinzel font-semibold text-white mb-8">Reset Password</p>
                    
                    <form onSubmit={sendLink} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-white" value="Your Email" />
                            <TextInput 
                                type="email" 
                                placeholder="name@company.com" 
                                id="email" 
                                onChange={handleChange} 
                                value={email}
                                className="w-full"
                            />
                        </div>

                        <Button 
                            className="bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] w-3/4 mx-auto py-1"
                            type="submit" 
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner size="sm" />
                                    <span className="pl-3">Sending...</span>
                                </>
                            ) : 'Send Reset Link'}
                        </Button>

                        {message && (
                            <Alert color="success" className="mt-4">
                                {message}
                            </Alert>
                        )}
                        {error && (
                            <Alert color="failure" className="mt-4">
                                {error}
                            </Alert>
                        )}

                        <div className="text-center text-sm text-white mt-4">
                            <span>Remembered your password? </span>
                            <Link to='/sign-in' className="text-blue-500 hover:underline">
                                Sign In
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}