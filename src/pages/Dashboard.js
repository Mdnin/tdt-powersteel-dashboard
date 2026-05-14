import { Suspense, lazy, memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import '../styles/dashboard.css';

import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import InteractiveMetricCard from '../components/cards/InteractiveMetricCard';
import RepTable from '../components/tables/RepTable';
import { metricCards } from '../data/dashboardData';

const SalesBarChart = lazy(() => import('../components/charts/SalesBarChart'));
const SourcePieChart = lazy(() => import('../components/charts/SourcePieChart'));
const LeadSources = lazy(() => import('./LeadSources'));
const SalesRep = lazy(() => import('./SalesRep'));
const RepData = lazy(() => import('./RepData'));
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

const MainDashboard = memo(function MainDashboard() {
  return (
    <>
      <motion.div className="dashboard-header" variants={itemVariants} initial="hidden" animate="visible">
        <h1 className="dashboard-title">Sales Dashboard</h1>
        <p className="dashboard-subtitle">
          Monitor your sales performance and team metrics in real time
        </p>
      </motion.div>

      <motion.div className="metrics-grid" variants={containerVariants} initial="hidden" animate="visible">
        {metricCards.map(card => (
          <motion.div key={card.metric} variants={itemVariants}>
            <InteractiveMetricCard {...card} />
          </motion.div>
        ))}
      </motion.div>

      <motion.div className="charts-grid" variants={containerVariants} initial="hidden" animate="visible">
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

      <motion.div className="table-section" variants={itemVariants} initial="hidden" animate="visible">
        <div className="table-glass-inner" />
        <RepTable />
      </motion.div>
    </>
  );
});

const routeLoading = <div className="route-loading" />;

export default function Dashboard({ onLogout }) {
  const { pathname } = useLocation();

  const routeContent = useMemo(() => ({
    '/dashboard': <MainDashboard />,
    '/lead-sources': <Suspense fallback={routeLoading}><LeadSources /></Suspense>,
    '/sales-reps': <Suspense fallback={routeLoading}><SalesRep /></Suspense>,
    '/reports': <Suspense fallback={routeLoading}><RepData /></Suspense>,
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
