import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import "./Manager.css";

export default function ManagerTimesheets() {
  const [timesheets, setTimesheets] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

   // Fetch all pending timesheets
  const fetchTimesheets = async () => {
    try {
      const res = await axios.get("/api/timesheets/pending");
      setTimesheets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTimesheets();
  }, []);


  // Approve timesheet
  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`/api/timesheets/${id}/approve`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      setMessage("✅ Timesheet approved successfully");
      fetchTimesheets(); // Refresh the list
    } catch (err) {
      console.error("Error approving timesheet:", err);
      setMessage("❌ Failed to approve timesheet");
    }
  };

  // Reject timesheet
  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`/api/timesheets/${id}/reject`, {
        notes: "Rejected by manager"
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      setMessage("✅ Timesheet rejected successfully");
      fetchTimesheets(); // Refresh the list
    } catch (err) {
      console.error("Error rejecting timesheet:", err);
      setMessage("❌ Failed to reject timesheet");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <DashboardLayout role="Manager">
        <div className="page-container">
          <h2 className="page-title">Approve Timesheets</h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="Manager">
      <div className="page-container">
        <h2 className="page-title">Pending Timesheets Approval</h2>
        
        {message && (
          <div className={`message ${message.includes('❌') ? 'error-message' : 'success-message'}`}>
            {message}
          </div>
        )}

        <div className="summary-card">
          <div className="summary-item">
            <span className="summary-label">Total Pending:</span>
            <span className="summary-value">{timesheets.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Your Role:</span>
            <span className="summary-value">Manager</span>
          </div>
        </div>

        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Employee Email</th>
                <th>Employee Role</th>
                <th>Date</th>
                <th>Hours Worked</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {timesheets && timesheets.length > 0 ? (
                timesheets.map((t) => (
                  <tr key={t._id}>
                    {/* Employee Email */}
                    <td className="email-cell">
                      {t.user?.email || "No email"}
                    </td>
                    
                    {/* Employee Role */}
                    <td>
                      <span className="role-badge">
                        {t.user?.role || "Unknown"}
                      </span>
                    </td>
                    
                    {/* Date */}
                    <td>
                      {formatDate(t.date)}
                    </td>
                    
                    {/* Hours Worked */}
                    <td className="hours-cell">
                      <span className={`hours-badge ${t.durationHours === 0 ? 'zero-hours' : ''}`}>
                        {t.durationHours !== null && t.durationHours !== undefined 
                          ? `${t.durationHours} hours` 
                          : "N/A"
                        }
                      </span>
                    </td>
                    
                    {/* Status */}
                    <td>
                      <span className={`status-badge ${t.approved ? 'status-approved' : 'status-pending'}`}>
                        {t.status || (t.approved ? 'approved' : 'pending')}
                      </span>
                    </td>
                    
                    {/* Actions */}
                    <td>
                      {!t.approved && (
                        <div className="action-btns">
                          <button
                            className="btn approve-btn"
                            onClick={() => handleApprove(t._id)}
                          >
                            Approve
                          </button>
                          <button
                            className="btn reject-btn"
                            onClick={() => handleReject(t._id)}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {t.approved && (
                        <span className="approved-text">Approved</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    No pending timesheets found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}