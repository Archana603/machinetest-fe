import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import "./HR.css";

export default function HRPayroll() {
  const [payroll, setPayroll] = useState([]);

  const fetchPayroll = async () => {
    const res = await axios.get("/api/hr/payroll");
    setPayroll(res.data);
  };

  const processPayroll = async (id) => {
    await axios.post(`/api/hr/payroll/${id}/process`);
    fetchPayroll();
  };

  useEffect(() => { fetchPayroll(); }, []);

  return (
    <DashboardLayout role="HR">
      <div className="page-container">
        <h2 className="page-title">Payroll Processing</h2>

        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Hours Worked</th>
                <th>Wage</th>
                <th>Overtime</th>
                <th>Total Salary</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payroll.map((p) => (
                <tr key={p._id}>
                  <td>{p.employeeName}</td>
                  <td>{p.hours}</td>
                  <td>{p.wage}</td>
                  <td>{p.overtime}</td>
                  <td>{p.total}</td>
                  <td>{p.status}</td>
                  <td>
                    {p.status !== "Paid" && (
                      <button className="btn pay-btn" onClick={() => processPayroll(p._id)}>
                        Generate Payroll
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
