import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import "./HR.css";

export default function HREmployees() {
  const [employees, setEmployees] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", role: "Employee", wage: "" });

 const fetchEmployees = async () => {
  try {
    const res = await axios.get("/api/hr/employees");
    setEmployees(res.data.employees || []);
  } catch (error) {
    console.error("Error fetching employees:", error);
    setEmployees([]); // fallback to empty array
  }
};


  useEffect(() => { fetchEmployees(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await axios.put(`/api/hr/employees/${editing._id}`, form);
    } else {
      await axios.post("/api/hr/employees", form);
    }
    fetchEmployees();
    setForm({ name: "", email: "", role: "Employee", wage: "" });
    setEditing(null);
  };

  const handleEdit = (emp) => {
    setEditing(emp);
    setForm(emp);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this employee?")) {
      await axios.delete(`/api/hr/employees/${id}`);
      fetchEmployees();
    }
  };

  return (
    <DashboardLayout role="HR">
      <div className="page-container">
        <h2 className="page-title">Employee Management</h2>

        <form onSubmit={handleSubmit} className="form-grid">
          <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option>Employee</option>
            <option>Manager</option>
            <option>HR</option>
          </select>
          <input placeholder="Hourly Wage" type="number" value={form.wage} onChange={e => setForm({ ...form, wage: e.target.value })} required />
          <button type="submit" className="btn submit-btn">{editing ? "Update" : "Add"} Employee</button>
        </form>

        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Email</th><th>Role</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e._id}>
                
                  <td>{e.email}</td>
                  <td>{e.role}</td>
                 
                  <td>
                    <button onClick={() => handleEdit(e)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDelete(e._id)} className="delete-btn">Delete</button>
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
