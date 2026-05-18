import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Minimize2, Radio } from 'lucide-react';
import logo from '../../assets/logos/tdt_logo.png';
import { enterpriseFilterOptions } from '../../data/enterprisePresentationData';

function formatClock(date) {
  return date.toLocaleTimeString('en-PH', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

export default function EnterprisePresentationHeader({ onExit, refreshLabel = 'Live sync active' }) {
  const [period, setPeriod] = useState(enterpriseFilterOptions.periods[0]);
  const [year, setYear] = useState(enterpriseFilterOptions.years[0]);
  const [month, setMonth] = useState(enterpriseFilterOptions.months[0]);
  const [clock, setClock] = useState(() => formatClock(new Date()));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClock(formatClock(new Date()));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <motion.header
      className="enterprise-present-header"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      <div className="enterprise-present-header-left">
        <img src={logo} alt="TDT Powersteel" className="enterprise-present-logo" />
        <div>
          <p className="enterprise-present-eyebrow">TDT Powersteel</p>
          <h1>Enterprise Analytics</h1>
        </div>
      </div>

      <div className="enterprise-present-filters">
        <label>
          <span>Period</span>
          <select value={period} onChange={event => setPeriod(event.target.value)}>
            {enterpriseFilterOptions.periods.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Year</span>
          <select value={year} onChange={event => setYear(event.target.value)}>
            {enterpriseFilterOptions.years.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Month</span>
          <select value={month} onChange={event => setMonth(event.target.value)}>
            {enterpriseFilterOptions.months.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="enterprise-present-header-right">
        <div className="enterprise-present-live">
          <span className="enterprise-present-live-dot">
            <Radio size={13} />
          </span>
          <div>
            <strong>LIVE</strong>
            <small>{refreshLabel}</small>
          </div>
        </div>
        <span className="enterprise-present-clock">{clock}</span>
        <button className="enterprise-present-exit" type="button" onClick={onExit}>
          <Minimize2 size={15} />
          Exit Present
        </button>
      </div>
    </motion.header>
  );
}
