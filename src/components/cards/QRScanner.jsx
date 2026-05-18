import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5Qrcode } from 'html5-qrcode';
import { FiCheckCircle, FiCopy, FiExternalLink, FiRefreshCw, FiRotateCcw } from 'react-icons/fi';
import scannerFrame from '../../assets/image/scanner.png';
import '../../styles/qr-scanner.css';

const SCAN_CONFIG = {
  fps: 10,
  disableFlip: false,
  qrbox: {
    width: 260,
    height: 260
  }
};

const isUrl = value => /^https?:\/\//i.test(value || '');

function getTimeLabel(date = new Date()) {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function getFullTimeLabel(date = new Date()) {
  return date.toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
  });
}

function normalizeCameraError(error) {
  const message = String(error?.message || error || '').toLowerCase();
  const name = String(error?.name || '').toLowerCase();

  if (name.includes('notallowed') || message.includes('permission') || message.includes('denied')) {
    return 'Camera access denied';
  }

  if (name.includes('notfound') || message.includes('not found') || message.includes('no camera')) {
    return 'No camera device found';
  }

  return 'Unable to start QR scanner';
}

function pickCameraId(cameras, mode) {
  const preferredTerms = mode === 'environment'
    ? ['back', 'rear', 'environment', 'world']
    : ['front', 'user', 'face'];
  const preferredCamera = cameras.find(camera => {
    const label = String(camera.label || '').toLowerCase();
    return preferredTerms.some(term => label.includes(term));
  });

  return preferredCamera?.id || cameras[0]?.id;
}

function QRScanner({
  title = 'QR Code Scanner',
  onScan,
  panelClassName = '',
  compact = false
}) {
  const scannerRef = useRef(null);
  const mountedRef = useRef(false);
  const isScanningRef = useRef(false);
  const successHandledRef = useRef(false);
  const scanRunRef = useRef(0);
  const [cameraMode, setCameraMode] = useState('environment');
  const [status, setStatus] = useState('Initializing scanner...');
  const [scannerState, setScannerState] = useState('idle');
  const [result, setResult] = useState(null);
  const [copyStatus, setCopyStatus] = useState('');
  const [restartKey, setRestartKey] = useState(0);

  const hasResultUrl = useMemo(() => isUrl(result?.code), [result]);

  const clearScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    if (!scanner) return;

    try {
      if (isScanningRef.current) {
        await scanner.stop();
      }
    } catch {
      // The library throws if the camera was already stopped by the browser.
    } finally {
      isScanningRef.current = false;
      try {
        await scanner.clear();
      } catch {
        const reader = document.getElementById('qr-reader');
        if (reader) reader.innerHTML = '';
      }
    }
  }, []);

  const startScanner = useCallback(async () => {
    if (!mountedRef.current) return;

    const runId = scanRunRef.current + 1;
    scanRunRef.current = runId;
    const isCurrentRun = () => mountedRef.current && scanRunRef.current === runId;

    setCopyStatus('');
    successHandledRef.current = false;
    setScannerState('starting');
    setStatus(`Starting ${cameraMode === 'environment' ? 'rear' : 'front'} camera...`);

    await clearScanner();

    const readerElement = document.getElementById('qr-reader');
    if (!readerElement) return;

    const scanner = new Html5Qrcode('qr-reader', { verbose: false });
    scannerRef.current = scanner;

    const handleSuccess = async decodedText => {
      if (!isCurrentRun() || !decodedText || successHandledRef.current) return;
      successHandledRef.current = true;

      const now = new Date();
      const nextResult = {
        code: decodedText,
        type: 'QR CODE',
        time: getTimeLabel(now),
        timestamp: getFullTimeLabel(now)
      };

      setResult(nextResult);
      setScannerState('success');
      setStatus('Scan successful');
      onScan?.(decodedText, nextResult);
      await clearScanner();
    };

    try {
      try {
        await scanner.start({ facingMode: cameraMode }, SCAN_CONFIG, handleSuccess, () => {});
      } catch (primaryError) {
        try {
          const cameras = await Html5Qrcode.getCameras();
          const fallbackCameraId = pickCameraId(cameras, cameraMode);
          if (!fallbackCameraId) {
            throw new Error('No camera device found');
          }
          if (!isCurrentRun()) return;
          await scanner.start(fallbackCameraId, SCAN_CONFIG, handleSuccess, () => {});
        } catch {
          throw primaryError;
        }
      }

      if (!isCurrentRun()) {
        try {
          await scanner.stop();
        } catch {
          // Ignore stale scanner shutdown errors.
        }
        try {
          await scanner.clear();
        } catch {
          // Ignore stale scanner cleanup errors.
        }
        return;
      }

      isScanningRef.current = true;
      setScannerState('scanning');
      setStatus('Scanning for QR code...');
    } catch (error) {
      if (isCurrentRun()) {
        isScanningRef.current = false;
        setScannerState('error');
        setStatus(normalizeCameraError(error));
      }
      if (isCurrentRun()) {
        await clearScanner();
      } else {
        try {
          await scanner.stop();
        } catch {
          // Ignore stale scanner shutdown errors.
        }
        try {
          await scanner.clear();
        } catch {
          // Ignore stale scanner cleanup errors.
        }
      }
    }
  }, [cameraMode, clearScanner, onScan]);

  useEffect(() => {
    mountedRef.current = true;
    startScanner();

    return () => {
      mountedRef.current = false;
      clearScanner();
    };
  }, [clearScanner, restartKey, startScanner]);

  const handleRestart = useCallback(() => {
    setResult(null);
    setScannerState('idle');
    setStatus('Restarting scanner...');
    setRestartKey(key => key + 1);
  }, []);

  const handleToggleCamera = useCallback(() => {
    setCameraMode(mode => (mode === 'environment' ? 'user' : 'environment'));
    setResult(null);
    setScannerState('idle');
    setRestartKey(key => key + 1);
  }, []);

  const handleCopy = useCallback(async () => {
    if (!result?.code) return;

    try {
      await navigator.clipboard.writeText(result.code);
      setCopyStatus('Copied');
    } catch {
      setCopyStatus('Copy unavailable');
    }
  }, [result]);

  const handleOpenLink = useCallback(() => {
    if (hasResultUrl) {
      window.open(result.code, '_blank', 'noopener,noreferrer');
    }
  }, [hasResultUrl, result]);

  return (
    <motion.section
      className={`tdt-qr-shell ${compact ? 'tdt-qr-shell-compact' : ''} ${panelClassName}`}
      initial={{ opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="tdt-qr-steel-overlay" />

      <header className="tdt-qr-header">
        <h1>{title}</h1>
      </header>

      <div className={`tdt-qr-reader-frame tdt-qr-reader-${scannerState}`}>
        <div id="qr-reader" />
        <img src={scannerFrame} alt="" className="tdt-qr-frame-image" aria-hidden="true" />
        <AnimatePresence>
          {scannerState === 'success' && (
            <motion.div
              className="tdt-qr-success-layer"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.22 }}
            >
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1.08, 1] }}
                transition={{ duration: 0.42, ease: 'easeOut' }}
              >
                <FiCheckCircle />
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="tdt-qr-status-row">
        <span className={`tdt-qr-status-dot tdt-qr-status-dot-${scannerState}`} />
        <span>{status}</span>
      </div>

      <AnimatePresence mode="wait">
        {result && (
          <motion.article
            className="tdt-qr-result-card"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.26, ease: 'easeOut' }}
          >
            <div>
              <span>Scan Successful</span>
              <strong>Result</strong>
              <p>{result.code}</p>
            </div>
            <dl>
              <div>
                <dt>Time</dt>
                <dd>{result.timestamp}</dd>
              </div>
              <div>
                <dt>Type</dt>
                <dd>{result.type}</dd>
              </div>
            </dl>
          </motion.article>
        )}
      </AnimatePresence>

      <div className="tdt-qr-actions">
        <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="button" onClick={handleRestart}>
          <FiRefreshCw />
          <span>Restart Scanner</span>
        </motion.button>
        <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="button" onClick={handleToggleCamera}>
          <FiRotateCcw />
          <span>Toggle Camera</span>
        </motion.button>
        {result && (
          <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="button" onClick={handleCopy}>
            <FiCopy />
            <span>{copyStatus || 'Copy Result'}</span>
          </motion.button>
        )}
        {hasResultUrl && (
          <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="button" onClick={handleOpenLink}>
            <FiExternalLink />
            <span>Open Link</span>
          </motion.button>
        )}
      </div>
    </motion.section>
  );
}

export default memo(QRScanner);
