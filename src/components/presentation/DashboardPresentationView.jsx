import { motion } from 'framer-motion';
import { useMemo } from 'react';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import EnterprisePresentationHeader from './EnterprisePresentationHeader';
import {
  enterpriseCompanies,
  enterpriseGsGkTrend,
  enterpriseItemsSummary,
  enterpriseKpiSummary,
  enterpriseLeaderboard,
  enterpriseLiveCompany,
  enterpriseMonthlyTrend,
  enterpriseTermsFunnel,
  enterpriseTotalSalesDisplay,
  formatEnterpriseCurrency
} from '../../data/enterprisePresentationData';
import '../../styles/enterprise-presentation.css';

const panelMotion = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: 'easeOut' }
  }
};

function EnterpriseTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="enterprise-chart-tooltip">
      <strong>{label}</strong>
      {payload.map(entry => (
        <span key={entry.dataKey} style={{ color: entry.color }}>
          {entry.name || entry.dataKey}: {entry.value}
        </span>
      ))}
    </div>
  );
}

function PanelTitle({ title, subtitle }) {
  return (
    <div className="enterprise-panel-title">
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  );
}

function TermsFunnel({ data }) {
  return (
    <div className="enterprise-funnel">
      {data.map(item => (
        <div
          className="enterprise-funnel-slice"
          key={item.name}
          style={{ '--slice-width': `${item.width}%`, '--slice-fill': item.fill }}
        >
          <strong>{item.name}</strong>
          <span>{item.value} records - {item.share}%</span>
        </div>
      ))}
    </div>
  );
}

function AutoScroll({ children, className = '', distance = 120, duration = 14 }) {
  return (
    <div
      className={`enterprise-auto-scroll ${className}`}
      style={{ '--scroll-distance': `${distance}px`, '--scroll-duration': `${duration}s` }}
    >
      <div className="enterprise-auto-scroll-track">
        {children}
      </div>
    </div>
  );
}

export default function DashboardPresentationView({ onExit }) {
  const refreshLabel = useMemo(() => 'Real-time sync - upload connected', []);

  return (
    <motion.div
      className="enterprise-present-shell"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <EnterprisePresentationHeader onExit={onExit} refreshLabel={refreshLabel} />

      <motion.main
        className="enterprise-present-grid"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.08 } }
        }}
      >
        <motion.section className="enterprise-panel enterprise-area-kpi" variants={panelMotion}>
          <PanelTitle title="KPI Summary" />
          <div className="enterprise-kpi-row">
            {enterpriseKpiSummary.map(item => (
              <article className="enterprise-kpi-card" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </motion.section>

        <motion.section className="enterprise-panel enterprise-area-hero" variants={panelMotion}>
          <PanelTitle title="Sales Data" />
          <div className="enterprise-sales-hero">
            <strong>{enterpriseTotalSalesDisplay}</strong>
            <span>Current uploaded sales value</span>
          </div>
        </motion.section>

        <motion.section className="enterprise-panel enterprise-area-trend" variants={panelMotion}>
          <PanelTitle title="Monthly Sales Trend" subtitle="PHP millions" />
          <div className="enterprise-chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enterpriseMonthlyTrend} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<EnterpriseTooltip />} />
                <Line type="monotone" dataKey="sales" name="Sales" stroke="#D16002" strokeWidth={2.5} dot={{ r: 3, fill: '#D16002' }} animationDuration={800} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section className="enterprise-panel enterprise-area-companies" variants={panelMotion}>
          <PanelTitle title="List of Companies" />
          <div className="enterprise-table-wrap">
            <div className="enterprise-table-head">
              <span>#</span>
              <span>Company</span>
              <span>Value</span>
            </div>
            <AutoScroll className="enterprise-table-body" distance={190} duration={16}>
              {enterpriseCompanies.map(row => (
                  <div className="enterprise-table-row" key={row.id}>
                    <span>{row.id}</span>
                    <span>{row.company}</span>
                    <strong>{formatEnterpriseCurrency(row.value)}</strong>
                  </div>
                ))}
            </AutoScroll>
            </div>
        </motion.section>

        <motion.section className="enterprise-panel enterprise-area-live" variants={panelMotion}>
          <PanelTitle title="Live Company" subtitle="Latest uploaded transaction" />
          <div className="enterprise-live-company">
            <h3>{enterpriseLiveCompany.name}</h3>
            <dl>
              <div>
                <dt>Sales Rep</dt>
                <dd>{enterpriseLiveCompany.salesRep}</dd>
              </div>
              <div>
                <dt>Client Type</dt>
                <dd>{enterpriseLiveCompany.clientType}</dd>
              </div>
              <div>
                <dt>Value</dt>
                <dd className="is-highlight">{enterpriseLiveCompany.value}</dd>
              </div>
              <div>
                <dt>Sales Terms</dt>
                <dd>{enterpriseLiveCompany.salesTerms}</dd>
              </div>
            </dl>
          </div>
        </motion.section>

        <motion.section className="enterprise-panel enterprise-area-gsgk" variants={panelMotion}>
          <PanelTitle title="Monthly GS & GK" subtitle="Thousands - dashed targets" />
          <div className="enterprise-chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enterpriseGsGkTrend} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<EnterpriseTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="gs" name="GS" stroke="#facc15" strokeWidth={2.2} dot={false} animationDuration={800} />
                <Line type="monotone" dataKey="gk" name="GK" stroke="#38bdf8" strokeWidth={2.2} dot={false} animationDuration={800} />
                <Line type="monotone" dataKey="gsTarget" name="GS Target" stroke="#facc15" strokeDasharray="5 4" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="gkTarget" name="GK Target" stroke="#38bdf8" strokeDasharray="5 4" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section className="enterprise-panel enterprise-area-items" variants={panelMotion}>
          <PanelTitle title="Items Summary" />
          <div className="enterprise-items-layout">
            <div className="enterprise-chart-box enterprise-chart-box-donut">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={enterpriseItemsSummary} dataKey="value" nameKey="name" innerRadius="54%" outerRadius="78%" paddingAngle={2} animationDuration={700}>
                    {enterpriseItemsSummary.map(item => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<EnterpriseTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="enterprise-items-legend">
              {enterpriseItemsSummary.map(item => (
                <div className="enterprise-legend-item" key={item.name}>
                  <i style={{ background: item.color }} />
                  <span>{item.name}</span>
                  <strong>{item.value}%</strong>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section className="enterprise-panel enterprise-area-leaderboard" variants={panelMotion}>
          <PanelTitle title="Sales Leaderboard" />
          <div className="enterprise-table-wrap">
            <div className="enterprise-table-head enterprise-table-head-leaderboard">
              <span>Sales Rep</span>
              <span>Records</span>
              <span>Value</span>
            </div>
            <AutoScroll className="enterprise-table-body" distance={120} duration={14}>
              {enterpriseLeaderboard.map(row => (
                  <div className="enterprise-table-row enterprise-table-row-leaderboard" key={row.rep}>
                    <span>{row.rep}</span>
                    <span>{row.records.toLocaleString()}</span>
                    <strong>{formatEnterpriseCurrency(row.value)}</strong>
                  </div>
                ))}
            </AutoScroll>
          </div>
        </motion.section>

        <motion.section className="enterprise-panel enterprise-area-funnel" variants={panelMotion}>
          <PanelTitle title="Sales Terms" />
          <TermsFunnel data={enterpriseTermsFunnel} />
        </motion.section>
      </motion.main>
    </motion.div>
  );
}
