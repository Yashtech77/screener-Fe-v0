
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import * as XLSX from "xlsx";
// import BackButton from "../section/Backbutton";

// const CallDetails = () => {
//   const { callId } = useParams();
//   const [callDetails, setCallDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const BASE_URL = import.meta.env.VITE_API_BASE_URL;

//   const fetchCallDetails = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`${BASE_URL}/call/${callId}`);
//       if (!response.ok) throw new Error("Failed to fetch call details");
//       const data = await response.json();
//       setCallDetails(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCallDetails();
//   }, [callId]);

//   const formatDate = (date) => (date ? new Date(date).toLocaleString() : "N/A");

//   const formatTranscript = (transcript) => {
//     if (!transcript) return <p className="text-gray-500">No transcript available</p>;

//     if (typeof transcript === "string") {
//       return transcript.split("\n").map((line, index) => {
//         const parts = line.split(":");
//         if (parts.length === 2) {
//           const [role, message] = parts;
//           return (
//             <div
//               key={index}
//               className={`mb-2 ${role.trim().toLowerCase() === "ai" ? "text-blue-500" : "text-green-600"}`}
//             >
//               <strong>{role.trim()}:</strong> {message.trim()}
//             </div>
//           );
//         }
//         return <div key={index} className="mb-2 text-gray-600">{line.trim()}</div>;
//       });
//     }

//     if (Array.isArray(transcript)) {
//       return transcript.map((msg, index) => (
//         <div key={index} className={`mb-2 ${msg.role === "assistant" ? "text-blue-500" : "text-green-600"}`}>
//           <strong>{msg.role}:</strong> {msg.content}
//         </div>
//       ));
//     }

//     return <p className="text-gray-500">Transcript format not recognized</p>;
//   };

//   const downloadExcel = () => {
//     if (!callDetails?.structuredOutputs) return;

//     // Create an object with fields as keys and values as the data
//     const dataObject = {};
//     Object.entries(callDetails.structuredOutputs).forEach(([key, value]) => {
//       dataObject[key] = value !== null && value !== undefined ? String(value) : "N/A";
//     });

//     // Convert to array format (fields as headers, values in first row)
//     const data = [dataObject];

//     // Create a new workbook and worksheet
//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Call Details");

//     // Set column widths for better readability
//     const columnCount = Object.keys(dataObject).length;
//     worksheet['!cols'] = Array(columnCount).fill({ wch: 25 });

//     // Generate filename with call ID and date
//     const filename = `call_details_${callId}_${new Date().toISOString().split('T')[0]}.xlsx`;

//     // Download the file
//     XLSX.writeFile(workbook, filename);
//   };

//   // Fix double slash in URL
//   const recordingUrl = callDetails?.recordingUrl
//     ? callDetails.recordingUrl.startsWith("/") 
//       ? callDetails.recordingUrl 
//       : "/" + callDetails.recordingUrl
//     : null;

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <BackButton />
//       <h2 className="text-3xl font-semibold mb-4">Call Details</h2>

//       {error && <p className="text-red-600">{error}</p>}

//       {loading ? (
//         <p>Loading...</p>
//       ) : callDetails ? (
//         <div className="bg-white shadow rounded-lg p-6">
//           <h3 className="text-xl font-medium text-gray-700 mb-4">
//             Call Type: {callDetails?.type || "N/A"}
//           </h3>

//           <div className="mb-4">
//             <h4 className="font-semibold text-gray-700">Transcript:</h4>
//             <div className="text-gray-600">{formatTranscript(callDetails.transcript)}</div>
//           </div>

//           {recordingUrl && (
//             <div className="mt-4">
//               <h4 className="text-lg font-semibold">Recording:</h4>
//               <audio controls className="mt-2 w-full">
//                 <source
//                   src={`${BASE_URL}${recordingUrl}`}
//                   type={recordingUrl.endsWith(".mp3") ? "audio/mpeg" : "audio/wav"}
//                 />
//                 Your browser does not support the audio element.
//               </audio>
//             </div>
//           )}

//           {callDetails.structuredOutputs && Object.keys(callDetails.structuredOutputs).length > 0 && (
//             <div className="mt-4">
//               <h4 className="font-semibold text-gray-700 mb-2">Key response:</h4>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full border border-gray-300">
//                   <thead className="bg-gray-100">
//                     <tr>
//                       <th className="px-4 py-2 border border-gray-300 text-left font-semibold text-gray-700">Field</th>
//                       <th className="px-4 py-2 border border-gray-300 text-left font-semibold text-gray-700">Value</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {Object.entries(callDetails.structuredOutputs).map(([key, value], index) => (
//                       <tr key={index} className="hover:bg-gray-50">
//                         <td className="px-4 py-2 border border-gray-300 font-medium text-gray-600">{key}</td>
//                         <td className="px-4 py-2 border border-gray-300 text-gray-600">
//                           {value !== null && value !== undefined ? String(value) : "N/A"}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
              
//               {/* Download Button */}
//               <button
//                 onClick={downloadExcel}
//                 className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200 ease-in-out flex items-center gap-2"
//               >
//                 <svg 
//                   xmlns="http://www.w3.org/2000/svg" 
//                   className="h-5 w-5" 
//                   viewBox="0 0 20 20" 
//                   fill="currentColor"
//                 >
//                   <path 
//                     fillRule="evenodd" 
//                     d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" 
//                     clipRule="evenodd" 
//                   />
//                 </svg>
//                 Download Excel
//               </button>
//             </div>
//           )}

//           <div className="mt-4">
//             <h4 className="font-semibold text-gray-700">Created At:</h4>
//             <p className="text-gray-600">{formatDate(callDetails?.createdAt)}</p>
//           </div>
//         </div>
//       ) : (
//         !loading && <p>No call details available</p>
//       )}
//     </div>
//   );
// };

// export default CallDetails;



import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import BackButton from "../section/Backbutton";

const CallDetails = () => {
  const { callId } = useParams();
  const [callDetails, setCallDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchCallDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/call/${callId}`);
      if (!response.ok) throw new Error("Failed to fetch call details");
      const data = await response.json();
      setCallDetails(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCallDetails();
  }, [callId]);

  const formatDate = (date) => (date ? new Date(date).toLocaleString() : "N/A");

  const formatTranscript = (transcript) => {
    if (!transcript) return <p className="text-gray-500">No transcript available</p>;

    if (typeof transcript === "string") {
      return transcript.split("\n").map((line, index) => {
        const parts = line.split(":");
        if (parts.length === 2) {
          const [role, message] = parts;
          return (
            <div
              key={index}
              className={`mb-2 ${role.trim().toLowerCase() === "ai" ? "text-cyan-400" : "text-green-400"}`}
            >
              <strong>{role.trim()}:</strong> <span className="text-gray-300">{message.trim()}</span>
            </div>
          );
        }
        return <div key={index} className="mb-2 text-gray-400">{line.trim()}</div>;
      });
    }

    if (Array.isArray(transcript)) {
      return transcript.map((msg, index) => (
        <div key={index} className={`mb-2 ${msg.role === "assistant" ? "text-cyan-400" : "text-green-400"}`}>
          <strong>{msg.role}:</strong> <span className="text-gray-300">{msg.content}</span>
        </div>
      ));
    }

    return <p className="text-gray-500">Transcript format not recognized</p>;
  };

  const downloadExcel = () => {
    if (!callDetails?.structuredOutputs) return;

    setDownloading(true);
    try {
      const dataObject = {};
      Object.entries(callDetails.structuredOutputs).forEach(([key, value]) => {
        dataObject[key] = value !== null && value !== undefined ? String(value) : "N/A";
      });

      const data = [dataObject];
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Call Details");

      const columnCount = Object.keys(dataObject).length;
      worksheet['!cols'] = Array(columnCount).fill({ wch: 25 });

      const filename = `call_details_${callId}_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, filename);
    } catch (error) {
      console.error("Error downloading Excel:", error);
      alert("Failed to download Excel file");
    } finally {
      setDownloading(false);
    }
  };

  const recordingUrl = callDetails?.recordingUrl
    ? callDetails.recordingUrl.startsWith("/") 
      ? callDetails.recordingUrl 
      : "/" + callDetails.recordingUrl
    : null;

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
      <div className="relative z-10 min-h-screen p-6">
        <BackButton />
        
        {/* Centered Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Call Details
          </h2>
          <p className="text-gray-400">Call ID: {callId}</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-cyan-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-400">Loading...</p>
            </div>
          </div>
        ) : callDetails ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow rounded-lg p-6">
            <h3 className="text-xl font-medium text-white mb-4">
              Call Type: {callDetails?.type || "N/A"}
            </h3>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-300 mb-2">Transcript:</h4>
              <div className="text-gray-400">{formatTranscript(callDetails.transcript)}</div>
            </div>

            {recordingUrl && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold text-gray-300 mb-2">Recording:</h4>
                <audio controls className="mt-2 w-full">
                  <source
                    src={`${BASE_URL}${recordingUrl}`}
                    type={recordingUrl.endsWith(".mp3") ? "audio/mpeg" : "audio/wav"}
                  />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {callDetails.structuredOutputs && Object.keys(callDetails.structuredOutputs).length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-300 mb-2">Key response:</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-white/20">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-4 py-2 border border-white/20 text-left font-semibold text-gray-300">Field</th>
                        <th className="px-4 py-2 border border-white/20 text-left font-semibold text-gray-300">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(callDetails.structuredOutputs).map(([key, value], index) => (
                        <tr key={index} className="hover:bg-white/5">
                          <td className="px-4 py-2 border border-white/20 font-medium text-gray-400">{key}</td>
                          <td className="px-4 py-2 border border-white/20 text-gray-300">
                            {value !== null && value !== undefined ? String(value) : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Download Button */}
                <button
                  onClick={downloadExcel}
                  disabled={downloading}
                  className="mt-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200 ease-in-out flex items-center gap-2 disabled:opacity-50"
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
                      Download Excel
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="mt-4">
              <h4 className="font-semibold text-gray-300">Created At:</h4>
              <p className="text-gray-400">{formatDate(callDetails?.createdAt)}</p>
            </div>
          </div>
        ) : (
          !loading && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-12 text-center">
              <p className="text-gray-400">No call details available</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CallDetails;