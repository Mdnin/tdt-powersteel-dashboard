import { AnimatePresence, motion } from 'framer-motion';
import { TrendingDown, TrendingUp } from 'lucide-react';
import RankingRow from './RankingRow';

export default function RankingsTable({
  reps,
  sortKey,
  sortDirection,
  onSort,
  page,
  totalPages,
  onPageChange
}) {
  const columns = [
    ['rank', 'Rank #'],
    ['name', 'Employee Name'],
    ['department', 'Department'],
    ['leadsGathered', 'Leads Gathered'],
    ['convertedLeads', 'Converted Leads'],
    ['grossSalesValue', 'Gross Sales'],
    ['conversionRate', 'Conversion Rate'],
    ['performance', 'Performance %'],
    ['statusKey', 'Performance']
  ];

  return (
    <section className="rankings-table-shell">
      <div className="rankings-table-header">
        <div>
          <p>Live Competition Board</p>
          <h2>Full Sales Rankings</h2>
        </div>
        <span className="live-update-pill">Live ranking updates</span>
      </div>

      <div className="rankings-table-scroll">
        <table className="rankings-table">
          <thead>
            <tr>
              {columns.map(([key, label]) => (
                <th key={key}>
                  <button type="button" onClick={() => onSort(key)}>
                    {label}
                    {sortKey === key && (
                      <span className={`sort-direction-icon sort-direction-${sortDirection}`}>
                        {sortDirection === 'asc' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      </span>
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <AnimatePresence>
            <tbody>
              {reps.map((rep, index) => (
                <RankingRow rep={rep} index={index} key={rep.id} />
              ))}
            </tbody>
          </AnimatePresence>
        </table>
      </div>

      {reps.length === 0 && (
        <motion.div
          className="rankings-empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No representatives match the current filters.
        </motion.div>
      )}

      <div className="rankings-pagination">
        <button type="button" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button type="button" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
          Next
        </button>
      </div>
    </section>
  );
}
