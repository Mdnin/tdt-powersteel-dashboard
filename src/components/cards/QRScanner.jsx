import { memo, useEffect, useRef, useState } from 'react';
import scannerFrame from '../../assets/image/scanner.png';
import '../../styles/auth.css';

function QRScanner({ title, subtitle }) {
  const videoRef = useRef(null);
  const [cameraState, setCameraState] = useState('loading');

  useEffect(() => {
    let activeStream;
    let isMounted = true;

    async function requestCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraState('denied');
        return;
      }

      try {
        activeStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });

        if (isMounted && videoRef.current) {
          videoRef.current.srcObject = activeStream;
          videoRef.current.play?.().catch(() => {});
          setCameraState('enabled');
        }
      } catch {
        if (isMounted) {
          setCameraState('denied');
        }
      }
    }

    requestCamera();

    return () => {
      isMounted = false;
      activeStream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <div className="qr-scanner-wrapper">
      <div className="qr-title-block">
        <span className="auth-section-label">Security Portal</span>
        <h3>{title || 'Scan Your QR Code'}</h3>
      </div>

      <div className={`scanner-container qr-camera-${cameraState}`}>
        <div className="qr-camera-window">
          <video ref={videoRef} autoPlay muted playsInline className="scanner-video" />
          {cameraState === 'denied' && (
            <span className="qr-camera-note">Camera access required</span>
          )}
        </div>

        <img src={scannerFrame} alt="QR Scanner" className="scanner-overlay" />

        <div className="scan-line" />
      </div>

      <p className="qr-copy">{subtitle}</p>
    </div>
  );
}

export default memo(QRScanner);
