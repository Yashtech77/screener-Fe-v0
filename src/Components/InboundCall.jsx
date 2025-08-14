 

// import React, { useEffect, useRef, useState } from 'react';
// import BackButton from '../section/Backbutton';

// const InboundCall = () => {
//   const [status, setStatus] = useState('Idle');
//   const [isCalling, setIsCalling] = useState(false);
//   const vapiInstanceRef = useRef(null);

//   const assistantId = '1d854369-f262-4c77-a0c3-5b0774346227';
//   const apiKey = '1267e6c8-4af0-4c16-8367-7af22c64c399';


//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = 'https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js';
//     script.async = true;
//     script.onload = () => console.log('Vapi SDK loaded');
//     document.body.appendChild(script);
//   }, []);

//   const removeVapiWidget = () => {
//     const widget = document.getElementById('vapi-container');
//     if (widget) widget.remove();
//   };

//   const handleInboundCall = () => {
//     if (!window.vapiSDK) return;

//     if (!vapiInstanceRef.current) {
//       setIsCalling(true);
//       setStatus('Connecting to AI assistant...');

//       const instance = window.vapiSDK.run({
//         apiKey,
//         assistant: assistantId,
//         config: { color: '#5e35b1', icon: 'phone' }
//       });

//       instance.on('call-start', () => {
//         setStatus('Call connected – speaking with AI...');
//       });

//       instance.on('call-end', () => {
//         setStatus('Call ended');
//         setIsCalling(false);
//         removeVapiWidget();
//         vapiInstanceRef.current = null;
//         setTimeout(() => setStatus('Idle'), 2000);
//       });

//       instance.on('error', (err) => {
//         setStatus(`Error: ${err.message}`);
//         setIsCalling(false);
//         removeVapiWidget();
//         vapiInstanceRef.current = null;
//       });

//       vapiInstanceRef.current = instance;
//     } else {
//       vapiInstanceRef.current.stop();
//       removeVapiWidget();
//       vapiInstanceRef.current = null;
//       setIsCalling(false);
//       setStatus('Call ended by user');
//     }
//   };

//   return (
//     <>
//       <BackButton />
//       <div className="h-[77vh] bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center px-4 py-12">
//         <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8">
//           <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
//             Inbound AI Call
//           </h2>

//           <div className="flex justify-center mb-6">
//             <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-orange-400 text-white flex items-center justify-center text-3xl shadow-lg ${isCalling ? 'animate-pulse' : ''}`}>
//               <i className="fas fa-user-headset" />
//             </div>
//           </div>

//           <p className="text-center text-gray-600 mb-4 font-medium">AI Customer Bot</p>

//           <div className="bg-purple-100 text-purple-700 text-sm px-4 py-2 rounded mb-4 text-center">
//             {status}
//           </div>

//           <button
//             onClick={handleInboundCall}
//             className={`w-full py-3 rounded-full text-white font-semibold text-lg transition-all ${isCalling ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'}`}
//           >
//             <i className={`fas ${isCalling ? 'fa-phone-slash' : 'fa-phone-alt'} mr-2`} />
//             {isCalling ? 'End Conversation' : 'Start AI Conversation'}
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default InboundCall;
import React, { useEffect, useRef, useState } from 'react';
import BackButton from '../section/Backbutton';
import axios from 'axios';

const InboundCall = () => {
  const [status, setStatus] = useState('Idle');
  const [isCalling, setIsCalling] = useState(false);
  const [assistantId, setAssistantId] = useState(null);
  const vapiInstanceRef = useRef(null);

  const apiKey = '26b8392c-3306-4dc1-bc88-dde22be6800c';

  // Fetch assistant ID from backend
  useEffect(() => {
    const fetchAssistantId = async () => {
      try {
        const response = await axios.get('http://localhost:5000/list-assistants');
        const assistants = response.data;

        if (Array.isArray(assistants) && assistants.length > 0) {
          // Assuming the latest one is first (you can change logic if needed)
          setAssistantId(assistants[0].id);
        } else {
          setStatus('No assistants found');
        }
      } catch (err) {
        console.error('Error fetching assistants:', err);
        setStatus('Failed to fetch assistant');
      }
    };

    fetchAssistantId();
  }, []);

  // Load Vapi SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js';
    script.async = true;
    script.onload = () => console.log('Vapi SDK loaded');
    document.body.appendChild(script);
  }, []);

  const removeVapiWidget = () => {
    const widget = document.getElementById('vapi-container');
    if (widget) widget.remove();
  };

  const handleInboundCall = () => {
    if (!window.vapiSDK || !assistantId) return;

    if (!vapiInstanceRef.current) {
      setIsCalling(true);
      setStatus('Connecting to AI assistant...');

      const instance = window.vapiSDK.run({
        apiKey,
        assistant: assistantId,
        config: { color: '#5e35b1', icon: 'phone' }
      });

      instance.on('call-start', () => {
        setStatus('Call connected – speaking with AI...');
      });

      instance.on('call-end', () => {
        setStatus('Call ended');
        setIsCalling(false);
        removeVapiWidget();
        vapiInstanceRef.current = null;
        setTimeout(() => setStatus('Idle'), 2000);
      });

      instance.on('error', (err) => {
        setStatus(`Error: ${err.message}`);
        setIsCalling(false);
        removeVapiWidget();
        vapiInstanceRef.current = null;
      });

      vapiInstanceRef.current = instance;
    } else {
      vapiInstanceRef.current.stop();
      removeVapiWidget();
      vapiInstanceRef.current = null;
      setIsCalling(false);
      setStatus('Call ended by user');
    }
  };

  return (
    <>
      <BackButton />
      <div className="h-[77vh] bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
            Inbound AI Call
          </h2>

          <div className="flex justify-center mb-6">
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-orange-400 text-white flex items-center justify-center text-3xl shadow-lg ${isCalling ? 'animate-pulse' : ''}`}>
              <i className="fas fa-user-headset" />
            </div>
          </div>

          <p className="text-center text-gray-600 mb-4 font-medium">AI Customer Bot</p>

          <div className="bg-purple-100 text-purple-700 text-sm px-4 py-2 rounded mb-4 text-center">
            {status}
          </div>

          <button
            onClick={handleInboundCall}
            disabled={!assistantId}
            className={`w-full py-3 rounded-full text-white font-semibold text-lg transition-all ${isCalling ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'} ${!assistantId ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <i className={`fas ${isCalling ? 'fa-phone-slash' : 'fa-phone-alt'} mr-2`} />
            {isCalling ? 'End Conversation' : 'Start AI Conversation'}
          </button>
        </div>
      </div>
    </>
  );
};

export default InboundCall;
