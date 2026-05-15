import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Database, FileSpreadsheet, X } from 'lucide-react';
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
    id: 'sheets',
    title: 'Google Sheets',
    description: 'Connect live sales data from Google Sheets for realtime dashboard sync',
    Icon: Database,
    actionTitle: 'Google Sheets Connection'
  },
  {
    id: 'csv',
    title: 'CSV Upload',
    description: 'Upload sales data from CSV files with automatic validation',
    Icon: FileSpreadsheet,
    actionTitle: 'CSV Upload'
  }
];

export default function Upload({ onComplete, embedded = false }) {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [isGoogleSheetsConnected, setIsGoogleSheetsConnected] = useState(
    () => localStorage.getItem('tdt_google_sheets_connected') === 'true'
  );
  const handleUploadSelect = useCallback(option => {
    setSelectedOption(option);
  }, []);

  const handleContinue = useCallback(() => {
    if (selectedOption === 'sheets') {
      localStorage.setItem('tdt_google_sheets_connected', 'true');
      setIsGoogleSheetsConnected(true);
      window.dispatchEvent(new Event('tdt-google-sheets-status'));
    }
    onComplete?.();
  }, [onComplete, selectedOption]);

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
            className="upload-back-btn back-button"
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </motion.button>
        </motion.div>
        <motion.div className="upload-logo-section upload-header" variants={itemVariants}>
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
        <motion.div className="upload-options upload-grid" variants={itemVariants}>
          {uploadOptions.map(({ id, title, description, Icon }) => (
            <motion.button
              key={id}
              className={`upload-card ${selectedOption === id ? 'selected' : ''}`}
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleUploadSelect(id)}
              type="button"
            >
              <span className="upload-card-icon">
                <Icon size={38} />
              </span>
              <h3 className="upload-card-title">
                <span>{title}</span>
                {id === 'sheets' && isGoogleSheetsConnected && (
                  <span className="live-badge upload-live-badge google-live">
                    Google Sheets LIVE
                  </span>
                )}
              </h3>
              <p className="upload-card-description">{description}</p>
              <span className="upload-card-cta">
                <span>Open</span>
                <ArrowRight size={15} />
              </span>
            </motion.button>
          ))}
        </motion.div>

        {selectedOption && (
          <motion.div
            className="upload-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <motion.div
              className={`upload-action-panel google-sheet-modal ${selectedOption === 'sheets' ? 'sheet-panel' : ''}`}
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <button className="upload-action-close" type="button" onClick={() => setSelectedOption(null)} aria-label="Close upload option">
                <X size={16} />
              </button>
              <div>
                <span className="upload-action-kicker">{selectedOption === 'sheets' ? 'Live sync' : 'File upload'}</span>
                <h2>{selectedOption === 'sheets' ? 'Google Sheets URL' : 'CSV Upload'}</h2>
                <p>{selectedOption === 'sheets' ? 'Connect a Google Sheets link to keep dashboard data synchronized.' : 'Select a CSV export from your sales tools.'}</p>
              </div>

              {selectedOption === 'sheets' ? (
                <>
                  <label className="upload-action-field">
                    <span>Google Sheets URL</span>
                    <input type="url" placeholder="https://docs.google.com/spreadsheets/..." />
                  </label>
                  <p className="upload-live-note">Live sync status appears once the sheet is connected.</p>
                </>
              ) : (
                <label className="upload-action-field upload-file-field">
                  <span>CSV file</span>
                  <input type="file" accept=".csv,text/csv" />
                </label>
              )}

              <button className="upload-action-primary connect-btn" type="button" onClick={handleContinue}>
                {selectedOption === 'sheets' ? 'Connect Google Sheets' : 'Upload CSV'}
                <ArrowRight size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
