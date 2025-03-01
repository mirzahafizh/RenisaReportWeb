import React from 'react';
import { FaTimes } from 'react-icons/fa'; // Import the Font Awesome X icon

const FailureModal = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition"
                    aria-label="Close"
                >
                    <FaTimes size={20} />
                </button>
                <h2 className="text-xl font-bold mb-4 text-red-600">Error</h2>
                <p className="text-gray-700">{message}</p>
                <button
                    onClick={onClose}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition mt-4 w-full"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default FailureModal;
