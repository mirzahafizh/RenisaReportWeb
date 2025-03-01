import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(atob(token.split('.')[1]));
    setUserRole(userData.role);
  }, [navigate]);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-mono">
      {/* Navbar outside of the flex container */}
      <Navbar />

      <div className="flex flex-1 mt-16">
        {/* Sidebar */}
        <aside className="w-20 md:w-64 bg-gray-800 text-white min-h-screen p-6">
          <nav>
            <ul>
              <li className="mb-4">
                <Link
                  to="/dashboard/manage_laporan"
                  className="text-white hover:bg-gray-700 px-3 py-2 rounded-md flex items-center justify-center md:justify-start"
                >
                  <i className="fas fa-file-alt mr-0 md:mr-2"></i>
                  <span className="hidden md:block">Manage Reports</span>
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/dashboard/all_laporan"
                  className="text-white hover:bg-gray-700 px-3 py-2 rounded-md flex items-center justify-center md:justify-start"
                >
                  <i className="fas fa-file-alt mr-0 md:mr-2"></i>
                  <span className="hidden md:block">All Reports</span>
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/dashboard/add_laporan"
                  className="text-white hover:bg-gray-700 px-3 py-2 rounded-md flex items-center justify-center md:justify-start"
                >
                  <i className="fas fa-plus-circle mr-0 md:mr-2"></i>
                  <span className="hidden md:block">Add Report</span>
                </Link>
              </li>

              {(userRole === 'admin' || userRole === 'superadmin') && (
                <>
                  <li className="mb-4">
                    <Link
                      to="/dashboard/manage_user"
                      className="text-white hover:bg-gray-700 px-3 py-2 rounded-md flex items-center justify-center md:justify-start"
                    >
                      <i className="fas fa-users mr-0 md:mr-2"></i>
                      <span className="hidden md:block">Manage User</span>
                    </Link>
                  </li>

                  <li className="mb-4">
                    <Link
                      to="/dashboard/add_user"
                      className="text-white hover:bg-gray-700 px-3 py-2 rounded-md flex items-center justify-center md:justify-start"
                    >
                      <i className="fas fa-plus-circle mr-0 md:mr-2"></i>
                      <span className="hidden md:block">Add User</span>
                    </Link>
                  </li>
                </>
              )}

              <li className="mt-6">
                <button
                  onClick={handleLogout}
                  className="text-white hover:bg-gray-700 px-3 py-2 rounded-md flex items-center justify-center md:justify-start"
                >
                  <i className="fas fa-sign-out-alt mr-0 md:mr-2"></i>
                  <span className="hidden md:block">Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
