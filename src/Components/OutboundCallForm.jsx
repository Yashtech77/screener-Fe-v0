// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import BackButton from "../section/Backbutton";

// // const API_BASE = "http://localhost:5000";
// const API_BASE = import.meta.env.VITE_API_BASE_URL;

// const E164_REGEX = /^\+\d{8,15}$/;
// // const CAMPAIGN_PHONE_NUMBER_ID = "096db749-edc6-4fd2-b262-efb9c155de00";
// const CAMPAIGN_PHONE_NUMBER_ID = import.meta.env.VITE_CAMPAIGN_PHONE_NUMBER_ID;

// const OutboundCallForm = () => {
//   const defaultAssistantId = import.meta.env.VITE_ASSISTANT_ID;

//   // ✅ auto assistant state
//   const [assistantId, setAssistantId] = useState(null);
//   const [assistStatus, setAssistStatus] = useState("Loading assistant…");

//   // Single outbound call
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [knowledgeBaseId, setKnowledgeBaseId] = useState("");
//   const [status, setStatus] = useState("");

//   // Campaign state
//   const [campaignName, setCampaignName] = useState("Sales Campaign");
//   const [customers, setCustomers] = useState([]);
//   const [batchStatus, setBatchStatus] = useState("");

//   // ===== Auto-select assistant (like inbound) =====
//   useEffect(() => {
//     const fetchAssistantId = async () => {
//       try {
//         const { data } = await axios.get(`${API_BASE}/list-assistants`);
//         if (Array.isArray(data) && data.length > 0) {
//           setAssistantId(data[0].id);
//           setAssistStatus(`Using assistant: ${data[0].name || data[0].id}`);
//         } else {
//           setAssistantId(defaultAssistantId);
//           setAssistStatus("Using default assistant from .env");
//         }
//       } catch (err) {
//         console.error("Error fetching assistants:", err);
//         setAssistantId(defaultAssistantId);
//         setAssistStatus("Failed to fetch — using default from .env");
//       }
//     };

//     fetchAssistantId();
//   }, [defaultAssistantId]);
//   // useEffect(() => {
//   //   const fetchAssistantId = async () => {
//   //     try {
//   //       const { data } = await axios.get(`${API_BASE}/list-assistants`);
//   //       if (data?.id) {
//   //         setAssistantId(data.id);
//   //         setAssistStatus(`Using assistant: ${data.name || data.id}`);
//   //       } else {
//   //         setAssistantId(defaultAssistantId);
//   //         setAssistStatus("Using default assistant from .env");
//   //       }
//   //     } catch (err) {
//   //       console.error("Error fetching assistants:", err);
//   //       setAssistantId(defaultAssistantId);
//   //       setAssistStatus("Failed to fetch — using default from .env");
//   //     }
//   //   };

//   //   fetchAssistantId();
//   // }, [defaultAssistantId]);

//   // ===== Single outbound call =====
//   const handleInitiateCall = async () => {
//     setStatus("");

//     if (!E164_REGEX.test(phoneNumber)) {
//       setStatus("Invalid phone number. Use E.164 format like +91874653...");
//       return;
//     }

//     try {
//       setStatus("Making the call…");
//       const payload = {
//         phoneNumber,
//         knowledgeBaseId: knowledgeBaseId || undefined,
//         assistantId: assistantId || undefined, // ✅ auto-injected
//       };

//       const { data } = await axios.post(
//         `${API_BASE}/make-outbound-call`,
//         payload
//       );
//       setStatus(
//         data?.success
//           ? "Call initiated successfully"
//           : data?.message || "Failed to initiate call"
//       );
//     } catch (error) {
//       let message = "Something went wrong. Please try again later.";

//       if (error.response?.status === 401) {
//         message = "Unauthorized: Please check your credentials.";
//       } else if (error.response?.status === 404) {
//         message = "Not found: The requested resource doesn’t exist.";
//       } else if (error.response?.status === 500) {
//         message = "Server error: Please try again after some time.";
//       }

//       setStatus(message);
//     }
//   };

//   // ===== CSV parsing for campaign =====
//   // const onCsvChange = async (e) => {
//   //   const file = e.target.files?.[0];
//   //   setCustomers([]);
//   //   setBatchStatus("");

//   //   if (!file) return;

//   //   try {
//   //     const text = await file.text();
//   //     const lines = text
//   //       .split(/\r?\n/)
//   //       .map((l) => l.trim())
//   //       .filter(Boolean);
//   //     if (lines.length < 2) throw new Error("CSV must include header + rows");

//   //     const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
//   //     const numberIdx = header.findIndex((col) => col === "number");
//   //     const nameIdx = header.findIndex((col) => col === "name");

//   //     if (numberIdx === -1) throw new Error("CSV needs 'number' column");

//   //     const parsed = [];
//   //     for (let i = 1; i < lines.length; i++) {
//   //       const cols = lines[i].split(",");
//   //       const raw = (cols[numberIdx] || "").trim();
//   //       if (!raw) continue;
//   //       if (!E164_REGEX.test(raw)) throw new Error(`Invalid: ${raw}`);

//   //       const entry = { number: raw };
//   //       if (nameIdx !== -1 && cols[nameIdx]?.trim()) {
//   //         entry.name = cols[nameIdx].trim();
//   //       }
//   //       parsed.push(entry);
//   //     }

//   //     setCustomers(parsed);
//   //     setBatchStatus(`Parsed ${parsed.length} numbers.`);
//   //   } catch (err) {
//   //     setCustomers([]);
//   //     setBatchStatus(`CSV error: ${err.message}`);
//   //   }
//   // };

//   // // ===== Create campaign =====
//   // const createCampaign = async () => {
//   //   if (!campaignName.trim()) {
//   //     setBatchStatus("Campaign name required.");
//   //     return;
//   //   }
//   //   if (!assistantId) {
//   //     setBatchStatus("No assistant available.");
//   //     return;
//   //   }
//   //   if (customers.length === 0) {
//   //     setBatchStatus("Upload CSV first.");
//   //     return;
//   //   }

//   //   try {
//   //     setBatchStatus("Creating campaign…");
//   //     const payload = {
//   //       name: campaignName.trim(),
//   //       phoneNumberId: CAMPAIGN_PHONE_NUMBER_ID,
//   //       assistantId, // ✅ auto-injected
//   //       customers,
//   //     };

//   //     const { data } = await axios.post(`${API_BASE}/create-campaign`, payload);
//   //     setBatchStatus(
//   //       data?.success
//   //         ? `✅ Campaign created: ${data.campaign?.name || campaignName}`
//   //         : `Failed: ${data?.message || "Unknown error"}`
//   //     );
//   //   } catch (err) {
//   //     setBatchStatus(`Error: ${err?.response?.data?.message || err.message}`);
//   //   }
//   // };
// const onCsvChange = async (e) => {
//   const file = e.target.files?.[0];
//   setCustomers([]);
//   setBatchStatus("");

//   if (!file) return;

//   try {
//     const text = await file.text();
//     const lines = text
//       .split(/\r?\n/)
//       .map((l) => l.trim())
//       .filter(Boolean);
//     if (lines.length < 2) throw new Error("CSV must include header + rows");

//     const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
//     const numberIdx = header.findIndex((col) => col === "number");
//     const nameIdx = header.findIndex((col) => col === "name");

//     if (numberIdx === -1) throw new Error("CSV needs 'number' column");

//     const parsed = [];
//     for (let i = 1; i < lines.length; i++) {
//       const cols = lines[i].split(",");
//       const raw = (cols[numberIdx] || "").trim();
//       if (!raw) continue;
//       if (!E164_REGEX.test(raw)) throw new Error(`Invalid: ${raw}`);

//       const entry = { number: raw };
//       if (nameIdx !== -1 && cols[nameIdx]?.trim()) {
//         entry.name = cols[nameIdx].trim();
//       }
//       parsed.push(entry);
//     }

//     setCustomers(parsed);
//     setBatchStatus(`Parsed ${parsed.length} numbers.`);
//   } catch (err) {
//     setCustomers([]);
//     // 🔹 Friendly error messages instead of raw ones
//     let userMessage = "CSV upload failed. Please check the file format.";

//     if (err.message.includes("header")) {
//       userMessage = "CSV must include a header row.";
//     } else if (err.message.includes("number")) {
//       userMessage = "CSV must include a 'number' column.";
//     } else if (err.message.includes("Invalid")) {
//       userMessage = "One or more phone numbers are invalid.";
//     }

//     setBatchStatus(userMessage);
//   }
// };

// // ===== Create campaign =====
// const createCampaign = async () => {
//   if (!campaignName.trim()) {
//     setBatchStatus("Campaign name required.");
//     return;
//   }
//   if (!assistantId) {
//     setBatchStatus("No assistant available.");
//     return;
//   }
//   if (customers.length === 0) {
//     setBatchStatus("Upload CSV first.");
//     return;
//   }

//   try {
//     setBatchStatus("Creating campaign…");
//     const payload = {
//       name: campaignName.trim(),
//       phoneNumberId: CAMPAIGN_PHONE_NUMBER_ID,
//       assistantId, // ✅ auto-injected
//       customers,
//     };

//     const { data } = await axios.post(`${API_BASE}/create-campaign`, payload);
//     setBatchStatus(
//       data?.success
//         ? `✅ Campaign created: ${data.campaign?.name || campaignName}`
//         : "Failed to create campaign. Please try again."
//     );
//   } catch (err) {
//     // 🔹 Friendly error messages instead of raw ones
//     let userMessage = "Failed to create campaign. Please try again later.";

//     if (err.response?.status === 400) {
//       userMessage = "Invalid request. Please check your inputs.";
//     } else if (err.response?.status === 401) {
//       userMessage = "Unauthorized. Please log in again.";
//     } else if (err.response?.status === 404) {
//       userMessage = "Service unavailable. Try again later.";
//     } else if (err.response?.status === 500) {
//       userMessage = "Server error. Please try again after some time.";
//     }

//     setBatchStatus(userMessage);
//   }
// };

//   return (
//     <>
//       <BackButton />
//       <div className="min-h-[85vh] bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
//           {/* ===== Single Outbound Call ===== */}
//           <div className="bg-white rounded-2xl shadow-xl p-8">
//             <h2 className="text-3xl font-bold text-center text-purple-700 mb-2">
//               Outbound Call
//             </h2>
//             {/* <p className="text-center text-sm text-gray-500 mb-6">{assistStatus}</p> */}

//             <label className="block text-gray-700 text-lg font-medium mb-2">
//               Phone Number (E.+918974653...)
//             </label>
//             <input
//               type="text"
//               value={phoneNumber}
//               onChange={(e) => setPhoneNumber(e.target.value)}
//               placeholder="+15551234567"
//               className="w-full px-4 py-3 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4"
//             />

//             <button
//               onClick={handleInitiateCall}
//               className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-full text-white font-semibold text-lg shadow-md transition-all"
//               disabled={!assistantId}
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

//           {/* ===== Campaign ===== */}
//           <div className="bg-white rounded-2xl shadow-xl p-8">
//             <h2 className="text-3xl font-bold text-center text-indigo-700 mb-2">
//               Batch Calling
//             </h2>
//             {/* <p className="text-center text-sm text-gray-500 mb-6">{assistStatus}</p> */}

//             <label className="block text-gray-700 text-lg font-medium mb-2">
//               Call Purpose
//             </label>
//             <input
//               type="text"
//               value={campaignName}
//               onChange={(e) => setCampaignName(e.target.value)}
//               placeholder="Sales Campaign"
//               className="w-full px-4 py-3 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4"
//             />

//             <label className="block text-gray-700 text-lg font-medium mb-2">
//               Upload CSV (number column required)
//             </label>
//             <input
//               type="file"
//               accept=".csv"
//               onChange={onCsvChange}
//               className="w-full px-4 py-3 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-3"
//             />

//             <button
//               onClick={createCampaign}
//               className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold text-lg shadow-md transition-all"
//               disabled={!assistantId}
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

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const E164_REGEX = /^\+\d{8,15}$/;
const CAMPAIGN_PHONE_NUMBER_ID = import.meta.env.VITE_CAMPAIGN_PHONE_NUMBER_ID;

const OutboundCallForm = () => {
  const defaultAssistantId = import.meta.env.VITE_ASSISTANT_ID;

  // Assistant state
  const [assistantId, setAssistantId] = useState(null);
  const [assistStatus, setAssistStatus] = useState("Loading assistant…");

  // Single outbound call
  const [phoneNumber, setPhoneNumber] = useState("");
  const [knowledgeBaseId, setKnowledgeBaseId] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Campaign state
  const [campaignName, setCampaignName] = useState("Sales Campaign");
  const [customers, setCustomers] = useState([]);
  const [batchStatus, setBatchStatus] = useState("");
  const [isCampaignLoading, setIsCampaignLoading] = useState(false);

  // Auto-select assistant
  useEffect(() => {
    const fetchAssistantId = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/list-assistants`);
        if (Array.isArray(data) && data.length > 0) {
          setAssistantId(data[0].id);
          setAssistStatus(`Using assistant: ${data[0].name || data[0].id}`);
        } else {
          setAssistantId(defaultAssistantId);
          setAssistStatus("Using default assistant");
        }
      } catch (err) {
        console.error("Error fetching assistants:", err);
        setAssistantId(defaultAssistantId);
        setAssistStatus("Using default assistant");
      }
    };

    fetchAssistantId();
  }, [defaultAssistantId]);

  // Single outbound call
  const handleInitiateCall = async () => {
    setStatus("");

    if (!E164_REGEX.test(phoneNumber)) {
      setStatus("Invalid phone number. Use E.164 format like +918746532...");
      return;
    }

    try {
      setIsLoading(true);
      setStatus("Making the call…");
      const payload = {
        phoneNumber,
        knowledgeBaseId: knowledgeBaseId || undefined,
        assistantId: assistantId || undefined,
      };

      const { data } = await axios.post(
        `${API_BASE}/make-outbound-call`,
        payload
      );
      setStatus(
        data?.success
          ? "✅ Call initiated successfully"
          : data?.message || "Failed to initiate call"
      );
      
      // Clear phone number on success
      if (data?.success) {
        setPhoneNumber("");
      }
    } catch (error) {
      let message = "Something went wrong. Please try again later.";

      if (error.response?.status === 401) {
        message = "Unauthorized: Please check your credentials.";
      } else if (error.response?.status === 404) {
        message = "Not found: The requested resource doesn't exist.";
      } else if (error.response?.status === 500) {
        message = "Server error: Please try again after some time.";
      }

      setStatus(message);
    } finally {
      setIsLoading(false);
    }
  };

  // CSV parsing
  const onCsvChange = async (e) => {
    const file = e.target.files?.[0];
    setCustomers([]);
    setBatchStatus("");

    if (!file) return;

    try {
      const text = await file.text();
      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
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
      setBatchStatus(`✅ Parsed ${parsed.length} numbers successfully`);
    } catch (err) {
      setCustomers([]);
      let userMessage = "CSV upload failed. Please check the file format.";

      if (err.message.includes("header")) {
        userMessage = "CSV must include a header row.";
      } else if (err.message.includes("number")) {
        userMessage = "CSV must include a 'number' column.";
      } else if (err.message.includes("Invalid")) {
        userMessage = "One or more phone numbers are invalid.";
      }

      setBatchStatus(userMessage);
    }
  };

  // Create campaign
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
      setIsCampaignLoading(true);
      setBatchStatus("Creating campaign…");
      const payload = {
        name: campaignName.trim(),
        phoneNumberId: CAMPAIGN_PHONE_NUMBER_ID,
        assistantId,
        customers,
      };

      const { data } = await axios.post(`${API_BASE}/create-campaign`, payload);
      setBatchStatus(
        data?.success
          ? `✅ Campaign created: ${data.campaign?.name || campaignName}`
          : "Failed to create campaign. Please try again."
      );
      
      // Clear form on success
      if (data?.success) {
        setCampaignName("Sales Campaign");
        setCustomers([]);
      }
    } catch (err) {
      let userMessage = "Failed to create campaign. Please try again later.";

      if (err.response?.status === 400) {
        userMessage = "Invalid request. Please check your inputs.";
      } else if (err.response?.status === 401) {
        userMessage = "Unauthorized. Please log in again.";
      } else if (err.response?.status === 404) {
        userMessage = "Service unavailable. Try again later.";
      } else if (err.response?.status === 500) {
        userMessage = "Server error. Please try again after some time.";
      }

      setBatchStatus(userMessage);
    } finally {
      setIsCampaignLoading(false);
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
      <div className="relative z-10 p-6">
        <BackButton />
        
        <div className="container mx-auto px-4 py-16 pt-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Outbound Calling
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mt-1">
                Reach Your Customers
              </span>
            </h1>
            <p className="text-gray-400 text-base max-w-2xl mx-auto">
              Make individual calls or launch batch campaigns with AI-powered assistance
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Single Outbound Call Card */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Single Call</h2>
                  <p className="text-gray-400 text-sm">Make an instant call</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Phone Number
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+918746532..."
                      className="w-full px-4 py-3.5 bg-black/40 border border-cyan-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all group-hover:border-cyan-500/50"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5 ml-1">Format: E.164 (e.g., +918746532...)</p>
                </div>

                <button
                  onClick={handleInitiateCall}
                  disabled={!assistantId || isLoading}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Calling...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Initiate Call
                      </>
                    )}
                  </span>
                </button>

                {status && (
                  <div className={`p-4 rounded-xl border backdrop-blur-sm ${
                    status.includes("✅") 
                      ? "bg-green-500/10 border-green-500/50 text-green-400" 
                      : "bg-cyan-500/10 border-cyan-500/50 text-cyan-400"
                  } animate-in fade-in slide-in-from-top-2 duration-300`}>
                    <div className="flex items-start gap-2">
                      {status.includes("✅") ? (
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      <p className="text-sm">{status}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Batch Campaign Card */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Batch Campaign</h2>
                  <p className="text-gray-400 text-sm">Call multiple numbers</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="Sales Campaign"
                    className="w-full px-4 py-3.5 bg-black/40 border border-blue-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-500/50"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Upload CSV File
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={onCsvChange}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label
                      htmlFor="csv-upload"
                      className="flex items-center justify-center w-full px-4 py-3.5 bg-black/40 border border-blue-500/30 rounded-xl text-gray-400 hover:bg-black/60 hover:border-blue-500/50 transition-all cursor-pointer group"
                    >
                      <svg className="w-5 h-5 mr-2 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="group-hover:text-white transition-colors">
                        {customers.length > 0 ? (
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {customers.length} numbers loaded
                          </span>
                        ) : (
                          "Choose CSV file"
                        )}
                      </span>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5 ml-1">
                    CSV must include a "number" column (E.164 format)
                  </p>
                </div>

                <button
                  onClick={createCampaign}
                  disabled={!assistantId || isCampaignLoading || customers.length === 0}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    {isCampaignLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Create Campaign
                      </>
                    )}
                  </span>
                </button>

                {batchStatus && (
                  <div className={`p-4 rounded-xl border backdrop-blur-sm ${
                    batchStatus.includes("✅") 
                      ? "bg-green-500/10 border-green-500/50 text-green-400" 
                      : "bg-blue-500/10 border-blue-500/50 text-blue-400"
                  } animate-in fade-in slide-in-from-top-2 duration-300`}>
                    <div className="flex items-start gap-2">
                      {batchStatus.includes("✅") ? (
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      <p className="text-sm">{batchStatus}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-12 max-w-7xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Quick Tips
              </h3>
              <ul className="text-gray-400 text-sm space-y-2.5">
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1 flex-shrink-0">•</span>
                  <span>Phone numbers must be in E.164 format (e.g., +918746532...)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1 flex-shrink-0">•</span>
                  <span>For batch campaigns, upload a CSV with a "number" column</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1 flex-shrink-0">•</span>
                  <span>Optional: Include a "name" column for personalized greetings</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutboundCallForm;