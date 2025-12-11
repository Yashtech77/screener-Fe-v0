

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../section/Backbutton";
import axios from "axios";

export default function InboundCall() {
  const [status, setStatus] = useState("Idle");
  const [assistantId, setAssistantId] = useState(null);
  const vapiInstanceRef = useRef(null);
  const navigate = useNavigate();

  const apiKey = import.meta.env.VITE_VAPI_PUB_API_KEY;
  const defaultAssistantId = import.meta.env.VITE_ASSISTANT_ID;
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // 1) Fetch assistant once
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/list-assistants`);
        setAssistantId(data?.id || defaultAssistantId);
        setStatus(
          data?.id ? `Using assistant: ${data.name || data.id}` : "Using default assistant"
        );
      } catch {
        setAssistantId(defaultAssistantId);
        setStatus("Using default assistant");
      }
    })();
  }, [defaultAssistantId]);

  // 2) Load SDK once; cleanup on page unmount (NO redirect here)
  useEffect(() => {
    if (!window.__VAPI_SCRIPT_LOADED) {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
      s.async = true;
      s.onload = () => (window.__VAPI_SCRIPT_LOADED = true);
      document.body.appendChild(s);
    }
    return () => {
      try { vapiInstanceRef.current?.stop?.(); } catch {}
      // remove any widget remnants
      document.querySelectorAll('[id*="vapi"],[class*="vapi"]').forEach(el => {
        if (el.tagName !== "SCRIPT") el.remove();
      });
    };
  }, []);

  const removeVapiWidget = () => {
    document.querySelectorAll('[id*="vapi"],[class*="vapi"]').forEach(el => {
      if (el.tagName !== "SCRIPT") el.remove();
    });
  };

  const cleanupAndBack = () => {
    try { vapiInstanceRef.current?.stop?.(); } catch {}
    vapiInstanceRef.current = null;
    removeVapiWidget();
    // redirect ONLY after call ends/errors
    navigate(-1);
  };

  const startCall = () => {
    if (!window.vapiSDK || !assistantId) return;

    if (!vapiInstanceRef.current) {
      setStatus("Connecting to AI assistant...");

      const instance = window.vapiSDK.run({
        apiKey,
        assistant: assistantId,
        config: { color: "#5e35b1", icon: "phone" },
      });

      instance.on("call-start", () => setStatus("Call connected – speaking with AI..."));
      instance.on("call-end", cleanupAndBack);
      instance.on("error", () => {
        setStatus("Error – ending");
        cleanupAndBack();
      });

      vapiInstanceRef.current = instance;
    }
  };

  // 3) Start the call when both assistantId and SDK are ready
  useEffect(() => {
    if (!assistantId) return;

    // wait for SDK if script is still loading
    let tries = 0;
    const t = setInterval(() => {
      if (window.vapiSDK) {
        clearInterval(t);
        startCall();
      } else if (++tries > 40) {
        clearInterval(t);
        setStatus("Failed to load call SDK");
      }
    }, 100);

    // do not redirect from here; just clear timer
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assistantId]);

  return (
    <>
      <BackButton />
      <div className="h-[77vh] bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-purple-700 mb-6">Inbound AI Call</h2>
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-600 to-orange-400 text-white flex items-center justify-center text-3xl shadow-lg animate-pulse">
            <i className="fas fa-user-headset" />
          </div>
          <p className="text-gray-600 mb-4 font-medium">AI Customer Bot</p>
          <div className="bg-purple-100 text-purple-700 text-sm px-4 py-2 rounded text-center">
            {status}
          </div>
        </div>
      </div>
    </>
  );
}
