import { motion } from 'framer-motion';
import '../../styles/auth.css';

export default function QRScanner({ title, subtitle }) {
  return (
    <div className="qr-scanner-wrapper">
      <div className="qr-title-block">
        <span className="auth-section-label">Security Portal</span>
        <h3>{title || 'Scan Your QR Code'}</h3>
      </div>

      <div className="qr-scanner-frame">
        <div className="qr-corner top-left" />
        <div className="qr-corner top-right" />
        <div className="qr-corner bottom-left" />
        <div className="qr-corner bottom-right" />
        
        <div className="qr-grid-overlay" />
        <motion.div 
          className="scanner-line"
          animate={{ top: ['10%', '90%', '10%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <p className="qr-copy">{subtitle}</p>
    </div>
  );
}
