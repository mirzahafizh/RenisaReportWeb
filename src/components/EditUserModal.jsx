// EditUserModal.js
import React, { useEffect, useState } from "react";

const EditUserModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [role, setRole] = useState(user ? user.role : ""); // Initialize role based on user

  useEffect(() => {
    // Update role when user changes
    if (user) {
      setRole(user.role);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(user.id, role); // Call the update function with user ID and new role
    onClose(); // Close the modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h3 className="text-lg font-bold mb-4">Edit User Role</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 text-gray-600">
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 text-white p-2 rounded">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
