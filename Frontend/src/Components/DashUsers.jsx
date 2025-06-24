import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Button, Modal, TextInput } from "flowbite-react";
import {
  HiArrowNarrowUp,
  HiOutlineExclamationCircle,
  HiOutlineUserGroup,
  HiUser,
  HiSearch,
} from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import html2pdf from "html2pdf.js";

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [userIdToAssignAdmin, setUserIdToAssignAdmin] = useState("");
  const [userIdToResignAdmin, setUserIdToResignAdmin] = useState("");
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [lastMonthCustomers, setLastMonthCustomers] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [lastMonthAdmin, setLastMonthAdmin] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdminsOnly, setShowAdminsOnly] = useState(false);
  const [showCustomersOnly, setShowCustomersOnly] = useState(false);
  const [showAccessConfirmation, setShowAccessConfirmation] = useState(false);
  const [showAccessDeclaration, setShowAccessDeclaration] = useState(false);

  useEffect(() => {
    if (showAdminsOnly) {
      const fetchAdmins = async () => {
        try {
          const res = await fetch("/api/user/getadmins");
          const data = await res.json();
          if (res.ok) {
            setUsers(data.admins);
          }
          setShowMore(false);
        } catch (error) {
          console.log(error.message);
        }
      };
      fetchAdmins();
    } else if (showCustomersOnly) {
      const fetchCustomers = async () => {
        try {
          const res = await fetch("/api/user/getcustomers");
          const data = await res.json();
          if (res.ok) {
            setUsers(data.admins);
          }
          setShowMore(false);
        } catch (error) {
          console.log(error.message);
        }
      };
      fetchCustomers();
    } else {
      const fetchAllUsers = async () => {
        try {
          const res = await fetch(
            `/api/user/getusers?searchTerm=${searchTerm}`
          );
          const data = await res.json();
          if (res.ok) {
            setUsers(data.users);
            setTotalCustomers(data.totalCustomers);
            setLastMonthCustomers(data.lastMonthCustomers);
            setTotalAdmins(data.totalAdmins);
            setLastMonthAdmin(data.lastMonthAdmin);
            setLastMonthUsers(data.lastMonthUsers);
            setTotalUsers(data.totalUsers);

            setShowMore(true);

            if (data.users.length < 9) {
              setShowMore(false);
            }
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      if (currentUser.isAdmin) {
        fetchAllUsers();
      }
    }
  }, [currentUser._id, searchTerm, showAdminsOnly, showCustomersOnly]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setShowMore(true);
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
      <h1><b>User Details Report</b></h1>
      <p>Total Customers: ${totalCustomers}</p>
      <p>Last Month Customers : ${lastMonthCustomers}</p>
      <p>Total Admins : ${totalAdmins}</p>
      <p>Last Month Admins : ${lastMonthAdmin}</p>
      <p>Total User (Admin + Customers) : ${totalUsers}</p>
      <p>Last Month User (Admin + Customers) : ${lastMonthUsers}</p>
      <br>
      <br>
      <table>
        <thead>
          <tr>
            <th>Created At</th>
            <th>Username</th>
            <th>Email</th>
            <th>Mobile</th>
            <th></th>
            <th>Admin</th>
          </tr>
        </thead>
        <tbody>
          ${users
            .map(
              (user) => `
            <tr>
              <td>${new Date(user.createdAt).toLocaleDateString()}</td>
              <td>${user.username}</td>
              <td>${user.email}</td>
              <td>${user.mobile}</td>
              <td>${user.adress}</td>
              <td>${user.isAdmin ? "Yes" : "No"}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

    html2pdf()
      .from(content)
      .set({ margin: 1, filename: "user_report.pdf" })
      .save();
  };

  const handleGenerateReport = () => {
    generatePDFReport();
  };

  const handleCheckboxChange = (e) => {
    setShowAdminsOnly(e.target.checked);
    setShowCustomersOnly(false);
  };

  const handleCheckboxChangeCus = (e) => {
    setShowCustomersOnly(e.target.checked);
    setShowAdminsOnly(false);
  };

  const handleAssignAdmin = async () => {
    try {
      const res = await fetch(`/api/user/assignadmin/${userIdToAssignAdmin}`, {
        method: "PUT",
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userIdToAssignAdmin ? { ...user, isAdmin: true } : user
          )
        );
        setShowAccessConfirmation(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleResignAdmin = async () => {
    try {
      const res = await fetch(`/api/user/resignadmin/${userIdToResignAdmin}`, {
        method: "PUT",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userIdToResignAdmin
              ? { ...user, isAdmin: false }
              : user
          )
        );
        setShowAccessDeclaration(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-3  md:mx-auto sm:w-full max-w-screen-2xl  md:w-3/4"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl md:text-3xl font-bold bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-transparent bg-clip-text">
          User Management
        </h1>
        <p className="text-gray-200 mt-2">
          Manage all registered user accounts
        </p>
      </motion.div>
      {/* Search and Filter Section */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="mb-4 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <HiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <TextInput
            type="text"
            placeholder="Search Users..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 w-full"
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center w-full md:w-auto justify-end">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="adminCheckbox"
              checked={showAdminsOnly}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="adminCheckbox"
              className="ml-2 block text-sm text-gray-200"
            >
              Admins Only
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="customerCheckbox"
              checked={showCustomersOnly}
              onChange={handleCheckboxChangeCus}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="customerCheckbox"
              className="ml-2 block text-sm text-gray-200"
            >
              Customers Only
            </label>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              gradientDuoTone="purpleToBlue"
              outline
              onClick={handleGenerateReport}
              className="whitespace-nowrap"
            >
              Generate Report
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="flex flex-col md:flex-row gap-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="flex flex-col p-4 gap-4 w-full rounded-md shadow-md bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] dark:bg-gray-800"
        >
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-200 text-sm md:text-md uppercase">
                Total Users
              </h3>
              <p className="text-xl md:text-2xl">{totalCustomers}</p>
            </div>
            <HiOutlineUserGroup className="bg-red-600 text-white rounded-full text-4xl md:text-5xl p-2 md:p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-xs md:text-sm">
            <span className="text-green-400 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthCustomers}
            </span>
            <div className="text-gray-200">Last month</div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="flex flex-col p-4 gap-4 w-full rounded-md shadow-md bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] dark:bg-gray-800"
        >
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-200 text-sm md:text-md uppercase">
                Total Admins
              </h3>
              <p className="text-xl md:text-2xl">{totalAdmins}</p>
            </div>
            <HiUser className="bg-lime-600 text-white rounded-full text-4xl md:text-5xl p-2 md:p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-xs md:text-sm">
            <span className="text-green-400 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthAdmin}
            </span>
            <div className="text-gray-200">Last month</div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="flex flex-col p-4 gap-4 w-full rounded-md shadow-md bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] dark:bg-gray-800"
        >
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-200 text-sm md:text-md uppercase">
                Total Users (Admin+Customers)
              </h3>
              <p className="text-xl md:text-2xl">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="bg-indigo-600 text-white rounded-full text-4xl md:text-5xl p-2 md:p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-xs md:text-sm">
            <span className="text-green-400 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className="text-gray-200">Last month</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        className="w-full overflow-x-auto overflow-hidden rounded-lg shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {currentUser.isAdmin && users.length > 0 ? (
          <>
            <div className="min-w-full">
              <Table hoverable className="w-full">
                <Table.Head className="bg-gray-100 dark:bg-gray-700">
                  <Table.HeadCell className="px-6 py-4 whitespace-nowrap">
                    Date created
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4">
                    User image
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4">
                    Username
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4">Email</Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4">Mobile</Table.HeadCell>

                  <Table.HeadCell className="px-6 py-4">Admin</Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4">Remove</Table.HeadCell>
                  {currentUser.isOwner && (
                    <Table.HeadCell className="px-6 py-4">
                      Admin Actions
                    </Table.HeadCell>
                  )}
                </Table.Head>
                <Table.Body className="divide-y divide-gray-200 dark:divide-gray-700 ">
                  {users.map((user) => (
                    <Table.Row
                      key={user._id}
                      className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Table.Cell className=" px-6 py-4 whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4">
                        <img
                          src={user.profilePicture}
                          alt={user.username}
                          className="w-8 h-8 md:w-10 md:h-10 object-cover bg-gray-500 rounded-full"
                        />
                      </Table.Cell>
                      <Table.Cell className=" px-6 py-4 whitespace-nowrap">
                        {user.username}
                      </Table.Cell>
                      <Table.Cell className=" px-6 py-4 whitespace-nowrap">
                        {user.email}
                      </Table.Cell>
                      <Table.Cell className=" px-6 py-4 whitespace-nowrap">
                        {user.mobile || "N/A"}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4">
                        {user.isAdmin ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          <FaTimes className="text-red-500" />
                        )}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4">
                        <motion.span
                          whileHover={{ scale: 1.1 }}
                          onClick={() => {
                            setShowModal(true);
                            setUserIdToDelete(user._id);
                          }}
                          className="font-medium text-red-500 hover:underline cursor-pointer"
                        >
                          Remove
                        </motion.span>
                      </Table.Cell>
                      {currentUser.isOwner && (
                        <Table.Cell className="px-6 py-4 flex gap-2">
                          <motion.span
                            whileHover={{ scale: 1.1 }}
                            onClick={() => {
                              if (!user.isAdmin) {
                                setShowAccessConfirmation(true);
                                setUserIdToAssignAdmin(user._id);
                              }
                            }}
                            className={`font-medium text-green-500 hover:underline cursor-pointer ${
                              user.isAdmin
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            Assign
                          </motion.span>

                          <motion.span
                            whileHover={{ scale: 1.1 }}
                            onClick={() => {
                              if (user.isAdmin) {
                                setShowAccessDeclaration(true);
                                setUserIdToResignAdmin(user._id);
                              }
                            }}
                            className={`font-medium text-red-500 hover:underline cursor-pointer ${
                              !user.isAdmin
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            Resign
                          </motion.span>
                        </Table.Cell>
                      )}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
            {showMore && (
              <motion.button
                onClick={handleShowMore}
                className="w-full text-teal-500 self-center text-sm py-7"
                whileHover={{ scale: 1.05 }}
              >
                Show more
              </motion.button>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500 py-10">No users found</p>
        )}
      </motion.div>

      {/* Modals */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showAccessConfirmation}
        onClose={() => setShowAccessConfirmation(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to give admin access?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="success" onClick={handleAssignAdmin}>
                Yes, give access
              </Button>
              <Button
                color="gray"
                onClick={() => setShowAccessConfirmation(false)}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showAccessDeclaration}
        onClose={() => setShowAccessDeclaration(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to remove admin access?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleResignAdmin}>
                Yes, remove access
              </Button>
              <Button
                color="gray"
                onClick={() => setShowAccessDeclaration(false)}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </motion.div>
  );
}
