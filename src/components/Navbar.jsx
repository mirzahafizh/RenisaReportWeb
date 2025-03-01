import React, { useState } from 'react';

const Navbar = () => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const username = localStorage.getItem('username') || 'Nama Pengguna';

  return (
    <nav className="bg-gray-800 w-full p-4 fixed top-0 left-0 z-10"> {/* Fixed positioning for full width */}
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold text-white">
            <i className="fas fa-file-alt mr-2"></i>
            Dashboard Laporan
          </h2>
        </div>
        <div className="relative flex items-center">
          <button className="text-white mx-4 focus:outline-none" onClick={toggleUserDropdown}>
            {username}
          </button>
          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-12 w-48 bg-white rounded-md shadow-lg py-1">
              <a className="block px-4 py-2 text-gray-800 hover:bg-gray-200" href="/dashboard/profile">
                Profile
              </a>
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
