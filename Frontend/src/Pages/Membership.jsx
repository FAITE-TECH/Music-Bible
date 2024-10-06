import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import Framer Motion

export default function MembershipForm() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    address: currentUser?.address || "",
    mobile: currentUser?.mobile || "",
    country: currentUser?.country || "",  
    city: currentUser?.city || "", 
    subscriptionPeriod: "",
  });
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/sign-in");
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/membership/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: currentUser.username,
          email: currentUser.email,
          ...formData,
        }),
      });

      const data = await res.json();

      if (data.success === false) {
        setSubmissionError(data.message);
        setSubmissionSuccess(null);
        return;
      }

      setSubmissionSuccess("Membership submitted successfully");
      navigate(`/`);

      setSubmissionError(null);
    } catch (error) {
      setSubmissionError(error.message);
      setSubmissionSuccess(null);
    }
  };

  
  const slideInFromLeft = {
    hidden: { opacity: 0, x: '-100vw', rotate: 360 }, 
    visible: { 
      opacity: 1, 
      x: 0,
      rotate: 0, // Animate to full visibility at its position and reset rotation
    },
    transition: { 
      type: 'spring', 
      stiffness: 100, 
      damping: 70, 
      duration: 2.9, 
    }, 
  };

  return (
    <div className="bg-[url('https://w0.peakpx.com/wallpaper/246/920/HD-wallpaper-live-through-music-live-music-through-black-headphones-blue.jpg')] bg-cover bg-center min-h-screen flex justify-center items-center ">
      {/* Animated form container */}
      <motion.div
        variants={slideInFromLeft} // Apply the animation
        initial="hidden"
        animate="visible"
        className="bg-black bg-opacity-80 p-8 rounded-xl shadow-lg max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6">Join the Music Club</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Name */}
          <input
            type="text"
            id="name"
            value={currentUser?.username|| ""}
            disabled
            className="bg-gray-700 text-white rounded-lg p-3 outline-none hover:bg-gray-600 transition-colors"
            placeholder="Name"
          />

          {/* Email */}
          <input
            type="email"
            id="email"
            value={currentUser?.email || ""}
            disabled
            className="bg-gray-700 text-white rounded-lg p-3 outline-none hover:bg-gray-600 transition-colors"
            placeholder="Email"
          />

          {/* Country */}
          <input
            type="text"
            id="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            className="bg-gray-700 text-white rounded-lg p-3 outline-none hover:bg-gray-600 transition-colors"
          />

          {/* City */}
          <input
            type="text"
            id="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="bg-gray-700 text-white rounded-lg p-3 outline-none hover:bg-gray-600 transition-colors"
          />

          {/* Address */}
          <input
            type="text"
            id="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="bg-gray-700 text-white rounded-lg p-3 outline-none hover:bg-gray-600 transition-colors"
          />

          {/* Mobile */}
          <input
            type="text"
            id="mobile"
            placeholder="Mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="bg-gray-700 text-white rounded-lg p-3 outline-none hover:bg-gray-600 transition-colors"
          />

          {/* Subscription Period */}
          <select
            id="subscriptionPeriod"
            value={formData.subscriptionPeriod}
            onChange={handleChange}
            className="bg-gray-700 text-white rounded-lg p-3 outline-none hover:bg-gray-600 transition-colors"
          >
            <option value="">Select Subscription Period</option>
            <option value="1month">1 Month</option>
            <option value="3months">3 Months</option>
            <option value="12months">12 Months</option>
          </select>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg p-3 hover:scale-105 transition-transform"
          >
            Submit Membership
          </button>

          {/* Submission feedback */}
          {submissionSuccess && <p className="text-green-400 text-center">{submissionSuccess}</p>}
          {submissionError && <p className="text-red-400 text-center">{submissionError}</p>}
        </form>
      </motion.div>
    </div>
  );
}
