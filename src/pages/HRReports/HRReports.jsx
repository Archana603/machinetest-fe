import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import { FaUserClock, FaUmbrellaBeach } from "react-icons/fa";
import "./HRReports.css";

export default function HRReports() {
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);

  // Fetch attendance and leave reports
  const fetchReports = async () => {
    try {
      const [attRes, leaveRes] = await Promise.all([
        axios.get("/api/reports/attendance"),
        axios.get("/api/reports/leaves"),
      ]);

      // Ensure we extract arrays from responses
      setAttendance(attRes.data.timesheets || []);
      setLeaves(leaveRes.data.leaves || []);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <DashboardLayout role="HR">
      <div className="reports-container">
        <h2 className="page-title">📊 HR Reports Dashboard</h2>

        {/* Attendance Report */}
        <div className="report-section">
          <div className="section-header">
            <FaUserClock className="icon" /> <h3>Attendance Report</h3>
          </div>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Date</th>
                <th>Duration (Hours)</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length > 0 ? (
                attendance.map((a) => (
                  <tr key={a._id}>
                    <td>{a.user?.email || "N/A"}</td>
                    <td>{a.user?.role || "N/A"}</td>
                    <td>{a.date}</td>
                    <td>{a.durationHours ?? 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No attendance data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Leave Report */}
        <div className="report-section">
          <div className="section-header">
            <FaUmbrellaBeach className="icon" /> <h3>Leave Report</h3>
          </div>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length > 0 ? (
                leaves.map((l) => (
                  <tr key={l._id}>
                    <td>{l.user?.email || "N/A"}</td>
                    <td>{l.user?.role || "N/A"}</td>
                    <td>{l.type}</td>
                    <td>{l.startDate}</td>
                    <td>{l.endDate}</td>
                    <td>{l.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No leave data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
