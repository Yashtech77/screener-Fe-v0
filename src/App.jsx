// src/App.jsx
import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import OutboundCallForm from './Components/OutboundCallForm';
import CallLogs from './Components/CallLogs';
 
import Home from './Components/Home';
import Nav from './Components/Nav';
import CallDetails from './Components/CallDetails';
import InboundCall from './Components/InboundCall';
import KnowledgeBaseUpload from './Components/KnowledgeBaseUpload';
import ManageAssist from './Components/ManageAssist';

function App() {
  const location = useLocation();

  useEffect(() => {
    // Remove floating Vapi widget if present on route change
    const widget = document.getElementById('vapi-container');
    if (widget) {
      widget.remove();
    }
  }, [location.pathname]);

  return (
    <>
      <Nav />

      <div className="p-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/outbound-call" element={<OutboundCallForm />} />
          <Route path="/call-logs" element={<CallLogs />} />
          
          <Route path="/inbound-call" element={<InboundCall />} />
          <Route path="/call-details/:callId" element={<CallDetails />} />
          <Route path="/knowledge-base-upload" element={<KnowledgeBaseUpload />} />
          <Route path="/manage-assist" element={<ManageAssist />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
