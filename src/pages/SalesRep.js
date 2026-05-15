import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import TopThree from '../components/rankings/TopThree';
import RankingsTable from '../components/rankings/RankingsTable';
import { baseSalesReps } from '../data/salesRepData';
import { enrichReps, pageSize } from '../utils/salesRepUtils';
import { useAuth } from '../auth/AuthContext';
import '../styles/dashboard.css';
import '../styles/rankings.css';

export default function SalesRep() {
  const { users } = useAuth();
  const [reps, setReps] = useState(baseSalesReps);
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('all');
  const [performanceFilter, setPerformanceFilter] = useState('all');
  const [sortKey, setSortKey] = useState('rank');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setReps(current => current.map(rep => {
        if (rep.id % 4 !== new Date().getSeconds() % 4) {
          return rep;
        }

        return {
          ...rep,
          leadsGathered: rep.leadsGathered + 1,
          convertedLeads: rep.convertedLeads + (rep.performance > 70 ? 1 : 0),
          grossSalesValue: rep.grossSalesValue + (rep.performance * 120),
          performance: Math.min(100, rep.performance + 1)
        };
      }));
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const workforceReps = useMemo(() => {
    const employeeUsers = users
      .filter(account => account.role === 'employee')
      .map((account, index) => ({
        id: `user-${account.id}`,
        name: account.name,
        position: account.position || 'Sales Representative',
        accountStatus: account.status,
        avatar: account.avatar,
        department: account.department || 'Sales Department',
        leadsGathered: 90 + index * 8,
        convertedLeads: 24 + index * 3,
        grossSalesValue: 62000 + index * 9000,
        performance: account.status === 'approved' ? 72 + (index % 5) * 4 : 38,
        previousRank: reps.length + index + 1
      }));

    const existingNames = new Set(reps.map(rep => rep.name.toLowerCase()));
    return [
      ...reps,
      ...employeeUsers.filter(rep => !existingNames.has(rep.name.toLowerCase()))
    ];
  }, [reps, users]);

  const rankedReps = useMemo(() => enrichReps(workforceReps), [workforceReps]);
  const departments = useMemo(() => ['all', ...new Set(baseSalesReps.map(rep => rep.department))], []);

  const filteredReps = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return rankedReps.filter(rep => {
      const matchesQuery = !normalizedQuery || rep.name.toLowerCase().includes(normalizedQuery);
      const matchesDepartment = department === 'all' || rep.department === department;
      const matchesPerformance =
        performanceFilter === 'all' ||
        (performanceFilter === 'elite' && rep.performance >= 90) ||
        (performanceFilter === 'strong' && rep.performance >= 70 && rep.performance < 90) ||
        (performanceFilter === 'watchlist' && rep.performance < 70);

      return matchesQuery && matchesDepartment && matchesPerformance;
    });
  }, [department, performanceFilter, query, rankedReps]);

  const sortedReps = useMemo(() => {
    return [...filteredReps].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      const direction = sortDirection === 'asc' ? 1 : -1;

      if (typeof aValue === 'string') {
        return aValue.localeCompare(bValue) * direction;
      }

      return (aValue - bValue) * direction;
    });
  }, [filteredReps, sortDirection, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedReps.length / pageSize));
  const visibleReps = sortedReps.slice((page - 1) * pageSize, page * pageSize);
  const topThree = rankedReps.slice(0, 3);

  useEffect(() => {
    setPage(1);
  }, [department, performanceFilter, query, sortDirection, sortKey]);

  const handleSort = key => {
    if (key === sortKey) {
      setSortDirection(current => current === 'asc' ? 'desc' : 'asc');
      return;
    }

    setSortKey(key);
    setSortDirection(key === 'rank' || key === 'name' || key === 'department' ? 'asc' : 'desc');
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.28, ease: 'easeOut' }
    }
  };

  return (
    <div className="rankings-page">
      <motion.div
        className="dashboard-header"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="dashboard-title">Sales Team</h1>
        <p className="dashboard-subtitle">
          Rankings, rep performance, conversion rate, and team activity in one page
        </p>
      </motion.div>

      <TopThree reps={topThree} />

      <motion.div
        className="rankings-toolbar"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24 }}
      >
        <input
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Search employee..."
        />
        <select value={department} onChange={event => setDepartment(event.target.value)}>
          {departments.map(option => (
            <option value={option} key={option}>
              {option === 'all' ? 'All Departments' : option}
            </option>
          ))}
        </select>
        <select value={performanceFilter} onChange={event => setPerformanceFilter(event.target.value)}>
          <option value="all">All Performance</option>
          <option value="elite">Elite 90%+</option>
          <option value="strong">Strong 70-89%</option>
          <option value="watchlist">Watchlist Below 70%</option>
        </select>
      </motion.div>

      <RankingsTable
        reps={visibleReps}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={handleSort}
        page={Math.min(page, totalPages)}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
