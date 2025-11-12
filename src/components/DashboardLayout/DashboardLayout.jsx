import React from 'react';
import './DashboardLayout.css';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';

export default function DashboardLayout({ role, children }) {
  return (
    <div className="dashboard-layout">
      <Navbar role={role} />
      <Sidebar role={role} />
      <main className="dashboard-content">{children}</main>
    </div>
  );
}
