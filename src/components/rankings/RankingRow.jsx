import { motion } from 'framer-motion';
import RankBadge from './RankBadge';
import StatusBadge from '../common/StatusBadge';

export default function RankingRow({ rep, index }) {
  const initials = rep.name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();

  return (
    <motion.tr
      className={rep.rank <= 3 ? 'ranking-row ranking-row-featured' : 'ranking-row'}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.025 }}
      whileHover={{ scale: 1.005 }}
    >
      <td data-label="Rank">
        <RankBadge rank={rep.rank} movement={rep.movement} />
      </td>
      <td data-label="Employee Name">
        <div className="ranking-employee-cell">
          <span className="ranking-avatar">{rep.avatar ? <img src={rep.avatar} alt="" /> : initials}</span>
          <span>
            <strong className="ranking-name">{rep.name}</strong>
            <small>{rep.position || 'Sales Representative'}</small>
          </span>
        </div>
      </td>
      <td data-label="Department">{rep.department}</td>
      <td data-label="Leads Gathered">{rep.leadsGathered.toLocaleString()}</td>
      <td data-label="Converted Leads">{rep.convertedLeads.toLocaleString()}</td>
      <td data-label="Gross Sales">{rep.grossSales}</td>
      <td data-label="Conversion Rate">{rep.conversionRate}%</td>
      <td data-label="Performance %">
        <div className="performance-meter">
          <span style={{ width: `${Math.min(rep.performance, 100)}%` }} />
        </div>
        <em>{rep.performance}%</em>
      </td>
      <td data-label="Performance">
        <StatusBadge status={rep.statusKey} type="performance" />
      </td>
    </motion.tr>
  );
}
