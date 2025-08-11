import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import BackButton from '../section/Backbutton';  // For getting the callId from URL params

const CallDetails = () => {
  const { callId } = useParams(); // Get the callId from the URL
  const [callDetails, setCallDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch details of a specific call by ID
  const fetchCallDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer 3efd46ea-a136-4079-b4f3-426658e28c20",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch call details");
      }

      const data = await response.json();
      setCallDetails(data); // Set the fetched call details
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCallDetails();
  }, [callId]);

  const formatDate = (date) => new Date(date).toLocaleString();

  const formatTranscript = (transcript) => {
    if (!transcript || typeof transcript !== "string") {
      return <p className="text-gray-500">No transcript available</p>;
    }

    return transcript.split("\n").map((line, index) => {
      const parts = line.split(":");
      if (parts.length === 2) {
        const [role, message] = parts;
        return (
          <div key={index} className={`mb-2 ${role === "AI" ? "text-blue-500" : "text-green-500"}`}>
            <strong>{role}:</strong> {message}
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <BackButton />
      <h2 className="text-3xl font-semibold mb-4">Call Details</h2>

      {/* Display any errors */}
      {error && <p className="text-red-600">{error}</p>}

      {/* Display Loading */}
      {loading ? (
        <p>Loading...</p>
      ) : callDetails ? (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-medium text-gray-700 mb-4">Call Type: {callDetails.type}</h3>

          <div className="mb-4">
            <h4 className="font-semibold text-gray-700">Transcript:</h4>
            <div className="text-gray-600">{formatTranscript(callDetails.transcript)}</div>
          </div>

          {callDetails.artifact && callDetails.artifact.recordingUrl && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold">Recording:</h4>
              <audio controls className="mt-2 w-full">
                <source src={callDetails.artifact.recordingUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          <div className="mt-4">
            <h4 className="font-semibold text-gray-700">Created At:</h4>
            <p className="text-gray-600">{formatDate(callDetails.createdAt)}</p>
          </div>
        </div>
      ) : (
        !loading && <p>No call details available</p>
      )} 
    </div>
  );
};

export default CallDetails;
