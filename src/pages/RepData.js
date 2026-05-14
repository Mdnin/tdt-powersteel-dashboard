import { motion } from 'framer-motion';
import '../styles/dashboard.css';

export default function RepData() {
  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.28, ease: 'easeOut' }
    }
  };

  return (
    <>
        <motion.div
          className="dashboard-header"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="dashboard-title">Reports & Analytics</h1>
          <p className="dashboard-subtitle">
            Generate comprehensive reports and analyze business performance data
          </p>
        </motion.div>

        <motion.div
          className="content-placeholder"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div style={{ textAlign: 'center', color: '#888' }}>
            <h2 style={{ color: '#ff7a00', marginBottom: '16px' }}>Reports Page</h2>
            <p>This page will contain reporting tools and analytics dashboards.</p>
            <p style={{ marginTop: '8px', fontSize: '14px' }}>Coming soon...</p>
          </div>
        </motion.div>
    </>
  );
}
