import React, { useState, useEffect } from "react";
import { Button, Modal, Table } from "flowbite-react";
import {
  HiOutlineExclamationCircle,
  HiSearch,
  HiOutlineDocumentDownload,
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import html2pdf from "html2pdf.js";

export default function DashContactUs() {
  const [contactMessages, setContactMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [messageIdToDelete, setMessageIdToDelete] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/contact/messages?searchTerm=${searchTerm}&page=${currentPage}&limit=10`
        );
        const data = await res.json();
        if (res.ok) {
          setContactMessages(data.messages || []);
          setTotalPages(data.totalPages);
          setTotalMessages(data.totalContacts || 0);
        } else {
          console.error("Failed to fetch messages", data);
        }
      } catch (error) {
        console.error("Error fetching messages", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [searchTerm, currentPage]);

  const handleDeleteMessage = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/contact/delete/${messageIdToDelete}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setContactMessages((prev) =>
          prev.filter((msg) => msg._id !== messageIdToDelete)
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const generatePDFReport = () => {
    const visibleMessages = contactMessages.slice(
      (currentPage - 1) * 10,
      currentPage * 10
    );
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
      </style>
      <h1>Contact Messages Report - Page ${currentPage}</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          ${visibleMessages
            .map(
              (msg) => `
            <tr>
              <td>${new Date(msg.createdAt).toLocaleDateString()}</td>
              <td>${msg.name}</td>
              <td>${msg.email}</td>
              <td>${msg.message}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
    html2pdf().from(content).set({ filename: "contact_report.pdf" }).save();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-3  md:mx-auto sm:w-full max-w-screen-2xl  md:w-3/4 "
    >
      <div className="max-w-7xl mx-auto items-center text-center justify-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-transparent bg-clip-text ">
            Contact Messages
          </h1>
          <p className="text-gray-200">
            Manage all incoming contact form submissions
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-md p-4 md:p-6"
        >
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row justify-between gap-4 mb-6"
          >
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiSearch className="text-gray-700" />
              </div>
              <input
                type="text"
                placeholder="Search messages by name, email or content..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-full border border-gray-700 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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

          <motion.div
            variants={itemVariants}
            className="mb-6 p-4 bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] rounded-lg"
          >
            <h2 className="text-lg font-semibold text-blue-950">
              Total Messages: <span className="font-bold">{totalMessages}</span>
            </h2>
          </motion.div>

          <motion.div variants={itemVariants} className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <Table hoverable className="min-w-full">
                  <Table.Head className="bg-gray-100">
                    <Table.HeadCell className="py-3 px-4">Date</Table.HeadCell>
                    <Table.HeadCell className="py-3 px-4">Name</Table.HeadCell>
                    <Table.HeadCell className="py-3 px-4">Email</Table.HeadCell>
                    <Table.HeadCell className="py-3 px-4">
                      Message
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    <AnimatePresence>
                      {contactMessages.length > 0 ? (
                        contactMessages.map((msg) => (
                          <motion.tr
                            key={msg._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.3 }}
                            className="hover:bg-gray-50"
                          >
                            <Table.Cell className="py-3 px-4">
                              {new Date(msg.createdAt).toLocaleDateString()}
                            </Table.Cell>
                            <Table.Cell className="py-3 px-4 font-medium">
                              {msg.name}
                            </Table.Cell>
                            <Table.Cell className="py-3 px-4 text-blue-600 hover:underline">
                              <a href={`mailto:${msg.email}`}>{msg.email}</a>
                            </Table.Cell>
                            <Table.Cell className="py-3 px-4">
                              {msg.message.length > 50
                                ? `${msg.message.substring(0, 50)}...`
                                : msg.message}
                            </Table.Cell>
                          </motion.tr>
                        ))
                      ) : (
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Table.Cell
                            colSpan={4}
                            className="py-8 text-center text-gray-500"
                          >
                            No contact messages found.
                          </Table.Cell>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </Table.Body>
                </Table>

                {totalPages > 1 && (
                  <motion.div
                    variants={itemVariants}
                    className="flex justify-between items-center mt-6 p-4 text-black bg-gray-50 rounded-lg"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        disabled={currentPage === 1}
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        className="flex text-gray-700 items-center gap-1"
                      >
                        Previous
                      </Button>
                    </motion.div>
                    <span className="text-gray-700 font-medium">
                      Page {currentPage} of {totalPages}
                    </span>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        disabled={
                          currentPage === totalPages || totalPages === 0
                        }
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        className="flex  text-gray-700 items-center gap-1"
                      >
                        Next
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      </div>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header className="border-b-0 pb-0" />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto text-5xl text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Confirm Deletion
            </h3>
            <p className="text-gray-500 mb-4">
              Are you sure you want to delete this message? This action cannot
              be undone.
            </p>
            <div className="flex justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button color="gray" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button color="red" onClick={handleDeleteMessage}>
                  Delete
                </Button>
              </motion.div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </motion.div>
  );
}
