import { motion } from 'framer-motion';
import { useMemo } from 'react';
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
import PresentationHeader from './PresentationHeader';
import PresentationMetrics from './PresentationMetrics';
import {
  panelVariant,
  PresentationPanelHeader,
  PresentationTooltip,
  usePresentationCycle
} from './presentationShared';
import {
  analyticsDailySales,
  analyticsMonthlySales,
  analyticsPresentationHeatmap,
  analyticsPresentationKpi,
  analyticsPresentationLeadSources,
  analyticsPresentationMetrics,
  analyticsPresentationProducts
} from '../../data/presentationData';
import { presentationDateRanges, presentationTitles } from '../../utils/presentationVariant';

export default function AnalyticsPresentationView({ onExit }) {
  const { cycleIndex, refreshCount } = usePresentationCycle(6);
  const refreshLabel = useMemo(
    () => `Analytics refresh ${refreshCount + 1} · live data`,
    [refreshCount]
  );

  return (
    <motion.div
      className="presentation-shell presentation-shell-analytics"
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.985 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
    >
      <PresentationHeader
        title={presentationTitles.analytics}
        dateRange={presentationDateRanges.analytics}
        onExit={onExit}
        refreshLabel={refreshLabel}
      />
      <PresentationMetrics metrics={analyticsPresentationMetrics} />

      <motion.main
        className="presentation-analytics-grid presentation-grid-analytics"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
        }}
      >
        <motion.section className={`presentation-panel presentation-analytics-daily ${cycleIndex === 0 ? 'presentation-panel-live' : ''}`} variants={panelVariant}>
          <PresentationPanelHeader title="Sales Overview" subtitle="Daily revenue movement" />
          <div className="presentation-chart-fill">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsDailySales} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="label" stroke="#a7a7a7" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a7a7a7" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<PresentationTooltip />} />
                <Area type="monotone" dataKey="sales" name="Sales" fill="#D16002" fillOpacity={0.14} stroke="#ffb15a" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section className={`presentation-panel presentation-analytics-monthly ${cycleIndex === 1 ? 'presentation-panel-live' : ''}`} variants={panelVariant}>
          <PresentationPanelHeader title="Monthly Sales" subtitle="Actual sales vs operating target" />
          <div className="presentation-chart-fill">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsMonthlySales} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="label" stroke="#a7a7a7" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a7a7a7" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<PresentationTooltip />} />
                <Line type="monotone" dataKey="sales" name="Sales" stroke="#D16002" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="target" name="Target" stroke="#CC5500" strokeWidth={2} strokeDasharray="5 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section className={`presentation-panel presentation-analytics-sources ${cycleIndex === 2 ? 'presentation-panel-live' : ''}`} variants={panelVariant}>
          <PresentationPanelHeader title="Lead Sources" subtitle="Top channels by lead volume" />
          <div className="presentation-source-list">
            {analyticsPresentationLeadSources.map(source => (
              <div className="presentation-source-row" key={source.name}>
                <div>
                  <strong>{source.name}</strong>
                  <span>{source.value} leads</span>
                </div>
                <div className="presentation-source-meter">
                  <span style={{ width: `${Math.min(100, source.value / 1.8)}%`, background: source.color }} />
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section className={`presentation-panel presentation-analytics-products ${cycleIndex === 3 ? 'presentation-panel-live' : ''}`} variants={panelVariant}>
          <PresentationPanelHeader title="Product Mix" subtitle="Contribution share by product" />
          <div className="presentation-chart-fill">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={analyticsPresentationProducts} dataKey="value" nameKey="name" innerRadius="48%" outerRadius="74%" paddingAngle={3}>
                  {analyticsPresentationProducts.map(product => (
                    <Cell key={product.name} fill={product.color} />
                  ))}
                </Pie>
                <Tooltip content={<PresentationTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section className={`presentation-panel presentation-analytics-kpi ${cycleIndex === 4 ? 'presentation-panel-live' : ''}`} variants={panelVariant}>
          <PresentationPanelHeader title="KPI Progress" subtitle="Completion against targets" />
          <div className="presentation-chart-fill">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsPresentationKpi} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="label" stroke="#a7a7a7" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#a7a7a7" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<PresentationTooltip />} />
                <Bar dataKey="completion" name="Completion %" fill="#D16002" radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section className={`presentation-panel presentation-analytics-heatmap ${cycleIndex === 5 ? 'presentation-panel-live' : ''}`} variants={panelVariant}>
          <PresentationPanelHeader title="Weekly Intensity" subtitle="Sales activity heatmap by day" />
          <div className="presentation-heatmap-list">
            {analyticsPresentationHeatmap.map(day => (
              <div className="presentation-heatmap-row" key={day.day}>
                <span>{day.day}</span>
                <div className="presentation-heatmap-meter">
                  <span style={{ width: `${day.level}%` }} />
                </div>
                <strong>{day.level}%</strong>
              </div>
            ))}
          </div>
        </motion.section>
      </motion.main>
    </motion.div>
  );
}
