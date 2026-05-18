import { Suspense, lazy, memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import '../styles/dashboard.css';

import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import InteractiveMetricCard from '../components/cards/InteractiveMetricCard';
import RepTable from '../components/tables/RepTable';
import { EnterpriseChart, EnterpriseFilters, EnterpriseTable } from '../components/analytics/EnterpriseWidgets';
import { metricCards } from '../data/dashboardData';
import { leadSourceData, recentSalesRows, repPerformanceRows, salesByRep } from '../data/enterpriseAnalytics';

const SalesBarChart = lazy(() => import('../components/charts/SalesBarChart'));
const SourcePieChart = lazy(() => import('../components/charts/SourcePieChart'));
const SalesRep = lazy(() => import('./SalesRep'));
const Analytics = lazy(() => import('./Analytics'));
const PresentationMode = lazy(() => import('./PresentationMode'));
const AdminPanel = lazy(() => import('./admin/AdminPanel'));
const PendingApprovals = lazy(() => import('./admin/PendingApprovals'));
const UserManagement = lazy(() => import('./admin/UserManagement'));
const Profile = lazy(() => import('./Profile'));

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: 'easeOut' }
  }
};

function LoadingSkeleton() {
  return <div className="loading-skeleton" />;
}

function MetricSet({ duplicate = false }) {
  return (
    <div className="metric-set" aria-hidden={duplicate ? 'true' : undefined}>
      {metricCards.map(card => (
        <div key={`${duplicate ? 'loop' : 'primary'}-${card.metric}`} className="metric-loop-item">
          <InteractiveMetricCard {...card} />
        </div>
      ))}
    </div>
  );
}

const MainDashboard = memo(function MainDashboard() {
  return (
    <div className="main-dashboard">
      <motion.div className="dashboard-header" variants={itemVariants} initial="hidden" animate="visible">
        <h1 className="dashboard-title">Sales Dashboard</h1>
        <p className="dashboard-subtitle">
          Monitor your sales performance and team metrics in real time
        </p>
      </motion.div>

      <motion.div className="metric-wrapper kpi-grid-wrapper dashboard-grid" variants={containerVariants} initial="hidden" animate="visible">
        <div className="metric-track">
          <MetricSet />
          <MetricSet duplicate />
        </div>
      </motion.div>

      <EnterpriseFilters />

      <motion.div className="charts-grid chart-grid" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants}>
          <Suspense fallback={<LoadingSkeleton />}>
            <SalesBarChart />
          </Suspense>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Suspense fallback={<LoadingSkeleton />}>
            <SourcePieChart />
          </Suspense>
        </motion.div>
      </motion.div>

      <section className="enterprise-grid enterprise-grid-two">
        <EnterpriseChart title="Top Reps" subtitle="Top performers by total gross sales" data={salesByRep} keys={['sales']} />
        <EnterpriseChart title="Lead Sources" subtitle="Lead source contribution and deal readiness" data={leadSourceData.slice(0, 6)} keys={['leads', 'deals']} />
      </section>

      <motion.div className="table-section" variants={itemVariants} initial="hidden" animate="visible">
        <div className="table-glass-inner" />
        <RepTable />
      </motion.div>

      <section className="enterprise-grid enterprise-grid-two">
        <EnterpriseTable
          title="Recent Sales Table"
          columns={['Date', 'Client Name', 'Sales Rep', 'Terms', 'Gross Sales', 'GK']}
          rows={recentSalesRows}
        />
        <EnterpriseTable
          title="Rep Performance Table"
          columns={['Sales Rep', 'Leads', 'Closed Deals', 'Gross Sales', 'Conversion Rate', 'GK %']}
          rows={repPerformanceRows}
        />
      </section>
    </div>
  );
});

const routeLoading = <div className="route-loading" />;

export default function Dashboard({ onLogout }) {
  const { pathname } = useLocation();

  const routeContent = useMemo(() => ({
    '/dashboard': <MainDashboard />,
    '/presentation': <Suspense fallback={routeLoading}><PresentationMode /></Suspense>,
    '/analytics': <Suspense fallback={routeLoading}><Analytics /></Suspense>,
    '/sales-analytics': <Suspense fallback={routeLoading}><Analytics /></Suspense>,
    '/lead-sources': <Suspense fallback={routeLoading}><Analytics /></Suspense>,
    '/lead-analytics': <Suspense fallback={routeLoading}><Analytics /></Suspense>,
    '/product-analytics': <Suspense fallback={routeLoading}><Analytics /></Suspense>,
    '/kpi-monitoring': <Suspense fallback={routeLoading}><Analytics /></Suspense>,
    '/reports': <Suspense fallback={routeLoading}><Analytics /></Suspense>,
    '/sales-team': <Suspense fallback={routeLoading}><SalesRep /></Suspense>,
    '/sales-reps': <Suspense fallback={routeLoading}><SalesRep /></Suspense>,
    '/rankings': <Suspense fallback={routeLoading}><SalesRep /></Suspense>,
    '/performance-board': <MainDashboard />,
    '/profile': <Suspense fallback={routeLoading}><Profile /></Suspense>,
    '/admin': <Suspense fallback={routeLoading}><AdminPanel /></Suspense>,
    '/admin/pending-approvals': <Suspense fallback={routeLoading}><PendingApprovals /></Suspense>,
    '/admin/users': <Suspense fallback={routeLoading}><UserManagement /></Suspense>
  }), []);

  return (
    <DashboardLayout onLogout={onLogout}>
      {routeContent[pathname] || <MainDashboard />}
    </DashboardLayout>
  );
}
