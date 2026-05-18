import { memo, useMemo } from 'react';
import { FiActivity, FiShield, FiTrendingUp, FiUploadCloud, FiUserCheck, FiUsers, FiUserX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../auth/AuthContext';
import PendingApprovals from './PendingApprovals';
import '../../styles/admin.css';

const adminTools = [
  { label: 'Import Sales Data', detail: 'Upload CSV/XLSX files or connect Google Sheets before teams view dashboards.', Icon: FiUploadCloud, action: 'Open upload page', path: '/upload' },
  { label: 'Review New Users', detail: 'Approve employees who should be allowed to use the sales system.', Icon: FiUserCheck, action: 'Review requests', path: '/admin/pending-approvals' },
  { label: 'Manage Accounts', detail: 'Reset passwords, disable accounts, and check employee access status.', Icon: FiUsers, action: 'Open user list', path: '/admin/users' },
  { label: 'Check Reports', detail: 'View analytics after data has been imported successfully.', Icon: FiTrendingUp, action: 'Open analytics', path: '/analytics' }
];

const adminGuideSteps = [
  'Import sales data first so dashboards do not appear empty.',
  'Approve pending employee requests after checking their details.',
  'Use User Management for password resets, account status, and access cleanup.'
];

const AdminMetricCard = memo(function AdminMetricCard({ label, value, detail, Icon, tone }) {
  return (
    <article className={`admin-stat-card admin-stat-${tone}`}>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
      <Icon />
    </article>
  );
});

const AdminToolCard = memo(function AdminToolCard({ label, detail, Icon, action, path, onOpen }) {
  return (
    <article className="admin-tool-card admin-guide-card">
      <div className="admin-guide-card-icon">
        <Icon />
      </div>
      <div>
        <strong>{label}</strong>
        <span>{detail}</span>
      </div>
      <button type="button" onClick={() => onOpen(path)}>{action}</button>
    </article>
  );
});

function AdminPanel() {
  const { users, pendingUsers, rejectedRequests } = useAuth();
  const navigate = useNavigate();
  const stats = useMemo(() => {
    const approvedEmployees = users.filter(user => user.role === 'employee' && user.status === 'approved').length;
    const activeUsers = users.filter(user => user.status === 'approved').length;
    const totalEmployees = users.filter(user => user.role === 'employee').length;
    const adminUsers = users.filter(user => user.role === 'admin').length;
    const approvalRate = totalEmployees ? Math.round((approvedEmployees / totalEmployees) * 100) : 0;

    return { approvedEmployees, activeUsers, totalEmployees, adminUsers, approvalRate };
  }, [users]);

  const metrics = useMemo(
    () => [
      { label: 'Pending Requests', value: pendingUsers.length, detail: 'awaiting admin review', Icon: FiActivity, tone: 'amber' },
      { label: 'Approved Employees', value: stats.approvedEmployees, detail: 'dashboard-ready accounts', Icon: FiUserCheck, tone: 'green' },
      { label: 'Rejected Requests', value: rejectedRequests.length, detail: 'denied access requests', Icon: FiUserX, tone: 'red' },
      { label: 'Active Users', value: stats.activeUsers, detail: 'approved platform users', Icon: FiUsers, tone: 'orange' }
    ],
    [pendingUsers.length, rejectedRequests.length, stats.activeUsers, stats.approvedEmployees]
  );

  return (
    <div className="admin-panel-page">
      <section className="admin-hero">
        <div>
          <small className="admin-breadcrumbs">Dashboard / Admin</small>
          <span>Beginner Admin Guide</span>
          <h1>Admin Control Center</h1>
          <p>Start here to keep the system ready: import sales data, approve new employees, and manage account access in a few guided steps.</p>
        </div>
        <div className="admin-hero-badge admin-badge">
          <FiShield />
          <strong>Admin only</strong>
          <small>{pendingUsers.length ? `${pendingUsers.length} request${pendingUsers.length === 1 ? '' : 's'} waiting` : 'No pending requests'}</small>
        </div>
      </section>

      <section className="admin-start-guide">
        <div>
          <span>Start Here</span>
          <h2>Recommended admin workflow</h2>
          <p>Follow these in order when you are setting up or checking the dashboard for the day.</p>
        </div>
        <ol>
          {adminGuideSteps.map(step => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="admin-metrics-grid">
        {metrics.map(({ label, value, detail, Icon, tone }) => (
          <AdminMetricCard key={label} label={label} value={value} detail={detail} Icon={Icon} tone={tone} />
        ))}
      </section>

      <section className="admin-command-grid">
        <div className="admin-tools-grid">
          {adminTools.map(({ label, detail, Icon, action, path }) => (
            <AdminToolCard key={label} label={label} detail={detail} Icon={Icon} action={action} path={path} onOpen={navigate} />
          ))}
        </div>
        <aside className="admin-activity-panel">
          <div>
            <span>Account Readiness</span>
            <h2>{stats.approvalRate}% approved</h2>
            <p>This shows how many employee accounts are ready to use the dashboard.</p>
          </div>
          <div className="admin-activity-meter">
            <span style={{ transform: `scaleX(${stats.approvalRate / 100})` }} />
          </div>
          <ul>
            <li><strong>{pendingUsers.length}</strong><span>queued approvals</span></li>
            <li><strong>{rejectedRequests.length}</strong><span>rejected requests</span></li>
            <li><strong>{stats.adminUsers}</strong><span>admin accounts</span></li>
          </ul>
        </aside>
      </section>

      <PendingApprovals />
    </div>
  );
}

export default memo(AdminPanel);
