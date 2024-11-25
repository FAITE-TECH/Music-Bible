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
    <div className="bg-gray-900 text-white min-h-screen flex flex-col justify-center items-center py-10 px-4">
      <div className="container mx-auto text-center mb-12" data-aos="fade-down">
        <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 text-indigo-400" data-aos="zoom-in">
          Get in Touch
        </h1>
        <p className="text-base lg:text-lg leading-relaxed max-w-2xl mx-auto" data-aos="fade-up">
          We’d love to hear from you! Whether you have a question, feedback, or just want to say hello, feel free to drop us a message.
        </p>
      </div>

      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center space-y-10 lg:space-y-0 lg:space-x-12 px-6">
        {/* Left: Contact Information */}
        <div className="lg:w-1/3 w-full" data-aos="fade-right">
          <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-indigo-400">Contact Information</h2>
          <p className="text-sm lg:text-lg mb-4" data-aos="fade-up">
            <i className="fas fa-envelope mr-2 text-indigo-400"></i> Email: support@amusicbible.com
          </p>
          <p className="text-sm lg:text-lg mb-4" data-aos="fade-up" data-aos-delay="100">
            <i className="fas fa-phone-alt mr-2 text-indigo-400"></i> Phone: +1 234 567 890
          </p>
          <p className="text-sm lg:text-lg mb-4" data-aos="fade-up" data-aos-delay="200">
            <i className="fas fa-map-marker-alt mr-2 text-indigo-400"></i> Location: 123 Music Avenue, NY
          </p>
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
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg p-3 hover:scale-105 transition-transform"
            >
              Send Message
            </button>
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
