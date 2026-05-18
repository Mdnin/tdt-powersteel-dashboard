import {
  filterOptions,
  monthlyGrossSalesTrend,
  productData,
  salesByRep,
  termsData
} from './enterpriseAnalytics';

export const enterpriseFilterOptions = filterOptions;

export const enterpriseKpiSummary = [
  { label: 'Total Records', value: '1,248' },
  { label: 'Companies', value: '486' },
  { label: 'Sales Value', value: 'PHP 258.8M' }
];

export const enterpriseTotalSalesDisplay = 'PHP 258.8M';

export const enterpriseMonthlyTrend = monthlyGrossSalesTrend.map(item => ({
  month: item.label,
  sales: Math.round(item.sales / 1000000),
  target: Math.round(item.target / 1000000)
}));

export const enterpriseGsGkTrend = monthlyGrossSalesTrend.map(item => ({
  month: item.label,
  gs: Math.round(item.sales / 1000),
  gk: Math.round(item.gk / 1000),
  gsTarget: Math.round(item.target / 1000),
  gkTarget: Math.round(item.target * 0.2 / 1000)
}));

export const enterpriseCompanies = [
  { id: 1, company: 'ARR Construction', value: 14800000 },
  { id: 2, company: 'Northline Builders', value: 12650000 },
  { id: 3, company: 'RJC Construction', value: 11840000 },
  { id: 4, company: 'MetroFab Supply', value: 9720000 },
  { id: 5, company: 'Cebu Steelworks', value: 8460000 },
  { id: 6, company: 'DPWH Project Desk', value: 17100000 },
  { id: 7, company: 'SteelCore Industries', value: 9340000 },
  { id: 8, company: 'Pacific Rim Trading', value: 8890000 },
  { id: 9, company: 'BuildRight Contractors', value: 7650000 },
  { id: 10, company: 'Summit Engineering', value: 7120000 },
  { id: 11, company: 'Metro Steel Partners', value: 6980000 },
  { id: 12, company: 'Golden Gate Fabrication', value: 6540000 }
];

export const enterpriseLiveCompany = {
  name: 'ARR CONSTRUCTION',
  salesRep: 'Ana Reyes',
  clientType: 'Contractor',
  value: 'PHP 14,800,000',
  salesTerms: 'FT'
};

export const enterpriseItemsSummary = productData.map((product, index) => ({
  name: product.label,
  value: product.contribution,
  color: ['#D16002', '#CC5500', '#facc15', '#38bdf8', '#ff6b57', '#a1a1aa'][index % 6]
}));

export const enterpriseLeaderboard = salesByRep.map(rep => ({
  rep: rep.label,
  records: rep.deals + rep.leads,
  value: rep.sales
}));

const funnelColors = ['#a7b4c1', '#3b82f6', '#64748b', '#ef4444', '#f59e0b', '#10b981'];

export const enterpriseTermsFunnel = [
  { name: 'Online-Cash', value: 295, share: 43, fill: funnelColors[0], width: 100 },
  { name: '30 days PDC', value: 136, share: 20, fill: funnelColors[1], width: 90 },
  { name: 'Online Check', value: 84, share: 12, fill: funnelColors[2], width: 80 },
  { name: '45 days PDC', value: 66, share: 10, fill: funnelColors[3], width: 70 },
  { name: '60 days PDC', value: 60, share: 9, fill: funnelColors[4], width: 58 },
  { name: 'Cash', value: 46, share: 7, fill: funnelColors[5], width: 46 }
];

export const enterpriseTermsFromUpload = termsData.map((term, index) => ({
  name: term.label,
  value: term.count,
  fill: funnelColors[index % funnelColors.length]
}));

export function formatEnterpriseCurrency(value) {
  if (value >= 1000000) {
    return `PHP ${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `PHP ${Math.round(value / 1000)}K`;
  }

  return `PHP ${value.toLocaleString()}`;
}

export function formatCompactNumber(value) {
  return value.toLocaleString();
}
