import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import useApi from '../hooks/useApi';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { request } = useApi();
  const [form, setForm] = useState({ name: '', email: '', bio: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({ ...prev, name: user.name, email: user.email, bio: user.bio || '' }));
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email, bio: form.bio };
      if (form.password) payload.password = form.password;

      const data = await request('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      updateUser(data);
      toast.success('Profile updated!');
      setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="page">
      <div className="profile-wrap">
        <div className="profile-sidebar">
          <div className="avatar avatar-lg">{initials}</div>
          <h2>{user?.name}</h2>
          <p className="muted">{user?.email}</p>
          {user?.bio && <p className="profile-bio">{user.bio}</p>}
        </div>

        <div className="profile-form-wrap">
          <h2 className="section-title">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input name="name" type="text" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Bio <span className="muted">(optional)</span></label>
              <textarea
                name="bio"
                rows={3}
                maxLength={300}
                placeholder="Tell us a little about yourself…"
                value={form.bio}
                onChange={handleChange}
              />
              <span className="char-count">{form.bio.length}/300</span>
            </div>

            <div className="divider">Change Password <span className="muted">(leave blank to keep current)</span></div>

            <div className="form-row">
              <div className="form-group">
                <label>New Password</label>
                <input name="password" type="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input name="confirmPassword" type="password" placeholder="Repeat new password" value={form.confirmPassword} onChange={handleChange} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
