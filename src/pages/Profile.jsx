import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const formatFileLinks = (fileUpload) => {
    let files;
  
    try {
      files = JSON.parse(fileUpload);
    } catch (error) {
      files = fileUpload.split(",").map((file) => file.trim());
    }
  
    const baseUrls = [
      "https://ik.imagekit.io/renisa/laporan/",
      "https://ik.imagekit.io/renisa/users/"
    ];
  
    return files.map((file) => {
      // Check if the file starts with any of the base URLs
      const isBaseUrl = baseUrls.some(baseUrl => file.startsWith(baseUrl));
      const fileUrl = isBaseUrl ? file : baseUrls[0] + file; // Default to the first base URL
      return fileUrl;
    });
  };
  
  useEffect(() => {
    // Fetch user data from your API or local storage
    const fetchUserData = async () => {
      const id = localStorage.getItem('id'); // Assuming you have id stored
      try {
        const response = await axios.get(`https://backend-laporan.vercel.app/api/user/${id}`);
        const userData = response.data.data; // Access the nested 'data' object
        setUser(userData);
        setNewUsername(userData.username); // Set initial username
        setNewEmail(userData.email); // Set initial email
        
        // Set the image preview if exists using formatFileLinks
        if (userData.foto) {
          setImagePreview(formatFileLinks(userData.foto)[0]); // Set the first image URL as preview
        }
        
        setLoading(false);
      } catch (error) {
        setError('User data not found');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUserUpdate = async (e) => {
    e.preventDefault();
    const id = localStorage.getItem('id'); // Get the id again inside the function
    const formData = new FormData(); // Create FormData for both image and user data

    // Append user data to FormData
    formData.append('username', newUsername);
    formData.append('email', newEmail);
    formData.append('password', newPassword);

    // Append profile image if it exists
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    try {
        const response = await axios.put(`https://backend-laporan.vercel.app/api/user/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      
        // Log the response to see if it contains the expected updated data
        console.log('Response from server:', response.data);
      
        // Store updated user data in local storage
        const updatedUser = response.data.data; // Adjust based on your actual API response structure
        if (updatedUser) {
          localStorage.setItem('username', updatedUser.username);
          localStorage.setItem('email', updatedUser.email);
          localStorage.setItem('photo', updatedUser.foto ? formatFileLinks(updatedUser.foto)[0] : '');
          alert('User updated successfully');
        } else {
          console.error('Updated user data not found in response.');
        }
      
        // Clear inputs and reload
        setNewPassword('');
        setNewUsername('');
        setNewEmail('');
        setProfileImage(null);
        setImagePreview('');
        window.location.reload();
      
      } catch (error) {
        console.error('Error updating user:', error);
        setError('Error updating user: ' + error.message);
      }
      
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(file);
        setImagePreview(reader.result); // Set preview to the selected image
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="bg-white p-4 rounded shadow mb-4">
        {imagePreview && (
          <img src={imagePreview} alt="Profile" className="w-42 h-42 rounded-full mb-4 mx-auto" />
        )}
        <form onSubmit={handleUserUpdate} className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Update Profile</h3>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Username"
            className="border border-gray-300 p-2 rounded w-full mb-4"
          />
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Email"
            className="border border-gray-300 p-2 rounded w-full mb-4"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="border border-gray-300 p-2 rounded w-full mb-4"
          />
          <input
            type="file"
            onChange={handleImageChange}
            className="border border-gray-300 p-2 rounded w-full mb-4"
          />
          <button type="submit" className="bg-blue-600 text-white rounded-md px-4 py-2">
            Update User
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
