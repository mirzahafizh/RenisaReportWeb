// components/SuccessModal.js
import React from "react";
import { FaCheckCircle } from "react-icons/fa"; // Import the checkmark icon

const SuccessModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full flex flex-col items-center">
        <FaCheckCircle className="text-green-500 mb-4" size={40} /> {/* Checkmark icon */}
        <h2 className="text-lg font-bold text-green-600">Success</h2>
        <p className="text-gray-700 text-center mb-4">{message}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
