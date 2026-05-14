export const pageSize = 6;

export const getStatus = performance => {
  if (performance >= 92) return { status: 'Excellent', statusKey: 'excellent' };
  if (performance >= 78) return { status: 'Good', statusKey: 'good' };
  if (performance >= 60) return { status: 'Average', statusKey: 'average' };
  return { status: 'Low', statusKey: 'low' };
};

export const getPerformanceState = performance => getStatus(Number(performance) || 0).statusKey;

export const formatCurrency = value => `PHP ${Math.round(value / 1000)}K`;

export const enrichReps = reps => {
  return [...reps]
    .sort((a, b) => b.performance - a.performance || b.grossSalesValue - a.grossSalesValue)
    .map((rep, index) => {
      const rank = index + 1;
      const conversionRate = Math.round((rep.convertedLeads / rep.leadsGathered) * 100);

      return {
        ...rep,
        ...getStatus(rep.performance),
        rank,
        movement: rep.previousRank - rank,
        conversionRate,
        grossSales: formatCurrency(rep.grossSalesValue)
      };
    });
};
