import { Suspense, lazy, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logos/tdt_logo.png';
import { useAuth } from '../auth/AuthContext';
import PasswordField from '../components/common/PasswordField';
import { PASSWORD_MIN_LENGTH } from '../auth/authService';
import '../styles/auth.css';

const pageMotion = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const QRScanner = lazy(() => import('../components/cards/QRScanner'));

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [busy, setBusy] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    setError('');

    if (password.length < PASSWORD_MIN_LENGTH) {
      setError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters.`);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setBusy(true);
    window.setTimeout(() => {
      const result = signup({ firstName, lastName, email, department, password });
      setBusy(false);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      navigate('/approval-pending', { replace: true });
    }, 800);
  };

  return (
    <div className="auth-page-wrapper auth-signup-page">
      <div className="auth-steel-bg" />
      <div className="auth-vignette" />
      <div className="auth-ambient-glow" />

      <motion.div className="auth-page" variants={pageMotion} initial="hidden" animate="visible">
        <div className="auth-container auth-layout">
          <section className="auth-panel left auth-left">
            <div className="auth-content">
              <div className="auth-branding">
                <span className="auth-label">Sales Performance System</span>
                <img src={logo} alt="TDT logo" className="auth-logo" />
                <p>Advanced Lead Tracking & Revenue Analytics</p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-row">
                  <div className="auth-field">
                    <label>FIRST NAME</label>
                    <input type="text" placeholder="John" value={firstName} onChange={event => setFirstName(event.target.value)} required />
                  </div>
                  <div className="auth-field">
                    <label>LAST NAME</label>
                    <input type="text" placeholder="Doe" value={lastName} onChange={event => setLastName(event.target.value)} required />
                  </div>
                </div>
                <div className="auth-field">
                  <label>EMAIL</label>
                  <input type="email" placeholder="john@email.com" value={email} onChange={event => setEmail(event.target.value)} required />
                </div>
                <div className="auth-field">
                  <label>DEPARTMENT</label>
                  <input type="text" placeholder="Sales Department" value={department} onChange={event => setDepartment(event.target.value)} required />
                </div>
                <div className="auth-field">
                  <label>PASSWORD</label>
                  <PasswordField
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                    autoComplete="new-password"
                  />
                </div>
                <div className="auth-field">
                  <label>CONFIRM PASSWORD</label>
                  <PasswordField
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    autoComplete="new-password"
                  />
                </div>
                {error && <p className="auth-form-feedback auth-form-feedback-error">{error}</p>}

                <div className="auth-actions">
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: '#ff8a1f' }}
                    whileTap={{ scale: 0.98 }}
                    className="auth-primary-btn"
                    type="submit"
                  >
                    {busy ? 'CREATING...' : 'SIGN UP'}
                  </motion.button>
                  <div className="auth-meta-row">
                    <Link to="/login" className="auth-switch-link auth-bottom-link">Back to login</Link>
                  </div>
                </div>
              </form>
            </div>
          </section>

          <section className="auth-panel right auth-right">
            <Suspense fallback={<div className="qr-scanner-fallback" />}>
              <QRScanner
                title="Scan Your QR Code"
                subtitle="Save Your QR Code for Future Access"
                compact
              />
            </Suspense>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
