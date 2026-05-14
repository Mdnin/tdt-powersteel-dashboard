import { useMemo, useState } from 'react';
import { Camera, Save } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import StatusBadge from '../components/common/StatusBadge';
import { baseSalesReps } from '../data/salesRepData';
import { getPerformanceState } from '../utils/salesRepUtils';
import '../styles/profile.css';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState(() => ({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    position: user?.position || 'Sales Representative',
    department: user?.department || 'Sales Department',
    avatar: user?.avatar || ''
  }));
  const [message, setMessage] = useState('');

  const initials = useMemo(() => {
    const first = form.firstName?.slice(0, 1) || user?.name?.slice(0, 1) || 'U';
    const last = form.lastName?.slice(0, 1) || '';
    return `${first}${last}`.toUpperCase();
  }, [form.firstName, form.lastName, user?.name]);
  const performanceState = useMemo(() => {
    const rep = baseSalesReps.find(item => item.name.toLowerCase() === user?.name?.toLowerCase());
    return rep ? getPerformanceState(rep.performance) : getPerformanceState(user?.status === 'approved' ? 76 : 48);
  }, [user?.name, user?.status]);

  const updateField = key => event => {
    setForm(current => ({ ...current, [key]: event.target.value }));
  };

  const handleAvatarUpload = event => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm(current => ({ ...current, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = event => {
    event.preventDefault();
    const result = updateProfile(form);
    setMessage(result.message);
  };

  return (
    <section className="profile-page">
      <div className="profile-hero">
        <div>
          <small className="profile-kicker">Employee Profile</small>
          <h1>Profile Management</h1>
          <p>Keep your visible workforce identity current across the dashboard.</p>
        </div>
        <StatusBadge status={performanceState} type="performance" />
      </div>

      <form className="profile-card" onSubmit={handleSubmit}>
        <div className="profile-avatar-editor">
          <div className="profile-avatar-preview">
            {form.avatar ? <img src={form.avatar} alt="" /> : <span>{initials}</span>}
          </div>
          <label className="profile-avatar-upload">
            <Camera size={16} />
            Upload avatar
            <input type="file" accept="image/*" onChange={handleAvatarUpload} />
          </label>
        </div>

        <div className="profile-form-grid">
          <label>
            <span>First name</span>
            <input value={form.firstName} onChange={updateField('firstName')} />
          </label>
          <label>
            <span>Last name</span>
            <input value={form.lastName} onChange={updateField('lastName')} />
          </label>
          <label>
            <span>Position</span>
            <input value={form.position} onChange={updateField('position')} />
          </label>
          <label>
            <span>Department</span>
            <input value={form.department} onChange={updateField('department')} />
          </label>
        </div>

        {message && <p className="profile-save-message">{message}</p>}

        <button className="profile-save-btn" type="submit">
          <Save size={16} />
          Save Profile
        </button>
      </form>
    </section>
  );
}
