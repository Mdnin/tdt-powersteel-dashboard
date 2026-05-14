import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import '../../styles/charts.css';
import { monthlySalesPerformance } from '../../data/dashboardData';

const chartMargin = { top: 10, right: 12, left: -8, bottom: 0 };
const axisTick = { fill: '#888', fontSize: 12 };
const formatYAxisTick = value => `$${value / 1000}k`;

const CustomTooltip = memo(function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="custom-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{ color: entry.color }}>
          {`${entry.dataKey}: $${entry.value.toLocaleString()}`}
        </p>
      ))}
    </div>
  );
});

function SalesBarChart() {
  const data = useMemo(() => monthlySalesPerformance, []);
  const tooltip = useMemo(() => <CustomTooltip />, []);

  return (
    <motion.div
      className="chart-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      style={{ willChange: 'opacity, transform' }}
    >
      <div className="chart-glass-inner" />
      <div className="chart-header">
        <h2 className="chart-title">Monthly Sales Performance</h2>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#ff7a00' }} />
            <span>Actual Sales</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#333' }} />
            <span>Target</span>
          </div>
        </div>
      </div>
      <div className="chart-viewport chart-viewport-wide">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={chartMargin}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="month" stroke="#888" tick={axisTick} />
            <YAxis stroke="#888" tick={axisTick} tickFormatter={formatYAxisTick} />
            <Tooltip content={tooltip} />
            <Bar dataKey="target" fill="#333" radius={[4, 4, 0, 0]} opacity={0.6} animationDuration={280} />
            <Bar dataKey="sales" fill="#ff7a00" radius={[4, 4, 0, 0]} animationDuration={320} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export default memo(SalesBarChart);
