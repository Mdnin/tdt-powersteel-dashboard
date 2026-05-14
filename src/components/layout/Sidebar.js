import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiChevronUp, FiGrid, FiLogOut, FiMenu, FiPieChart, FiSettings, FiUsers, FiBarChart2, FiUser, FiShield, FiUserCheck } from 'react-icons/fi';
import { useAuth } from '../../auth/AuthContext';
import '../../styles/sidebar.css';

import logo from '../../assets/logos/tdt_logo.png';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', Icon: FiGrid },
  { path: '/lead-sources', label: 'Lead Sources', Icon: FiPieChart },
  { path: '/sales-reps', label: 'Sales Reps', Icon: FiUsers },
  { path: '/reports', label: 'Reports', Icon: FiBarChart2 }
];

const adminNavItems = [
  { path: '/admin', label: 'Admin Panel', Icon: FiShield },
  { path: '/admin/pending-approvals', label: 'Pending Approvals', Icon: FiUserCheck },
  { path: '/admin/users', label: 'User Management', Icon: FiUsers }
];

const SidebarNavItem = memo(function SidebarNavItem({ path, label, Icon }) {
  return (
    <NavLink
      to={path}
      end
      className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
    >
      <span className="sidebar-link-icon">
        <Icon />
      </span>
      <span className="sidebar-link-label">{label}</span>
    </NavLink>
  );
});

const SidebarSectionLabel = memo(function SidebarSectionLabel({ children }) {
  return (
    <div className="sidebar-section-label">
      <span>{children}</span>
    </div>
  );
});

const ProfileMenu = memo(function ProfileMenu({
  isOpen,
  isAdmin,
  user,
  roleLabel,
  menuRef,
  onOpenProfile,
  onOpenSettings,
  onOpenLogout
}) {
  return (
    <motion.div
      ref={menuRef}
      className={`sidebar-profile-menu ${isOpen ? 'sidebar-profile-menu-inline' : 'sidebar-profile-menu-popover'}`}
      initial={{ opacity: 0, y: isOpen ? 10 : 6, x: isOpen ? 0 : -6, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      exit={{ opacity: 0, y: isOpen ? 6 : 4, x: isOpen ? 0 : -4, scale: 0.99 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
    >
      <button className="sidebar-profile-menu-card sidebar-profile-menu-card-button" type="button" onClick={onOpenProfile}>
        <span className="sidebar-profile-menu-avatar">
          {user?.avatar ? <img src={user.avatar} alt="" /> : <FiUser />}
        </span>
        <div>
          <strong>{user?.name || 'Operations Lead'}</strong>
          <span className={`profile-role-pill ${isAdmin ? 'profile-role-admin' : 'profile-role-employee'}`}>
            {roleLabel}
          </span>
        </div>
      </button>

      <button className="sidebar-profile-menu-item" type="button" onClick={onOpenSettings}>
        <FiSettings size={16} />
        <span>Settings</span>
      </button>

      <button className="sidebar-profile-menu-item" type="button" onClick={onOpenLogout}>
        <FiLogOut size={16} />
        <span>Logout</span>
      </button>
    </motion.div>
  );
});

function Sidebar({ isOpen, onToggle, onOpenSettings, onOpenLogout }) {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileZoneRef = useRef(null);
  const profileMenuRef = useRef(null);
  const roleLabel = isAdmin ? 'Administrator' : 'Sales Representative';

  const handleOpenSettings = useCallback(() => {
    setIsProfileMenuOpen(false);
    onOpenSettings?.();
  }, [onOpenSettings]);

  const handleOpenLogout = useCallback(() => {
    setIsProfileMenuOpen(false);
    onOpenLogout?.();
  }, [onOpenLogout]);

  const handleOpenProfile = useCallback(() => {
    setIsProfileMenuOpen(false);
    navigate('/profile');
  }, [navigate]);

  const toggleProfileMenu = useCallback(() => {
    setIsProfileMenuOpen(open => !open);
  }, []);

  useEffect(() => {
    const handlePointerDown = event => {
      const clickedTrigger = profileZoneRef.current?.contains(event.target);
      const clickedMenu = profileMenuRef.current?.contains(event.target);

      if (!clickedTrigger && !clickedMenu) {
        setIsProfileMenuOpen(false);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  useEffect(() => {
    setIsProfileMenuOpen(false);
  }, [isOpen]);

  const profileMenu = (
    <ProfileMenu
      isOpen={isOpen}
      isAdmin={isAdmin}
      user={user}
      roleLabel={roleLabel}
      menuRef={profileMenuRef}
      onOpenProfile={handleOpenProfile}
      onOpenSettings={handleOpenSettings}
      onOpenLogout={handleOpenLogout}
    />
  );

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <button type="button" className="sidebar-toggle" onClick={onToggle} aria-label="Toggle sidebar">
        <FiMenu />
      </button>

      <div className="sidebar-logo-wrapper">
        <img src={logo} alt="TDT logo" className="sidebar-logo" />
      </div>

      <nav className="sidebar-menu">
        <div className="sidebar-nav-section">
          <SidebarSectionLabel>Main Navigation</SidebarSectionLabel>
          {navItems.map(({ path, label, Icon }) => (
            <SidebarNavItem
              key={path}
              path={path}
              label={label}
              Icon={Icon}
            />
          ))}
        </div>

        {isAdmin && (
          <div className="sidebar-nav-section sidebar-admin-section">
            <SidebarSectionLabel>Admin Tools</SidebarSectionLabel>
            {adminNavItems.map(({ path, label, Icon }) => (
              <SidebarNavItem
                key={path}
                path={path}
                label={label}
                Icon={Icon}
              />
            ))}
          </div>
        )}
      </nav>

      <div className="sidebar-profile-zone" ref={profileZoneRef}>
        <button
          type="button"
          className="sidebar-profile-trigger"
          onClick={toggleProfileMenu}
          aria-haspopup="menu"
          aria-expanded={isProfileMenuOpen}
        >
          <span className="sidebar-profile-avatar">
            {user?.avatar ? <img src={user.avatar} alt="" /> : <FiUser />}
          </span>
          <span className="sidebar-profile-copy">
            <strong>{user?.name || 'Operations Lead'}</strong>
            <small className={`sidebar-role-badge ${isAdmin ? 'sidebar-role-admin' : 'sidebar-role-employee'}`}>{roleLabel}</small>
          </span>
          <span className={`sidebar-profile-chevron ${isProfileMenuOpen ? 'open' : ''}`}>
            <FiChevronUp size={16} />
          </span>
        </button>
      </div>
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>{isProfileMenuOpen && profileMenu}</AnimatePresence>,
        document.body
      )}
    </aside>
  );
}

export default memo(Sidebar);

