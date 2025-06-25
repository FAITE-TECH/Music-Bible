import { Button, Modal, Table, TextInput, Tooltip } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle, HiSearch, HiOutlineCurrencyDollar, HiClipboard, HiCheck } from "react-icons/hi";
import { useSelector } from "react-redux";
import html2pdf from "html2pdf.js";
import { motion } from "framer-motion";

export default function DashAIOrders() {
  const { currentUser } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [orderIdToDelete, setOrderIdToDelete] = useState("");
  const [totalOrders, setTotalOrders] = useState(0);
  const [lastMonthOrders, setLastMonthOrders] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `/api/aiorder/getAIOrders?searchTerm=${searchTerm}&page=${currentPage}&limit=10`
        );
        const data = await res.json();
        if (res.ok) {
          setOrders(data.orders);
          setTotalOrders(data.totalOrders);
          setLastMonthOrders(data.lastMonthOrders);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchOrders();
  }, [searchTerm, currentPage]);

  const handleDeleteOrder = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/aiorder/deleteAIOrder/${orderIdToDelete}`,
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
        setOrders((prev) =>
          prev.filter((order) => order.orderId !== orderIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const copyToClipboard = (apiKey) => {
    if (!apiKey) return;
    
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(apiKey);
    
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
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
      </style>
      <h1><b>AI Orders Report</b></h1>
      <p>Total Orders: ${totalOrders}</p>
      <p>Last Month Orders: ${lastMonthOrders}</p>
      <br>
      <br>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Order ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${orders.map((order) => `
            <tr>
              <td>${new Date(order.createdAt).toLocaleDateString()}</td>
              <td>${order.orderId}</td>
              <td>${order.username}</td>
              <td>${order.email}</td>
              <td>${order.mobile || 'N/A'}</td>
              <td>$${(order.totalcost).toFixed(2)}</td>
              <td>${order.status}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>  
    `;

    html2pdf()
      .from(content)
      .set({ margin: 1, filename: "ai_orders_report.pdf" })
      .save();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-3 md:mx-auto w-full max-w-screen-2xl md:w-3/4"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl md:text-3xl font-bold bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-transparent bg-clip-text">
          AI Orders Management
        </h1>
        <p className="text-gray-200 mt-2">
          Manage all Bible AI API Key purchases
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
          <TextInput
            type="text"
            placeholder="Search Orders..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 w-full"
          />
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            gradientDuoTone="purpleToBlue"
            outline
            onClick={generatePDFReport}
            className="whitespace-nowrap"
          >
            Generate Report
          </Button>
        </motion.div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="flex flex-col md:flex-row gap-6 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="flex flex-col p-6 gap-4 w-full rounded-xl shadow-lg bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] dark:bg-gray-800"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-200 text-lg uppercase font-semibold">
                Total Orders
              </h3>
              <p className="text-3xl font-bold">{totalOrders}</p>
            </div>
            <HiOutlineCurrencyDollar className="bg-red-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="flex flex-col p-6 gap-4 w-full rounded-xl shadow-lg bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] dark:bg-gray-800"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-200 text-lg uppercase font-semibold">
                Last Month Orders
              </h3>
              <p className="text-3xl font-bold">{lastMonthOrders}</p>
            </div>
            <HiOutlineCurrencyDollar className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </motion.div>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        className="w-full overflow-x-auto rounded-lg shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {currentUser.isAdmin && orders.length > 0 ? (
          <>
            <div className="min-w-full">
              <Table hoverable className="w-full">
                <Table.Head className="bg-gray-100 dark:bg-gray-700">
                  <Table.HeadCell className="px-6 py-4 whitespace-nowrap">
                    Date
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4">Username</Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4">Email</Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4">Mobile</Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4">Amount</Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4">Status</Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4">API Key</Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4">Delete</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y divide-gray-200 dark:divide-gray-700">
                  {orders.map((order) => (
                    <Table.Row
                      className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      key={order._id}
                    >
                      <Table.Cell className="px-6 py-4 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </Table.Cell>
                      
                      <Table.Cell className="px-6 py-4">
                        {order.username}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4">
                        {order.email}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4">
                        {order.mobile || 'N/A'}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4">
                        ${order.totalcost.toFixed(2)}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 max-w-xs">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-mono truncate w-32">
                            {order.apiKey || 'Not generated'}
                          </p>
                          {order.apiKey && (
                            <Tooltip
                              content={copiedKey === order.apiKey ? "Copied!" : "Copy to clipboard"}
                              placement="top"
                            >
                              <motion.button
                                onClick={() => copyToClipboard(order.apiKey)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                              >
                                {copiedKey === order.apiKey ? (
                                  <HiCheck className="h-4 w-4 text-green-500" />
                                ) : (
                                  <HiClipboard className="h-4 w-4" />
                                )}
                              </motion.button>
                            </Tooltip>
                          )}
                        </div>
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4">
                        <motion.button
                          onClick={() => {
                            setShowModal(true);
                            setOrderIdToDelete(order.orderId);
                          }}
                          className="text-red-600 hover:text-red-900 dark:hover:text-red-400 font-medium"
                          whileHover={{ scale: 1.1 }}
                        >
                          Delete
                        </motion.button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </>
        ) : (
          <motion.div
            className="w-full py-12 text-center bg-white dark:bg-gray-800 rounded-lg shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-lg text-gray-500 dark:text-gray-400">
              {searchTerm
                ? "No matching orders found"
                : "No AI orders to show"}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Pagination */}
      <motion.div
        className="flex justify-between items-center px-6 py-4 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((prev) => Math.max(prev - 1, 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            gradientDuoTone="purpleToBlue"
            outline
          >
            Previous
          </Button>
        </motion.div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-200 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage((prev) => Math.min(prev + 1, totalPages));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            gradientDuoTone="purpleToBlue"
            outline
          >
            Next
          </Button>
        </motion.div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="lg"
      >
        <Modal.Header className="border-b border-gray-200 dark:border-gray-700" />
        <Modal.Body>
          <motion.div
            className="text-center flex flex-col items-center justify-center gap-6 p-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-20 sm:w-20">
              <HiOutlineExclamationCircle className="h-10 w-10 text-red-600 dark:text-red-300" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Delete Order
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this order? This action cannot
                  be undone.
                </p>
              </div>
            </div>
          </motion.div>
        </Modal.Body>
        <Modal.Footer className="px-6 py-4 bg-gray-50 dark:bg-gray-800 flex justify-end gap-3">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              color="light"
              onClick={() => setShowModal(false)}
              className="px-4 py-2"
            >
              Cancel
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              color="failure"
              onClick={handleDeleteOrder}
              className="px-4 py-2"
            >
              Delete
            </Button>
          </motion.div>
        </Modal.Footer>
      </Modal>
    </motion.div>
  );
}