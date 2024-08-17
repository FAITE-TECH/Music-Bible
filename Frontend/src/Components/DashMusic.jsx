import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiGift, HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import html2pdf from 'html2pdf.js';

export default function DashMusic() {
  const { currentUser } = useSelector((state) => state.user);
  const [userMusic, setUserMusic] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [musicIdToDelete, setMusicIdToDelete] = useState('');
  const [totalMusic, setTotalMusic] = useState(0);
  const [lastMonthMusic, setLastMonthMusic] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Added pagination state
  const [totalPages, setTotalPages] = useState(0); // Added pagination state

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const res = await fetch(`/api/music/music?searchTerm=${searchTerm}&page=${currentPage}&limit=10`);
        const data = await res.json();
        console.log(data);
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
    setShowModel(false);
    try {
      const res = await fetch(`/api/music/delete/${musicIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
      });
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
          font-size: 14px; /* Adjust font size */
        }
        td {
          font-size: 12px; /* Adjust font size */
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
            <th>Music Title</th>
            <th>Category</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${userMusic.map((music) => `
            <tr>
              <td>${new Date(music.updatedAt).toLocaleDateString()}</td>
              <td>${music.title}</td>
              <td>${music.category}</td>
              <td>${music.description}</td>
              <td>
                <a href="${music.music}" target="_blank">Listen</a>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    html2pdf().from(content).set({ margin: 1, filename: 'music_report.pdf' }).save();
  };

  const handleGenerateReport = () => {
    generatePDFReport();
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      <div className='flex justify-between'>
        <input
          type="text"
          placeholder="Search Music.."
          value={searchTerm}
          onChange={handleSearch}
          className="px-3 py-2 w-150 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mr-2 h-10 dark:bg-slate-800 placeholder-gray-500"
        />
        <div></div>
        <Button
          gradientDuoTone='purpleToBlue'
          outline
          onClick={handleGenerateReport}
          className=""
        >
          Generate Report
        </Button>
      </div>

      <div className='flex-wrap flex gap-4 justify-center p-3'>
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
            
              <h3 className='text-gray-500 text-md uppercase'>Total Music</h3>
              <p className='text-2xl'>{totalMusic}</p>
              
            </div>
            <HiGift className='bg-red-600 text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
        </div>
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>
                Last Month Music
              </h3>
              <p className='text-2xl'>{lastMonthMusic}</p>
            </div>
            <HiGift className='bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
        </div>
      </div>
      {currentUser.isAdmin && userMusic.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Music Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Description</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {userMusic.map((music) => (
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800' key={music._id}>
                  <Table.Cell>{new Date(music.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link className='font-medium text-gray-900 dark:text-white' to={`/music/${music.slug}`}>
                      {music.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{music.category}</Table.Cell>
                  <Table.Cell>{music.description}</Table.Cell>
                  <Table.Cell>
                    <a href={music.music} target="_blank" className='text-teal-500 hover:underline'>
                      Listen
                    </a>
                  </Table.Cell>
                  <Table.Cell>
                    <span className='font-medium text-red-500 hover:underline cursor-pointer'
                      onClick={() => {
                        setShowModel(true);
                        setMusicIdToDelete(music._id);
                      }}
                    >
                      Delete
                    </span>
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
        <p>You have no music to show</p>
      )}
      <Modal show={showModel} onClose={() => setShowModel(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-200">Are you sure you want to Delete this Music</h3>
          </div>
          <div className='flex justify-center gap-4'>
            <Button color='failure' onClick={handleDeleteMusic}>
              Yes, I am sure
            </Button>
            <Button color='gray' onClick={() => setShowModel(false)}>
              No, cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
