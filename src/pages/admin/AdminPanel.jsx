import { memo, useMemo } from 'react';
import { FiActivity, FiDatabase, FiEdit3, FiShield, FiTrendingUp, FiUploadCloud, FiUserCheck, FiUsers, FiUserX } from 'react-icons/fi';

import { useAuth } from '../../auth/AuthContext';
import PendingApprovals from './PendingApprovals';
import '../../styles/admin.css';

const adminTools = [
  { label: 'Manage Uploads', detail: 'Review imported files and dataset readiness', Icon: FiUploadCloud },
  { label: 'Edit Rankings', detail: 'Tune representative ranking controls', Icon: FiEdit3 },
  { label: 'Analytics Access', detail: 'Inspect enterprise dashboard telemetry', Icon: FiTrendingUp },
  { label: 'Admin Controls', detail: 'Govern elevated account permissions', Icon: FiDatabase }
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

const AdminToolCard = memo(function AdminToolCard({ label, detail, Icon }) {
  return (
    <article className="admin-tool-card">
      <Icon />
      <strong>{label}</strong>
      <span>{detail}</span>
    </article>
  );
});

function AdminPanel() {
  const { users, pendingUsers, rejectedRequests } = useAuth();
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
          <span>Administrator Workspace</span>
          <h1>Admin Management</h1>
          <p>Control employee access, approval queues, upload governance, rankings, and analytics permissions.</p>
        </div>
        <div className="admin-hero-badge admin-badge">
          <FiShield />
          <strong>Admin only</strong>
        </div>
      </section>

      <section className="admin-metrics-grid">
        {metrics.map(({ label, value, detail, Icon, tone }) => (
          <AdminMetricCard key={label} label={label} value={value} detail={detail} Icon={Icon} tone={tone} />
        ))}
      </section>

      <section className="admin-command-grid">
        <div className="admin-tools-grid">
          {adminTools.map(({ label, detail, Icon }) => (
            <AdminToolCard key={label} label={label} detail={detail} Icon={Icon} />
          ))}
        </div>
        <aside className="admin-activity-panel">
          <div>
            <span>Approval Analytics</span>
            <h2>{stats.approvalRate}% approved</h2>
            <p>Employee account readiness across all signup requests.</p>
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
