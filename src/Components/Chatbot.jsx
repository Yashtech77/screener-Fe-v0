// src/components/Chatbot.jsx
import React, { useState } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I help you today?' },
  ]);
  const [userInput, setUserInput] = useState('');

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (userInput.trim()) {
      setMessages([...messages, { sender: 'user', text: userInput }]);
      setUserInput('');
      // Simulate a dummy bot response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: `You said: "${userInput}"` },
        ]);
      }, 1000);
    }
  };

  return (
    <div className=" h-[78vh]  w-auto bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col">
      <div className="bg-blue-700 text-white p-3 rounded-t-lg">
        <h2 className="text-center text-lg">Chatbot</h2>
      </div>

      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === 'bot' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                message.sender === 'bot' ? 'bg-gray-200' : 'bg-blue-600 text-white'
              }`}
            >
              <p>{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center p-3 w-auto border-t border-gray-200">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="p-2 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 focus:outline-none"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
