import { memo, useMemo } from 'react';
import { representativeSummary } from '../../data/dashboardData';
import { useAuth } from '../../auth/AuthContext';
import StatusBadge from '../common/StatusBadge';
import { baseSalesReps } from '../../data/salesRepData';
import { getPerformanceState } from '../../utils/salesRepUtils';
import '../../styles/tables.css';

function RepTable() {
  const { users } = useAuth();
  const workforceByName = useMemo(
    () => new Map(users.map(user => [user.name?.toLowerCase(), user])),
    [users]
  );
  const performanceByName = useMemo(
    () => new Map(baseSalesReps.map(rep => [rep.name.toLowerCase(), getPerformanceState(rep.performance)])),
    []
  );
  const rows = useMemo(
    () => representativeSummary.map(rep => {
      const profile = workforceByName.get(rep.name.toLowerCase());
      const initials = rep.name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();

      return (
      <tr key={rep.id}>
        <td>
          <div className="rep-identity-cell">
            <span className="rep-avatar">
              {profile?.avatar ? <img src={profile.avatar} alt="" /> : initials}
            </span>
            <span>
              <strong>{profile?.name || rep.name}</strong>
              <small>{profile?.position || 'Sales Representative'}</small>
            </span>
          </div>
        </td>
        <td>{rep.sales}</td>
        <td>{rep.deals}</td>
        <td>
          <StatusBadge status={performanceByName.get(rep.name.toLowerCase()) || 'average'} type="performance" />
        </td>
      </tr>
      );
    }),
    [performanceByName, workforceByName]
  );

  return (
    <div className="table-card">
      <h2 className="table-title">Sales Representatives</h2>
      <table className="rep-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Sales</th>
            <th>Deals</th>
            <th>Performance</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

export default memo(RepTable);
