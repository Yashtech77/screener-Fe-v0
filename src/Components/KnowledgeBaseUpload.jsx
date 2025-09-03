
// import React, { useState } from 'react';
// import axios from 'axios';
// import BackButton from '../section/Backbutton';

// function KnowledgeBaseUpload() {
//   const [file, setFile] = useState(null);
//   const [kbId, setKbId] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Assistant form state
//   const [assistantName, setAssistantName] = useState('');
//   const [firstMessage, setFirstMessage] = useState('');
//   const [systemPrompt, setSystemPrompt] = useState('');
//   const [creating, setCreating] = useState(false);
//   const [assistantId, setAssistantId] = useState('');
//   // Read from .env
//   const BASE_URL = import.meta.env.VITE_VAPI_BASE_URL;
//   const API_KEY = import.meta.env.VITE_VAPI_API_KEY;

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       alert('Please select a file first.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('knowledgeBase', file);

//     try {
//       setLoading(true);
//       const response = await axios.post('${BASE_URL}/upload-files', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       console.log("Upload response:", response.data);

//       if (response.data.success) {
//         const id = response.data.knowledgeBaseId;
//         setKbId(id || 'N/A');
//         if (id) {
//           localStorage.setItem('knowledgeBaseId', id);
//         }
//         alert('Knowledge Base uploaded successfully!');
//       } else {
//         alert('Upload failed. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       alert('An error occurred during upload.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateAssistant = async () => {
//     if (!assistantName || !firstMessage || !systemPrompt) {
//       alert('Please fill in all required fields.');
//       return;
//     }

//     try {
//       setCreating(true);

//       const response = await axios.post('${BASE_URL}/create-assistant', {
//         name: assistantName,
//         firstMessage: firstMessage,
//         content: systemPrompt,
//         // Optional fields
//         endCallMessage: "Thanks for speaking with me.",
//         firstMessageInterruptionsEnabled: true
//       });

//       console.log("Assistant response:", response.data);

//       if (response.data.id) {
//         setAssistantId(response.data.id);
//         alert('Assistant created successfully!');
//       } else {
//         alert('Assistant creation failed.');
//       }
//     } catch (error) {
//       console.error('Error creating assistant:', error);
//       alert('An error occurred while creating the assistant.');
//     } finally {
//       setCreating(false);
//     }
//   };

//   return (
//     <> 
//     <BackButton />
   
//     <div className="p-4 border rounded shadow bg-white max-w-xl mx-auto mt-10 space-y-8">
//       <h1 className="text-2xl font-bold mb-4">Knowledge Base Upload & Assistant Creation</h1>
// <div>
//   <a href="/Assistant_Guide_Steps.pdf" target="_blank" rel="noopener noreferrer">📃
//     <span className="underline text hover:text-blue-900 font-bold">Assistant Creation Guide</span>
//   </a>
// </div>

//       <div>
//         <h2 className="text-lg font-semibold mb-2">Create Assistant</h2>

//         <input
//           type="text"
//           placeholder="Assistant Name"
//           value={assistantName}
//           onChange={(e) => setAssistantName(e.target.value)}
//           className="block w-full mb-2 px-2 py-1 border rounded"
//         />

//         <input
//           type="text"
//           placeholder="First Message"
//           value={firstMessage}
//           onChange={(e) => setFirstMessage(e.target.value)}
//           className="block w-full mb-2 px-2 py-1 border rounded"
//         />

//         <textarea
//           placeholder="System Prompt"
//           value={systemPrompt}
//           onChange={(e) => setSystemPrompt(e.target.value)}
//           className="block w-full mb-2 px-2 py-1 border rounded h-28"
//         />

//         <button
//           onClick={handleCreateAssistant}
//           className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
//           disabled={creating}
//         >
//           {creating ? 'Creating...' : 'Create Assistant'}
//         </button>

//         {assistantId && (
//           <p className="mt-2 text-green-600 text-sm">
//             Assistant ID: <span className="font-mono">{assistantId}</span>
//           </p>
//         )}
//       </div>

//       {/* Upload UI */}
//       <div className='mb-8 '>
//         <h2 className="text-lg font-semibold mb-2">Upload Knowledge Base</h2>
//         <input
//           type="file"
//           onChange={handleFileChange}
//           className="mb-2 block w-full  rounded-2xl border p-2"
//         />
//          <p className='text-xs mb-2 mt-2'>not Mandatory for assistant creation , its only required for info about the company</p>
//         <button
//           onClick={handleUpload}
//           className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 ml-54"
//           disabled={loading}
//         >
//           {loading ? 'Uploading...' : 'Upload'}
//         </button>

//         {kbId && (
//           <p className="mt-2 text-green-600 text-sm">
//             Knowledge Base ID: <span className="font-mono">{kbId}</span>
//           </p>
//         )}
       
       
//       </div>
  
      
//     </div>
//     </>
    
//   );
  
// }

// export default KnowledgeBaseUpload;



import React, { useState } from 'react';
import axios from 'axios';
import BackButton from '../section/Backbutton';

function KnowledgeBaseUpload() {
  const [file, setFile] = useState(null);
  const [kbId, setKbId] = useState('');
  const [loading, setLoading] = useState(false);

  // Assistant form state
  const [assistantName, setAssistantName] = useState('');
  const [firstMessage, setFirstMessage] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [creating, setCreating] = useState(false);
  const [assistantId, setAssistantId] = useState('');

  // Read from .env
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('knowledgeBase', file);

    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/upload-files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Upload response:", response.data);

      if (response.data.success) {
        const id = response.data.knowledgeBaseId;
        setKbId(id || 'N/A');
        if (id) {
          localStorage.setItem('knowledgeBaseId', id);
        }
        alert('Knowledge Base uploaded successfully!');
      } else {
        alert('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred during upload.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssistant = async () => {
    if (!assistantName || !firstMessage || !systemPrompt) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      setCreating(true);

      const response = await axios.post(`${BASE_URL}/create-assistant`, {
        name: assistantName,
        firstMessage: firstMessage,
        content: systemPrompt,
        // Optional fields
        endCallMessage: "Thanks for speaking with me.",
        firstMessageInterruptionsEnabled: true
      });

      console.log("Assistant response:", response.data);

      if (response.data.id) {
        setAssistantId(response.data.id);
        alert('Assistant created successfully!');
      } else {
        alert('Assistant creation failed.');
      }
    } catch (error) {
      console.error('Error creating assistant:', error);
      alert('An error occurred while creating the assistant.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <> 
      <BackButton />
      <div className="p-4 border rounded shadow bg-white max-w-xl mx-auto mt-10 space-y-8">
        <h1 className="text-2xl font-bold mb-4">
          Knowledge Base Upload & Assistant Creation
        </h1>

        <div>
          <a href="/Assistant_Guide_Steps.pdf" target="_blank" rel="noopener noreferrer">📃
            <span className="underline text hover:text-blue-900 font-bold">Assistant Creation Guide</span>
          </a>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Create Assistant</h2>

          <input
            type="text"
            placeholder="Assistant Name"
            value={assistantName}
            onChange={(e) => setAssistantName(e.target.value)}
            className="block w-full mb-2 px-2 py-1 border rounded"
          />

          <input
            type="text"
            placeholder="First Message"
            value={firstMessage}
            onChange={(e) => setFirstMessage(e.target.value)}
            className="block w-full mb-2 px-2 py-1 border rounded"
          />

          <textarea
            placeholder="System Prompt"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="block w-full mb-2 px-2 py-1 border rounded h-28"
          />

          <button
            onClick={handleCreateAssistant}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={creating}
          >
            {creating ? 'Creating...' : 'Create Assistant'}
          </button>

          {assistantId && (
            <p className="mt-2 text-green-600 text-sm">
              Assistant ID: <span className="font-mono">{assistantId}</span>
            </p>
          )}
        </div>

        {/* Upload UI */}
        <div className='mb-8'>
          <h2 className="text-lg font-semibold mb-2">Upload Knowledge Base</h2>
          <input
            type="file"
            onChange={handleFileChange}
            className="mb-2 block w-full rounded-2xl border p-2"
          />
          <p className='text-xs mb-2 mt-2'>
            Not mandatory for assistant creation, only required for company info.
          </p>
          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>

          {kbId && (
            <p className="mt-2 text-green-600 text-sm">
              Knowledge Base ID: <span className="font-mono">{kbId}</span>
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default KnowledgeBaseUpload;
