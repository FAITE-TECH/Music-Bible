import React, { useState, useEffect } from 'react';
import { Button, Modal, Table } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import html2pdf from 'html2pdf.js';

export default function DashContactUs() {
  const [contactMessages, setContactMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [messageIdToDelete, setMessageIdToDelete] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0); 

  useEffect(() => {
    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/contact/messages?searchTerm=${searchTerm}&page=${currentPage}&limit=10`);
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
        }
    };
    fetchMessages();
}, [searchTerm, currentPage]);


  const handleDeleteMessage = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/contact/delete/${messageIdToDelete}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setContactMessages((prev) => prev.filter((msg) => msg._id !== messageIdToDelete));
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const generatePDFReport = () => {
    const visibleMessages = contactMessages.slice((currentPage - 1) * 10, currentPage * 10); // Limit to current page
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
          ${visibleMessages.map(msg => `
            <tr>
              <td>${new Date(msg.createdAt).toLocaleDateString()}</td>
              <td>${msg.name}</td>
              <td>${msg.email}</td>
              <td>${msg.message}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    html2pdf().from(content).set({ filename: 'contact_report.pdf' }).save();
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3'>
      <div className='flex justify-between mb-4'>
        <input
          type="text"
          placeholder="Search Messages..."
          value={searchTerm}
          onChange={handleSearch}
          className="px-3 py-2 w-150 border border-gray-300 rounded-md text-black"
        />
        <Button gradientDuoTone='purpleToBlue' outline onClick={generatePDFReport}>
          Generate Report
        </Button>
      </div>

      {/* Display Total Messages */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Total Messages: {totalMessages}</h2>
      </div>

      <Table hoverable className="shadow-md mt-4">
        <Table.Head>
          <Table.HeadCell>Date</Table.HeadCell>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Message</Table.HeadCell>
      
        </Table.Head>
        <Table.Body className='divide-y'>
          {contactMessages.length > 0 ? (
            contactMessages.map((msg) => (
              <Table.Row key={msg._id}>
                <Table.Cell>{new Date(msg.createdAt).toLocaleDateString()}</Table.Cell>
                <Table.Cell>{msg.name}</Table.Cell>
                <Table.Cell>{msg.email}</Table.Cell>
                <Table.Cell>{msg.message}</Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={5} className="text-center">
                No contact messages found.
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <Button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
          Next
        </Button>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Confirm Deletion</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className='text-5xl text-red-500' />
            <p>Are you sure you want to delete this message? This action is irreversible.</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDeleteMessage}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
