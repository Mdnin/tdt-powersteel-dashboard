import { motion } from 'framer-motion';
import { useCallback, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, ClipboardList, Database, FileSpreadsheet, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/upload.css';

import logo from '../assets/logos/tdt_logo.png';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.54,
      staggerChildren: 0.16
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: 'easeOut' }
  }
};

const uploadOptions = [
  {
    id: 'csv',
    title: 'CSV Upload',
    description: 'Upload your sales data from CSV files for instant analysis',
    Icon: FileSpreadsheet,
    actionTitle: 'CSV Upload',
    actionCopy: 'Select a CSV export from your sales tools and prepare it for dashboard analysis.'
  },
  {
    id: 'sheets',
    title: 'Google Sheets',
    description: 'Connect your Google Sheets for real-time data synchronization',
    Icon: Database,
    actionTitle: 'Google Sheets Connection',
    actionCopy: 'Paste your Google Sheets link to connect live sales data synchronization.'
  },
  {
    id: 'manual',
    title: 'Manual Entry',
    description: 'Manage sales data manually with real-time dashboard visibility',
    Icon: ClipboardList,
    actionTitle: 'Manual Entry',
    actionCopy: 'Create a manual sales record and publish it into the dashboard workflow.'
  }
];

export default function Upload({ onComplete, embedded = false }) {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const selectedConfig = useMemo(
    () => uploadOptions.find(option => option.id === selectedOption),
    [selectedOption]
  );

  const handleUploadSelect = useCallback(option => {
    setSelectedOption(option);
  }, []);

  const handleContinue = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  return (
    <motion.div
      className={embedded ? 'upload-portal upload-portal-embedded' : 'upload-portal'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.28 }}
    >
      <div className="upload-steel-bg" />
      <div className="upload-dark-overlay" />
      <div className="upload-vignette" />
      <div className="orange-glow" />

      <motion.div className="upload-content" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div className="upload-header-row" variants={itemVariants}>
          <motion.button
            className="upload-back-btn"
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </motion.button>
        </motion.div>
        <motion.div className="upload-logo-section" variants={itemVariants}>
          <motion.img
            src={logo}
            alt="TDT Powersteel Logo"
            className="upload-logo"
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'tween', duration: 0.22 }}
          />
          <motion.h1 className="upload-title" variants={itemVariants}>
            Sales Performance System
          </motion.h1>
          <motion.p className="upload-tagline" variants={itemVariants}>
            Advanced Lead Tracking & Revenue Analytics
          </motion.p>
        </motion.div>
        <motion.div className="upload-options" variants={itemVariants}>
          {uploadOptions.map(({ id, title, description, Icon }) => (
            <motion.button
              key={id}
              className={`upload-card ${selectedOption === id ? 'selected' : ''}`}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleUploadSelect(id)}
              type="button"
            >
              <span className="upload-card-icon">
                <Icon size={38} />
              </span>
              <h3 className="upload-card-title">{title}</h3>
              <p className="upload-card-description">{description}</p>
              <span className="upload-card-cta">
                Open
                <ArrowRight size={15} />
              </span>
            </motion.button>
          ))}
        </motion.div>

        {selectedConfig && (
          <motion.div
            className="upload-action-panel"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <button className="upload-action-close" type="button" onClick={() => setSelectedOption(null)} aria-label="Close upload option">
              <X size={16} />
            </button>
            <div>
              <span className="upload-action-kicker">Selected pathway</span>
              <h2>{selectedConfig.actionTitle}</h2>
              <p>{selectedConfig.actionCopy}</p>
            </div>

            {selectedOption === 'csv' && (
              <label className="upload-action-field upload-file-field">
                <span>CSV file</span>
                <input type="file" accept=".csv,text/csv" />
              </label>
            )}

            {selectedOption === 'sheets' && (
              <label className="upload-action-field">
                <span>Google Sheets URL</span>
                <input type="url" placeholder="https://docs.google.com/spreadsheets/..." />
              </label>
            )}

            {selectedOption === 'manual' && (
              <div className="upload-manual-grid">
                <label className="upload-action-field">
                  <span>Lead source</span>
                  <input type="text" placeholder="Walk-in, referral, website..." />
                </label>
                <label className="upload-action-field">
                  <span>Sales value</span>
                  <input type="number" placeholder="0.00" />
                </label>
              </div>
            )}

            <button className="upload-action-primary" type="button" onClick={handleContinue}>
              Continue to Dashboard
              <ArrowRight size={16} />
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
