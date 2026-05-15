import { motion } from 'framer-motion';
import { Minimize2, Radio } from 'lucide-react';
import logo from '../../assets/logos/tdt_logo.png';

export default function PresentationHeader({ dateRange, onExit, refreshLabel = 'Live sync active' }) {
  return (
    <motion.header
      className="presentation-header"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      <div className="presentation-brand">
        <img src={logo} alt="TDT Powersteel" className="presentation-logo" />
        <div>
          <p className="presentation-company">TDT Powersteel</p>
          <h1>TDT POWERSTEEL DASHBOARD</h1>
        </div>
      </div>

      <div className="presentation-live">
        <span className="presentation-live-dot">
          <Radio size={14} />
        </span>
        <span>LIVE PRESENT</span>
        <small>{refreshLabel}</small>
      </div>

      <div className="presentation-header-right">
        <span className="presentation-date-range">{dateRange}</span>
        <button className="presentation-exit-btn" type="button" onClick={onExit}>
          <Minimize2 size={16} />
          Exit Present
        </button>
      </div>
    </motion.header>
  );
}
