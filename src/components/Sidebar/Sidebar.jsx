import React from "react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import {
  FaRegClock,
  FaUmbrellaBeach,
  FaUsers,
  FaClipboardList,
  FaChartBar,
  FaCalendarAlt,
  FaCheckCircle,
  FaSignOutAlt,
  FaFileAlt 
} from "react-icons/fa";

export default function Sidebar({ role }) {
  const nav = useNavigate();

  const menu = {
    Employee: [
      { name: "Attendance", path: "/employee/attendance", icon: <FaRegClock /> },
      { name: "Leaves", path: "/employee/leaves", icon: <FaUmbrellaBeach /> },
      { name: "Logout", path: "/login", icon: <FaSignOutAlt /> },
    ],
   HR: [
  { name: "Employee Management", path: "/hr/employees", icon: <FaUsers /> },
  { name: "Payroll Processing", path: "/hr/payroll", icon: <FaChartBar /> },
{ name: "Reports", path: "/hr/reports", icon: <FaFileAlt /> },
  { name: "Logout", path: "/login", icon: <FaSignOutAlt /> },
],

    Manager: [
      { name: "Approve Timesheets", path: "/manager/timesheets", icon: <FaCheckCircle /> },
      { name: "Manage Schedules", path: "/manager/schedules", icon: <FaCalendarAlt /> },
      { name: "Logout", path: "/login", icon: <FaSignOutAlt /> },
    ],
  };

  const handleNavigation = (item) => {
    if (item.name === "Logout") {
      const confirmLogout = window.confirm("Are you sure you want to logout?");
      if (confirmLogout) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        nav("/login");
      }
    } else {
      nav(item.path);
    }
  };

  return (
    <div className="sidebar bg-gray-800 text-white h-screen p-5">
      <h2 className="text-xl font-bold mb-6">{role} Panel</h2>
      <ul className="space-y-3">
        {menu[role]?.map((item, i) => (
          <li
            key={i}
            onClick={() => handleNavigation(item)}
            className={`flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-700 transition ${
              item.name === "Logout" ? "text-red-400 hover:text-red-300" : ""
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
