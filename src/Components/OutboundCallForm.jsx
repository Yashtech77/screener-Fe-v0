// // src/Components/OutboundCallForm.jsx

// import React, { useState } from 'react';
// import axios from 'axios';
// import BackButton from '../section/Backbutton';

// const OutboundCallForm = () => {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [knowledgeBaseId, setKnowledgeBaseId] = useState('');
//   const [status, setStatus] = useState('');

//   const handlePhoneNumberChange = (e) => {
//     setPhoneNumber(e.target.value);
//   };

//   const handleKnowledgeBaseIdChange = (e) => {
//     setKnowledgeBaseId(e.target.value);
//   };

//   const handleInitiateCall = async () => {
//     try {
//       setStatus('Making the call...');
//       const response = await axios.post('http://localhost:5000/make-outbound-call', {
//         phoneNumber,
//         knowledgeBaseId
//       });

//       if (response.data.success) {
//         setStatus('Call initiated successfully');
//       } else {
//         setStatus('Failed to initiate call');
//       }
//     } catch (error) {
//       setStatus('Error occurred while making the call');
//     }
//   };

//   return (
//     <>
//       <BackButton />
//       <div className="h-[77vh] bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center px-4 py-12">
//         <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8">
//           <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Outbound Call</h2>

//           <div className="flex justify-center mb-6">
//             <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-orange-400 text-white flex items-center justify-center text-3xl shadow-lg">
//               <i className="fas fa-phone-volume" />
//             </div>
//           </div>

//           <label className="block text-gray-700 text-lg font-medium mb-2">
//             Phone Number (E.164 format)
//           </label>
//           <input
//             type="text"
//             value={phoneNumber}
//             onChange={handlePhoneNumberChange}
//             placeholder="+1XXXXXXXXXX"
//             className="w-full px-4 py-3 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4"
//           />

//           <label className="block text-gray-700 text-lg font-medium mb-2">
//             Knowledge Base ID (Optional)
//           </label>
//           <input
//             type="text"
//             value={knowledgeBaseId}
//             onChange={handleKnowledgeBaseIdChange}
//             placeholder="Paste Knowledge Base ID"
//             className="w-full px-4 py-3 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4"
//           />

//           <button
//             onClick={handleInitiateCall}
//             className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-full text-white font-semibold text-lg shadow-md transition-all"
//           >
//             <i className="fas fa-phone mr-2" />
//             Initiate Call
//           </button>

//           {status && (
//             <p className="mt-4 text-center text-sm text-gray-600 bg-purple-50 border border-purple-200 px-4 py-2 rounded">
//               {status}
//             </p>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default OutboundCallForm;
// src/Components/OutboundCallForm.jsx

import React, { useState } from 'react';
import axios from 'axios';
import BackButton from '../section/Backbutton';

const OutboundCallForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [knowledgeBaseId, setKnowledgeBaseId] = useState('');
  const [status, setStatus] = useState('');

  const [batchFile, setBatchFile] = useState(null);
  const [batchStatus, setBatchStatus] = useState('');

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleKnowledgeBaseIdChange = (e) => {
    setKnowledgeBaseId(e.target.value);
  };

  const handleBatchFileChange = (e) => {
    setBatchFile(e.target.files[0]);
  };

  const handleInitiateCall = async () => {
    
    try {
      setStatus('Making the call...');
      const response = await axios.post('http://localhost:5000/make-outbound-call', {
        phoneNumber,
        knowledgeBaseId,
      });

      if (response.data.success) {
        setStatus('Call initiated successfully');
      } else {
        setStatus('Failed to initiate call');
      }
    } catch (error) {
      setStatus('Error occurred while making the call');
    }
  };

  const handleBatchUpload = async () => {
    if (!batchFile) {
      setBatchStatus('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('batchFile', batchFile);

    try {
      setBatchStatus('Uploading and processing...');
      const response = await axios.post('http://localhost:5000/upload-batch-file', formData);
      if (response.data.success) {
        setBatchStatus('Batch file processed successfully');
      } else {
        setBatchStatus('Failed to process batch file');
      }
    } catch (error) {
      setBatchStatus('Error occurred while processing the file');
    }
  };

  return (
    <>
      <BackButton />
      <div className="h-[85vh] bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
          {/* Outbound Call Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Outbound Call</h2>

            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-orange-400 text-white flex items-center justify-center text-3xl shadow-lg">
                <i className="fas fa-phone-volume" />
              </div>
            </div>

            <label className="block text-gray-700 text-lg font-medium mb-2">
              Phone Number (E.164 format)
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="+1XXXXXXXXXX"
              className="w-full px-4 py-3 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4"
            />

            <label className="block text-gray-700 text-lg font-medium mb-2">
              Knowledge Base ID (Optional)
            </label>
            <input
              type="text"
              value={knowledgeBaseId}
              onChange={handleKnowledgeBaseIdChange}
              placeholder="Paste Knowledge Base ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4"
            />

            <button
              onClick={handleInitiateCall}
              className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-full text-white font-semibold text-lg shadow-md transition-all"
            >
              <i className="fas fa-phone mr-2" />
              Initiate Call
            </button>

            {status && (
              <p className="mt-4 text-center text-sm text-gray-600 bg-purple-50 border border-purple-200 px-4 py-2 rounded">
                {status}
              </p>
            )}
          </div>

          {/* Batch File Upload Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Batch File Upload</h2>

            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-400 text-white flex items-center justify-center text-3xl shadow-lg">
                <i className="fas fa-file-upload" />
              </div>
            </div>

            <label className="block text-gray-700 text-lg font-medium mb-2">
              Upload File (CSV or Excel)
            </label>
            <input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleBatchFileChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4"
            />

            <button
              onClick={handleBatchUpload}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold text-lg shadow-md transition-all"
            >
              <i className="fas fa-cloud-upload-alt mr-2" />
              Upload & Start Calls
            </button>

            {batchStatus && (
              <p className="mt-4 text-center text-sm text-gray-600 bg-indigo-50 border border-indigo-200 px-4 py-2 rounded">
                {batchStatus}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OutboundCallForm;
