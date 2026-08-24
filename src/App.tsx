/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TopNav from './components/TopNav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import News from './pages/News';
import Activities from './pages/Activities';
import Kalender from './pages/Kalender';
import AdminLogin from './pages/AdminLogin';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import AdminOverview from './pages/AdminOverview';
import ResidentDirectory from './pages/ResidentDirectory';
import Finances from './pages/Finances';
import Infrastructure from './pages/Infrastructure';
import Complaints from './pages/Complaints';
import DashboardRT from './pages/DashboardRT';
import DashboardRTOverview from './pages/DashboardRTOverview';
import AdminPosts from './pages/AdminPosts';
import Sejarah from './pages/Sejarah';
import SystemLogsPage from './pages/SystemLogsPage';
import AdminSettings from './pages/AdminSettings';

import AccountsRT from './pages/AccountsRT';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />
        
        <Route path="/admin/dashboard" element={<AdminDashboard />}>
          <Route index element={<AdminOverview />} />
          <Route path="news" element={<AdminPosts type="news" />} />
          <Route path="activities" element={<AdminPosts type="activity" />} />
          <Route path="directory" element={<ResidentDirectory />} />
          <Route path="finances" element={<Finances />} />
          <Route path="infrastructure" element={<Infrastructure />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="accounts" element={<AccountsRT />} />
          <Route path="logs" element={<SystemLogsPage />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="/admin/dashboard-rt" element={<DashboardRT />}>
          <Route path="directory" element={<ResidentDirectory />} />
          <Route index element={<DashboardRTOverview />} />
          <Route path="news" element={<AdminPosts type="news" />} />
          <Route path="activities" element={<AdminPosts type="activity" />} />
        </Route>
        
        {/* Public Routes with standard layout */}
        <Route path="*" element={
          <div className="flex flex-col min-h-screen relative overflow-x-hidden bg-background text-on-background">
            <TopNav />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/news" element={<News />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/kalender" element={<Kalender />} />
              <Route path="/sejarah" element={<Sejarah />} />
            </Routes>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}
