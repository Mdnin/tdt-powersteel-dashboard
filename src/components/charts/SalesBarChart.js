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
const actualSalesColor = '#D16002';
const targetSalesColor = '#CC5500';
const formatCurrency = value => `PHP ${value.toLocaleString()}`;
const formatYAxisTick = value => `PHP ${value / 1000}k`;

function SalesBarChart() {
  const data = useMemo(() => monthlySalesPerformance, []);
  const latestMonth = data[data.length - 1];

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
          <div className="legend-item actual" data-tooltip={`Actual Sales ${formatCurrency(latestMonth.sales)}`}>
            <span className="legend-bar" />
            Actual Sales
          </div>
          <div className="legend-item target" data-tooltip={`Target ${formatCurrency(latestMonth.target)}`}>
            <span className="legend-bar" />
            Target
          </div>
        </div>
      </div>
      <div className="chart-viewport chart-viewport-wide">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={chartMargin}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="month" stroke="#888" tick={axisTick} />
            <YAxis stroke="#888" tick={axisTick} tickFormatter={formatYAxisTick} />
            <Tooltip
              shared={false}
              cursor={{
                fill: 'rgba(209,96,2,0.06)'
              }}
              contentStyle={{
                background: '#0b0b0b',
                border: '1px solid rgba(209,96,2,0.16)',
                borderRadius: '12px',
                color: '#fff',
                boxShadow: '0 0 12px rgba(204,85,0,0.10)'
              }}
              labelStyle={{
                color: actualSalesColor,
                fontWeight: 600
              }}
              itemStyle={{
                color: '#fff'
              }}
              formatter={(value, name) => [
                formatCurrency(value),
                name
              ]}
            />
            <Bar dataKey="target" name="Target" fill={targetSalesColor} radius={[4, 4, 0, 0]} opacity={0.62} animationDuration={280} />
            <Bar dataKey="sales" name="Actual Sales" fill={actualSalesColor} radius={[4, 4, 0, 0]} opacity={0.88} animationDuration={320} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export default memo(SalesBarChart);
