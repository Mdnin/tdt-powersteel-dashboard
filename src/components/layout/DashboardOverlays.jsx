import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiBell, FiLogOut, FiMonitor, FiSave, FiSettings, FiSliders, FiUser } from 'react-icons/fi';
import { useAuth } from '../../auth/AuthContext';

function ToggleControl({ label, checked, onChange }) {
  return (
    <label className="settings-toggle-row">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="settings-toggle" aria-hidden="true" />
    </label>
  );
}

export function SettingsPanel({ isOpen, onClose, onSave, onNotify }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    particles: true,
    hoverPopups: true,
    compactMode: false,
    glow: 68,
    sidebarCollapsed: false,
    animationSpeed: 'Normal',
    zoom: 100,
    qrLogin: true,
    sessionTimeout: '30 min',
    rememberDevice: true,
    emailAlerts: true,
    weeklyDigest: true,
    denseTables: false
  });

  const toggle = key => {
    setSettings(current => ({ ...current, [key]: !current[key] }));
  };

  const update = (key, value) => {
    setSettings(current => ({ ...current, [key]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="settings-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="settings-panel"
            initial={{ x: '104%', opacity: 0.7 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '104%', opacity: 0.7 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Dashboard settings"
          >
            <div className="settings-panel-glow" />
            <header className="settings-header">
              <div>
                <span>Control Center</span>
                <h2>Settings</h2>
              </div>
              <button className="settings-close" type="button" onClick={onClose} aria-label="Close settings">x</button>
            </header>

            <div className="settings-body">
              <section className="settings-section">
                <div className="settings-section-title">
                  <FiUser />
                  <h3>Profile Settings</h3>
                </div>
                <label className="settings-field">
                  <span>Full Name</span>
                  <input value={user?.name || ''} readOnly />
                </label>
                <label className="settings-field">
                  <span>Department</span>
                  <input value={user?.department || 'Sales Analytics'} readOnly />
                </label>
                <label className="settings-field">
                  <span>Email</span>
                  <input type="email" value={user?.email || ''} readOnly />
                </label>
                <label className="settings-field">
                  <span>Role</span>
                  <input value={user?.role || ''} readOnly />
                </label>
              </section>

              <section className="settings-section">
                <div className="settings-section-title">
                  <FiSliders />
                  <h3>Theme</h3>
                </div>
                <label className="settings-range">
                  <span>Dark glow intensity</span>
                  <input type="range" min="0" max="100" value={settings.glow} onChange={event => update('glow', event.target.value)} />
                  <strong>{settings.glow}%</strong>
                </label>
                <ToggleControl label="Enable particles background" checked={settings.particles} onChange={() => toggle('particles')} />
              </section>

              <section className="settings-section">
                <div className="settings-section-title">
                  <FiBell />
                  <h3>Notifications</h3>
                </div>
                <ToggleControl label="Email alerts" checked={settings.emailAlerts} onChange={() => toggle('emailAlerts')} />
                <ToggleControl label="Weekly performance digest" checked={settings.weeklyDigest} onChange={() => toggle('weeklyDigest')} />
              </section>

              <section className="settings-section">
                <div className="settings-section-title">
                  <FiMonitor />
                  <h3>UI Preferences</h3>
                </div>
                <ToggleControl label="Sidebar collapsed by default" checked={settings.sidebarCollapsed} onChange={() => toggle('sidebarCollapsed')} />
                <ToggleControl label="Enable hover analytics popups" checked={settings.hoverPopups} onChange={() => toggle('hoverPopups')} />
                <ToggleControl label="Compact mode" checked={settings.compactMode} onChange={() => toggle('compactMode')} />
                <ToggleControl label="Dense table rows" checked={settings.denseTables} onChange={() => toggle('denseTables')} />
                <label className="settings-field">
                  <span>Animation speed</span>
                  <select value={settings.animationSpeed} onChange={event => update('animationSpeed', event.target.value)}>
                    <option>Slow</option>
                    <option>Normal</option>
                    <option>Fast</option>
                  </select>
                </label>
                <label className="settings-range">
                  <span>Dashboard zoom scale</span>
                  <input type="range" min="85" max="120" value={settings.zoom} onChange={event => update('zoom', event.target.value)} />
                  <strong>{settings.zoom}%</strong>
                </label>
              </section>

              <section className="settings-section">
                <div className="settings-section-title">
                  <FiSettings />
                  <h3>Account Preferences</h3>
                </div>
                <ToggleControl label="QR Login enabled" checked={settings.qrLogin} onChange={() => toggle('qrLogin')} />
                <label className="settings-field">
                  <span>Session timeout</span>
                  <select value={settings.sessionTimeout} onChange={event => update('sessionTimeout', event.target.value)}>
                    <option>15 min</option>
                    <option>30 min</option>
                    <option>60 min</option>
                    <option>End of day</option>
                  </select>
                </label>
                <ToggleControl label="Remember device" checked={settings.rememberDevice} onChange={() => toggle('rememberDevice')} />
              </section>
            </div>

            <footer className="settings-footer">
              <button className="nav-btn nav-btn-secondary" type="button" onClick={onClose}>Cancel</button>
              <button className="nav-btn nav-btn-secondary" type="button" onClick={onSave}>
                <FiSave size={16} />
                Save Settings
              </button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function LogoutConfirm({ isOpen, onCancel, onConfirm }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="logout-modal-shell" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="logout-modal"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
          >
            <span className="logout-modal-kicker">Secure Session</span>
            <h3>Log out of TDT Powersteel?</h3>
            <p>Your dashboard session will be cleared and protected routes will require login again.</p>
            <div className="logout-modal-actions">
              <button className="nav-btn nav-btn-secondary" type="button" onClick={onCancel}>Cancel</button>
              <button className="nav-btn nav-btn-secondary logout-danger" type="button" onClick={onConfirm}>
                <FiLogOut size={16} />
                Logout
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function SettingsToast({ isVisible, message = 'Settings saved', tone = 'success' }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`settings-toast settings-toast-${tone}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
