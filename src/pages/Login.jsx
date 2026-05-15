import { Suspense, lazy, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import logo from '../assets/logos/tdt_logo.png';
import { useAuth } from '../auth/AuthContext';
import PasswordField from '../components/common/PasswordField';
import TeamCredits from '../components/common/TeamCredits';
import { PASSWORD_MIN_LENGTH, updateUserPasswordByIdentity } from '../auth/authService';
import '../styles/auth.css';

const pageMotion = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const QRScanner = lazy(() => import('../components/cards/QRScanner'));

export default function Login() {
  const { login } = useAuth();
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isTeamPanelOpen, setIsTeamPanelOpen] = useState(false);
  const [passwordNotice, setPasswordNotice] = useState({ message: '', tone: 'success' });
  const [passwordForm, setPasswordForm] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = event => {
    event.preventDefault();
    setError('');

    if (password.length < PASSWORD_MIN_LENGTH) {
      setError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters.`);
      return;
    }

    setBusy(true);
    window.setTimeout(() => {
      const result = login(identity, password, remember);
      if (!result.ok) {
        setError(result.message);
      }
      setBusy(false);
    }, 600);
  };

  const updatePasswordField = key => event => {
    setPasswordForm(current => ({ ...current, [key]: event.target.value }));
  };

  const openPasswordModal = () => {
    setPasswordNotice({ message: '', tone: 'success' });
    setPasswordForm(current => ({ ...current, email: current.email || identity }));
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPasswordNotice({ message: '', tone: 'success' });
  };

  const handlePasswordChange = event => {
    event.preventDefault();
    const result = updateUserPasswordByIdentity(
      passwordForm.email,
      passwordForm.currentPassword,
      passwordForm.newPassword,
      passwordForm.confirmPassword
    );
    setPasswordNotice({ message: result.message, tone: result.ok ? 'success' : 'error' });
    if (result.ok) {
      setPasswordForm({ email: passwordForm.email, currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  return (
    <div className="auth-page-wrapper auth-login-page">
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
                <div className="auth-field">
                  <span>EMAIL OR NAME</span>
                  <input value={identity} onChange={e => setIdentity(e.target.value)} placeholder="Enter Email or Name" required />
                </div>
                <div className="auth-field">
                  <span>PASSWORD</span>
                  <PasswordField
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                </div>
                {error && <p className="auth-form-feedback auth-form-feedback-error">{error}</p>}
                <div className="auth-options-row">
                  <label className="auth-checkbox">
                    <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} />
                    Remember me
                  </label>
                  <button className="auth-change-password-link" type="button" onClick={openPasswordModal}>Change Password</button>
                </div>
                <div className="auth-action-row">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="primary-btn" type="submit" disabled={busy}>
                    {busy ? 'AUTHENTICATING...' : 'LOGIN'}
                  </motion.button>
                  <Link to="/signup" className="auth-alt-link auth-bottom-link">Create account</Link>
                </div>
              </form>
            </div>
          </section>

          <section className="auth-panel right auth-right">
            <Suspense fallback={<div className="qr-scanner-fallback" />}>
              <QRScanner title="Scan Your QR Code" subtitle="Align your employee QR code inside the scanner frame" />
            </Suspense>
          </section>
        </div>
      </motion.div>

      {isPasswordModalOpen && (
        <div className="auth-modal-backdrop" role="presentation" onMouseDown={closePasswordModal}>
          <motion.form
            className="auth-password-modal"
            onSubmit={handlePasswordChange}
            onMouseDown={event => event.stopPropagation()}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
          >
            <div className="auth-modal-header">
              <span className="auth-section-label">Secure Account</span>
              <h3>Change Password</h3>
            </div>
            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                value={passwordForm.email}
                onChange={updatePasswordField('email')}
                placeholder="Enter Email or Name"
                required
              />
            </label>
            <label className="auth-field">
              <span>Current Password</span>
              <PasswordField
                value={passwordForm.currentPassword}
                onChange={updatePasswordField('currentPassword')}
                placeholder="Enter current password"
                autoComplete="current-password"
                required
              />
            </label>
            <label className="auth-field">
              <span>New Password</span>
              <PasswordField
                value={passwordForm.newPassword}
                onChange={updatePasswordField('newPassword')}
                placeholder="Enter new password"
                autoComplete="new-password"
                required
              />
            </label>
            <label className="auth-field">
              <span>Confirm Password</span>
              <PasswordField
                value={passwordForm.confirmPassword}
                onChange={updatePasswordField('confirmPassword')}
                placeholder="Confirm new password"
                autoComplete="new-password"
                required
              />
            </label>
            {passwordNotice.message && (
              <p className={`auth-form-feedback auth-form-feedback-${passwordNotice.tone}`}>{passwordNotice.message}</p>
            )}
            <div className="auth-modal-actions">
              <button className="auth-modal-secondary" type="button" onClick={closePasswordModal}>Cancel</button>
              <button className="primary-btn" type="submit">Update Password</button>
            </div>
          </motion.form>
        </div>
      )}

      <button className="login-team-credit" type="button" onClick={() => setIsTeamPanelOpen(true)}>
        System Development Team
      </button>
      <TeamCredits isOpen={isTeamPanelOpen} onClose={() => setIsTeamPanelOpen(false)} />
    </div>
  );
}
