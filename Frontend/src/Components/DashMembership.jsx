import { Button, Modal, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiOutlineExclamationCircle,
  HiSearch,
  HiOutlineDocumentDownload,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import html2pdf from "html2pdf.js";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserPlus, FaChartLine } from "react-icons/fa";

export default function DashMembership() {
  const { currentUser } = useSelector((state) => state.user);
  const [memberships, setMemberships] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [membershipIdToDelete, setMembershipIdToDelete] = useState("");
  const [totalMemberships, setTotalMemberships] = useState(0);
  const [lastMonthMemberships, setLastMonthMemberships] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMemberships = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/membership/membership?searchTerm=${searchTerm}&page=${currentPage}&limit=10`
        );
        const data = await res.json();
        if (res.ok) {
          setMemberships(data.membership);
          setTotalMemberships(data.totalMembership);
          setLastMonthMemberships(data.lastMonthMembership);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMemberships();
  }, [searchTerm, currentPage]);

  const handleAcceptMembership = async (membershipId) => {
    try {
      const res = await fetch(`/api/membership/accept/${membershipId}`, {
        method: "PUT",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setMemberships((prev) =>
          prev.map((membership) =>
            membership._id === membershipId
              ? { ...membership, status: "Accepted", isMember: true }
              : membership
          )
        );
        alert("Email sent to user: Membership accepted");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleRejectMembership = async (membershipId) => {
    try {
      const res = await fetch(`/api/membership/reject/${membershipId}`, {
        method: "PUT",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setMemberships((prev) =>
          prev.filter((membership) => membership._id !== membershipId)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const generatePDFReport = () => {
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();

  const content = `
    <style>
      body {
        font-family: 'Arial', sans-serif;
        color: #333;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 2px solid #3AF7F0;
      }
      .title {
        color: #0119FF;
        font-size: 24px;
        font-weight: bold;
        margin: 0;
      }
      .subtitle {
        color: #0093FF;
        font-size: 16px;
        margin: 5px 0 0 0;
      }
      .report-info {
        text-align: right;
        font-size: 12px;
        color: #666;
      }
      .stats-container {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin: 20px 0;
      }
      .stat-card {
        flex: 1;
        min-width: 200px;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }
      .stat-title {
        font-size: 14px;
        color: #555;
        margin-bottom: 5px;
      }
      .stat-value {
        font-size: 22px;
        font-weight: bold;
        color: #0119FF;
      }
      .stat-change {
        font-size: 12px;
        color: #0093FF;
        margin-top: 5px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      th {
        background: linear-gradient(to right, #0119FF, #0093FF);
        color: white;
        text-align: left;
        padding: 12px;
        font-size: 14px;
      }
      td {
        padding: 10px 12px;
        border-bottom: 1px solid #ddd;
        font-size: 13px;
      }
      tr:nth-child(even) {
        background-color: #f8f9fa;
      }
        .email-link {
        color: #3182ce;
        text-decoration: none;
        transition: all 0.2s;
      }
      
      .email-link:hover {
        text-decoration: underline;
      }
      .status-badge {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 50px;
        font-size: 12px;
        font-weight: 500;
        text-align: center;
        min-width: full;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .active-badge {
        background-color: #4CAF50;
        color: white;
      }
      .pending-badge {
        background-color: #FFC107;
        color: black;
      }
      .rejected-badge {
        background-color: #F44336;
        color: white;
      }
      .status-cell {
        text-align: center;
      }
    </style>

    <div class="header">
      <div>
        <h1 class="title">Membership Management Report</h1>
        <p class="subtitle">Detailed overview of membership applications</p>
      </div>
      <div class="report-info">
        Generated on ${date}<br>
        At ${time}
      </div>
    </div>

    <div class="stats-container">
      <div class="stat-card">
        <div class="stat-title">Total Memberships</div>
        <div class="stat-value">${totalMemberships}</div>
        <div class="stat-change">+${lastMonthMemberships} from last month</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Date Joined</th>
          <th>Member Name</th>
          <th>Email</th>
          
          <th>Mobile</th>
          <th>Subscription</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${memberships
          .map(
            (membership) => `
          <tr>
            <td>${new Date(membership.updatedAt).toLocaleDateString()}</td>
            <td>${membership.name}</br>(${membership.country})</td>
            <td><a href="mailto:${membership.email}" class="email-link">${membership.email} </a></td>
           
            <td>${membership.mobile}</td>
            <td>${membership.subscriptionPeriod}</td>
            <td class="status-cell">
              <span class="status-badge ${
                membership.isMember
                  ? 'active-badge'
                  : membership.status === 'Rejected'
                  ? 'rejected-badge'
                  : 'pending-badge'
              }">
                ${
                  membership.isMember
                    ? 'Active'
                    : membership.status === 'Rejected'
                    ? 'Rejected'
                    : 'Pending'
                }
              </span>
            </td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  `;

  const options = {
    margin: [10, 10, 10, 10],
    filename: `membership_report_${date.replace(/\//g, '-')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      allowTaint: true,
      letterRendering: true
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      hotfixes: ["px_scaling"] 
    }
  };

  html2pdf().set(options).from(content).save();
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

  const cardVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
      transition: { duration: 0.3 },
    },
    tap: {
      scale: 0.98,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-3 md:mx-auto w-full max-w-screen-2xl md:w-3/4"
    >
      <div className="max-w-7xl mx-auto items-center text-center justify-center">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
        <h1 className="text-3xl md:text-3xl font-bold  bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-transparent bg-clip-text ">
          Membership Management
        </h1>
        <p className="text-gray-200">
          View and manage all membership applications
        </p>
      </motion.div>
      </div>

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
            placeholder="Search by name, email or country..."
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
                Total Memberships
              </h3>

              <p className="text-2xl font-bold text-gray-200">
                {totalMemberships}
              </p>
            </div>
            <FaUserPlus className="bg-red-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="flex flex-col p-6 gap-4 w-full rounded-xl shadow-lg bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] dark:bg-gray-800"
        >
          <div className="flex justify-between items-center">
            <div>
             <h3 className="text-gray-200 text-lg uppercase font-semibold">
                Last Month Memberships
              </h3>
              <p className="text-2xl font-bold text-gray-200">
                {lastMonthMemberships}
              </p>
            </div>
            <FaChartLine className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="w-full overflow-x-auto rounded-lg shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {currentUser.isAdmin && memberships.length > 0 ? (
          
       
            <Table hoverable className="w-full">
              <Table.Head className="bg-gray-100 dark:bg-gray-700">
                <Table.HeadCell className="px-6 py-4 whitespace-nowrap">
                  Date Joined
                </Table.HeadCell>
                <Table.HeadCell className="py-3 px-4">
                  Member Name
                </Table.HeadCell>
                <Table.HeadCell className="py-3 px-4">Email</Table.HeadCell>
                <Table.HeadCell className="py-3 px-4">Country</Table.HeadCell>
                <Table.HeadCell className="py-3 px-4">Mobile</Table.HeadCell>
                <Table.HeadCell className="py-3 px-4">
                  Subscription
                </Table.HeadCell>
                <Table.HeadCell className="py-3 px-4">Status</Table.HeadCell>
                <Table.HeadCell className="py-3 px-4">Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y divide-gray-200 dark:divide-gray-700">
                <AnimatePresence>
                  {memberships.map((membership) => (
                    <motion.tr
                      key={membership._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Table.Cell className="py-3 px-4">
                        {new Date(membership.updatedAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell className="py-3 px-4 font-medium">
                        {membership.name}
                      </Table.Cell>
                      <Table.Cell className="py-3 px-4 text-blue-600 hover:underline">
                        <a href={`mailto:${membership.email}`}>
                          {membership.email}
                        </a>
                      </Table.Cell>
                      <Table.Cell className="py-3 px-4">
                        {membership.country}
                      </Table.Cell>
                      <Table.Cell className="py-3 px-4">
                        {membership.mobile}
                      </Table.Cell>
                      <Table.Cell className="py-3 px-4">
                        {membership.subscriptionPeriod}
                      </Table.Cell>
                      <Table.Cell className="py-3 px-4">
                        {membership.isMember ? (
                          <HiCheckCircle className="text-green-500 text-xl" />
                        ) : membership.status === "Rejected" ? (
                          <HiXCircle className="text-red-500 text-xl" />
                        ) : (
                          <span className="text-yellow-600">Pending</span>
                        )}
                      </Table.Cell>
                      <Table.Cell className="py-3 px-4">
                        <div className="flex flex-wrap gap-2">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              size="xs"
                              color="green"
                              onClick={() =>
                                handleAcceptMembership(membership._id)
                              }
                              disabled={membership.isMember}
                            >
                              Accept
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              size="xs"
                              color="red"
                              onClick={() =>
                                handleRejectMembership(membership._id)
                              }
                              disabled={membership.status === "Rejected"}
                            >
                              Reject
                            </Button>
                          </motion.div>
                        </div>
                      </Table.Cell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </Table.Body>
            </Table>
          

           
          
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 text-gray-500"
          >
            {currentUser.isAdmin
              ? "No membership applications found"
              : "You don't have permission to view memberships"}
          </motion.div>
        )}
      </motion.div>

       {totalPages > 1 && (
              <motion.div
                variants={itemVariants}
                className="flex justify-between items-center mt-6 p-4  rounded-lg"
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
                    className="flex text-gray-200 items-center gap-1"
                  >
                    Previous
                  </Button>
                </motion.div>
                <span className="text-gray-200 font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className="flex text-gray-200 items-center gap-1"
                  >
                    Next
                  </Button>
                </motion.div>
              </motion.div>
            )}

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
              Do you really want to delete this membership? This action cannot
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
                <Button color="red">Delete</Button>
              </motion.div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </motion.div>
  );
}
