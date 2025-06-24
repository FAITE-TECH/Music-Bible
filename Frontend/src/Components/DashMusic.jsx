import { Button, Modal, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiGift, HiOutlineExclamationCircle, HiSearch } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { motion } from "framer-motion";

export default function DashMusic() {
  const { currentUser } = useSelector((state) => state.user);
  const [userMusic, setUserMusic] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [musicIdToDelete, setMusicIdToDelete] = useState("");
  const [totalMusic, setTotalMusic] = useState(0);
  const [lastMonthMusic, setLastMonthMusic] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchMusic = async () => {
      try {

        const res = await fetch(
          `/api/music/music?searchTerm=${searchTerm}&page=${currentPage}&limit=10`
        );

        const data = await res.json();
        if (res.ok) {
          setUserMusic(data.music);
          setTotalMusic(data.totalMusic);
          setLastMonthMusic(data.lastMonthMusic);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchMusic();
  }, [searchTerm, currentPage]);

  const handleDeleteMusic = async () => {
    setShowModal(false);
    try {

      const res = await fetch(
        `/api/music/delete/${musicIdToDelete}/${currentUser._id}`,
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
        setUserMusic((prev) =>
          prev.filter((music) => music._id !== musicIdToDelete)
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
        img {
          max-width: 50px;
          height: auto;
        }
      </style>
      <h1><b>Music Details Report</b></h1>
      <p>Total Music: ${totalMusic}</p>
      <p>Last Month Music: ${lastMonthMusic}</p>
      <br>
      <br>
      <table>
        <thead>
          <tr>
            <th>Date Updated</th>
            <th>Image</th>
            <th>Music Title</th>
            <th>Category</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${userMusic
            .map(
              (music) => `
            <tr>
              <td>${new Date(music.updatedAt).toLocaleDateString()}</td>
              <td><img src="${music.image}" alt="Music Image"/></td>
              <td>${music.title}</td>
              <td>${music.category}</td>
              <td>${music.description}</td>
              <td>
                <a href="${music.music}" target="_blank">Listen</a>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>  
    `;

    html2pdf()
      .from(content)
      .set({ margin: 1, filename: "music_report.pdf" })
      .save();
  };

  const handleGenerateReport = () => {
    generatePDFReport();
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
        <h1 className="text-3xl md:text-3xl font-bold bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0]  text-transparent bg-clip-text">
          Music Library
        </h1>
        <p className="text-gray-200 mt-2">
          Manage your music collection and uploads
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
            placeholder="Search Music..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 w-full"
          />
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
                Total Music
              </h3>
              <p className="text-3xl font-bold">{totalMusic}</p>
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
                Last Month Music
              </h3>
              <p className="text-3xl font-bold">{lastMonthMusic}</p>
            </div>
            <HiGift className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </motion.div>
      </motion.div>

      {/* Music Table */}
      <motion.div
        className="w-full overflow-x-auto rounded-lg shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {currentUser.isAdmin && userMusic.length > 0 ? (
          <>
            <div className="min-w-full">
              <Table hoverable className="w-full">
                <Table.Head className="bg-gray-100 dark:bg-gray-700">
                  <Table.HeadCell className="px-6 py-4 whitespace-nowrap">
                    Date Updated
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4">Image</Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4">Title</Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4">
                    Category
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4 min-w-[200px]">
                    Description
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4">Listen</Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4">Delete</Table.HeadCell>
                  <Table.HeadCell className="px-6 py-4">Edit</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y divide-gray-200 dark:divide-gray-700">
                  {userMusic.map((music) => (
                    <Table.Row
                      className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      key={music._id}
                    >
                      <Table.Cell className="px-6 py-4 whitespace-nowrap">
                        {new Date(music.updatedAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4">
                        {music.image && (
                          <motion.div
                            className="w-16 h-16 flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                          >
                            <img
                              src={music.image}
                              alt="Music cover"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </motion.div>
                        )}
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        <a
                          href={music.music}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {music.title}
                        </a>
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4">
                        <span className="px-2 py-1 text-blue-800 text-xs font-medium rounded dark:bg-blue-900 dark:text-blue-300">
                          {music.category}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4 max-w-xs">
                        <p className="line-clamp-2">{music.description}</p>
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4">
                        <motion.a
                          href={music.music}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                          whileHover={{ scale: 1.05 }}
                        >
                          Listen
                        </motion.a>
                      </Table.Cell>
                      <Table.Cell className="px-6 py-4">
                        <motion.button
                          onClick={() => {
                            setShowModal(true);
                            setMusicIdToDelete(music._id);
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
                            to={`/update-music/${music._id}`}
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
                ? "No matching music found"
                : "You have no music to show"}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Pagination */}
      <motion.div
        className="flex justify-between items-center px-6 py-4  dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
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
                Delete Music
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this music? This action cannot
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
              onClick={handleDeleteMusic}
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
