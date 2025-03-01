import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FailureModal from '../components/FailureModal'; // Adjust the path as necessary
import SuccessModal from '../components/SuccessModal'; // Adjust the path as necessary

const AddUser = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user',
        foto: null,
    });
    const [message, setMessage] = useState('');
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isFailureModalOpen, setIsFailureModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            foto: e.target.files[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            Object.keys(formData).forEach((key) => {
                data.append(key, formData[key]);
            });

            await axios.post('https://backend-laporan.vercel.app/api/register', data);
            setMessage('User added successfully!');
            setIsSuccessModalOpen(true); // Open success modal
            setTimeout(() => {
                navigate('/dashboard/manage_user'); // Redirect after success
            }, 2000); // Delay to let modal display
        } catch (error) {
            setMessage('Error adding user: ' + error.message);
            setIsFailureModalOpen(true); // Open failure modal
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Add User</h2>
            {message && <div className="alert">{message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Role</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="border p-2 w-full"
                    >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="super admin">Super Admin</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Upload Photo</label>
                    <input
                        type="file"
                        name="foto"
                        onChange={handleFileChange}
                        className="border p-2 w-full"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition"
                >
                    Add User
                </button>
            </form>

            {/* Success Modal */}
            {isSuccessModalOpen && (
                <SuccessModal
                    message={message}
                    onClose={() => setIsSuccessModalOpen(false)} // Close modal
                />
            )}

            {/* Failure Modal */}
            {isFailureModalOpen && (
                <FailureModal
                    message={message}
                    onClose={() => setIsFailureModalOpen(false)} // Close modal
                />
            )}
        </div>
    );
};

export default AddUser;
