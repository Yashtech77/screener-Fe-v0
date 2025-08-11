// src/Components/BackButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; // Optional: Lucide icon

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center text-purple-600 hover:text-purple-800 mb-4 transition-all"
    >
      <ArrowLeft className="mr-2" />
      <span>Back</span>
    </button>
  );
};

export default BackButton;
