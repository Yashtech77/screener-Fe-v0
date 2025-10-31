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
 
//   useEffect(() => {
//     const fetchAssistantId = async () => {
//       try {
//         const { data } = await axios.get(`${API_BASE}/list-assistants`);
//         if (data?.id) {
//           setAssistantId(data.id);
//           setAssistStatus(`Using assistant: ${data.name || data.id}`);
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
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import BackButton from "../section/Backbutton";

// const API_BASE = "http://localhost:5000";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const E164_REGEX = /^\+\d{8,15}$/;
const CAMPAIGN_PHONE_NUMBER_ID = import.meta.env.VITE_CAMPAIGN_PHONE_NUMBER_ID;

const OutboundCallForm = () => {
  // -------- .env defaults --------
  const defaultAssistantId = import.meta.env.VITE_ASSISTANT_ID || null;

  // -------- assistants (bots) state --------
  const [assistants, setAssistants] = useState([]);              // [{id, name}]
  const [assistantId, setAssistantId] = useState(null);          // selected id
  const [assistantsLoading, setAssistantsLoading] = useState(true);
  const [assistantsError, setAssistantsError] = useState("");

  // -------- single call state --------
  const [phoneNumber, setPhoneNumber] = useState("");
  const [knowledgeBaseId, setKnowledgeBaseId] = useState("");
  const [status, setStatus] = useState("");

  // -------- batch/campaign state --------
  const [campaignName, setCampaignName] = useState("Sales Campaign");
  const [customers, setCustomers] = useState([]);
  const [batchStatus, setBatchStatus] = useState("");

  // -------- helpers --------
  const normalizeAssistants = (raw) => {
    // Accepts: array of {id,name} OR wrapped shapes like {items:[...]} OR {data:[...]}
    const arr =
      Array.isArray(raw) ? raw :
      Array.isArray(raw?.items) ? raw.items :
      Array.isArray(raw?.data) ? raw.data :
      [];

    return arr
      .map(a => ({
        id: a.id || a.assistant_id || a.uuid || "",
        name: a.name || a.displayName || a.title || "Unnamed",
      }))
      .filter(a => a.id);
  };

  const pickInitialAssistantId = (list) => {
    if (!list.length) return defaultAssistantId || null;

    // Prefer defaultAssistantId if it exists in list
    if (defaultAssistantId && list.some(a => a.id === defaultAssistantId)) {
      return defaultAssistantId;
    }
    // Otherwise choose first in list
    return list[0].id;
  };

  // -------- fetch assistants on mount --------
  useEffect(() => {
    let mounted = true;
    (async () => {
      setAssistantsLoading(true);
      setAssistantsError("");
      try {
        const { data } = await axios.get(`${API_BASE}/list-assistants`);
        const normalized = normalizeAssistants(data);

        if (!mounted) return;

        setAssistants(normalized);
        const initial = pickInitialAssistantId(normalized);
        setAssistantId(initial);
        if (!normalized.length && !defaultAssistantId) {
          setAssistantsError("No assistants found and no default is set.");
        }
      } catch (err) {
        if (!mounted) return;
        setAssistantsError("Failed to load assistants. Using .env default if available.");
        setAssistants([]);
        setAssistantId(defaultAssistantId || null);
      } finally {
        if (mounted) setAssistantsLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [API_BASE, defaultAssistantId]);

  const selectedAssistantName = useMemo(() => {
    const found = assistants.find(a => a.id === assistantId);
    if (found) return found.name;
    if (assistantId && defaultAssistantId === assistantId) return "(.env default)";
    return "";
  }, [assistants, assistantId, defaultAssistantId]);

  // ===== Single outbound call =====
  const handleInitiateCall = async () => {
    setStatus("");

    if (!assistantId) {
      setStatus("Please select a bot before making a call.");
      return;
    }
    if (!E164_REGEX.test(phoneNumber)) {
      setStatus("Invalid phone number. Use E.164 format like +91874653...");
      return;
    }

    try {
      setStatus("Making the call…");
      const payload = {
        phoneNumber,
        knowledgeBaseId: knowledgeBaseId || undefined,
        assistantId, // <-- selected from dropdown
      };

      const { data } = await axios.post(`${API_BASE}/make-outbound-call`, payload);
      setStatus(
        data?.success
          ? "Call initiated successfully"
          : data?.message || "Failed to initiate call"
      );
    } catch (error) {
      let message = "Something went wrong. Please try again later.";
      if (error.response?.status === 401) message = "Unauthorized: Please check your credentials.";
      else if (error.response?.status === 404) message = "Not found: The requested resource doesn’t exist.";
      else if (error.response?.status === 500) message = "Server error: Please try again after some time.";
      setStatus(message);
    }
  };

  // ===== CSV upload for batch =====
  const onCsvChange = async (e) => {
    const file = e.target.files?.[0];
    setCustomers([]);
    setBatchStatus("");

    if (!file) return;

    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) throw new Error("CSV must include header + rows");

      const header = lines[0].split(",").map(h => h.trim().toLowerCase());
      const numberIdx = header.findIndex(col => col === "number");
      const nameIdx = header.findIndex(col => col === "name");
      if (numberIdx === -1) throw new Error("CSV needs 'number' column");

      const parsed = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",");
        const raw = (cols[numberIdx] || "").trim();
        if (!raw) continue;
        if (!E164_REGEX.test(raw)) throw new Error(`Invalid: ${raw}`);
        const entry = { number: raw };
        if (nameIdx !== -1 && cols[nameIdx]?.trim()) entry.name = cols[nameIdx].trim();
        parsed.push(entry);
      }

      setCustomers(parsed);
      setBatchStatus(`Parsed ${parsed.length} numbers.`);
    } catch (err) {
      setCustomers([]);
      let userMessage = "CSV upload failed. Please check the file format.";
      if (err.message.includes("header")) userMessage = "CSV must include a header row.";
      else if (err.message.includes("number")) userMessage = "CSV must include a 'number' column.";
      else if (err.message.includes("Invalid")) userMessage = "One or more phone numbers are invalid.";
      setBatchStatus(userMessage);
    }
  };

  // ===== Create campaign (batch) =====
  const createCampaign = async () => {
    if (!campaignName.trim()) {
      setBatchStatus("Campaign name required.");
      return;
    }
    if (!assistantId) {
      setBatchStatus("Please select a bot first.");
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
        assistantId, // <-- selected from dropdown
        customers,
      };

      const { data } = await axios.post(`${API_BASE}/create-campaign`, payload);
      setBatchStatus(
        data?.success
          ? `✅ Campaign created: ${data.campaign?.name || campaignName}`
          : "Failed to create campaign. Please try again."
      );
    } catch (err) {
      let userMessage = "Failed to create campaign. Please try again later.";
      if (err.response?.status === 400) userMessage = "Invalid request. Please check your inputs.";
      else if (err.response?.status === 401) userMessage = "Unauthorized. Please log in again.";
      else if (err.response?.status === 404) userMessage = "Service unavailable. Try again later.";
      else if (err.response?.status === 500) userMessage = "Server error. Please try again after some time.";
      setBatchStatus(userMessage);
    }
  };

  // -------- UI --------
  return (
    <>
      <BackButton />
      <div className="min-h-[85vh] bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl">
          {/* ===== Bot Selector (TOP) ===== */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">Select Bot for Calling</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Bot (Assistant)
                </label>

                <select
                  value={assistantId || ""}
                  onChange={(e) => setAssistantId(e.target.value || null)}
                  disabled={assistantsLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  {/* Prefer showing actual assistant list if available */}
                  {assistantsLoading && <option>Loading assistants…</option>}

                  {!assistantsLoading && assistants.length === 0 && (
                    <>
                      <option value="">
                        {assistantsError || "No assistants found"}
                      </option>
                      {defaultAssistantId && (
                        <option value={defaultAssistantId}>
                          Use .env default ({defaultAssistantId})
                        </option>
                      )}
                    </>
                  )}

                  {!assistantsLoading && assistants.length > 0 && (
                    <>
                      <option value="" disabled>
                        — Select a bot —
                      </option>
                      {assistants.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}  
                        </option>
                      ))}
                      {/* Include .env default as explicit choice if it’s not in list */}
                      {defaultAssistantId &&
                        !assistants.some(a => a.id === defaultAssistantId) && (
                          <option value={defaultAssistantId}>
                            (.env default) {defaultAssistantId}
                          </option>
                        )}
                    </>
                  )}
                </select>

                {assistantId && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected bot: <span className="font-medium">{selectedAssistantName}</span> 
                  </p>
                )}

                {assistantsError && (
                  <p className="mt-2 text-sm text-red-600">{assistantsError}</p>
                )}
              </div>

             
            </div>
          </div>

          {/* ===== Two Column Panels ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* ===== Single Outbound Call ===== */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-center text-purple-700 mb-2">
                Outbound Call
              </h2>

              <label className="block text-gray-700 text-lg font-medium mb-2">
                Phone Number (E.+918974653...)
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
                className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-full text-white font-semibold text-lg shadow-md transition-all disabled:opacity-60"
                disabled={!assistantId || assistantsLoading}
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

            {/* ===== Campaign (Batch) ===== */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-center text-indigo-700 mb-2">
                Batch Calling
              </h2>

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
                className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold text-lg shadow-md transition-all disabled:opacity-60"
                disabled={!assistantId || assistantsLoading}
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
      </div>
    </>
  );
};

export default OutboundCallForm;
