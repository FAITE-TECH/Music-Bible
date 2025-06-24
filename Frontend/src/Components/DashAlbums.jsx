import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import html2pdf from 'html2pdf.js';

export default function DashAlbum() {
  const { currentUser } = useSelector((state) => state.user);
  const [userAlbums, setUserAlbums] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [albumIdToDelete, setAlbumIdToDelete] = useState('');
  const [totalAlbums, setTotalAlbums] = useState(0);
  const [lastMonthAlbums, setLastMonthAlbums] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await fetch(`/api/category/getAlbums?searchTerm=${searchTerm}&page=${currentPage}&limit=10`);
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
      const res = await fetch(`/api/category/delete/${albumIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
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
          max-width: 100px;
          height: auto;
        }
      </style>
      <h1><b>Album Details Report</b></h1>
      <p>Total Albums: ${totalAlbums}</p>
      <p>Last Month Albums: ${lastMonthAlbums}</p>
      <br>
      <br>
      <table>
        <thead>
          <tr>
            <th>Date Updated</th>
            <th>Image</th>
            <th>Album Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          ${userAlbums.map((album) => `
            <tr>
              <td>${new Date(album.updatedAt).toLocaleDateString()}</td>
              <td><img src="${album.image}" alt="Album Image"/></td>
              <td>${album.albumName}</td>
              <td>${album.description}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>  
    `;

    html2pdf().from(content).set({ margin: 1, filename: 'album_report.pdf' }).save();
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      <div className='flex justify-between items-center mb-4'>
        <input
          type="text"
          placeholder="Search Albums.."
          value={searchTerm}
          onChange={handleSearch}
          className="px-3 py-2 w-150 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mr-2 h-10 dark:bg-slate-800 placeholder-gray-500"
        />
        <div className="flex gap-2">
          <Link to="/addalbum">
            <Button gradientDuoTone="purpleToBlue">Create Album</Button>
          </Link>
          <Button
            gradientDuoTone='purpleToBlue'
            outline
            onClick={generatePDFReport}
          >
            Generate Report
          </Button>
        </div>
      </div>

      <div className='flex-wrap flex gap-4 justify-center p-3'>
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Total Albums</h3>
              <p className='text-2xl'>{totalAlbums}</p>
            </div>
          </div>
        </div>
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>
                Last Month Albums
              </h3>
              <p className='text-2xl'>{lastMonthAlbums}</p>
            </div>
          </div>
        </div>
      </div>
      {currentUser.isAdmin && userAlbums.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Album Name</Table.HeadCell>
              <Table.HeadCell>Description</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {userAlbums.map((album) => (
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800' key={album._id}>
                  <Table.Cell>{new Date(album.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <img src={album.image} alt="Album" className="w-16 h-16 object-cover" />
                  </Table.Cell>
                  <Table.Cell>{album.albumName}</Table.Cell>
                  <Table.Cell>{album.description}</Table.Cell>
                  <Table.Cell>
                    <span className='font-medium text-red-500 hover:underline cursor-pointer'
                      onClick={() => {
                        setShowModal(true);
                        setAlbumIdToDelete(album._id);
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/update-album/${album._id}`}
                      className='font-medium text-blue-500 hover:underline'
                    >
                      Edit
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <div className="flex justify-between items-center mt-4">
            <Button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>
            <span>Page {currentPage} of {totalPages}</span>
            <Button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <p>You have no albums to show</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Are you sure?</Modal.Header>
        <Modal.Body>
          <div className="text-center flex flex-col items-center justify-center gap-4">
            <HiOutlineExclamationCircle className='text-5xl text-red-500' />
            <p>Do you really want to delete this album? This action cannot be undone.</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDeleteAlbum}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}