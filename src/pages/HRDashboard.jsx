import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function HRDashboard(){
  const [payrolls, setPayrolls] = useState([]);
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [msg, setMsg] = useState('');

  const fetch = async () => {
    const r = await axios.get('/api/payroll');
    setPayrolls(r.data);
  }

  useEffect(()=>{ fetch() }, []);

  const generate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/payroll/generate', { periodStart, periodEnd });
      setMsg(`Generated payrolls: ${res.data.generated}`);
      fetch();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>HR Dashboard</h2>
      <form onSubmit={generate}>
        <input type="date" value={periodStart} onChange={e=>setPeriodStart(e.target.value)} required />
        <input type="date" value={periodEnd} onChange={e=>setPeriodEnd(e.target.value)} required />
        <button type="submit">Generate Payroll</button>
      </form>
      <div style={{ color: 'green' }}>{msg}</div>

      <h3>Payroll Records</h3>
      <table border="1" cellPadding="6">
        <thead><tr><th>Period</th><th>Employee</th><th>Hours</th><th>Gross</th><th>Net</th></tr></thead>
        <tbody>
          {payrolls.map(p => (
            <tr key={p._id}>
              <td>{p.periodStart} → {p.periodEnd}</td>
              <td>{p.employee?.name}</td>
              <td>{p.totalHours}</td>
              <td>{p.grossPay}</td>
              <td>{p.netPay}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
