import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { FiEye, FiEyeOff, FiKey, FiRefreshCw, FiSearch, FiShield, FiUploadCloud, FiUserCheck, FiUserX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../auth/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import { baseSalesReps } from '../../data/salesRepData';
import { getPerformanceState } from '../../utils/salesRepUtils';
import '../../styles/admin.css';

const pageSize = 8;

const UserRow = memo(function UserRow({ employee, performance, isPasswordVisible, onTogglePassword, onApprove, onDeactivate, onResetPassword, onForceReset }) {
  const approve = useCallback(() => onApprove(employee.id), [employee.id, onApprove]);
  const deactivate = useCallback(() => onDeactivate(employee.id), [employee.id, onDeactivate]);
  const resetPassword = useCallback(() => onResetPassword(employee.id), [employee.id, onResetPassword]);
  const forceReset = useCallback(() => onForceReset(employee.id), [employee.id, onForceReset]);
  const togglePassword = useCallback(() => onTogglePassword(employee.id), [employee.id, onTogglePassword]);

  return (
    <tr>
      <td data-label="Avatar">
        <span className="admin-avatar-cell avatar-image">{employee.avatar ? <img src={employee.avatar} alt="" /> : <FiShield />}</span>
      </td>
      <td data-label="Name"><strong>{employee.name}</strong></td>
      <td data-label="Position"><span className="position-text">{employee.position || 'Sales Representative'}</span></td>
      <td data-label="Department"><span className="department-text">{employee.department || 'Sales Department'}</span></td>
      <td data-label="Email"><span className="email-text">{employee.email}</span></td>
      <td data-label="Performance"><StatusBadge status={performance} type="performance" className="performance-badge" /></td>
      <td data-label="Status"><StatusBadge status={employee.status} type="approval" className="status-badge" /></td>
      <td data-label="Password">
        <div className="admin-password-cell admin-password-cell-compact">
          <code className="password-box">{isPasswordVisible ? employee.password : '********'}</code>
          <button type="button" onClick={togglePassword} aria-label={isPasswordVisible ? 'Hide employee password' : 'View employee password'}>
            {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
          </button>
          {employee.forcePasswordReset && <span className="admin-reset-flag">Reset</span>}
        </div>
      </td>
      <td data-label="Actions">
        <div className="admin-table-actions admin-table-actions-compact">
          {employee.status !== 'approved' && (
            <button type="button" className="admin-action-approve" onClick={approve}>
              <FiUserCheck />
              Approve
            </button>
          )}
          <button type="button" onClick={resetPassword}>
            <FiKey />
            Reset
          </button>
          <button type="button" onClick={forceReset}>
            <FiRefreshCw />
            Force
          </button>
          <button type="button" className="admin-action-reject" onClick={deactivate}>
            <FiUserX />
            Disable
          </button>
        </div>
      </td>
    </tr>
  );
});

function UserManagement() {
  const navigate = useNavigate();
  const { adminUsers, approveEmployee, deactivateEmployee, resetEmployeePassword, forceEmployeePasswordReset } = useAuth();
  const [isGoogleSheetsConnected, setIsGoogleSheetsConnected] = useState(
    () => localStorage.getItem('tdt_google_sheets_connected') === 'true'
  );
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('all');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [notice, setNotice] = useState('');

  const employees = useMemo(() => adminUsers.filter(user => user.role === 'employee'), [adminUsers]);
  const performanceByName = useMemo(
    () => new Map(baseSalesReps.map(rep => [rep.name.toLowerCase(), getPerformanceState(rep.performance)])),
    []
  );
  const departments = useMemo(() => ['all', ...new Set(employees.map(employee => employee.department).filter(Boolean))], [employees]);
  const filteredEmployees = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return employees.filter(employee => {
      const matchesQuery = !normalizedQuery || `${employee.name} ${employee.email}`.toLowerCase().includes(normalizedQuery);
      const matchesDepartment = department === 'all' || employee.department === department;
      const matchesRole = role === 'all' || employee.role === role;
      const matchesStatus = status === 'all' || employee.status === status;
      return matchesQuery && matchesDepartment && matchesRole && matchesStatus;
    });
  }, [department, employees, query, role, status]);

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize));
  const visibleEmployees = useMemo(
    () => filteredEmployees.slice((page - 1) * pageSize, page * pageSize),
    [filteredEmployees, page]
  );

  const updateFilter = useCallback(setter => event => {
    setter(event.target.value);
    setPage(1);
  }, []);
  const previousPage = useCallback(() => setPage(current => Math.max(1, current - 1)), []);
  const nextPage = useCallback(() => setPage(current => Math.min(totalPages, current + 1)), [totalPages]);
  const togglePassword = useCallback(userId => {
    setVisiblePasswords(current => ({ ...current, [userId]: !current[userId] }));
  }, []);
  const handleResetPassword = useCallback(userId => {
    const result = resetEmployeePassword(userId);
    setVisiblePasswords(current => ({ ...current, [userId]: true }));
    setNotice(result.ok ? `Temporary password: ${result.password}` : result.message);
  }, [resetEmployeePassword]);
  const handleForceReset = useCallback(userId => {
    const result = forceEmployeePasswordReset(userId);
    setNotice(result.message);
  }, [forceEmployeePasswordReset]);

  const handleUploadSheets = useCallback(() => {
    navigate('/upload');
  }, [navigate]);

  const handleDisconnectLive = useCallback(() => {
    localStorage.removeItem('tdt_google_sheets_connected');
    setIsGoogleSheetsConnected(false);
    window.dispatchEvent(new Event('tdt-google-sheets-status'));
    navigate('/upload');
  }, [navigate]);

  useEffect(() => {
    const syncStatus = () => {
      setIsGoogleSheetsConnected(localStorage.getItem('tdt_google_sheets_connected') === 'true');
    };

    window.addEventListener('storage', syncStatus);
    window.addEventListener('tdt-google-sheets-status', syncStatus);
    return () => {
      window.removeEventListener('storage', syncStatus);
      window.removeEventListener('tdt-google-sheets-status', syncStatus);
    };
  }, []);

  return (
    <section className="admin-panel-section">
      <div className="admin-section-header admin-management-topbar">
        <div>
          <small className="admin-breadcrumbs">Admin / Employee Directory</small>
          <span>Account Governance</span>
          <h1>User Management</h1>
        </div>
        <div className="admin-topbar-actions">
          <label className="admin-search admin-search-wide">
            <FiSearch />
            <input value={query} onChange={updateFilter(setQuery)} placeholder="Search employee or email" />
          </label>
          <button type="button" className="admin-primary-action">Export Users</button>
        </div>
      </div>

      <div className="admin-filter-bar">
        <div className="admin-filter-bar-filters">
          <select value={department} onChange={updateFilter(setDepartment)}>
            {departments.map(option => (
              <option key={option} value={option}>{option === 'all' ? 'All Departments' : option}</option>
            ))}
          </select>
          <select value={role} onChange={updateFilter(setRole)}>
            <option value="all">All Roles</option>
            <option value="employee">Employee</option>
          </select>
          <select value={status} onChange={updateFilter(setStatus)}>
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="admin-filter-bar-sync">
          <button type="button" className="admin-sheets-upload-btn" onClick={handleUploadSheets}>
            <FiUploadCloud />
            Upload Google Sheets
          </button>
          {isGoogleSheetsConnected && (
            <button
              type="button"
              className="admin-live-indicator"
              onClick={handleDisconnectLive}
              aria-label="Google Sheets live sync active. Click to disconnect."
              title="Disconnect live sync"
            >
              <span className="admin-live-dot" aria-hidden="true" />
              Live
            </button>
          )}
        </div>
      </div>

      {notice && <div className="admin-password-notice">{notice}</div>}

      <div className="admin-table-shell table-wrapper">
        <table className="admin-table admin-user-management-table user-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Email</th>
              <th>Performance</th>
              <th>Status</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleEmployees.map(employee => (
              <UserRow
                key={employee.id}
                employee={employee}
                performance={performanceByName.get(employee.name?.toLowerCase()) || getPerformanceState(employee.status === 'approved' ? 76 : 48)}
                isPasswordVisible={Boolean(visiblePasswords[employee.id])}
                onTogglePassword={togglePassword}
                onApprove={approveEmployee}
                onDeactivate={deactivateEmployee}
                onResetPassword={handleResetPassword}
                onForceReset={handleForceReset}
              />
            ))}
          </tbody>
        </table>
        {!visibleEmployees.length && (
          <div className="admin-empty-state">
            <strong>No employee accounts found</strong>
            <span>Adjust filters or wait for new employee signup requests.</span>
          </div>
        )}
      </div>

      <div className="admin-pagination">
        <button type="button" disabled={page === 1} onClick={previousPage}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button type="button" disabled={page === totalPages} onClick={nextPage}>Next</button>
      </div>
    </section>
  );
}

export default memo(UserManagement);
