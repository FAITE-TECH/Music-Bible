import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import html2pdf from 'html2pdf.js';
import { HiCheckCircle, HiXCircle } from "react-icons/hi";

export default function DashMembership() {
  const { currentUser } = useSelector((state) => state.user);
  const [memberships, setMemberships] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [membershipIdToDelete, setMembershipIdToDelete] = useState('');
  const [totalMemberships, setTotalMemberships] = useState(0);
  const [lastMonthMemberships, setLastMonthMemberships] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const res = await fetch(`/api/membership/membership?searchTerm=${searchTerm}&page=${currentPage}&limit=10`);
        const data = await res.json();
        if (res.ok) {
          setMemberships(data.membership);
          setTotalMemberships(data.totalMembership);
          setLastMonthMemberships(data.lastMonthMembership);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchMemberships();
  }, [searchTerm, currentPage]);

  const handleAcceptMembership = async (membershipId) => {
    try {
      const res = await fetch(`/api/membership/accept/${membershipId}`, {
        method: 'PUT',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        // Update memberships state to reflect the change
        setMemberships((prev) =>
          prev.map((membership) =>
            membership._id === membershipId ? { ...membership, status: 'Accepted', isMember: true } : membership
          )
        );
        alert('Email sent to user: Membership accepted');
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  

  const handleRejectMembership = async (membershipId) => {
    try {
      const res = await fetch(`/api/membership/reject/${membershipId}`, {
        method: 'PUT',
      });
      const data = await res.json();
    if (!res.ok) {
      console.log(data.message);
    } else {
      
      setMemberships((prev) =>
        prev.filter((membership) => membership._id !== membershipId)
      );
    }
  }  catch (error) {
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
      </style>
      <h1><b>Membership Details Report</b></h1>
      <p>Total Memberships: ${totalMemberships}</p>
      <p>Last Month Memberships: ${lastMonthMemberships}</p>
      <table>
        <thead>
          <tr>
            <th>Date Joined</th>
            <th>Member Name</th>
            <th>Email</th>
            <th>Country</th>
            <th>Mobile Number</th>
             <th>Subscription Period</th>
            <th>Is Member</th>
            
          </tr>
        </thead>
        <tbody>
          ${memberships.map((membership) => `
            <tr>
              <td>${new Date(membership.updatedAt).toLocaleDateString()}</td>
              <td>${membership.name}</td>
              <td>${membership.email}</td>
              <td>${membership.country}</td>
              <td>${membership.mobile}</td>
              <td>${membership.subscriptionPeriod}</td>
              <td>${membership.isMember}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    html2pdf().from(content).set({ margin: 1, filename: 'membership_report.pdf' }).save();
  };

  const handleGenerateReport = () => {
    generatePDFReport();
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3'>
      <div className='flex justify-between'>
        <input
          type="text"
          placeholder="Search Memberships.."
          value={searchTerm}
          onChange={handleSearch}
          className="px-3 py-2 w-150 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mr-2 h-10 text-black"
        />
        <Button
          gradientDuoTone='purpleToBlue'
          outline
          onClick={handleGenerateReport}
        >
          Generate Report
        </Button>
      </div>

      <div className='flex-wrap flex gap-4 justify-center p-3'>
        <div className='flex flex-col p-3 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <h3 className='text-gray-500 text-md uppercase'>Total Memberships</h3>
          <p className='text-2xl'>{totalMemberships}</p>
        </div>
        <div className='flex flex-col p-3 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <h3 className='text-gray-500 text-md uppercase'>Last Month Memberships</h3>
          <p className='text-2xl'>{lastMonthMemberships}</p>
        </div>
      </div>

      {currentUser.isAdmin && memberships.length > 0 ? (
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Date Joined</Table.HeadCell>
            <Table.HeadCell>Member Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Country</Table.HeadCell>
            <Table.HeadCell>Mobile Number</Table.HeadCell>
            <Table.HeadCell>Subscription Period</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell> 
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className='divide-y'>
            {memberships.map((membership) => (
              <Table.Row className='bg-white' key={membership._id}>
                <Table.Cell>{new Date(membership.updatedAt).toLocaleDateString()}</Table.Cell>
                <Table.Cell>{membership.name}</Table.Cell>
                <Table.Cell>{membership.email}</Table.Cell>
                <Table.Cell>{membership.country}</Table.Cell>
                <Table.Cell>{membership.mobile}</Table.Cell>
                <Table.Cell>{membership.subscriptionPeriod}</Table.Cell>
                <Table.Cell>
                {/* Render tick or cross based on membership status */}
                {membership.isMember ? (
                    <HiCheckCircle className="text-green-500" />
                ) : membership.status === 'Rejected' ? (
                    <HiXCircle className="text-red-500" />
                ) : (
                    <span>Pending</span>
                )}
                </Table.Cell>
                <Table.Cell>
                <div className="flex space-x-2">
                    <Button
                    color="green"
                    onClick={() => handleAcceptMembership(membership._id)}
                    disabled={membership.isMember} 
                    >
                    Accept
                    </Button>
                    <Button 
                    color="red" 
                    onClick={() => handleRejectMembership(membership._id)} 
                    disabled={membership.status === 'Rejected'} 
                    >
                    Reject
                    </Button>
                </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <p>You have no memberships to show</p>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Are you sure?</Modal.Header>
        <Modal.Body>
          <div className="text-center flex flex-col items-center justify-center gap-4">
            <HiOutlineExclamationCircle className='text-5xl text-red-500' />
            <p>Do you really want to delete this membership? This action cannot be undone.</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button color="red">
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
