//  // src/Components/CallLogs.jsx
//  import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

// const CallLogs = () => {
//   const [callLogs, setCallLogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchCallLogs = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch("https://api.vapi.ai/call", {
//         method: "GET",
//         headers: {
//           Authorization: "Bearer e4efd92f-c138-4948-a94c-09ebeeb13749",
//         },
//       });
//       if (!response.ok) throw new Error("Failed to fetch call logs");

//       const data = await response.json();
//       setCallLogs(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCallLogs();
//   }, []);

//   const formatDate = (date) => new Date(date).toLocaleString();

//   const badgeClass = (status) => {
//     if (status === "true") return "bg-green-200 text-green-700";
//     if (status === "false") return "bg-red-200 text-red-700";
//     return "bg-gray-200 text-gray-700";
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <h2 className="text-3xl font-semibold mb-4">Call Logs</h2>
//       {error && <p className="text-red-600">{error}</p>}
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <div className="overflow-x-auto bg-white shadow rounded-lg">
//           <table className="min-w-full table-auto">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-4 py-2 text-left">Call ID</th>
//                 <th className="px-4 py-2">Type</th>
//                 <th className="px-4 py-2">Started At</th>
//                 <th className="px-4 py-2">Ended At</th>
//                 <th className="px-4 py-2">Status</th>
//                 <th className="px-4 py-2">Success</th>
//                 <th className="px-4 py-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {callLogs.map((log) => (
//                 <tr
//                   key={log.id}
//                   className="border-b hover:bg-gray-50"
//                 >
//                   <td className="px-4 py-2 text-sm">{log.id}</td>
//                   <td className="px-4 py-2 text-sm">{log.type}</td>
//                   <td className="px-4 py-2 text-sm">{formatDate(log.startedAt)}</td>
//                   <td className="px-4 py-2 text-sm">{formatDate(log.endedAt)}</td>
//                   <td className="px-4 py-2 text-sm capitalize">
//                     <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
//                       {log.endedReason ? log.endedReason.replace(/-/g, " ") : "N/A"}
//                     </span>
//                   </td>
//                   <td className="px-4 py-2 text-sm">
//                     <span className={`px-2 py-1 rounded ${badgeClass(log.analysis?.successEvaluation)}`}>
//                       {log.analysis?.successEvaluation === "true"
//                         ? "Pass"
//                         : log.analysis?.successEvaluation === "false"
//                         ? "Fail"
//                         : "N/A"}
//                     </span>
//                   </td>
//                   <td className="px-4 py-2 text-sm space-x-2">
//                     <Link
//                       to={`/call-details/${log.id}`}
//                       className="text-blue-600 hover:underline"
//                     >
//                       View Details
//                     </Link>
//                     {log.recordingUrl ? (
//                       <a
//                         href={log.recordingUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-green-600 hover:underline"
//                       >
//                         Play Recording
//                       </a>
//                     ) : (
//                       <span className="text-gray-500">No Recording</span>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CallLogs;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../section/Backbutton';

const CallLogs = () => {
  const [callLogs, setCallLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCallLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://api.vapi.ai/call", {
        method: "GET",
        headers: {
          Authorization: "Bearer 0f0a5b82-c9d4-4db5-8c9f-075c0f155897",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch call logs");

      const data = await response.json();
      setCallLogs(data);
      setFilteredLogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCallLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filter, callLogs]);

  const applyFilters = () => {
    let logs = [...callLogs];

    // Filter by search term
    if (searchTerm.trim() !== "") {
      logs = logs.filter(
        (log) =>
          log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date
    const today = new Date();
    logs = logs.filter((log) => {
      const date = new Date(log.startedAt);
      if (filter === "today") {
        return (
          date.toDateString() === today.toDateString()
        );
      } else if (filter === "yesterday") {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return date.toDateString() === yesterday.toDateString();
      } else if (filter === "week") {
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        return date >= weekAgo;
      } else if (filter === "month") {
        return date.getMonth() === today.getMonth();
      }
      return true; // "all"
    });

    setFilteredLogs(logs);
    setCurrentPage(1); 
  };

  const formatDate = (date) => new Date(date).toLocaleString();

  const badgeClass = (status) => {
    if (status === "true") return "bg-green-200 text-green-700";
    if (status === "false") return "bg-red-200 text-red-700";
    return "bg-gray-200 text-gray-700";
  };

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const startIndex = (currentPage - 1) * logsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, startIndex + logsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <BackButton />
      <h2 className="text-3xl font-semibold mb-4">Call Logs</h2>

      {error && <p className="text-red-600">{error}</p>}

      {/* Search and Filters */}
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search by Call ID or Type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded w-full md:w-1/3"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded"
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Call ID</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Started At</th>
                  <th className="px-4 py-2">Ended At</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Success</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm">{log.id}</td>
                    <td className="px-4 py-2 text-sm">{log.type}</td>
                    <td className="px-4 py-2 text-sm">{formatDate(log.startedAt)}</td>
                    <td className="px-4 py-2 text-sm">{formatDate(log.endedAt)}</td>
                    <td className="px-4 py-2 text-sm capitalize">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {log.endedReason ? log.endedReason.replace(/-/g, " ") : "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`px-2 py-1 rounded ${badgeClass(log.analysis?.successEvaluation)}`}>
                        {log.analysis?.successEvaluation === "true"
                          ? "Pass"
                          : log.analysis?.successEvaluation === "false"
                          ? "Fail"
                          : "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm space-x-2">
                      <Link
                        to={`/call-details/${log.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View Details
                      </Link>
                      {log.recordingUrl ? (
                        <a
                          href={log.recordingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline"
                        >
                          Play Recording
                        </a>
                      ) : (
                        <span className="text-gray-500">No Recording</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CallLogs;
