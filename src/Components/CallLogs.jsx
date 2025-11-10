// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import BackButton from "../section/Backbutton";

// const CallLogs = () => {
//   const [callLogs, setCallLogs] = useState([]);
//   const [filteredLogs, setFilteredLogs] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filter, setFilter] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const logsPerPage = 10;

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

//   const fetchCallLogs = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`${BACKEND_URL}/get-call-logs`);
//       if (!response.ok) throw new Error("Failed to fetch call logs");

//       const data = await response.json();

//       // ✅ Use fallback: createdAt || startedAt
//       const withDetails = data.map((log) => ({
//         ...log,
//         createdAt: log.createdAt || log.startedAt,
//       }));

//       setCallLogs(withDetails);
//       setFilteredLogs(withDetails);
//     } catch (err) {
//       setError(err.message || "Something went wrong while fetching call logs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCallLogs();
//   }, []);

//   useEffect(() => {
//     applyFilters();
//   }, [searchTerm, filter, callLogs]);

//   const applyFilters = () => {
//     let logs = [...callLogs];

//     if (searchTerm.trim() !== "") {
//       const term = searchTerm.toLowerCase();
//       logs = logs.filter(
//         (log) =>
//           String(log.id).toLowerCase().includes(term) ||
//           (log.type && log.type.toLowerCase().includes(term))
//       );
//     }

//     const today = new Date();
//     logs = logs.filter((log) => {
//       const date = new Date(log.createdAt || log.startedAt);
//       if (filter === "today") {
//         return date.toDateString() === today.toDateString();
//       } else if (filter === "yesterday") {
//         const yesterday = new Date(today);
//         yesterday.setDate(today.getDate() - 1);
//         return date.toDateString() === yesterday.toDateString();
//       } else if (filter === "week") {
//         const weekAgo = new Date(today);
//         weekAgo.setDate(today.getDate() - 7);
//         return date >= weekAgo;
//       } else if (filter === "month") {
//         return (
//           date.getMonth() === today.getMonth() &&
//           date.getFullYear() === today.getFullYear()
//         );
//       }
//       return true;
//     });

//     setFilteredLogs(logs);
//     setCurrentPage(1);
//   };

//   const formatDate = (date) =>
//     date ? new Date(date).toLocaleString() : "N/A";

//   const totalPages =
//     filteredLogs.length > 0
//       ? Math.ceil(filteredLogs.length / logsPerPage)
//       : 1;

//   const startIndex = (currentPage - 1) * logsPerPage;
//   const currentLogs = filteredLogs.slice(
//     startIndex,
//     startIndex + logsPerPage
//   );

//   const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
//   const handleNext = () =>
//     setCurrentPage((prev) => Math.min(prev + 1, totalPages));

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <BackButton />
//       <h2 className="text-3xl font-semibold mb-4">Call Logs</h2>

//       {error && <p className="text-red-600">{error}</p>}

//       <div className="mb-4 flex flex-wrap gap-4 items-center">
//         <input
//           type="text"
//           placeholder="Search by Call ID or Type..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border border-gray-300 px-3 py-2 rounded w-full md:w-1/3"
//         />

//         <select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           className="border border-gray-300 px-3 py-2 rounded"
//         >
//           <option value="all">All Dates</option>
//           <option value="today">Today</option>
//           <option value="yesterday">Yesterday</option>
//           <option value="week">This Week</option>
//           <option value="month">This Month</option>
//         </select>
//       </div>

//       {loading ? (
//         <p>Loading...</p>
//       ) : filteredLogs.length === 0 ? (
//         <p className="text-gray-600">No call logs found.</p>
//       ) : (
//         <>
//           <div className="overflow-x-auto bg-white shadow rounded-lg">
//             <table className="min-w-full table-auto">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-4 py-2 text-left">Call ID</th>
//                   <th className="px-4 py-2">Type</th>
//                   <th className="px-4 py-2">Created At</th>
//                   <th className="px-4 py-2">Ended At</th>
//                   <th className="px-4 py-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentLogs.map((log) => (
//                   <tr key={log.id} className="border-b hover:bg-gray-50">
//                     <td className="px-4 py-2 text-sm">{log.id}</td>
//                     <td className="px-4 py-2 text-sm">{log.type || "N/A"}</td>
//                     <td className="px-4 py-2 text-sm">
//                       {formatDate(log.createdAt)}
//                     </td>
//                     <td className="px-4 py-2 text-sm">
//                       {log.endedAt ? (
//                         formatDate(log.endedAt)
//                       ) : (
//                         <span className="px-2 py-1 border border-yellow-400 text-yellow-600 rounded">
//                           Customer didn’t pick the call
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-4 py-2 text-sm">
//                       <Link
//                         to={`/call-details/${log.id}`}
//                         className="text-blue-600 hover:underline"
//                       >
//                         View Details
//                       </Link>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="mt-4 flex justify-between items-center">
//             <button
//               onClick={handlePrev}
//               disabled={currentPage === 1}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
//             >
//               Prev
//             </button>
//             <span className="text-gray-600">
//               Page {currentPage} of {totalPages}
//             </span>
//             <button
//               onClick={handleNext}
//               disabled={currentPage === totalPages}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default CallLogs;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import BackButton from "../section/Backbutton";

const CallLogs = () => {
  const [callLogs, setCallLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchCallLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/get-call-logs`);
      if (!response.ok) throw new Error("Failed to fetch call logs");

      const data = await response.json();

      // ✅ Use fallback: createdAt || startedAt
      const withDetails = data.map((log) => ({
        ...log,
        createdAt: log.createdAt || log.startedAt,
      }));

      setCallLogs(withDetails);
      setFilteredLogs(withDetails);
    } catch (err) {
      setError(err.message || "Something went wrong while fetching call logs");
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

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      logs = logs.filter(
        (log) =>
          String(log.id).toLowerCase().includes(term) ||
          (log.type && log.type.toLowerCase().includes(term))
      );
    }

    const today = new Date();
    logs = logs.filter((log) => {
      const date = new Date(log.createdAt || log.startedAt);
      if (filter === "today") {
        return date.toDateString() === today.toDateString();
      } else if (filter === "yesterday") {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return date.toDateString() === yesterday.toDateString();
      } else if (filter === "week") {
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        return date >= weekAgo;
      } else if (filter === "month") {
        return (
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        );
      }
      return true;
    });

    setFilteredLogs(logs);
    setCurrentPage(1);
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleString() : "N/A";

  const totalPages =
    filteredLogs.length > 0
      ? Math.ceil(filteredLogs.length / logsPerPage)
      : 1;

  const startIndex = (currentPage - 1) * logsPerPage;
  const currentLogs = filteredLogs.slice(
    startIndex,
    startIndex + logsPerPage
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Download Excel - ONE FILE, ONE SHEET, ALL CALLS AS ROWS
  const downloadBulkExcel = async () => {
    if (currentLogs.length === 0) {
      alert("No calls to download");
      return;
    }

    setDownloading(true);

    try {
      // Fetch details for all calls on current page
      const callDetailsPromises = currentLogs.map(async (log) => {
        try {
          const response = await fetch(`${BACKEND_URL}/call/${log.id}`);
          if (!response.ok) throw new Error(`Failed to fetch details for call ${log.id}`);
          const data = await response.json();
          return { callId: log.id, callType: log.type, createdAt: log.createdAt, details: data };
        } catch (error) {
          console.error(`Error fetching call ${log.id}:`, error);
          return { callId: log.id, callType: log.type, createdAt: log.createdAt, details: null };
        }
      });

      const allCallDetails = await Promise.all(callDetailsPromises);

      // Collect all unique fields across all calls
      const allFields = new Set();
      allCallDetails.forEach(({ details }) => {
        if (details?.structuredOutputs) {
          Object.keys(details.structuredOutputs).forEach(field => allFields.add(field));
        }
      });

      if (allFields.size === 0) {
        alert("No structured outputs found for the calls on this page");
        setDownloading(false);
        return;
      }

      // Create array of data rows - each call is a row
      const excelData = allCallDetails.map(({ callId, callType, createdAt, details }) => {
        const row = {
          // 'Call ID': callId,
          // 'Call Type': callType || 'N/A',
          'Created At': formatDate(createdAt),
        };

        // Add all structured output fields
        if (details?.structuredOutputs) {
          allFields.forEach(field => {
            const value = details.structuredOutputs[field];
            row[field] = value !== null && value !== undefined ? String(value) : 'N/A';
          });
        } else {
          // If no structured outputs, fill with N/A
          allFields.forEach(field => {
            row[field] = 'N/A';
          });
        }

        return row;
      });

      // Create workbook and worksheet (ONE SHEET)
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Call Details");

      // Set column widths
      const columnCount = Object.keys(excelData[0]).length;
      worksheet['!cols'] = Array(columnCount).fill({ wch: 20 });

      // Generate filename
      const filename = `call_logs_page_${currentPage}_${new Date().toISOString().split('T')[0]}.xlsx`;

      // Download the file
      XLSX.writeFile(workbook, filename);
      alert(`Successfully downloaded ${allCallDetails.length} call(s) structured outputs!`);
    } catch (error) {
      console.error("Error downloading Excel:", error);
      alert("Failed to download Excel file");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <BackButton />
      <h2 className="text-3xl font-semibold mb-4">Call Logs</h2>

      {error && <p className="text-red-600">{error}</p>}

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

        {/* Download Excel Button */}
        <button
          onClick={downloadBulkExcel}
          disabled={downloading || loading || currentLogs.length === 0}
          className="ml-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200 ease-in-out flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {downloading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Downloading...
            </>
          ) : (
            <>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
              Download Page ({currentLogs.length} calls)
            </>
          )}
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredLogs.length === 0 ? (
        <p className="text-gray-600">No call logs found.</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Call ID</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Created At</th>
                  <th className="px-4 py-2">Ended At</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm">{log.id}</td>
                    <td className="px-4 py-2 text-sm">{log.type || "N/A"}</td>
                    <td className="px-4 py-2 text-sm">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {log.endedAt ? (
                        formatDate(log.endedAt)
                      ) : (
                        <span className="px-2 py-1 border border-yellow-400 text-yellow-600 rounded">
                          Customer didn't pick the call
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <Link
                        to={`/call-details/${log.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
 