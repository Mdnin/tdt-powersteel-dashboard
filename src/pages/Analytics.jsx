import { motion } from 'framer-motion';
import {
  EnterpriseChart,
  EnterpriseFilters,
  EnterpriseTable,
  HeatmapCard
} from '../components/analytics/EnterpriseWidgets';
import {
  dailySalesTrend,
  kpiProgressData,
  leadSourceData,
  monthlyGrossSalesTrend,
  productBreakdownRows,
  productData,
  repPerformanceRows,
  salesByRep,
  salesHeatmap
} from '../data/enterpriseAnalytics';
import '../styles/dashboard.css';
import '../styles/enterprise.css';

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } }
};

const remainingTargetRows = kpiProgressData.map(item => [
  item.label,
  typeof item.target === 'number' ? item.target.toLocaleString() : item.target,
  typeof item.actual === 'number' ? item.actual.toLocaleString() : item.actual,
  `${item.completion}%`,
  (item.target - item.actual).toLocaleString()
]);

export default function Analytics() {
  return (
    <>
      <motion.div className="dashboard-header" variants={itemVariants} initial="hidden" animate="visible">
        <h1 className="dashboard-title">Analytics</h1>
        <p className="dashboard-subtitle">
          Sales, leads, products, team rankings, and performance progress in one workspace
        </p>
      </motion.div>

      <EnterpriseFilters />

      <section className="enterprise-grid enterprise-grid-two">
        <EnterpriseChart title="Sales Overview" subtitle="Daily revenue movement" type="area" data={dailySalesTrend} keys={['sales']} />
        <EnterpriseChart title="Monthly Sales" subtitle="Sales and target comparison" type="line" data={monthlyGrossSalesTrend} keys={['sales', 'target']} />
      </section>

      <section className="enterprise-grid enterprise-grid-two">
        <EnterpriseChart title="Lead Sources" subtitle="Lead volume by source" data={leadSourceData} keys={['leads']} />
        <EnterpriseChart title="Lead Conversion" subtitle="Conversion and closed deals by source" data={leadSourceData} keys={['conversion', 'deals']} />
      </section>

      <section className="enterprise-grid enterprise-grid-two">
        <EnterpriseChart title="Products" subtitle="Top product revenue" data={productData} keys={['revenue']} />
        <EnterpriseChart title="Product Mix" subtitle="Contribution share by product" type="pie" data={productData.map(product => ({ name: product.label, value: product.contribution }))} />
      </section>

      <section className="enterprise-grid enterprise-grid-two">
        <EnterpriseChart title="Team Rankings" subtitle="Sales by representative" data={salesByRep} keys={['sales']} />
        <EnterpriseChart title="Rep Performance" subtitle="Leads and closed deals by rep" data={salesByRep} keys={['leads', 'deals']} />
      </section>

      <section className="enterprise-grid enterprise-grid-two">
        <EnterpriseChart title="Performance" subtitle="Actual progress against targets" data={kpiProgressData} keys={['actual', 'target']} />
        <EnterpriseChart title="KPI Progress" subtitle="Completion by category" data={kpiProgressData} keys={['completion']} />
        <HeatmapCard data={salesHeatmap} />
      </section>

      <section className="enterprise-grid enterprise-grid-two">
        <EnterpriseTable
          title="Team Activity"
          columns={['Sales Rep', 'Leads', 'Closed Deals', 'Gross Sales', 'Conversion Rate', 'GK %']}
          rows={repPerformanceRows}
        />
        <EnterpriseTable
          title="Product Summary"
          columns={['Product', 'Quantity', 'Revenue', 'GK']}
          rows={productBreakdownRows}
        />
        <EnterpriseTable
          title="Performance Targets"
          columns={['KPI', 'Target', 'Actual', 'Completion %', 'Remaining']}
          rows={remainingTargetRows}
        />
      </section>
    </>
  );
}
