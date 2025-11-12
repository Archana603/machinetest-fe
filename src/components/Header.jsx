// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../auth';

// export default function Header() {
//   const { user, logout } = useAuth();
//   return (
//     <header style={{ padding: '10px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between' }}>
//       <div><Link to="/">TimePay</Link></div>
//       <nav>
//         {user ? (
//           <>
//             <span style={{ marginRight: 10 }}>{user.name} ({user.role})</span>
//             <button onClick={logout}>Logout</button>
//           </>
//         ) : (
//           <Link to="/login">Login</Link>
//         )}
//       </nav>
//     </header>
//   );
// }
