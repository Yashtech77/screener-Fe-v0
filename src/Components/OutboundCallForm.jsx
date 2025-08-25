//  // src/Components/OutboundCallForm.jsx
// import React, { useState } from 'react';
// import axios from 'axios';
// import BackButton from '../section/Backbutton';

// const API_BASE = 'http://localhost:5000';
// const E164_REGEX = /^\+\d{8,15}$/;

// // Static for CAMPAIGN calls (phone number only)
// const CAMPAIGN_PHONE_NUMBER_ID = '096db749-edc6-4fd2-b262-efb9c155de00';

// const OutboundCallForm = () => {
//   // Single outbound call
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [knowledgeBaseId, setKnowledgeBaseId] = useState('');
//   const [status, setStatus] = useState('');

//   // Dynamic overrides for SINGLE call
//   const [singlePhoneNumberId, setSinglePhoneNumberId] = useState('');
//   const [singleAssistantId, setSingleAssistantId] = useState('');

//   // Campaign state
//   const [campaignName, setCampaignName] = useState('Sales Campaign');
//   const [campaignAssistantId, setCampaignAssistantId] = useState(''); // dynamic assistant for campaign
//   const [customers, setCustomers] = useState([]); // [{ number, name? }]
//   const [batchStatus, setBatchStatus] = useState('');

//   // ===== Single outbound call =====
//   const handleInitiateCall = async () => {
//     setStatus('');

//     if (!E164_REGEX.test(phoneNumber)) {
//       setStatus('Invalid phone number. Use E.164 format like +15551234567');
//       return;
//     }

//     try {
//       setStatus('Making the call...');
//       const payload = {
//         phoneNumber,
//         knowledgeBaseId: knowledgeBaseId || undefined,
//         phoneNumberId: singlePhoneNumberId || undefined, // backend should fallback if undefined
//         assistantId: singleAssistantId || undefined,     // backend should fallback if undefined
//       };

//       const { data } = await axios.post(`${API_BASE}/make-outbound-call`, payload);
//       setStatus(
//         data?.success ? 'Call initiated successfully' : (data?.message || 'Failed to initiate call')
//       );
//     } catch (error) {
//       setStatus(`Error: ${error?.response?.data?.message || error.message}`);
//     }
//   };

//   // ===== CSV parsing for campaign =====
//   const onCsvChange = async (e) => {
//     const file = e.target.files?.[0];
//     setCustomers([]);
//     setBatchStatus('');

//     if (!file) return;

//     try {
//       const text = await file.text();
//       const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
//       if (lines.length < 2) throw new Error('CSV must include a header and at least one data row');

//       const header = lines[0].split(',').map((h) => h.trim().toLowerCase());
//       const numberIdx = header.findIndex((col) => col === 'number');
//       const nameIdx = header.findIndex((col) => col === 'name'); // optional

//       if (numberIdx === -1) throw new Error("No 'number' column found in CSV header");

//       const invalid = [];
//       const parsed = [];

//       for (let i = 1; i < lines.length; i++) {
//         const cols = lines[i].split(',');
//         const raw = (cols[numberIdx] || '').trim();
//         if (!raw) continue;

//         if (!E164_REGEX.test(raw)) {
//           invalid.push(raw);
//           continue;
//         }

//         const entry = { number: raw };
//         if (nameIdx !== -1) {
//           const nm = (cols[nameIdx] || '').trim();
//           if (nm) entry.name = nm;
//         }
//         parsed.push(entry);
//       }

//       if (invalid.length) {
//         throw new Error(`Invalid phone numbers: ${invalid.join(', ')}`);
//       }

//       setCustomers(parsed);
//       setBatchStatus(`Parsed ${parsed.length} numbers from CSV.`);
//     } catch (err) {
//       setCustomers([]);
//       setBatchStatus(`CSV error: ${err.message}`);
//     }
//   };

//   // ===== Create campaign =====
//   const createCampaign = async () => {
//     setBatchStatus('');

//     if (!campaignName.trim()) {
//       setBatchStatus('Campaign name is required.');
//       return;
//     }
//     if (!campaignAssistantId.trim()) {
//       setBatchStatus('Assistant ID is required for campaign.');
//       return;
//     }
//     if (customers.length === 0) {
//       setBatchStatus('No valid customers. Upload a CSV first.');
//       return;
//     }

//     try {
//       setBatchStatus('Creating campaign…');

//       const payload = {
//         name: campaignName.trim(),
//         phoneNumberId: CAMPAIGN_PHONE_NUMBER_ID,        // static
//         assistantId: campaignAssistantId.trim(),        // dynamic from UI
//         customers,                                      // [{ number, name? }]
//       };

//       const { data } = await axios.post(`${API_BASE}/create-campaign`, payload);
//       if (data?.success) {
//         setBatchStatus(`✅ Campaign created: ${data.campaign?.name || campaignName}`);
//       } else {
//         setBatchStatus(`Failed: ${data?.message || 'Unknown error'}`);
//       }
//     } catch (err) {
//       setBatchStatus(`Error: ${err?.response?.data?.message || err.message}`);
//     }
//   };

//   return (
//     <>
//       <BackButton />
//       <div className="min-h-[85vh] bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
//           {/* ===== Single Outbound Call ===== */}
//           <div className="bg-white rounded-2xl shadow-xl p-8">
//             <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Outbound Call</h2>

//             <div className="flex justify-center mb-6">
//               <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-orange-400 text-white flex items-center justify-center text-3xl shadow-lg">
//                 <i className="fas fa-phone-volume" />
//               </div>
//             </div>

//             <label className="block text-gray-700 text-lg font-medium mb-2">
//               Phone Number (E.164)
//             </label>
//             <input
//               type="text"
//               value={phoneNumber}
//               onChange={(e) => setPhoneNumber(e.target.value)}
//               placeholder="+15551234567"
//               className="w-full px-4 py-3 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4"
//             />

//             {/* Dynamic overrides for single call */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
//             </div>

           

//             <button
//               onClick={handleInitiateCall}
//               className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-full text-white font-semibold text-lg shadow-md transition-all"
//             >
//               <i className="fas fa-phone mr-2" />
//               Initiate Call
//             </button>

//             {status && (
//               <p className="mt-4 text-center text-sm text-gray-700 bg-purple-50 border border-purple-200 px-4 py-2 rounded">
//                 {status}
//               </p>
//             )}
//           </div>

//           {/* ===== Campaign (CSV -> Create Campaign) ===== */}
//           <div className="bg-white rounded-2xl shadow-xl p-8">
//             <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Batch calling</h2>

//             <label className="block text-gray-700 text-lg font-medium mb-2">call Purpose </label>
//             <input
//               type="text"
//               value={campaignName}
//               onChange={(e) => setCampaignName(e.target.value)}
//               placeholder="Sales Campaign"
//               className="w-full px-4 py-3 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4"
//             />

//             <label className="block text-gray-700 text-lg font-medium mb-2">Assistant ID</label>
//             <input
//               type="text"
//               value={campaignAssistantId}
//               onChange={(e) => setCampaignAssistantId(e.target.value)}
//               placeholder="Enter Assistant ID to use for this campaign"
//               className="w-full px-4 py-3 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4"
//             />

//             <label className="block text-gray-700 text-lg font-medium mb-2">
//               Upload CSV (must include <code>number</code> column; optional <code>name</code>)
//             </label>
//             <input
//               type="file"
//               accept=".csv"
//               onChange={onCsvChange}
//               className="w-full px-4 py-3 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-3"
//             />

//             {/* Preview */}
//             <div className="mt-2">
//               <div className="text-sm text-gray-600">
//                 {customers.length > 0
//                   ? `Ready: ${customers.length} customer${customers.length > 1 ? 's' : ''}`
//                   : 'No customers parsed yet.'}
//               </div>
//               {customers.length > 0 && (
//                 <div className="mt-2 max-h-40 overflow-auto border border-slate-200 rounded-lg p-3 text-sm">
//                   {customers.slice(0, 12).map((c, idx) => (
//                     <div key={idx} className="text-slate-700">
//                       {c.number}{c.name ? ` — ${c.name}` : ''}
//                     </div>
//                   ))}
//                   {customers.length > 12 && (
//                     <div className="text-slate-500 mt-1">…and {customers.length - 12} more</div>
//                   )}
//                 </div>
//               )}
//             </div>

//             <button
//               onClick={createCampaign}
//               className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold text-lg shadow-md transition-all"
//             >
//               <i className="fas fa-bullhorn mr-2" />
//               Create Campaign & Start Calls
//             </button>

//             {batchStatus && (
//               <p className="mt-4 text-center text-sm text-gray-700 bg-indigo-50 border border-indigo-200 px-4 py-2 rounded">
//                 {batchStatus}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default OutboundCallForm;


import React, { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../section/Backbutton";

// const API_BASE = "http://localhost:5000";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const E164_REGEX = /^\+\d{8,15}$/;
// const CAMPAIGN_PHONE_NUMBER_ID = "096db749-edc6-4fd2-b262-efb9c155de00";
const CAMPAIGN_PHONE_NUMBER_ID = import.meta.env.VITE_CAMPAIGN_PHONE_NUMBER_ID ;

const OutboundCallForm = () => {
  const defaultAssistantId = import.meta.env.VITE_ASSISTANT_ID;

  // ✅ auto assistant state
  const [assistantId, setAssistantId] = useState(null);
  const [assistStatus, setAssistStatus] = useState("Loading assistant…");

  // Single outbound call
  const [phoneNumber, setPhoneNumber] = useState("");
  const [knowledgeBaseId, setKnowledgeBaseId] = useState("");
  const [status, setStatus] = useState("");

  // Campaign state
  const [campaignName, setCampaignName] = useState("Sales Campaign");
  const [customers, setCustomers] = useState([]);
  const [batchStatus, setBatchStatus] = useState("");

  // ===== Auto-select assistant (like inbound) =====
  useEffect(() => {
    const fetchAssistantId = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/list-assistants`);
        if (Array.isArray(data) && data.length > 0) {
          setAssistantId(data[0].id);
          setAssistStatus(`Using assistant: ${data[0].name || data[0].id}`);
        } else {
          setAssistantId(defaultAssistantId);
          setAssistStatus("Using default assistant from .env");
        }
      } catch (err) {
        console.error("Error fetching assistants:", err);
        setAssistantId(defaultAssistantId);
        setAssistStatus("Failed to fetch — using default from .env");
      }
    };

    fetchAssistantId();
  }, [defaultAssistantId]);

  // ===== Single outbound call =====
  const handleInitiateCall = async () => {
    setStatus("");

    if (!E164_REGEX.test(phoneNumber)) {
      setStatus("Invalid phone number. Use E.164 format like +15551234567");
      return;
    }

    try {
      setStatus("Making the call…");
      const payload = {
        phoneNumber,
        knowledgeBaseId: knowledgeBaseId || undefined,
        assistantId: assistantId || undefined, // ✅ auto-injected
      };

      const { data } = await axios.post(`${API_BASE}/make-outbound-call`, payload);
      setStatus(
        data?.success
          ? "Call initiated successfully"
          : data?.message || "Failed to initiate call"
      );
    } catch (error) {
      setStatus(`Error: ${error?.response?.data?.message || error.message}`);
    }
  };

  // ===== CSV parsing for campaign =====
  const onCsvChange = async (e) => {
    const file = e.target.files?.[0];
    setCustomers([]);
    setBatchStatus("");

    if (!file) return;

    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      if (lines.length < 2) throw new Error("CSV must include header + rows");

      const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const numberIdx = header.findIndex((col) => col === "number");
      const nameIdx = header.findIndex((col) => col === "name");

      if (numberIdx === -1) throw new Error("CSV needs 'number' column");

      const parsed = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",");
        const raw = (cols[numberIdx] || "").trim();
        if (!raw) continue;
        if (!E164_REGEX.test(raw)) throw new Error(`Invalid: ${raw}`);

        const entry = { number: raw };
        if (nameIdx !== -1 && cols[nameIdx]?.trim()) {
          entry.name = cols[nameIdx].trim();
        }
        parsed.push(entry);
      }

      setCustomers(parsed);
      setBatchStatus(`Parsed ${parsed.length} numbers.`);
    } catch (err) {
      setCustomers([]);
      setBatchStatus(`CSV error: ${err.message}`);
    }
  };

  // ===== Create campaign =====
  const createCampaign = async () => {
    if (!campaignName.trim()) {
      setBatchStatus("Campaign name required.");
      return;
    }
    if (!assistantId) {
      setBatchStatus("No assistant available.");
      return;
    }
    if (customers.length === 0) {
      setBatchStatus("Upload CSV first.");
      return;
    }

    try {
      setBatchStatus("Creating campaign…");
      const payload = {
        name: campaignName.trim(),
        phoneNumberId: CAMPAIGN_PHONE_NUMBER_ID,
        assistantId, // ✅ auto-injected
        customers,
      };

      const { data } = await axios.post(`${API_BASE}/create-campaign`, payload);
      setBatchStatus(
        data?.success
          ? `✅ Campaign created: ${data.campaign?.name || campaignName}`
          : `Failed: ${data?.message || "Unknown error"}`
      );
    } catch (err) {
      setBatchStatus(`Error: ${err?.response?.data?.message || err.message}`);
    }
  };

  return (
    <>
      <BackButton />
      <div className="min-h-[85vh] bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
          {/* ===== Single Outbound Call ===== */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-center text-purple-700 mb-2">
              Outbound Call
            </h2>
            <p className="text-center text-sm text-gray-500 mb-6">{assistStatus}</p>

            <label className="block text-gray-700 text-lg font-medium mb-2">
              Phone Number (E.164)
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+15551234567"
              className="w-full px-4 py-3 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4"
            />

            <button
              onClick={handleInitiateCall}
              className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-full text-white font-semibold text-lg shadow-md transition-all"
              disabled={!assistantId}
            >
              <i className="fas fa-phone mr-2" />
              Initiate Call
            </button>

            {status && (
              <p className="mt-4 text-center text-sm text-gray-700 bg-purple-50 border border-purple-200 px-4 py-2 rounded">
                {status}
              </p>
            )}
          </div>

          {/* ===== Campaign ===== */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-center text-indigo-700 mb-2">
              Batch Calling
            </h2>
            <p className="text-center text-sm text-gray-500 mb-6">{assistStatus}</p>

            <label className="block text-gray-700 text-lg font-medium mb-2">
              Call Purpose
            </label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="Sales Campaign"
              className="w-full px-4 py-3 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4"
            />

            <label className="block text-gray-700 text-lg font-medium mb-2">
              Upload CSV (number column required)
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={onCsvChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-3"
            />

            <button
              onClick={createCampaign}
              className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold text-lg shadow-md transition-all"
              disabled={!assistantId}
            >
              <i className="fas fa-bullhorn mr-2" />
              Create Campaign & Start Calls
            </button>

            {batchStatus && (
              <p className="mt-4 text-center text-sm text-gray-700 bg-indigo-50 border border-indigo-200 px-4 py-2 rounded">
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

 