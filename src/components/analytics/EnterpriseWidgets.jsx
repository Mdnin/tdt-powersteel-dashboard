import { memo, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { filterOptions } from '../../data/enterpriseAnalytics';
import '../../styles/enterprise.css';

const orange = '#ffb15a';
const actualSalesColor = '#D16002';
const targetSalesColor = '#CC5500';
const amber = '#ffb347';
const green = '#10b981';
const muted = 'rgba(255,255,255,0.62)';
const chartMargin = { top: 14, right: 18, left: -8, bottom: 4 };
const axisTick = { fill: muted, fontSize: 11 };
const pieColors = ['#ffb15a', '#ffcf8f', '#10b981', '#3b82f6', '#f97316', '#facc15'];
const barColorByKey = {
  actual: actualSalesColor,
  sales: actualSalesColor,
  revenue: actualSalesColor,
  target: targetSalesColor
};
const initialFilters = {
  period: 'Monthly',
  year: '2026',
  month: 'May',
  branch: 'all'
};

function TooltipBox({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="enterprise-tooltip">
      <strong>{label || payload[0].name}</strong>
      {payload.map(item => (
        <span key={item.dataKey || item.name}>
          {item.name || item.dataKey}: {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
        </span>
      ))}
    </div>
  );
}

function ChartHeader({ title, subtitle }) {
  return (
    <div className="enterprise-card-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}

export const EnterpriseFilters = memo(function EnterpriseFilters() {
  const [filters, setFilters] = useState(initialFilters);
  const monthDisabled = filters.period === 'Yearly' || filters.period === 'YTD';

  const update = key => event => {
    const value = event.target.value;
    setFilters(current => {
      const next = { ...current, [key]: value };
      if (key === 'period' && (value === 'Yearly' || value === 'YTD')) {
        next.month = 'All Months';
      }
      return next;
    });
  };

  return (
    <motion.section
      className="enterprise-filters filter-bar filters-wrapper filters-panel filters-container filters-grid"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
    >
      <label className="select-wrapper filter-group">
        <span className="filter-label">Period</span>
        <select className="filter-select" value={filters.period} onChange={update('period')}>
          {filterOptions.periods.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
      </label>
      <label className="select-wrapper filter-group">
        <span className="filter-label">Year</span>
        <select className="filter-select" value={filters.year} onChange={update('year')}>
          {filterOptions.years.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
      </label>
      <label className="select-wrapper filter-group">
        <span className="filter-label">Month</span>
        <select
          className="filter-select"
          value={filters.month}
          onChange={update('month')}
          disabled={monthDisabled}
        >
          {filterOptions.months.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
      </label>
      <label className="select-wrapper filter-group">
        <span className="filter-label">Branch</span>
        <select className="filter-select" value={filters.branch} onChange={update('branch')}>
          {filterOptions.branches.map(({ id, label }) => (
            <option key={id} value={id}>{label}</option>
          ))}
        </select>
      </label>
      <button className="filter-reset reset-filter-button reset-button" type="button" onClick={() => setFilters(initialFilters)}>
        Reset Filters
      </button>
    </motion.section>
  );
});

export const EnterpriseChart = memo(function EnterpriseChart({ title, subtitle, type = 'bar', data, keys = ['sales'], height = 280 }) {
  const tooltip = useMemo(() => <TooltipBox />, []);

  return (
    <motion.article
      className="enterprise-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      <div className="enterprise-card-glow" />
      <ChartHeader title={title} subtitle={subtitle} />
      <div className="enterprise-chart" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ? (
            <LineChart data={data} margin={chartMargin}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
              <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} width={48} />
              <Tooltip content={tooltip} cursor={{ stroke: 'rgba(255,177,90,0.12)' }} />
              {keys.map((key, index) => (
                <Line key={key} type="monotone" dataKey={key} name={key} stroke={index ? amber : orange} strokeWidth={3} dot={{ r: 3 }} animationDuration={360} />
              ))}
            </LineChart>
          ) : type === 'area' ? (
            <AreaChart data={data} margin={chartMargin}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
              <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} width={48} />
              <Tooltip content={tooltip} cursor={{ stroke: 'rgba(255,177,90,0.12)' }} />
              <Area type="monotone" dataKey={keys[0]} stroke={orange} fill="rgba(255,177,90,0.10)" strokeWidth={3} animationDuration={360} />
            </AreaChart>
          ) : type === 'pie' ? (
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius="52%" outerRadius="78%" paddingAngle={3} animationDuration={360}>
                {data.map((entry, index) => <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />)}
              </Pie>
              <Tooltip content={tooltip} />
            </PieChart>
          ) : (
            <BarChart data={data} margin={chartMargin}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
              <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} interval={0} angle={data.length > 7 ? -18 : 0} textAnchor={data.length > 7 ? 'end' : 'middle'} height={data.length > 7 ? 56 : 32} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} width={48} />
              <Tooltip content={tooltip} cursor={{ fill: 'rgba(209,96,2,0.06)' }} />
              {keys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  name={key}
                  fill={barColorByKey[key] || (index === 1 ? green : index === 2 ? amber : orange)}
                  opacity={key === 'target' ? 0.68 : 0.9}
                  radius={[5, 5, 0, 0]}
                  animationDuration={320}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.article>
  );
});

export const HeatmapCard = memo(function HeatmapCard({ data }) {
  return (
    <motion.article className="enterprise-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="enterprise-card-glow" />
      <ChartHeader title="Sales Heatmap by Day" subtitle="High-activity days glow brighter for quick scanning" />
      <div className="enterprise-heatmap">
        {data.map(item => (
          <div key={item.day} className="enterprise-heatmap-cell" style={{ '--heat': item.level / 100 }}>
            <strong>{item.day}</strong>
            <span>{item.level}%</span>
          </div>
        ))}
      </div>
    </motion.article>
  );
});

export const EnterpriseTable = memo(function EnterpriseTable({ title, columns, rows }) {
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const visibleRows = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <motion.article className="enterprise-table-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="enterprise-card-header">
        <h2>{title}</h2>
      </div>
      <div className="enterprise-table-scroll">
        <table className="enterprise-table">
          <thead>
            <tr>{columns.map(column => <th key={column}>{column}</th>)}</tr>
          </thead>
          <tbody>
            {visibleRows.map((row, rowIndex) => (
              <tr key={`${title}-${rowIndex}`}>
                {row.map((cell, cellIndex) => <td key={`${title}-${rowIndex}-${cellIndex}`}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="enterprise-pagination">
        <button type="button" disabled={page === 1} onClick={() => setPage(current => Math.max(1, current - 1))}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button type="button" disabled={page === totalPages} onClick={() => setPage(current => Math.min(totalPages, current + 1))}>Next</button>
      </div>
    </motion.article>
  );
});
