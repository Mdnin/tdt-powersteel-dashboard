import { Suspense, lazy, useCallback, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import AdminRoute from '../auth/AdminRoute';
import ApprovalPendingPage from '../auth/ApprovalPendingPage';
import ProtectedRoute from '../auth/ProtectedRoute';
import { useAuth } from '../auth/AuthContext';
import Background from '../components/layout/Background';
import IntroPopup from '../components/common/IntroPopup';
import LoadingScreen from '../components/common/LoadingScreen';

const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));
const Upload = lazy(() => import('../pages/Upload'));
const Dashboard = lazy(() => import('../pages/Dashboard'));

const pageVariants = {
  initial: { opacity: 0, y: 18, scale: 0.996 },
  in: { opacity: 1, y: 0, scale: 1 },
  out: { opacity: 0, y: -10, scale: 0.99 }
};

const pageTransition = {
  type: 'tween',
  ease: [0.22, 1, 0.36, 1],
  duration: 0.32
};

function IntroRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => navigate('/loading', { replace: true }), 2400);
    return () => window.clearTimeout(timer);
  }, [navigate]);

  return <IntroPopup />;
}

function LoadingRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => navigate('/login', { replace: true }), 3000);
    return () => window.clearTimeout(timer);
  }, [navigate]);

  return <LoadingScreen />;
}

function RouteShell({ children }) {
  return (
    <motion.div
      className="screen-wrapper"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

export default function AppRoutes() {
  const { isAuthenticated, isApproved, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const fallback = useMemo(() => <div className="screen-fallback" />, []);

  const authenticatedLanding = isAdmin ? '/dashboard' : '/upload';

  const handleUploadComplete = useCallback(() => {
    navigate('/dashboard', { replace: true });
  }, [navigate]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login', { replace: true });
  }, [logout, navigate]);

  return (
    <>
      <Background />
      <div className="app-stage">
        <Suspense fallback={fallback}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Navigate to="/intro" replace />} />
              <Route path="/intro" element={<RouteShell><IntroRoute /></RouteShell>} />
              <Route path="/loading" element={<RouteShell><LoadingRoute /></RouteShell>} />
              <Route
                path="/login"
                element={
                  isAuthenticated ? (
                    <Navigate to={isApproved ? authenticatedLanding : '/approval-pending'} replace />
                  ) : (
                    <RouteShell><Login /></RouteShell>
                  )
                }
              />
              <Route
                path="/signup"
                element={
                  isAuthenticated ? (
                    <Navigate to={isApproved ? authenticatedLanding : '/approval-pending'} replace />
                  ) : (
                    <RouteShell><Signup /></RouteShell>
                  )
                }
              />
              <Route
                path="/approval-pending"
                element={
                  isAuthenticated && !isApproved ? (
                    <RouteShell><ApprovalPendingPage /></RouteShell>
                  ) : (
                    <Navigate to={isAuthenticated ? authenticatedLanding : '/login'} replace />
                  )
                }
              />
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <RouteShell><Upload onComplete={handleUploadComplete} /></RouteShell>
                  </ProtectedRoute>
                }
              />
              {['/dashboard', '/lead-sources', '/sales-reps', '/reports', '/profile'].map(path => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <ProtectedRoute>
                      <Dashboard onLogout={handleLogout} />
                    </ProtectedRoute>
                  }
                />
              ))}
              {['/admin', '/admin/pending-approvals', '/admin/users'].map(path => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <AdminRoute>
                      <Dashboard onLogout={handleLogout} />
                    </AdminRoute>
                  }
                />
              ))}
              <Route path="*" element={<Navigate to="/intro" replace />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </div>
    </>
  );
}
