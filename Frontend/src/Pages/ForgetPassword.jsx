import { Button, Label, TextInput, Spinner, Alert } from "flowbite-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/Logo/newlogo.png";
import video from "../assets/Logo/design.mp4";
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
      const res = await fetch(
        "/api/user/forgetpassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      if (data.status === 201) {
        setEmail("");
        setMessage("Password reset link sent successfully!");
      } else {
        setError("Invalid User");
      }
    } catch (error) {
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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-12">
          {/* Left Side - Logo and Description */}
          <motion.div
            className="flex-1 flex flex-col items-center text-center"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <Link to="/" className="text-5xl font-bold text-white">
              <img
                src={logo}
                alt="MusicBible logo"
                className="h-72 w-auto mx-auto"
              />
            </Link>
            <p className="text-lg font-cinzel text-gray-200 mt-6 max-w-lg">
              Music expresses that which cannot be said and on which it is
              impossible to be silent. Music in itself is healing. It's an
              explosive expression of humanity. It's something we are all
              touched by. No matter what culture we're from, everyone loves
              music.
            </p>
          </motion.div>

          {/* Right Side - Reset Password Form */}
          <div className="flex-1 w-full max-w-md flex flex-col items-center">
            <div className="w-full  bg-opacity-70 p-8 rounded-lg">
              <p className="text-center text-2xl font-cinzel font-semibold text-white mb-8">
                Reset Password
              </p>

              <form
                onSubmit={sendLink}
                className=" space-y-6"
              >
                <div className="space-y-2">
                  <Label
                    className="text-white "
                    value="Your Email"
                  />
                  <div className="relative">
                  <TextInput
                    type="email"
                    placeholder="name@company.com"
                    id="email"
                    onChange={handleChange}
                    value={email}
                    className="w-full"
                  />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0]  w-full sm:w-1/2 max-w-xs mx-auto 
             flex items-center justify-center 
             rounded-lg h-10 sm:h-8 px-4 sm:px-5 py-2 text-sm 
             whitespace-nowrap transition duration-300 ease-in-out"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" />
                      <span className="pl-2">Loading</span>
                    </>
                  ) : (
                    <span className="w-full text-center ">Send Reset Link</span>
                  )}
                </Button>

                {message && (
                  <Alert color="success" className="w-full max-w-xs mt-4  flex items-center justify-center mx-auto">
                    <span className="text-center w-full">{message}</span>
                  </Alert>
                )}
                {error && (
                  <Alert color="failure" className="w-full max-w-xs mt-4  flex items-center justify-center mx-auto">
                    <span className="text-center w-full">{error}</span>
                  </Alert>
                )}

                <div className="text-center text-sm text-white mt-4">
                  <span>Remembered your password? </span>
                  <Link to="/sign-in" className="text-blue-500 hover:underline">
                    Sign In
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
