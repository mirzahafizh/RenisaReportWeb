import '@fortawesome/fontawesome-free/css/all.min.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';

import AddLaporan from './pages/AddLaporan';
import AddUser from './pages/AddUser';
import AllLaporan from './pages/AllLaporan';
import DashboardLayout from './pages/DashboardLayout';
import Login from './pages/login';
import ManageLaporan from './pages/ManageLaporan';
import ManageUsers from './pages/ManageUser';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Wrap all dashboard-related pages in DashboardLayout */}
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route path="manage_laporan" element={<ManageLaporan />} />
          <Route path="add_laporan" element={<AddLaporan />} />
          <Route path="all_laporan" element={<AllLaporan />} />
          <Route path="profile" element={<Profile />} />



        </Route>
        <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="manage_user" element={<ManageUsers />} />
        <Route path="add_user" element={<AddUser />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
