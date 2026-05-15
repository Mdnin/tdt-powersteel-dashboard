import { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiDownload, FiUploadCloud } from 'react-icons/fi';
import ExportModal from '../common/ExportModal';
import PresentButton from '../common/PresentButton';
import { exportDashboard } from '../../utils/exportService';
import '../../styles/navbar.css';
import '../../styles/export.css';

function Navbar({ isPresenting = false, onTogglePresentation }) {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isGoogleSheetsConnected, setIsGoogleSheetsConnected] = useState(
    () => localStorage.getItem('tdt_google_sheets_connected') === 'true'
  );
  const navigate = useNavigate();

  const handleUploadClick = () => {
    navigate('/upload');
  };

  const handleLiveClick = () => {
    localStorage.removeItem('tdt_google_sheets_connected');
    setIsGoogleSheetsConnected(false);
    window.dispatchEvent(new Event('tdt-google-sheets-status'));
    navigate('/upload');
  };

  const handleExport = async option => {
    setIsExporting(true);

    try {
      await exportDashboard(option);
      setIsExportOpen(false);
    } finally {
      setIsExporting(false);
    }
  };

  const closeExport = () => {
    if (!isExporting) setIsExportOpen(false);
  };

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
    <>
      <div className="navbar">
        <div>
          <h1 className="navbar-title">TDT Powersteel Dashboard</h1>
        </div>

        <div className="navbar-right">
          {isGoogleSheetsConnected && (
            <button
              className="nav-btn live-btn"
              type="button"
              onClick={handleLiveClick}
              aria-label="Disconnect Live Sync"
              title="Disconnect Live Sync"
            >
              <span className="live-btn-label">LIVE</span>
              <span className="live-btn-hover-label">Disconnect Live Sync</span>
            </button>
          )}

          <button className="nav-btn nav-btn-secondary" type="button" onClick={handleUploadClick}>
            <FiUploadCloud size={16} />
            Upload
          </button>

          <PresentButton isPresenting={isPresenting} onToggle={onTogglePresentation} />

          <button
            className="nav-btn nav-btn-secondary"
            type="button"
            onClick={() => setIsExportOpen(true)}
            disabled={isExporting}
          >
            <FiDownload size={16} />
            {isExporting ? 'Exporting' : 'Export'}
          </button>
        </div>
      </div>

      <ExportModal
        isOpen={isExportOpen}
        isExporting={isExporting}
        onClose={closeExport}
        onExport={handleExport}
      />
    </>
  );
}

export default memo(Navbar);
