import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { 
  HiOutlineExclamationCircle, 
  HiSearch, 
  HiOutlineCurrencyDollar, 
  HiOutlineMusicNote, 
  HiDownload, 
  HiPhone 
} from "react-icons/hi";
import ReactAudioPlayer from 'react-audio-player';
import html2pdf from 'html2pdf.js';
import { motion } from "framer-motion";
import { Tooltip } from "flowbite-react";

export default function DashMusicPurchase() {
  const { currentUser } = useSelector((state) => state.user);
  const [purchases, setPurchases] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [orderIdToDelete, setOrderIdToDelete] = useState("");
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [copiedOrderId, setCopiedOrderId] = useState(null);

  // Format order ID to be more readable
  const formatOrderId = (orderId) => {
    return `${orderId.substring(0, 4)}...${orderId.substring(orderId.length - 4)}`;
  };

  const copyOrderId = (orderId) => {
    navigator.clipboard.writeText(orderId);
    setCopiedOrderId(orderId);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch(
          `/api/music-purchase/getMusicPurchases?searchTerm=${searchTerm}&page=${currentPage}&limit=10`
        );
        const data = await res.json();
        if (res.ok) {
          setPurchases(data.purchases);
          setTotalPurchases(data.totalPurchases);
          setTotalRevenue(data.totalRevenue || 0);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPurchases();
  }, [searchTerm, currentPage]);

  const handleDeletePurchase = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/music-purchase/deleteMusicPurchase/${orderIdToDelete}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setPurchases((prev) =>
          prev.filter((purchase) => purchase.orderId !== orderIdToDelete)
        );
        // Refetch stats after deletion
        const statsRes = await fetch(
          `/api/music-purchase/getMusicPurchases?page=${currentPage}&limit=10`
        );
        const statsData = await statsRes.json();
        if (statsRes.ok) {
          setTotalPurchases(statsData.totalPurchases);
          setTotalRevenue(statsData.totalRevenue || 0);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const generatePDFReport = () => {
    const content = `
      <style>
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f2f2f2;
          font-size: 14px;
        }
        td {
          font-size: 12px;
        }
        .music-img {
          width: 50px;
          height: 50px;
          object-fit: cover;
        }
        .summary {
          margin-bottom: 20px;
        }
        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        .summary-value {
          font-weight: bold;
        }
      </style>
      <h1><b>Music Purchases Report</b></h1>
      <div class="summary">
        <div class="summary-item">
          <span>Total Purchases:</span>
          <span class="summary-value">${totalPurchases}</span>
        </div>
        <div class="summary-item">
          <span>Total Revenue:</span>
          <span class="summary-value">$${totalRevenue.toFixed(2)}</span>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Music</th>
            <th>Date</th>
            <th>Order ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${purchases.map((purchase) => `
            <tr>
              <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <img src="${purchase.musicImage}" alt="${purchase.musicTitle}" class="music-img" />
                  <span>${purchase.musicTitle}</span>
                </div>
              </td>
              <td>${new Date(purchase.createdAt).toLocaleDateString()}</td>
              <td>${formatOrderId(purchase.orderId)}</td>
              <td>${purchase.username}</td>
              <td>${purchase.email}</td>
              <td>${purchase.mobile || 'N/A'}</td>
              <td>$${(purchase.price).toFixed(2)}</td>
              <td>${purchase.status}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>  
    `;

    html2pdf()
      .from(content)
      .set({ margin: 1, filename: "music_purchases_report.pdf" })
      .save();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-3 w-full max-w-screen-2xl mx-auto"
    >
      {/* Header Section */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-300 text-transparent bg-clip-text">
          Music Purchases Management
        </h1>
        <p className="text-gray-500 mt-2">
          Manage all music purchases and revenue
        </p>
      </motion.div>

      {/* Search and Report Section */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6"
      >
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <HiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search Purchases..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 w-full rounded-lg border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generatePDFReport}
          className="whitespace-nowrap bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-200"
        >
          Generate Report
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Total Purchases Card */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="p-6 rounded-xl shadow-lg bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-300"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-white text-lg uppercase font-semibold">
                Total Orders
              </h3>
              <p className="text-3xl font-bold text-white">{totalPurchases}</p>
            </div>
            <div className="bg-purple-600 text-white rounded-full p-3 shadow-lg">
              <HiOutlineMusicNote className="h-6 w-6" />
            </div>
          </div>
        </motion.div>

        {/* Total Revenue Card */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="p-6 rounded-xl shadow-lg bg-gradient-to-r from-green-600 via-green-400 to-teal-300"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-white text-lg uppercase font-semibold">
                Total Revenue
              </h3>
              <p className="text-3xl font-bold text-white">
                ${totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="bg-yellow-500 text-white rounded-full p-3 shadow-lg">
              <HiOutlineCurrencyDollar className="h-6 w-6" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Purchases Table */}
      <motion.div
        className="w-full overflow-x-auto rounded-lg shadow-xl bg-white dark:bg-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {currentUser.isAdmin && purchases.length > 0 ? (
          <div className="min-w-full">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Music</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audio</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {purchases.map((purchase) => (
                  <tr 
                    key={purchase._id}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={purchase.musicImage} 
                          alt={purchase.musicTitle}
                          className="w-10 h-10 rounded-md object-cover"
                        />
                        <span className="font-medium text-gray-900 dark:text-white">{purchase.musicTitle}</span>
                      </div>
                    </td>
                    
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(purchase.createdAt).toLocaleDateString()}
                    </td>
                    
                    <td className="px-4 py-3">
                      <Tooltip 
                          content={purchase.orderId} 
                          placement="top"
                          style="light"
                          arrow={false}
                          className="max-w-xs break-all"
                      >
                          <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => copyOrderId(purchase.orderId)}
                          className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded cursor-pointer text-black dark:text-white"
                          >
                          {formatOrderId(purchase.orderId)}
                          </motion.div>
                      </Tooltip>
                    </td>
                                            
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-white">{purchase.username}</span>
                        <span className="text-xs text-gray-500">{purchase.email}</span>
                      </div>
                    </td>
                    
                    <td className="px-4 py-3">
                      {purchase.mobile ? (
                        <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                          <HiPhone className="text-gray-500" />
                          <span>{purchase.mobile}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      ${purchase.price.toFixed(2)}
                    </td>
                    
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-40">
                          <ReactAudioPlayer
                            src={purchase.musicFile}
                            controls
                            className="h-10 w-full bg-gray-100 dark:bg-gray-700 rounded-md px-2"
                            onError={(e) => console.error('Audio error:', e)}
                          />
                        </div>
                        <button 
                          title="Download"
                          onClick={() => window.open(purchase.musicFile, '_blank')}
                          className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <HiDownload className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                    
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        purchase.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                      }`}>
                        {purchase.status}
                      </span>
                    </td>
                    
                    <td className="px-4 py-3">
                      <motion.button
                        onClick={() => {
                          setShowModal(true);
                          setOrderIdToDelete(purchase.orderId);
                        }}
                        className="text-red-600 hover:text-red-900 dark:hover:text-red-400 font-medium text-sm"
                        whileHover={{ scale: 1.05 }}
                      >
                        Delete
                      </motion.button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="w-full py-12 text-center bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-lg text-gray-500 dark:text-gray-400">
              {searchTerm
                ? "No matching purchases found"
                : "No music purchases to show"}
            </p>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      <motion.div
        className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={currentPage === 1}
          onClick={() => {
            setCurrentPage((prev) => Math.max(prev - 1, 1));
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`px-4 py-2 rounded-lg border border-gray-300 text-gray-700 dark:text-gray-300 ${
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Previous
        </motion.button>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={currentPage === totalPages}
          onClick={() => {
            setCurrentPage((prev) => Math.min(prev + 1, totalPages));
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`px-4 py-2 rounded-lg border border-gray-300 text-gray-700 dark:text-gray-300 ${
            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Next
        </motion.button>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900">
                  <HiOutlineExclamationCircle className="h-10 w-10 text-red-600 dark:text-red-300" />
                </div>
                <div className="mt-3 text-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Delete Purchase Record
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Are you sure you want to delete this purchase record? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-b-lg flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleDeletePurchase}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg"
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}