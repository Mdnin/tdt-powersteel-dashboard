import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { LogoutConfirm, SettingsPanel, SettingsToast } from './DashboardOverlays';
import PresentationMode from '../../pages/PresentationMode';
import '../../styles/dashboard.css';
import '../../styles/presentation.css';

function DashboardLayout({ children, onLogout }) {
  const [isPresenting, setIsPresenting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [settingsToast, setSettingsToast] = useState({ isVisible: false, message: 'Settings saved', tone: 'success' });
  const toastTimerRef = useRef(null);

  const showToast = useCallback((message, tone = 'success') => {
    window.clearTimeout(toastTimerRef.current);
    setSettingsToast({ isVisible: true, message, tone });
    toastTimerRef.current = window.setTimeout(() => {
      setSettingsToast(current => ({ ...current, isVisible: false }));
    }, 2600);
  }, []);

  const exitPresentation = useCallback(() => {
    setIsPresenting(false);

    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    }
  }, []);

  const enterPresentation = useCallback(() => {
    setIsPresenting(true);
    document.documentElement.requestFullscreen?.().catch(() => {});
  }, []);

  const togglePresentation = useCallback(() => {
    if (isPresenting) {
      exitPresentation();
      return;
    }

    enterPresentation();
  }, [enterPresentation, exitPresentation, isPresenting]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(open => !open);
  }, []);

  const handleSaveSettings = useCallback(() => {
    setIsSettingsOpen(false);
    showToast('Settings saved', 'success');
  }, [showToast]);

  const handleConfirmLogout = useCallback(() => {
    setIsLogoutOpen(false);
    onLogout?.();
  }, [onLogout]);

  const openSettings = useCallback(() => setIsSettingsOpen(true), []);
  const closeSettings = useCallback(() => setIsSettingsOpen(false), []);
  const openLogout = useCallback(() => setIsLogoutOpen(true), []);
  const closeLogout = useCallback(() => setIsLogoutOpen(false), []);
  const pageClassName = useMemo(
    () => `dashboard-page ${isPresenting ? 'presentation-mode' : ''} ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`,
    [isPresenting, isSidebarOpen]
  );
  const pageStyle = useMemo(
    () => ({ willChange: 'opacity', '--sidebar-width': isSidebarOpen ? '252px' : '90px' }),
    [isSidebarOpen]
  );

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === 'Escape' && isPresenting) {
        exitPresentation();
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsPresenting(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.clearTimeout(toastTimerRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [exitPresentation, isPresenting]);

  return (
    <motion.div
      className={pageClassName}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={pageStyle}
    >
      {isPresenting ? (
        <PresentationMode onExit={exitPresentation} />
      ) : (
        <>
          <Sidebar
            isOpen={isSidebarOpen}
            onToggle={toggleSidebar}
            onOpenSettings={openSettings}
            onOpenLogout={openLogout}
          />

          <main className="dashboard-content">
            <Navbar isPresenting={isPresenting} onTogglePresentation={togglePresentation} />
            {children}
          </main>

          <div className="sidebar-backdrop" onClick={toggleSidebar} />
          <SettingsPanel
            isOpen={isSettingsOpen}
            onClose={closeSettings}
            onSave={handleSaveSettings}
            onNotify={showToast}
          />
          <LogoutConfirm isOpen={isLogoutOpen} onCancel={closeLogout} onConfirm={handleConfirmLogout} />
          <SettingsToast isVisible={settingsToast.isVisible} message={settingsToast.message} tone={settingsToast.tone} />
        </>
      )}
    </motion.div>
  );
}

export default memo(DashboardLayout);
