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
      files = fileUpload?.split(',').map((file) => file.trim());
    }

    const baseUrls = [
      'https://ik.imagekit.io/renisa/laporan/',
      'https://ik.imagekit.io/renisa/users/',
    ];

    return files?.map((file) => {
      const isBaseUrl = baseUrls.some((baseUrl) => file.startsWith(baseUrl));
      return isBaseUrl ? file : baseUrls[0] + file;
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const id = localStorage.getItem('id');
      if (!id) {
        setError('User ID not found in localStorage');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`https://backend-laporan.vercel.app/api/user/${id}`);
        const userData = response.data.data;

        setUser(userData);
        setNewUsername(userData.username || '');
        setNewEmail(userData.email || '');
        if (userData.foto) {
          const imageUrl = formatFileLinks(userData.foto)[0];
          setImagePreview(imageUrl);
        }

        setLoading(false);
      } catch (err) {
        setError('Gagal mengambil data user.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUserUpdate = async (e) => {
    e.preventDefault();
    const id = localStorage.getItem('id');
    if (!id) {
      setError('User ID not found');
      return;
    }

    const formData = new FormData();
    formData.append('username', newUsername);
    formData.append('email', newEmail);
    formData.append('password', newPassword);
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `https://backend-laporan.vercel.app/api/user/${id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const updatedUser = response.data?.data;

      if (updatedUser) {
        localStorage.setItem('username', updatedUser.username);
        localStorage.setItem('email', updatedUser.email);
        localStorage.setItem(
          'photo',
          updatedUser.foto ? formatFileLinks(updatedUser.foto)[0] : ''
        );
        alert('Profil berhasil diperbarui');
        window.location.reload();
      } else {
        throw new Error('Data user tidak ditemukan dalam response');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      setError('Gagal memperbarui data user: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(file);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Silakan unggah file gambar yang valid');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Profil</h2>
      <div className="bg-white p-4 rounded shadow mb-4">
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Profile"
            className="w-42 h-42 rounded-full mb-4 mx-auto"
          />
        )}
        <form onSubmit={handleUserUpdate} className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Perbarui Profil</h3>

          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Username"
            className="border border-gray-300 p-2 rounded w-full mb-4"
            required
          />

          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Email"
            className="border border-gray-300 p-2 rounded w-full mb-4"
            required
          />

          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Password Baru"
            className="border border-gray-300 p-2 rounded w-full mb-4"
          />

          <input
            type="file"
            onChange={handleImageChange}
            className="border border-gray-300 p-2 rounded w-full mb-4"
            accept="image/*"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white rounded-md px-4 py-2 disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Perbarui Profil'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
