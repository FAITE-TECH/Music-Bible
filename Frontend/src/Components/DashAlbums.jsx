import { Button, Modal, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiGift, HiOutlineExclamationCircle, HiSearch } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { motion } from "framer-motion";

export default function DashAlbum() {
  const { currentUser } = useSelector((state) => state.user);
  const [userAlbums, setUserAlbums] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [albumIdToDelete, setAlbumIdToDelete] = useState("");
  const [totalAlbums, setTotalAlbums] = useState(0);
  const [lastMonthAlbums, setLastMonthAlbums] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await fetch(
          `/api/category/getAlbums?searchTerm=${searchTerm}&page=${currentPage}&limit=10`
        );
        const data = await res.json();
        if (res.ok) {
          setUserAlbums(data.albums);
          setTotalAlbums(data.totalAlbums);
          setLastMonthAlbums(data.lastMonthAlbums);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchAlbums();
  }, [searchTerm, currentPage]);

  const handleDeleteAlbum = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/category/delete/${albumIdToDelete}/${currentUser._id}`,
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
        setUserAlbums((prev) =>
          prev.filter((album) => album._id !== albumIdToDelete)
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
        page-break-after: avoid;
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
        page-break-after: avoid;
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
         page-break-inside: avoid;
        page-break-after: auto;
      }
      .album-image {
        max-width: 80px;
        max-height: 80px;
        object-fit: cover;
        border-radius: 4px;
      }
    </style>

    <div class="header">
      <div>
        <h1 class="title">Album Management Report</h1>
        <p class="subtitle">Detailed overview of music albums</p>
      </div>
      <div class="report-info">
        Generated on ${date}<br>
        At ${time}
      </div>
    </div>

    <div class="stats-container">
      <div class="stat-card">
        <div class="stat-title">Total Albums</div>
        <div class="stat-value">${totalAlbums}</div>
        <div class="stat-change">+${lastMonthAlbums} from last month</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Date Updated</th>
          <th>Album Name</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        ${userAlbums
          .map(
            (album) => `
          <tr>
            <td>${new Date(album.updatedAt).toLocaleDateString()}</td>
            <td>${album.albumName}</td>
            <td>${album.description || "No description"}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;

    const options = {
      margin: [10, 10, 10, 10],
      filename: `album_report_${date.replace(/\//g, "-")}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        letterRendering: true,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
        hotfixes: ["px_scaling"],
      },
    };

    html2pdf().set(options).from(content).save();
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
          <h1 className="text-3xl md:text-3xl font-bold bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-transparent bg-clip-text">
            <span className="block md:inline">Album </span>
            <span className="block md:inline">Management</span>
          </h1>
          <p className="text-gray-200 mt-2">
            Manage your music albums and collections
          </p>
        </motion.div>
      </div>

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
            placeholder="Search Albums..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 w-full"
          />
        </div>

        <div className="flex gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/addalbum">
              <Button gradientDuoTone="purpleToBlue">Create Album</Button>
            </Link>
          </motion.div>
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
        </div>
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
                Total Albums
              </h3>
              <p className="text-3xl font-bold">{totalAlbums}</p>
            </div>
            <HiGift className="bg-red-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="flex flex-col p-6 gap-4 w-full rounded-xl shadow-lg bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] dark:bg-gray-800"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-200 text-lg uppercase font-semibold">
                Last Month Albums
              </h3>
              <p className="text-3xl font-bold">{lastMonthAlbums}</p>
            </div>
            <HiGift className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </motion.div>
      </motion.div>

      {/* Albums Table */}
      <motion.div
        className="w-full overflow-x-auto rounded-lg shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {currentUser.isAdmin && userAlbums.length > 0 ? (
          <>
            <div className="min-w-full">
              <Table hoverable className="w-full">
                <Table.Head className="bg-gray-100 dark:bg-gray-700">
                  <Table.HeadCell className="px-6 py-4 whitespace-nowrap">
                    Date Updated
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4">Image</Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4">
                    Album Name
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4 min-w-[200px]">
                    Description
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4">Delete</Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4">Edit</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y divide-gray-200 dark:divide-gray-700">
                  {userAlbums.map((album) => (
                    <Table.Row
                      className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      key={album._id}
                    >
                      <Table.Cell className="px-6 py-4 whitespace-nowrap">
                        {new Date(album.updatedAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4">
                        {album.image && (
                          <motion.div
                            className="w-16 h-16 flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                          >
                            <img
                              src={album.image}
                              alt="Album cover"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </motion.div>
                        )}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {album.albumName}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 max-w-xs">
                        <p className="line-clamp-2">{album.description}</p>
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4">
                        <motion.button
                          onClick={() => {
                            setShowModal(true);
                            setAlbumIdToDelete(album._id);
                          }}
                          className="text-red-600 hover:text-red-900 dark:hover:text-red-400 font-medium"
                          whileHover={{ scale: 1.1 }}
                        >
                          Delete
                        </motion.button>
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4">
                        <motion.div whileHover={{ scale: 1.1 }}>
                          <Link
                            to={`/update-album/${album._id}`}
                            className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 font-medium"
                          >
                            Edit
                          </Link>
                        </motion.div>
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
                ? "No matching albums found"
                : "You have no albums to show"}
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
                Delete Album
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this album? This action cannot
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
              onClick={handleDeleteAlbum}
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
