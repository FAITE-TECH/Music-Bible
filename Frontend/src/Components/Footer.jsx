import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaPhone } from "react-icons/fa";
import {
  HiMail,
  HiMusicNote,
  HiCollection,
  HiUserGroup,
  HiBookOpen,
} from "react-icons/hi";
import logo from "../assets/Logo/newlogo.png";
import txtLogo from "../assets/Logo/txtnewlogo.png";

const Footer = () => {
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  return (
    <footer className="relative bg-gradient-to-b from-black to-gray-900 text-white pt-16 pb-8 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About - Full width on mobile, then normal */}
          <div className="flex flex-col items-start md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <img src={logo} alt="aMusicBible Logo" className="h-12 mr-2" />
              <img src={txtLogo} alt="aMusicBible" className="h-10 mt-2" />
            </div>
            <p className="text-gray-400 mb-4">
              Experience the Bible through music and transform your spiritual
              journey.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-blue-400">
              Services
            </h3>
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/musics"
                  className={({ isActive }) =>
                    `text-gray-400 hover:text-white transition flex items-center pointer-events-auto ${
                      isActive ? "text-orange-400" : ""
                    }`
                  }
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <HiMusicNote className="mr-2" size={20} />
                  Musics
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/album"
                  className="text-gray-400 hover:text-white transition flex items-center"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <HiCollection className="mr-2" size={20} />
                  Album
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/membership"
                  className="text-gray-400 hover:text-white transition flex items-center"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <HiUserGroup className="mr-2" size={20} />
                  Membership
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/bible/ai"
                  className="text-gray-400 hover:text-white transition flex items-center"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <HiBookOpen className="mr-2" size={20} />
                  Bible/AI
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/reading"
                  className="text-gray-400 hover:text-white transition flex items-center w-full text-left"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <HiBookOpen className="mr-2" size={20} />
                  Reading Bible
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-blue-400">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <HiMail
                  className="text-gray-400 mt-1 mr-3 flex-shrink-0"
                  size={20}
                />
                <a
                  href="mailto:support@amusicbible.com"
                  className="text-gray-400 hover:text-white transition"
                >
                  amusicbible@gmail.com
                </a>
              </li>
              <li className="flex items-start">
                <FaPhone
                  className="text-gray-400 mt-1 mr-3 flex-shrink-0"
                  size={18}
                />
                <a
                  href="tel:+16477718426"
                  className="text-gray-400 hover:text-white transition"
                >
                  +1 (647) 771-8426
                </a>
              </li>
              <li className="flex items-start">
                <svg
                  className="text-gray-400 mt-1 mr-3 flex-shrink-0 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-gray-400">
                  123 Bible Way, Jerusalem, Holy Land
                </span>
              </li>
            </ul>
          </div>

          {/* Social Media Vertical Links */}
          <div className="md:col-span-2 lg:col-span-1 flex flex-col items-start md:ml-8">
            <h3 className="text-lg font-semibold mb-4 text-blue-400">
              Follow Us
            </h3>
            <div className="flex flex-col items-start space-y-4 w-full">
              <a
                href="https://www.facebook.com/share/16egcyoU5s/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition flex items-center"
                aria-label="Facebook"
              >
                <svg
                  className="w-6 h-6 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="align-middle">facebook.com</span>
              </a>
              <a
                href="https://youtube.com/@amusicbible?si=2gK7hJ9LU27CcANG"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition flex items-center"
                aria-label="YouTube"
              >
                <svg
                  className="w-6 h-6 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="align-middle">youtube.com</span>
              </a>
              <a
                href="https://www.instagram.com/amusicbibletgcn?igsh=YXFnYWwycnV1MDdj"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition flex items-center"
                aria-label="Instagram"
              >
                <svg
                  className="w-6 h-6 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="align-middle">instagram.com</span>
              </a>

              <a
                href="https://wa.me/16477718426"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition flex items-center"
                aria-label="WhatsApp"
              >
                <svg
                  className="w-6 h-6 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.028-.967-.271-.099-.468-.148-.666.15-.198.297-.767.967-.94 1.166-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.666-1.611-.912-2.207-.242-.579-.487-.5-.666-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.075-.792.372-.271.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.2 5.077 4.348.711.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.075-.124-.271-.198-.568-.347z" />
                  <path d="M12.004 2.002c-5.523 0-10 4.477-10 10 0 1.768.464 3.497 1.345 5.012L2 22l5.09-1.329A9.96 9.96 0 0 0 12.004 22c5.523 0 10-4.477 10-10s-4.477-9.998-10-9.998zm0 18.001c-1.592 0-3.155-.418-4.522-1.211l-.323-.188-3.018.786.808-2.945-.21-.338C4.418 15.155 4.002 13.592 4.002 12c0-4.418 3.584-8.002 8.002-8.002 4.418 0 8.002 3.584 8.002 8.002 0 4.418-3.584 8.003-8.002 8.003z" />
                </svg>
                <span className="align-middle">whatsapp.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright - Responsive text */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 mb-10 sm:mb-0">
          <p className="m-0 text-center text-xs sm:text-sm">
            © 2025{" "}
            <a
              href="http://www.faite.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              FAITE (PVT) Ltd
            </a>
            .{" "}
            <span className="hidden sm:inline">
              Designed and maintained by FAITE.
            </span>{" "}
            All rights reserved.
          </p>
        </div>
      </div>

      {/* Coming Soon Modal */}
      {showComingSoonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-blue-900 to-black rounded-xl p-8 max-w-md mx-4 border border-[#3AF7F0]">
            <h3 className="text-2xl font-bold text-blue-400 mb-4">
              Coming Soon!
            </h3>
            <p className="text-gray-300 mb-6">
              We're currently working on the Reading Bible feature. This will be
              available in our next update!
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowComingSoonModal(false)}
                className="bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] hover:from-[#3AF7F0] hover:to-[#0119FF] text-white px-6 py-2 rounded-full transition"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
