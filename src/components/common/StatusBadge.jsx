import { memo } from 'react';
import { Activity, CheckCircle, Clock3, Minus, MinusCircle, TrendingDown, TrendingUp, XCircle } from 'lucide-react';
import '../../styles/statusBadge.css';

const approvalConfig = {
  approved: { Icon: CheckCircle, label: 'Approved' },
  pending: { Icon: Clock3, label: 'Pending' },
  rejected: { Icon: XCircle, label: 'Rejected' },
  inactive: { Icon: MinusCircle, label: 'Inactive' }
};

const performanceConfig = {
  excellent: { Icon: TrendingUp, label: 'Excellent' },
  good: { Icon: Activity, label: 'Good' },
  average: { Icon: Minus, label: 'Average' },
  low: { Icon: TrendingDown, label: 'Low' }
};

function StatusBadge({ status = 'inactive', type = 'auto', className = '' }) {
  const isPerformance =
    type === 'performance' ||
    (type === 'auto' && Boolean(performanceConfig[status]));
  const config = isPerformance ? performanceConfig : approvalConfig;
  const fallback = isPerformance ? 'average' : 'inactive';
  const normalizedStatus = config[status] ? status : fallback;
  const { Icon, label } = config[normalizedStatus];
  const badgeType = isPerformance ? 'performance' : 'approval';

  return (
    <span className={`workforce-status-badge workforce-status-badge-${badgeType} workforce-status-${normalizedStatus} ${className}`.trim()}>
      <Icon size={13} />
      <span>{label}</span>
    </span>
  );
}

export default memo(StatusBadge);
