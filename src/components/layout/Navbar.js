import { memo, useState } from 'react';
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
  const navigate = useNavigate();

  const handleUploadClick = () => {
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

  return (
    <>
      <div className="navbar">
        <div>
          <h1 className="navbar-title">TDT Powersteel Dashboard</h1>
        </div>

        <div className="navbar-right">
          <button className="nav-btn nav-btn-secondary" type="button" onClick={handleUploadClick}>
            <FiUploadCloud size={16} />
            Upload
          </button>

          <button
            className="nav-btn nav-btn-secondary"
            type="button"
            onClick={() => setIsExportOpen(true)}
            disabled={isExporting}
          >
            <FiDownload size={16} />
            {isExporting ? 'Exporting' : 'Export'}
          </button>

          <PresentButton isPresenting={isPresenting} onToggle={onTogglePresentation} />
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
