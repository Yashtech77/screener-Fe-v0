// import React from 'react'

// const ManageAssist = () => {
//   return (
//     <div>ManageAssist</div>
//   )
// }

// export default ManageAssist

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ITEMS_PER_PAGE = 5;

const AssistantManager = () => {
  const [assistants, setAssistants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch assistants
  const fetchAssistants = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/list-assistants');
      setAssistants(response.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load assistants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssistants();
  }, []);

  // Delete assistant
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assistant?')) return;

    try {
      await axios.delete(`http://localhost:5000/delete-assistant/${id}`);
      toast.success('Assistant deleted');
      fetchAssistants(); // Refresh list
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete assistant');
    }
  };

  const totalPages = Math.ceil(assistants.length / ITEMS_PER_PAGE);
  const currentAssistants = assistants.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-bold text-purple-700 mb-4">Manage Assistants</h1>

        {loading ? (
          <div className="text-center py-10 text-purple-600 font-semibold">Loading assistants...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500 font-semibold">{error}</div>
        ) : assistants.length === 0 ? (
          <div className="text-center py-10 text-gray-500 font-medium">No assistants found.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm text-left">
                <thead className="bg-purple-100 text-purple-800 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4 border-b">Name</th>
                    <th className="py-3 px-4 border-b">ID</th>
                    <th className="py-3 px-4 border-b text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAssistants.map((assistant) => (
                    <tr key={assistant.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{assistant.name || 'Unnamed'}</td>
                      <td className="py-2 px-4 border-b">{assistant.id}</td>
                      <td className="py-2 px-4 border-b text-right">
                        <button
                          onClick={() => handleDelete(assistant.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <p className="text-gray-600 text-sm">
                Page {currentPage} of {totalPages}
              </p>
              <div className="space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-purple-500 text-white rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-purple-500 text-white rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AssistantManager;
