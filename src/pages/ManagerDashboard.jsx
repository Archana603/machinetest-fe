import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ManagerDashboard(){
  const [pendingTimesheets, setPendingTimesheets] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [msg, setMsg] = useState('');

  const fetch = async () => {
    const t = await axios.get('/api/timesheets/pending');
    setPendingTimesheets(t.data);
    const l = await axios.get('/api/leaves/pending');
    setPendingLeaves(l.data);
  }

  useEffect(()=>{ fetch() }, []);

  const approveTS = async (id) => {
    await axios.post(`/api/timesheets/${id}/approve`);
    setMsg('Approved timesheet');
    fetch();
  };
  const rejectTS = async (id) => {
    await axios.post(`/api/timesheets/${id}/reject`, { notes: 'Incorrect' });
    setMsg('Rejected timesheet');
    fetch();
  };

  const approveLeave = async (id) => { await axios.post(`/api/leaves/${id}/approve`); setMsg('Leave approved'); fetch(); }
  const rejectLeave = async (id) => { await axios.post(`/api/leaves/${id}/reject`); setMsg('Leave rejected'); fetch(); }

  return (
    <div style={{ padding: 20 }}>
      <h2>Manager Dashboard</h2>
      <div style={{ color: 'green' }}>{msg}</div>

      <section>
        <h3>Pending Timesheets</h3>
        {pendingTimesheets.map(ts => (
          <div key={ts._id} style={{ border: '1px solid #ccc', margin: 6, padding: 6 }}>
            <div>{ts.user.name} — {ts.date} — {ts.durationHours || 0} hrs</div>
            <button onClick={()=>approveTS(ts._id)}>Approve</button>
            <button onClick={()=>rejectTS(ts._1d)}>Reject</button>
          </div>
        ))}
      </section>

      <section>
        <h3>Pending Leaves</h3>
        {pendingLeaves.map(l => (
          <div key={l._id} style={{ border: '1px solid #ccc', margin: 6, padding: 6 }}>
            <div>{l.user.name} — {l.startDate} to {l.endDate} — {l.type}</div>
            <button onClick={()=>approveLeave(l._id)}>Approve</button>
            <button onClick={()=>rejectLeave(l._id)}>Reject</button>
          </div>
        ))}
      </section>
    </div>
  );
}
