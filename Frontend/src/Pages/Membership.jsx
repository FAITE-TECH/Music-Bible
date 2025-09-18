import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function MembershipForm() {
  // Toast animation: slide in from right
  const toastVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 120, damping: 18 },
    },
    exit: { opacity: 0, x: 100, transition: { duration: 0.3 } },
  };

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

  // Auto-dismiss toast messages after 5 seconds
  useEffect(() => {
    if (submissionSuccess || submissionError) {
      const timer = setTimeout(() => {
        setSubmissionSuccess(null);
        setSubmissionError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [submissionSuccess, submissionError]);

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

      setSubmissionSuccess("Membership submitted successfully!");
      setSubmissionError(null);

      // Reset form after successful submission
      setFormData({
        address: currentUser?.address || "",
        mobile: currentUser?.mobile || "",
        country: currentUser?.country || "",
        city: currentUser?.city || "",
        subscriptionPeriod: "",
      });
    } catch (error) {
      setSubmissionError(error.message);
      setSubmissionSuccess(null);
    }
  };

  const slideInFromLeft = {
    hidden: { opacity: 0, x: "-100vw", rotate: 360 },
    visible: {
      opacity: 1,
      x: 0,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 70,
        duration: 0.9,
      },
    },
  };

  return (
    <div className="bg-[url('https://w0.peakpx.com/wallpaper/246/920/HD-wallpaper-live-through-music-live-music-through-black-headphones-blue.jpg')] bg-cover bg-center min-h-screen flex justify-center items-center p-4">
      {/* Toast messages in top right corner */}
      <div className="fixed top-20 right-6 z-50 flex flex-col items-end space-y-2">
        <AnimatePresence>
          {submissionSuccess && (
            <motion.div
              key="success-toast"
              variants={toastVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              {submissionSuccess}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {submissionError && (
            <motion.div
              key="error-toast"
              variants={toastVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
              {submissionError}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Animated form container */}
      <motion.div
        variants={slideInFromLeft}
        initial="hidden"
        animate="visible"
        className="bg-black bg-opacity-80 p-8 rounded-xl shadow-lg max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-[#0979F0] via-[#00CCFF] to-[#0979F0] bg-clip-text text-transparent mb-6">
          Join the Music Club
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Name */}
          <input
            type="text"
            id="name"
            value={currentUser?.username || ""}
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
            required
          />
          {/* City */}
          <input
            type="text"
            id="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="bg-gray-700 text-white rounded-lg p-3 outline-none hover:bg-gray-600 transition-colors"
            required
          />
          {/* Address */}
          <input
            type="text"
            id="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="bg-gray-700 text-white rounded-lg p-3 outline-none hover:bg-gray-600 transition-colors"
            required
          />
          {/* Mobile */}
          <input
            type="text"
            id="mobile"
            placeholder="Mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="bg-gray-700 text-white rounded-lg p-3 outline-none hover:bg-gray-600 transition-colors"
            required
          />
          {/* Subscription Period */}
          <select
            id="subscriptionPeriod"
            value={formData.subscriptionPeriod}
            onChange={handleChange}
            className="bg-gray-700 text-white rounded-lg p-3 outline-none hover:bg-gray-600 transition-colors"
            required
          >
            <option value="">Select Subscription Period</option>
            <option value="1month">1 Month</option>
            <option value="3months">3 Months</option>
            <option value="12months">12 Months</option>
          </select>
          {/* Submit Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-[#0979F0] via-[#00CCFF] to-[#0979F0] w-1/2 mx-auto justify-center text-white rounded-lg p-3 hover:scale-105 transition-transform font-semibold"
          >
            Submit Membership
          </button>
        </form>
      </motion.div>
    </div>
  );
}
