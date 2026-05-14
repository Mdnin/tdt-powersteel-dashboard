import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import '../../styles/charts.css';
import { sourceDistribution, sourceDistributionColors } from '../../data/dashboardData';

const CustomTooltip = memo(function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;

  const datum = payload[0].payload;
  return (
    <div className="custom-tooltip">
      <p className="tooltip-label">{datum.name}</p>
      <p style={{ color: payload[0].color }}>
        {`Leads: ${datum.value} (${datum.percentage}%)`}
      </p>
    </div>
  );
});

const LegendLabel = memo(function LegendLabel({ value, color }) {
  return <span style={{ color }}>{value}</span>;
});

function renderCustomizedLabel({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${percentage}%`}
    </text>
  );
}

function SourcePieChart() {
  const data = useMemo(() => sourceDistribution, []);
  const colors = useMemo(() => sourceDistributionColors, []);
  const tooltip = useMemo(() => <CustomTooltip />, []);
  const legendFormatter = useMemo(
    () => (value, entry) => <LegendLabel value={value} color={entry.color} />,
    []
  );

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
        <h2 className="chart-title">Lead Sources Distribution</h2>
      </div>
      <div className="chart-viewport chart-viewport-pie">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius="68%"
              fill="#8884d8"
              dataKey="value"
              animationBegin={120}
              animationDuration={360}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={tooltip} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={legendFormatter}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export default memo(SourcePieChart);
