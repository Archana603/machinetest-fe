import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import "./Manager.css";

export default function ManagerSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [message, setMessage] = useState("");

  const fetchSchedules = async () => {
    try {
      const res = await axios.get("/api/manager/schedules");
      setSchedules(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const updateSchedule = async (id, newShift) => {
    try {
      await axios.patch(`/api/manager/schedules/${id}`, { shift: newShift });
      setMessage("✅ Schedule updated successfully");
      fetchSchedules();
    } catch (err) {
      setMessage("❌ Failed to update schedule");
    }
  };

  return (
    <DashboardLayout role="Manager">
      <div className="page-container">
        <h2 className="page-title">Manage Team Schedules</h2>
        <p className="message">{message}</p>

        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Shift</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {schedules.length > 0 ? (
                schedules.map((s) => (
                  <tr key={s._id}>
                    <td>{s.employeeName}</td>
                    <td>{s.date}</td>
                    <td>{s.shift}</td>
                    <td>
                      <select
                        onChange={(e) =>
                          updateSchedule(s._id, e.target.value)
                        }
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Change Shift
                        </option>
                        <option value="Morning">Morning</option>
                        <option value="Evening">Evening</option>
                        <option value="Night">Night</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No schedules found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
