import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import "./Manager.css";

export default function ManagerTimesheets() {
  const [timesheets, setTimesheets] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all pending timesheets
  const fetchTimesheets = async () => {
    try {
      const res = await axios.get("/api/timesheets/pending");
      if (res.data && res.data.timesheets) {
        setTimesheets(res.data.timesheets);
      } else {
        setTimesheets([]);
      }
    } catch (err) {
      console.error("Error fetching timesheets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimesheets();
  }, []);

 // ✅ Approve timesheet
const handleApprove = async (id) => {
  try {
    const token = localStorage.getItem("tp_token");
    const res = await axios.post(
      `/api/timesheets/${id}/approve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (res.data.success) {
      setMessage(`✅ ${res.data.message}`);
    } else {
      setMessage(`❌ ${res.data.message || "Failed to approve timesheet"}`);
    }

    fetchTimesheets();
  } catch (err) {
    console.error("Error approving timesheet:", err);
    const errMsg = err.response?.data?.message || "Failed to approve timesheet";
    setMessage(`❌ ${errMsg}`);
  }
};


// ✅ Reject timesheet
const handleReject = async (id) => {
  try {
    const token = localStorage.getItem("tp_token");
    const res = await axios.post(
      `/api/timesheets/${id}/reject`,
      { notes: "Rejected by manager" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (res.data.success) {
      setMessage(`✅ ${res.data.message}`);
    } else {
      setMessage(`❌ ${res.data.message || "Failed to reject timesheet"}`);
    }

    fetchTimesheets();
  } catch (err) {
    console.error("Error rejecting timesheet:", err);
    const errMsg = err.response?.data?.message || "Failed to reject timesheet";
    setMessage(`❌ ${errMsg}`);
  }
};


  // ✅ Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <DashboardLayout role="Manager">
        <div className="page-container">
          <h2 className="page-title">Loading Timesheets...</h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="Manager">
      <div className="page-container">
        <h2 className="page-title">Pending Timesheets Approval</h2>

        {message && (
          <div
            className={`message ${
              message.includes("❌") ? "error-message" : "success-message"
            }`}
          >
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {timesheets.length > 0 ? (
                timesheets.map((t) => (
                  <tr key={t._id}>
                    <td>{t.user?.email || "No email"}</td>
                    <td>{t.user?.role || "Unknown"}</td>
                    <td>{formatDate(t.date)}</td>
                    <td>{t.durationHours !== undefined ? `${t.durationHours} hours` : "N/A"}</td>
                    <td>
                      {!t.approved ? (
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
                      ) : (
                        <span className="approved-text">Approved</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
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
