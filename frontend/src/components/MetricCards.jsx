import React from 'react';
import { Package, Percent, AlertTriangle, Warehouse } from 'lucide-react';

const MetricCards = ({ products = [], warehouses = [], suppliers = [] }) => {
  const totalProducts = products.length;
  
  const totalValue = products.reduce((acc, curr) => {
    return acc + (Number(curr.qty) * Number(curr.price));
  }, 0);

  const lowStockCount = products.filter(p => Number(p.qty) <= 10).length;
  const totalWarehouses = warehouses.length;
  const totalSuppliers = suppliers.length;

  const metrics = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'indigo',
      desc: 'Catalog items'
    },
    {
      title: 'Inventory Value',
      value: `₹${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: Percent,
      color: 'emerald',
      desc: 'Total asset value'
    },
    {
      title: 'Low Stock Alerts',
      value: lowStockCount,
      icon: AlertTriangle,
      color: lowStockCount > 0 ? 'rose' : 'emerald',
      desc: 'Quantity ≤ 10'
    },
    {
      title: 'Network Assets',
      value: `${totalWarehouses} WH / ${totalSuppliers} Spl`,
      icon: Warehouse,
      color: 'amber',
      desc: 'Active locations & suppliers'
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'indigo':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20';
      case 'emerald':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
      case 'rose':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20';
      case 'amber':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div key={idx} className="p-5 rounded-2xl border border-slate-200/60 dark:border-white/5 bg-white/70 dark:bg-slate-900/30 shadow-sm dark:shadow-xl flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/10 hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{m.title}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getColorClasses(m.color)}`}>
                <Icon size={16} />
              </div>
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">{m.value}</div>
              <span className="text-[0.675rem] font-semibold text-slate-400 dark:text-slate-500 mt-1 block uppercase tracking-wider">{m.desc}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricCards;
