import { motion } from 'framer-motion';
import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
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
  salesTeamPresentationActivity,
  salesTeamPresentationMetrics,
  salesTeamPresentationRankings,
  salesTeamPresentationTopReps
} from '../../data/presentationData';
import { presentationDateRanges, presentationTitles } from '../../utils/presentationVariant';

const rankLabels = ['1st', '2nd', '3rd'];

export default function SalesTeamPresentationView({ onExit }) {
  const { cycleIndex, refreshCount } = usePresentationCycle(4);
  const refreshLabel = useMemo(
    () => `Team refresh ${refreshCount + 1} · live rankings`,
    [refreshCount]
  );

  return (
    <motion.div
      className="presentation-shell presentation-shell-sales-team"
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.985 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
    >
      <PresentationHeader
        title={presentationTitles['sales-team']}
        dateRange={presentationDateRanges['sales-team']}
        onExit={onExit}
        refreshLabel={refreshLabel}
      />
      <PresentationMetrics metrics={salesTeamPresentationMetrics} />

      <motion.main
        className="presentation-analytics-grid presentation-grid-sales-team"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
        }}
      >
        <motion.section className={`presentation-panel presentation-team-podium ${cycleIndex === 0 ? 'presentation-panel-live' : ''}`} variants={panelVariant}>
          <PresentationPanelHeader title="Top Performers" subtitle="Current period leaders" />
          <div className="presentation-podium-grid">
            {salesTeamPresentationTopReps.map(rep => (
              <article className={`presentation-podium-card presentation-podium-${rep.rank}`} key={rep.name}>
                <span className="presentation-podium-rank">{rankLabels[rep.rank - 1]}</span>
                <h3>{rep.name}</h3>
                <p>{rep.department}</p>
                <strong>{rep.sales}</strong>
                <div className="presentation-podium-stats">
                  <span>{rep.performance}</span>
                  <small>{rep.leads} leads · {rep.converted} converted</small>
                </div>
              </article>
            ))}
          </div>
        </motion.section>

        <motion.section className={`presentation-panel presentation-ranking-panel ${cycleIndex === 1 ? 'presentation-panel-live' : ''}`} variants={panelVariant}>
          <PresentationPanelHeader title="Team Rankings" subtitle="Revenue and deal performance" />
          <div className="presentation-ranking-table presentation-ranking-table-wide">
            {salesTeamPresentationRankings.map(rep => (
              <div className="presentation-ranking-row" key={rep.name}>
                <span>{rep.rank}</span>
                <strong>{rep.name}</strong>
                <em>{rep.sales}</em>
                <small>{rep.deals} deals</small>
                <small>{rep.leads} leads</small>
                <small>{rep.gk} GK</small>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section className={`presentation-panel presentation-team-activity ${cycleIndex === 2 ? 'presentation-panel-live' : ''}`} variants={panelVariant}>
          <PresentationPanelHeader title="Rep Activity" subtitle="Leads and closed deals by representative" />
          <div className="presentation-chart-fill">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesTeamPresentationActivity} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="label" stroke="#a7a7a7" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#a7a7a7" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<PresentationTooltip />} />
                <Bar dataKey="leads" name="Leads" fill="#ff9f43" radius={[5, 5, 0, 0]} maxBarSize={22} />
                <Bar dataKey="deals" name="Deals" fill="#D16002" radius={[5, 5, 0, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section className={`presentation-panel presentation-team-sales ${cycleIndex === 3 ? 'presentation-panel-live' : ''}`} variants={panelVariant}>
          <PresentationPanelHeader title="Sales Output" subtitle="Gross sales by top representatives (PHP K)" />
          <div className="presentation-chart-fill">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesTeamPresentationActivity} layout="vertical" margin={{ top: 4, right: 12, left: 4, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" horizontal={false} />
                <XAxis type="number" stroke="#a7a7a7" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="label" stroke="#a7a7a7" fontSize={11} tickLine={false} axisLine={false} width={52} />
                <Tooltip content={<PresentationTooltip />} />
                <Bar dataKey="sales" name="Sales (K)" fill="#ffb15a" radius={[0, 6, 6, 0]} maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>
      </motion.main>
    </motion.div>
  );
}
