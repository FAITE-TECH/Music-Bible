import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useSelector } from 'react-redux';

export default function ContactUs() {
  const { currentUser } = useSelector((state) => state.user);
  const [name, setName] = useState(currentUser?.username || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [message, setMessage] = useState('');
  const [formStatus, setFormStatus] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const contactData = {
      name,
      email,
      message,
      userId: currentUser?._id || null, // Include userId only if logged in
    };

    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(contactData),
      });

      if (response.ok) {
        setFormStatus('Message sent successfully!');
        setMessage('');
      } else {
        setFormStatus('Failed to send the message.');
      }
    } catch (error) {
      setFormStatus('An error occurred while sending the message.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col justify-center items-center py-10 px-4">
      <div className="container mx-auto text-center mb-12" data-aos="fade-down">
        <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] bg-clip-text text-transparent" data-aos="zoom-in">
          Get in Touch
        </h1>
        <p className="text-base lg:text-lg leading-relaxed max-w-2xl mx-auto" data-aos="fade-up">
          We’d love to hear from you! Whether you have a question, feedback, or just want to say hello, feel free to drop us a message.
        </p>
      </div>

      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center space-y-10 lg:space-y-0 lg:space-x-12 px-6">
        {/* Left: Contact Information */}
        <div className="w-full lg:w-2/5" data-aos="fade-right">
          <div className=" p-6 sm:p-8 rounded-xl shadow-lg h-full">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] bg-clip-text text-transparent">
              Contact Information
            </h2>
            
            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-start">
                <div className="bg-indigo-500/20 p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-medium text-gray-300">Email</h3>
                  <p className="text-sm sm:text-base text-gray-400">support@amusicbible.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-indigo-500/20 p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-medium text-gray-300">Phone</h3>
                  <p className="text-sm sm:text-base text-gray-400">+1 234 567 890</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-indigo-500/20 p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-medium text-gray-300">Location</h3>
                  <p className="text-sm sm:text-base text-gray-400">123 Music Avenue, NY</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:w-2/3 w-full" data-aos="fade-left">
          <form className="bg-gray-800 p-4 lg:p-8 rounded-lg shadow-lg" onSubmit={handleSubmit}>
            <div className="mb-4 lg:mb-6">
              <label htmlFor="name" className="block text-sm lg:text-lg mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full p-2 lg:p-3 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-aos="fade-up"
              />
            </div>
            <div className="mb-4 lg:mb-6">
              <label htmlFor="email" className="block text-sm lg:text-lg mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-2 lg:p-3 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-aos="fade-up"
                data-aos-delay="100"
              />
            </div>
            <div className="mb-4 lg:mb-6">
              <label htmlFor="message" className="block text-sm lg:text-lg mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                className="w-full p-2 lg:p-3 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                data-aos="fade-up"
                data-aos-delay="200"
              ></textarea>
            </div>
            <div className="flex justify-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0]  text-white rounded-lg w-3/4 mx-auto  p-3 hover:scale-105 transition-transform"
            >
              Send Message
            </button>
            </div>
          </form>
          {formStatus && <p className="mt-4">{formStatus}</p>}
        </div>
      </div>

      {/* Decorative Bottom Wave Effect */}
      <div className="wave-bg absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-gray-900"></div>

      {/* Style for wave background */}
      <style jsx>{`
        .wave-bg {
          background: url('https://www.transparenttextures.com/patterns/wave.png');
        }
      `}</style>
    </div>
  );
}
