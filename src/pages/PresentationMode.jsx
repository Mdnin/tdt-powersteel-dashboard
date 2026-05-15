import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import PresentationHeader from '../components/presentation/PresentationHeader';
import PresentationMetrics from '../components/presentation/PresentationMetrics';
import {
  presentationMetrics,
  presentationRepData,
  presentationSalesTrend,
  presentationSourceData
} from '../data/presentationData';
import '../styles/presentation.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="presentation-tooltip">
      <strong>{label}</strong>
      {payload.map(entry => (
        <span key={entry.dataKey} style={{ color: entry.color }}>
          {entry.name || entry.dataKey}: {entry.value}
        </span>
      ))}
    </div>
  );
};

export default function PresentationMode({ onExit }) {
  const [cycleIndex, setCycleIndex] = useState(0);
  const [refreshCount, setRefreshCount] = useState(0);
  const refreshLabel = useMemo(
    () => `Auto-refresh ${refreshCount + 1} · real-time sync`,
    [refreshCount]
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCycleIndex(current => (current + 1) % 5);
      setRefreshCount(current => (current + 1) % 9);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <motion.div
      className="presentation-shell"
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.985 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
    >
      <PresentationHeader dateRange="Reporting Period: Jan - Jun 2026" onExit={onExit} refreshLabel={refreshLabel} />
      <PresentationMetrics metrics={presentationMetrics} />

      <motion.main
        className="presentation-analytics-grid"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
        }}
      >
        <motion.section className={`presentation-panel presentation-main-chart ${cycleIndex === 0 ? 'presentation-panel-live' : ''}`} variants={panelVariant}>
          <PanelHeader title="Gross Sales Momentum" subtitle="Sales value, lead volume, and target pace" />
          <div className="presentation-chart-fill">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={presentationSalesTrend} margin={{ top: 8, right: 18, left: -8, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="month" stroke="#a7a7a7" fontSize={13} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#a7a7a7" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#a7a7a7" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area yAxisId="left" type="monotone" dataKey="leads" name="Leads" fill="#ff7a00" fillOpacity={0.12} stroke="#ff9f43" strokeWidth={2} animationDuration={550} />
                <Bar yAxisId="right" dataKey="target" name="Target" fill="#CC5500" opacity={0.62} radius={[6, 6, 0, 0]} animationDuration={450} />
                <Line yAxisId="right" type="monotone" dataKey="sales" name="Sales" stroke="#D16002" strokeWidth={3} dot={{ r: 4, fill: '#D16002' }} animationDuration={600} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section className={`presentation-panel presentation-source-panel ${cycleIndex === 1 ? 'presentation-panel-live' : ''}`} variants={panelVariant}>
          <PanelHeader title="Source Breakdown" subtitle="Lead channel contribution" />
          <div className="presentation-source-list">
            {presentationSourceData.map(source => (
              <div className="presentation-source-row" key={source.name}>
                <div>
                  <strong>{source.name}</strong>
                  <span>{source.value} leads</span>
                </div>
                <div className="presentation-source-meter">
                  <span style={{ width: `${source.value / 4}%`, background: source.color }} />
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section className={`presentation-panel ${cycleIndex === 2 ? 'presentation-panel-live' : ''}`} variants={panelVariant}>
          <PanelHeader title="Lead Velocity" subtitle="Monthly gathered leads" />
          <div className="presentation-chart-fill">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={presentationSalesTrend} margin={{ top: 6, right: 10, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="month" stroke="#a7a7a7" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a7a7a7" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="leads" name="Leads" fill="#ff7a00" fillOpacity={0.16} stroke="#ff7a00" strokeWidth={2} animationDuration={500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section className={`presentation-panel ${cycleIndex === 3 ? 'presentation-panel-live' : ''}`} variants={panelVariant}>
          <PanelHeader title="Lead Mix" subtitle="Conversion source profile" />
          <div className="presentation-chart-fill">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={presentationSourceData} dataKey="value" nameKey="name" innerRadius="50%" outerRadius="76%" paddingAngle={3} animationDuration={520}>
                  {presentationSourceData.map(source => (
                    <Cell key={source.name} fill={source.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section className={`presentation-panel presentation-ranking-panel ${cycleIndex === 4 ? 'presentation-panel-live' : ''}`} variants={panelVariant}>
          <PanelHeader title="Sales Rep Rankings" subtitle="Top activity and revenue performers" />
          <div className="presentation-ranking-table">
            {presentationRepData.map(rep => (
              <div className="presentation-ranking-row" key={rep.name}>
                <span>{rep.rank}</span>
                <strong>{rep.name}</strong>
                <em>{rep.sales}</em>
                <small>{rep.deals} deals</small>
              </div>
            ))}
          </div>
        </motion.section>
      </motion.main>
    </motion.div>
  );
}

const panelVariant = {
  hidden: { opacity: 0, y: 14, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.28, ease: 'easeOut' }
  }
};

function PanelHeader({ title, subtitle }) {
  return (
    <div className="presentation-panel-header">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}
