import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import { useAuth } from "../../auth";
import "./EmployeeDashboard.css";

export default function Leave() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState("");

  const fetchLeaves = async () => {
    const res = await axios.get("/api/leaves/me");
    setLeaves(res.data);
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const requestLeave = async (e) => {
    e.preventDefault();
    const form = e.target;
    const body = {
      startDate: form.startDate.value,
      endDate: form.endDate.value,
      type: form.type.value,
      reason: form.reason.value,
    };
    try {
      await axios.post("/api/leaves", body);
      setMessage("✅ Leave requested successfully");
      fetchLeaves();
      form.reset();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error requesting leave");
    }
  };

  return (
    <DashboardLayout role="Employee">
      <div className="page-container">
        <h2 className="page-title">Leave Management</h2>

        <form onSubmit={requestLeave} className="leave-form">
          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input type="date" name="startDate" required />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input type="date" name="endDate" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Type</label>
              <select name="type">
                <option value="sick">Sick</option>
                <option value="vacation">Vacation</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Reason</label>
              <input type="text" name="reason" placeholder="Reason" />
            </div>
          </div>

          <button type="submit" className="btn submit-btn">Request Leave</button>
          <p className="message">{message}</p>
        </form>

        <h3 className="section-title">Your Leave Requests</h3>
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Start</th>
                <th>End</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l) => (
                <tr key={l._id}>
                  <td>{l.startDate}</td>
                  <td>{l.endDate}</td>
                  <td>{l.type}</td>
                  <td>{l.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
