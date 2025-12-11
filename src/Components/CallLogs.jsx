
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import * as XLSX from "xlsx";
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
//   const [downloading, setDownloading] = useState(false);

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

//   // Download Excel - ONE FILE, ONE SHEET, ALL CALLS AS ROWS
//   const downloadBulkExcel = async () => {
//     if (currentLogs.length === 0) {
//       alert("No calls to download");
//       return;
//     }

//     setDownloading(true);

//     try {
//       // Fetch details for all calls on current page
//       const callDetailsPromises = currentLogs.map(async (log) => {
//         try {
//           const response = await fetch(`${BACKEND_URL}/call/${log.id}`);
//           if (!response.ok) throw new Error(`Failed to fetch details for call ${log.id}`);
//           const data = await response.json();
//           return { callId: log.id, callType: log.type, createdAt: log.createdAt, details: data };
//         } catch (error) {
//           console.error(`Error fetching call ${log.id}:`, error);
//           return { callId: log.id, callType: log.type, createdAt: log.createdAt, details: null };
//         }
//       });

//       const allCallDetails = await Promise.all(callDetailsPromises);

//       // Collect all unique fields across all calls
//       const allFields = new Set();
//       allCallDetails.forEach(({ details }) => {
//         if (details?.structuredOutputs) {
//           Object.keys(details.structuredOutputs).forEach(field => allFields.add(field));
//         }
//       });

//       if (allFields.size === 0) {
//         alert("No structured outputs found for the calls on this page");
//         setDownloading(false);
//         return;
//       }

//       // Create array of data rows - each call is a row
//       const excelData = allCallDetails.map(({ callId, callType, createdAt, details }) => {
//         const row = {
//           // 'Call ID': callId,
//           // 'Call Type': callType || 'N/A',
//           'Created At': formatDate(createdAt),
//         };

//         // Add all structured output fields
//         if (details?.structuredOutputs) {
//           allFields.forEach(field => {
//             const value = details.structuredOutputs[field];
//             row[field] = value !== null && value !== undefined ? String(value) : 'N/A';
//           });
//         } else {
//           // If no structured outputs, fill with N/A
//           allFields.forEach(field => {
//             row[field] = 'N/A';
//           });
//         }

//         return row;
//       });

//       // Create workbook and worksheet (ONE SHEET)
//       const worksheet = XLSX.utils.json_to_sheet(excelData);
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Call Details");

//       // Set column widths
//       const columnCount = Object.keys(excelData[0]).length;
//       worksheet['!cols'] = Array(columnCount).fill({ wch: 20 });

//       // Generate filename
//       const filename = `call_logs_page_${currentPage}_${new Date().toISOString().split('T')[0]}.xlsx`;

//       // Download the file
//       XLSX.writeFile(workbook, filename);
//       // alert(`Successfully downloaded ${allCallDetails.length} call(s) structured outputs!`);
//     } catch (error) {
//       console.error("Error downloading Excel:", error);
//       alert("Failed to download Excel file");
//     } finally {
//       setDownloading(false);
//     }
//   };

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

//         {/* Download Excel Button */}
//         <button
//           onClick={downloadBulkExcel}
//           disabled={downloading || loading || currentLogs.length === 0}
//           className="ml-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200 ease-in-out flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {downloading ? (
//             <>
//               <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               Downloading...
//             </>
//           ) : (
//             <>
//               <svg 
//                 xmlns="http://www.w3.org/2000/svg" 
//                 className="h-5 w-5" 
//                 viewBox="0 0 20 20" 
//                 fill="currentColor"
//               >
//                 <path 
//                   fillRule="evenodd" 
//                   d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" 
//                   clipRule="evenodd" 
//                 />
//               </svg>
//               Download Page ({currentLogs.length} calls)
//             </>
//           )}
//         </button>
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
//                           Customer didn't pick the call
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

  const downloadBulkExcel = async () => {
    if (currentLogs.length === 0) {
      alert("No calls to download");
      return;
    }

    setDownloading(true);

    try {
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

      const excelData = allCallDetails.map(({ callId, callType, createdAt, details }) => {
        const row = {
          'Created At': formatDate(createdAt),
        };

        if (details?.structuredOutputs) {
          allFields.forEach(field => {
            const value = details.structuredOutputs[field];
            row[field] = value !== null && value !== undefined ? String(value) : 'N/A';
          });
        } else {
          allFields.forEach(field => {
            row[field] = 'N/A';
          });
        }

        return row;
      });

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Call Details");

      const columnCount = Object.keys(excelData[0]).length;
      worksheet['!cols'] = Array(columnCount).fill({ wch: 20 });

      const filename = `call_logs_page_${currentPage}_${new Date().toISOString().split('T')[0]}.xlsx`;

      XLSX.writeFile(workbook, filename);
    } catch (error) {
      console.error("Error downloading Excel:", error);
      alert("Failed to download Excel file");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-black relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/30 via-black to-blue-950/30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.15),transparent_50%)]"></div>
      
      {/* Subtle dot pattern */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>

      {/* Content */}
      <div className="relative z-10">
        <BackButton />
        
        <div className="container mx-auto px-4 py-16 pt-24">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Call Logs
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mt-1">
                Track Your Communications
              </span>
            </h1>
            <p className="text-gray-400 text-base max-w-2xl mx-auto">
              View, filter, and download detailed call records
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="max-w-7xl mx-auto mb-6">
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Filters Card */}
          <div className="max-w-7xl mx-auto mb-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
                {/* Search Input */}
                <div className="flex-1 relative group">
                  <input
                    type="text"
                    placeholder="Search by Call ID or Type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 bg-black/40 border border-cyan-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all group-hover:border-cyan-500/50"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Date Filter */}
                <div className="relative">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full lg:w-auto px-4 py-3 bg-black/40 border border-blue-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer pr-10"
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={downloadBulkExcel}
                  disabled={downloading || loading || currentLogs.length === 0}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-green-500/50 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative z-10 flex items-center gap-2">
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
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="hidden sm:inline">Download Page</span>
                        <span className="sm:hidden">Download</span>
                        <span className="hidden sm:inline">({currentLogs.length})</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12">
                <div className="flex flex-col items-center justify-center gap-4">
                  <svg className="animate-spin h-12 w-12 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gray-400">Loading call logs...</p>
                </div>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-lg">No call logs found</p>
                  <p className="text-gray-500 text-sm">Try adjusting your filters or make some calls</p>
                </div>
              </div>
            ) : (
              <>
                {/* Table */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Call ID</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Type</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Created At</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Ended At</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {currentLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-400 font-mono">{log.id}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-medium">
                                {log.type || "N/A"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-400">
                              {formatDate(log.createdAt)}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              {log.endedAt ? (
                                <span className="text-gray-400">{formatDate(log.endedAt)}</span>
                              ) : (
                                <span className="px-3 py-1 rounded-lg bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 text-xs">
                                  Not answered
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <Link
                                to={`/call-details/${log.id}`}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white text-xs font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all hover:scale-105"
                              >
                                View Details
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="w-full sm:w-auto px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">
                      Page <span className="text-white font-semibold">{currentPage}</span> of{" "}
                      <span className="text-white font-semibold">{totalPages}</span>
                    </span>
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="w-full sm:w-auto px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Next
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Stats Card */}
          {!loading && filteredLogs.length > 0 && (
            <div className="max-w-7xl mx-auto mt-8">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Total Calls</p>
                      <p className="text-white text-2xl font-bold">{callLogs.length}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Filtered</p>
                      <p className="text-white text-2xl font-bold">{filteredLogs.length}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Current Page</p>
                      <p className="text-white text-2xl font-bold">{currentLogs.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallLogs;