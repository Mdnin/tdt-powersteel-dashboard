import { memo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Activity, BarChart3, Target, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { monthlyGrossSalesTrend, weeklySalesTrend, dailySalesTrend, clientTypeSales } from '../../data/enterpriseAnalytics';

const POPUP_COLORS = ['#D16002', '#ff9f43', '#ffb15a', '#10b981'];

const kpiInsights = {
  sales: {
    title: 'Revenue Pulse',
    eyebrow: 'Gross sales trend',
    icon: BarChart3,
    trend: '+8.2%',
    direction: 'up',
    chartType: 'area',
    dataKey: 'sales',
    data: monthlyGrossSalesTrend,
    stats: [
      { label: 'MTD', value: 'PHP 2.1M' },
      { label: 'Target', value: 'PHP 2.0M' },
      { label: 'GK Share', value: '19.9%' },
      { label: 'Variance', value: '+4.8%' }
    ]
  },
  gk: {
    title: 'GK Contribution',
    eyebrow: 'GK vs gross sales',
    icon: Activity,
    trend: '+6.9%',
    direction: 'up',
    chartType: 'bar',
    dataKey: 'gk',
    data: monthlyGrossSalesTrend,
    stats: [
      { label: 'MTD GK', value: 'PHP 418K' },
      { label: 'Avg GK %', value: '19.4%' },
      { label: 'Top Branch', value: 'Caloocan' },
      { label: 'MoM', value: '+6.9%' }
    ]
  },
  leads: {
    title: 'Lead Momentum',
    eyebrow: 'Weekly lead velocity',
    icon: Users,
    trend: '+12.5%',
    direction: 'up',
    chartType: 'area',
    dataKey: 'sales',
    data: weeklySalesTrend,
    stats: [
      { label: 'This Week', value: '312' },
      { label: 'Qualified', value: '68%' },
      { label: 'Top Source', value: 'Facebook' },
      { label: 'Pipeline', value: '1,248' }
    ]
  },
  deals: {
    title: 'Deal Closure',
    eyebrow: 'Closed deal cadence',
    icon: Target,
    trend: '-3.1%',
    direction: 'down',
    chartType: 'bar',
    dataKey: 'conversion',
    data: weeklySalesTrend,
    stats: [
      { label: 'Closed', value: '324' },
      { label: 'Win Rate', value: '25.9%' },
      { label: 'Avg Cycle', value: '11d' },
      { label: 'At Risk', value: '42' }
    ]
  },
  conversion: {
    title: 'Conversion Health',
    eyebrow: 'Weekly conversion rate',
    icon: Activity,
    trend: '+2.4%',
    direction: 'up',
    chartType: 'line-area',
    dataKey: 'conversion',
    data: weeklySalesTrend,
    stats: [
      { label: 'Rate', value: '25.9%' },
      { label: 'Target', value: '24%' },
      { label: 'Best Week', value: 'W4' },
      { label: 'Lift', value: '+2.4%' }
    ]
  },
  'active-reps': {
    title: 'Rep Activity',
    eyebrow: 'Active field coverage',
    icon: Users,
    trend: '+2',
    direction: 'up',
    chartType: 'bar',
    dataKey: 'sales',
    data: dailySalesTrend,
    stats: [
      { label: 'Active', value: '18' },
      { label: 'On Target', value: '14' },
      { label: 'Coaching', value: '3' },
      { label: 'Capacity', value: '94%' }
    ]
  },
  'avg-rep': {
    title: 'Rep Productivity',
    eyebrow: 'Average output per rep',
    icon: BarChart3,
    trend: '+5.1%',
    direction: 'up',
    chartType: 'area',
    dataKey: 'sales',
    data: dailySalesTrend,
    stats: [
      { label: 'Avg Sales', value: 'PHP 117K' },
      { label: 'Median', value: 'PHP 108K' },
      { label: 'Top Quartile', value: 'PHP 142K' },
      { label: 'Growth', value: '+5.1%' }
    ]
  },
  growth: {
    title: 'Growth Trajectory',
    eyebrow: 'Month-over-month lift',
    icon: Activity,
    trend: '+1.8%',
    direction: 'up',
    chartType: 'area',
    dataKey: 'sales',
    data: monthlyGrossSalesTrend,
    stats: [
      { label: 'MoM', value: '8.2%' },
      { label: 'QoQ', value: '11.4%' },
      { label: 'Forecast', value: '9.1%' },
      { label: 'Delta', value: '+1.8%' }
    ]
  },
  clients: {
    title: 'Client Base',
    eyebrow: 'Client mix overview',
    icon: Users,
    trend: '+34',
    direction: 'up',
    chartType: 'donut',
    data: clientTypeSales,
    stats: [
      { label: 'Total', value: '486' },
      { label: 'New', value: '34' },
      { label: 'Repeat', value: '62%' },
      { label: 'Churn', value: '2.1%' }
    ]
  },
  'top-rep': {
    title: 'Top Performer',
    eyebrow: 'Leaderboard snapshot',
    icon: Target,
    trend: '94%',
    direction: 'up',
    chartType: 'bar',
    dataKey: 'sales',
    data: dailySalesTrend,
    stats: [
      { label: 'Rep', value: 'Ana Reyes' },
      { label: 'Quota', value: '94%' },
      { label: 'Deals', value: '48' },
      { label: 'GK %', value: '22%' }
    ]
  }
};

function PopupTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="kpi-popup-tooltip">
      <p>{label}</p>
      <strong>{payload[0].value?.toLocaleString?.() ?? payload[0].value}</strong>
    </div>
  );
}

const tooltipElement = <PopupTooltip />;

function TrendBadge({ direction, trend }) {
  return (
    <span className={`kpi-popup-trend ${direction === 'down' ? 'is-down' : 'is-up'}`}>
      {direction === 'down' ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
      {trend}
    </span>
  );
}

function KPIChart({ insight }) {
  const { chartType, dataKey, data } = insight;

  if (chartType === 'donut') {
    return (
      <div className="kpi-donut-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={72} paddingAngle={3}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={POPUP_COLORS[index % POPUP_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={tooltipElement} />
          </PieChart>
        </ResponsiveContainer>
        <div className="kpi-donut-center">
          <strong>{data[0]?.value}%</strong>
          <span>{data[0]?.name}</span>
        </div>
      </div>
    );
  }

  if (chartType === 'bar') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false} width={36} />
          <Tooltip content={tooltipElement} cursor={{ fill: 'rgba(209,96,2,0.06)' }} />
          <Bar dataKey={dataKey} fill="#D16002" radius={[6, 6, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="kpiPopupFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D16002" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#D16002" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false} width={36} />
        <Tooltip content={tooltipElement} cursor={{ stroke: 'rgba(255,177,90,0.12)' }} />
        <Area type="monotone" dataKey={dataKey} stroke="#ffb15a" fill="url(#kpiPopupFill)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function buildFallbackInsight(metric, title) {
  return {
    title: title || 'KPI Overview',
    eyebrow: 'Performance snapshot',
    icon: BarChart3,
    trend: '+0.0%',
    direction: 'up',
    chartType: 'area',
    dataKey: 'sales',
    data: weeklySalesTrend,
    stats: [
      { label: 'Metric', value: title || metric },
      { label: 'Period', value: 'This month' },
      { label: 'Status', value: 'On track' },
      { label: 'Updated', value: 'Live' }
    ]
  };
}

function getInsight(metric, title) {
  return kpiInsights[metric] || buildFallbackInsight(metric, title);
}

function KPIHoverPopup({ metric, title }) {
  const insight = getInsight(metric, title);
  const Icon = insight.icon;

  return (
    <div className="kpi-popup-content">
      <div className="kpi-popup-sheen" />
      <div className="kpi-popup-header">
        <div>
          <span className="kpi-popup-eyebrow">
            <Icon size={12} />
            {insight.eyebrow}
          </span>
          <h4>{insight.title}</h4>
        </div>
        <TrendBadge direction={insight.direction} trend={insight.trend} />
      </div>
      <div className="popup-chart">
        <KPIChart insight={insight} />
      </div>
      <div className="kpi-popup-meta">
        {insight.stats.map(item => (
          <div className="kpi-popup-stat" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(KPIHoverPopup);
