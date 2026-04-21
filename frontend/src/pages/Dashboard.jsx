import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="page">
      <div className="dashboard">
        <div className="dashboard-header">
          <div className="avatar">{initials}</div>
          <div>
            <h1 className="dashboard-title">Hello, {user?.name.split(' ')[0]} 👋</h1>
            <p className="dashboard-sub">{user?.email}</p>
          </div>
        </div>

        <div className="cards-grid">
          <div className="card">
            <div className="card-icon">🔐</div>
            <h3>Secure Session</h3>
            <p>You're authenticated via a JWT stored in an HTTP-only cookie — inaccessible to JavaScript.</p>
          </div>
          <div className="card">
            <div className="card-icon">🛡️</div>
            <h3>Protected Route</h3>
            <p>This page is only reachable when logged in. Unauthenticated users are redirected to /login.</p>
          </div>
          <div className="card">
            <div className="card-icon">👤</div>
            <h3>Profile Management</h3>
            <p>Update your name, email, bio, or password at any time from your profile page.</p>
            <Link to="/profile" className="card-link">Go to Profile →</Link>
          </div>
          <div className="card">
            <div className="card-icon">📅</div>
            <h3>Member Since</h3>
            <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
