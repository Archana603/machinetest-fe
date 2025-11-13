import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../auth';
import DashboardLayout from '../components/DashboardLayout/DashboardLayout';

export default function EmployeeDashboard(){
  const { user } = useAuth();
  const [timesheets, setTimesheets] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState('');

  const fetch = async () => {
    const t = await axios.get('/api/timesheets/me');
    setTimesheets(t.data);
    const l = await axios.get('/api/leaves/me');
    setLeaves(l.data);
  }

  useEffect(()=>{ fetch() }, []);

  const clockIn = async () => {
    try {
      await axios.post('/api/timesheets/clockin');
      setMessage('Clocked in');
      fetch();
    } catch (e) { setMessage(e.response?.data?.message || 'Error'); }
  }
  const clockOut = async () => {
    try {
      await axios.post('/api/timesheets/clockout');
      setMessage('Clocked out');
      fetch();
    } catch (e) { setMessage(e.response?.data?.message || 'Error'); }
  }

  const requestLeave = async (e) => {
    e.preventDefault();
    const form = e.target;
    const body = { startDate: form.startDate.value, endDate: form.endDate.value, type: form.type.value, reason: form.reason.value };
    try {
      await axios.post('/api/leaves', body);
      setMessage('Leave requested');
      fetch();
      form.reset();
    } catch(e) { setMessage(e.response?.data?.message || 'Error'); }
  }

  return (
    <DashboardLayout role="Employee">
    <div style={{ padding: 20 }}>
      <h2>Welcome, {user?.name}</h2>
     

      <section>
        <h3>Timesheets</h3>
        <table border="1" cellPadding="6">
          <thead><tr><th>Date</th><th>In</th><th>Out</th><th>Hours</th><th>Approved</th></tr></thead>
          <tbody>
            {timesheets.map(ts => <tr key={ts._id}>
              <td>{ts.date}</td>
              <td>{ts.clockIn ? new Date(ts.clockIn).toLocaleTimeString() : '-'}</td>
              <td>{ts.clockOut ? new Date(ts.clockOut).toLocaleTimeString() : '-'}</td>
              <td>{ts.durationHours}</td>
              <td>{ts.approved ? 'Yes' : 'No'}</td>
            </tr>)}
          </tbody>
        </table>
      </section>

      <section style={{ marginTop: 20 }}>
        <h3>Request Leave</h3>
        <form onSubmit={requestLeave}>
          <input name="startDate" type="date" required /> to <input name="endDate" type="date" required />
          <select name="type"><option value="sick">Sick</option><option value="vacation">Vacation</option><option value="other">Other</option></select>
          <input name="reason" placeholder="Reason" />
          <button type="submit">Request</button>
        </form>

        <h4>Your Leaves</h4>
        <ul>
          {leaves.map(l => <li key={l._id}>{l.startDate} → {l.endDate} — {l.type} — {l.status}</li>)}
        </ul>
      </section>
    </div>
    </DashboardLayout>
  );
}
