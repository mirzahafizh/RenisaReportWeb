import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
import React, { useEffect, useState } from "react";
import EditUserModal from "../components/EditUserModal"; // Adjust the path as necessary
import FailureModal from "../components/FailureModal"; // Adjust the path as necessary
import SpinnerModal from "../components/SpinnerModal"; // Adjust the path as necessary
import SuccessModal from "../components/SuccessModal"; // Adjust the path as necessary

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFailureModalOpen, setIsFailureModalOpen] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true); // Show spinner
    try {
      const response = await axios.get("https://backend-laporan.vercel.app/api/user");
      setUsers(response.data.data);
    } catch (error) {
      setMessage("Error fetching users: " + error.message);
      setIsFailureModalOpen(true); // Open failure modal
    } finally {
      setIsLoading(false); // Hide spinner
    }
  };

  const handleEdit = (user) => {
    setEditUser(user); // Set the user to edit
    setIsModalOpen(true); // Open the modal
  };

  const handleUpdate = async (id, newRole) => {
    setIsLoading(true); // Show spinner
    try {
      await axios.put(`https://backend-laporan.vercel.app/api/user/${id}`, { role: newRole });
      setIsSuccessModalOpen(true); // Open success modal
      fetchUsers(); // Refresh the user list
    } catch (error) {
      setMessage("Error updating user role: " + error.message);
      setIsFailureModalOpen(true); // Open failure modal
    } finally {
      setIsLoading(false); // Hide spinner
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      setIsLoading(true); // Show spinner
      try {
        await axios.delete(`https://backend-laporan.vercel.app/api/user/${id}`);
        setIsSuccessModalOpen(true); // Open success modal
        fetchUsers(); // Refresh the user list
      } catch (error) {
        setMessage("Error deleting user: " + error.message);
        setIsFailureModalOpen(true); // Open failure modal
      } finally {
        setIsLoading(false); // Hide spinner
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      {message && <div className="alert">{message}</div>}
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="border-b border-gray-300 p-2">Username</th>
            <th className="border-b border-gray-300 p-2">Email</th>
            <th className="border-b border-gray-300 p-2">Role</th>
            <th className="border-b border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border text-center border-gray-300 p-2">{user.username}</td>
              <td className="border text-center border-gray-300 p-2">{user.email}</td>
              <td className="border text-center border-gray-300 p-2">{user.role}</td>
              <td className="border text-center border-gray-300 p-2 flex space-x-2 justify-center">
                <button
                  onClick={() => handleEdit(user)} // Pass user to edit
                  className="text-white bg-blue-600 p-2 rounded-md w-12"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => handleDelete(user.id)} // Trigger delete with confirmation
                  className="text-white bg-red-600 p-2 rounded-md w-12"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Close modal
        user={editUser} // Pass the current edit user data
        onUpdate={handleUpdate} // Pass the update function
      />

      {/* Spinner Modal */}
      {isLoading && <SpinnerModal />}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <SuccessModal
          message={message}
          onClose={() => setIsSuccessModalOpen(false)}
        />
      )}

      {/* Failure Modal */}
      {isFailureModalOpen && (
        <FailureModal
          message={message}
          onClose={() => setIsFailureModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ManageUsers;
