 



// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
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
              className={`mb-2 ${role.trim().toLowerCase() === "ai" ? "text-blue-500" : "text-green-600"}`}
            >
              <strong>{role.trim()}:</strong> {message.trim()}
            </div>
          );
        }
        return <div key={index} className="mb-2 text-gray-600">{line.trim()}</div>;
      });
    }

    if (Array.isArray(transcript)) {
      return transcript.map((msg, index) => (
        <div key={index} className={`mb-2 ${msg.role === "assistant" ? "text-blue-500" : "text-green-600"}`}>
          <strong>{msg.role}:</strong> {msg.content}
        </div>
      ));
    }

    return <p className="text-gray-500">Transcript format not recognized</p>;
  };

  const downloadExcel = () => {
    if (!callDetails?.structuredOutputs) return;

    // Create an object with fields as keys and values as the data
    const dataObject = {};
    Object.entries(callDetails.structuredOutputs).forEach(([key, value]) => {
      dataObject[key] = value !== null && value !== undefined ? String(value) : "N/A";
    });

    // Convert to array format (fields as headers, values in first row)
    const data = [dataObject];

    // Create a new workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Call Details");

    // Set column widths for better readability
    const columnCount = Object.keys(dataObject).length;
    worksheet['!cols'] = Array(columnCount).fill({ wch: 25 });

    // Generate filename with call ID and date
    const filename = `call_details_${callId}_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Download the file
    XLSX.writeFile(workbook, filename);
  };

  // Fix double slash in URL
  const recordingUrl = callDetails?.recordingUrl
    ? callDetails.recordingUrl.startsWith("/") 
      ? callDetails.recordingUrl 
      : "/" + callDetails.recordingUrl
    : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <BackButton />
      <h2 className="text-3xl font-semibold mb-4">Call Details</h2>

      {error && <p className="text-red-600">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : callDetails ? (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-medium text-gray-700 mb-4">
            Call Type: {callDetails?.type || "N/A"}
          </h3>

          <div className="mb-4">
            <h4 className="font-semibold text-gray-700">Transcript:</h4>
            <div className="text-gray-600">{formatTranscript(callDetails.transcript)}</div>
          </div>

          {recordingUrl && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold">Recording:</h4>
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
              <h4 className="font-semibold text-gray-700 mb-2">Key response:</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 border border-gray-300 text-left font-semibold text-gray-700">Field</th>
                      <th className="px-4 py-2 border border-gray-300 text-left font-semibold text-gray-700">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(callDetails.structuredOutputs).map(([key, value], index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border border-gray-300 font-medium text-gray-600">{key}</td>
                        <td className="px-4 py-2 border border-gray-300 text-gray-600">
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
                className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200 ease-in-out flex items-center gap-2"
              >
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
              </button>
            </div>
          )}

          <div className="mt-4">
            <h4 className="font-semibold text-gray-700">Created At:</h4>
            <p className="text-gray-600">{formatDate(callDetails?.createdAt)}</p>
          </div>
        </div>
      ) : (
        !loading && <p>No call details available</p>
      )}
    </div>
  );
};

export default CallDetails;