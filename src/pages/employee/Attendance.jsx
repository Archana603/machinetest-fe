import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import { useAuth } from "../../auth";
import "./EmployeeDashboard.css";

export default function Attendance() {
  const { user } = useAuth();
  const [timesheets, setTimesheets] = useState([]);
  const [message, setMessage] = useState("");
  const [isClockedIn, setIsClockedIn] = useState(false);

  const fetchData = async () => {
    const res = await axios.get("/api/timesheets/me");
    setTimesheets(res.data);
    const latest = res.data[res.data.length - 1];
    setIsClockedIn(latest && !latest.clockOut);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleClock = async () => {
    try {
      if (!isClockedIn) {
        await axios.post("/api/timesheets/clockin");
        setMessage("✅ Clocked In successfully");
      } else {
        await axios.post("/api/timesheets/clockout");
        setMessage("⏰ Clocked Out successfully");
      }
      fetchData();
    } catch (e) {
      setMessage(e.response?.data?.message || "Error occurred");
    }
  };

  return (
    <DashboardLayout role="Employee">
      <div className="page-container">
        <h2 className="page-title">Attendance</h2>

        <div className="attendance-actions">
          <button
            onClick={toggleClock}
            className={isClockedIn ? "btn clockout-btn" : "btn clockin-btn"}
          >
            {isClockedIn ? "Clock Out" : "Clock In"}
          </button>
          <p className="message">{message}</p>
        </div>

        <h3 className="section-title">Timesheet</h3>
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Clock In</th>
                <th>Clock Out</th>
                <th>Hours</th>
                <th>Approved</th>
              </tr>
            </thead>
            <tbody>
              {timesheets.map((ts) => (
                <tr key={ts._id}>
                  <td>{ts.date}</td>
                  <td>{ts.clockIn ? new Date(ts.clockIn).toLocaleTimeString() : "-"}</td>
                  <td>{ts.clockOut ? new Date(ts.clockOut).toLocaleTimeString() : "-"}</td>
                  <td>{ts.durationHours || "-"}</td>
                  <td>{ts.approved ? "✔️" : "❌"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
