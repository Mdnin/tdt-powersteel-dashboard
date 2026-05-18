import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Database, FileSpreadsheet, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/upload.css';

import logo from '../assets/logos/tdt_logo.png';
import { GOOGLE_SHEETS_KEY, hasImportedSalesData, markSalesDataImported } from '../utils/importStatus';

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
    title: 'CSV / XLSX Upload',
    description: 'Upload sales data from CSV or Excel files with automatic validation',
    Icon: FileSpreadsheet,
    actionTitle: 'CSV / XLSX Upload'
  }
];

export default function Upload({ onComplete, embedded = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isRequiredImport = Boolean(location.state?.requiredImport);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sheetUrl, setSheetUrl] = useState('');
  const [importSuccess, setImportSuccess] = useState(() => hasImportedSalesData());
  const [isGoogleSheetsConnected, setIsGoogleSheetsConnected] = useState(
    () => localStorage.getItem(GOOGLE_SHEETS_KEY) === 'true'
  );
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const canContinue = importSuccess || isGoogleSheetsConnected;
  const selectedFileLabel = selectedFile?.name || 'Drop CSV or XLSX here';

  const handleUploadSelect = useCallback(option => {
    setSelectedOption(option);
    setSelectedFile(null);
    setSheetUrl('');
    setIsDraggingFile(false);
  }, []);

  const acceptFile = useCallback(file => {
    if (!file) return;
    const name = file.name.toLowerCase();
    if (!name.endsWith('.csv') && !name.endsWith('.xlsx')) return;
    setSelectedFile(file);
    markSalesDataImported(name.endsWith('.xlsx') ? 'xlsx' : 'csv');
    setImportSuccess(true);
    setSelectedOption(null);
    window.setTimeout(() => onComplete?.(), 250);
  }, [onComplete]);

  const handleDragOver = useCallback(event => {
    event.preventDefault();
    setIsDraggingFile(true);
  }, []);

  const handleDragLeave = useCallback(event => {
    event.preventDefault();
    setIsDraggingFile(false);
  }, []);

  const handleDrop = useCallback(event => {
    event.preventDefault();
    setIsDraggingFile(false);
    acceptFile(event.dataTransfer.files?.[0]);
  }, [acceptFile]);

  const handleContinue = useCallback(() => {
    if (!canContinue) return;
    onComplete?.();
  }, [canContinue, onComplete]);

  const handleImport = useCallback(() => {
    if (selectedOption === 'sheets') {
      if (!sheetUrl.trim()) return;
      localStorage.setItem(GOOGLE_SHEETS_KEY, 'true');
      setIsGoogleSheetsConnected(true);
      markSalesDataImported('google-sheets');
      window.dispatchEvent(new Event('tdt-google-sheets-status'));
      setImportSuccess(true);
      setSelectedOption(null);
      return;
    }

    if (!selectedFile) return;
    markSalesDataImported(selectedFile.name.toLowerCase().endsWith('.xlsx') ? 'xlsx' : 'csv');
    setImportSuccess(true);
    setSelectedOption(null);
  }, [selectedFile, selectedOption, sheetUrl]);

  useEffect(() => {
    const syncStatus = () => {
      setIsGoogleSheetsConnected(localStorage.getItem(GOOGLE_SHEETS_KEY) === 'true');
      setImportSuccess(hasImportedSalesData());
    };

    window.addEventListener('storage', syncStatus);
    window.addEventListener('tdt-google-sheets-status', syncStatus);
    window.addEventListener('tdt-sales-import-status', syncStatus);
    return () => {
      window.removeEventListener('storage', syncStatus);
      window.removeEventListener('tdt-google-sheets-status', syncStatus);
      window.removeEventListener('tdt-sales-import-status', syncStatus);
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

      <motion.div className={`upload-content ${isRequiredImport ? 'upload-content-required' : ''}`} variants={containerVariants} initial="hidden" animate="visible">
        {!isRequiredImport && (
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
        )}
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
          <motion.div className="upload-required-status" variants={itemVariants}>
            <strong>{importSuccess ? 'Data imported successfully' : 'Import sales data to continue'}</strong>
            <span>CSV, XLSX, or Google Sheets LIVE required</span>
            {importSuccess && (
              <em>
                <CheckCircle2 size={15} />
                Ready to continue
              </em>
            )}
            {isGoogleSheetsConnected && (
              <em className="upload-live-connected">
                <i />
                LIVE CONNECTED
              </em>
            )}
          </motion.div>
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
                    LIVE CONNECTED
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
                <h2>{selectedOption === 'sheets' ? 'Google Sheets URL' : 'CSV / XLSX Upload'}</h2>
                <p>{selectedOption === 'sheets' ? 'Connect a Google Sheets link to keep dashboard data synchronized.' : 'Select a CSV or XLSX export from your sales tools.'}</p>
              </div>

              {selectedOption === 'sheets' ? (
                <>
                  <label className="upload-action-field">
                    <span>Google Sheets URL</span>
                    <input type="url" value={sheetUrl} onChange={event => setSheetUrl(event.target.value)} placeholder="https://docs.google.com/spreadsheets/..." />
                  </label>
                  <p className="upload-live-note">Live sync status appears once the sheet is connected.</p>
                </>
              ) : (
                <label
                  className={`upload-action-field upload-file-field upload-drop-zone ${isDraggingFile ? 'is-dragging' : ''} ${selectedFile ? 'has-file' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <span>CSV or XLSX file</span>
                  <strong>{selectedFileLabel}</strong>
                  <small>{selectedFile ? 'File ready to import' : 'Drag and drop a file, or click to browse'}</small>
                  <input type="file" accept=".csv,text/csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={event => acceptFile(event.target.files?.[0])} />
                </label>
              )}

              <button
                className={`upload-action-primary connect-btn ${selectedOption === 'sheets' ? (!sheetUrl.trim() ? 'is-disabled' : '') : (!selectedFile ? 'is-disabled' : '')}`}
                type="button"
                onClick={handleImport}
              >
                {selectedOption === 'sheets' ? 'Connect Google Sheets' : 'Import Data'}
                <ArrowRight size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}

        <motion.button
          className={`upload-continue-dashboard ${!canContinue ? 'is-disabled' : ''}`}
          type="button"
          variants={itemVariants}
          onClick={handleContinue}
        >
          Continue to Dashboard
          <ArrowRight size={17} />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
