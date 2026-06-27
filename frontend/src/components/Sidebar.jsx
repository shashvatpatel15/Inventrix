import React from 'react';
import { Package, Truck, Warehouse, FileText, TrendingUp, Info } from 'lucide-react';

const Sidebar = ({ currentPage, setCurrentPage, username, onLogout }) => {
  const menuItems = [
    { id: 'products', name: 'Products', icon: Package },
    { id: 'suppliers', name: 'Suppliers', icon: Truck },
    { id: 'warehouses', name: 'Warehouses', icon: Warehouse },
    { id: 'purchase-orders', name: 'Purchase Orders', icon: FileText },
    { id: 'sales-orders', name: 'Sales Orders', icon: TrendingUp },
    { id: 'about-us', name: 'About Us', icon: Info },
  ];

  return (
    <aside className="w-[260px] bg-white dark:bg-slate-950/80 border-r border-slate-200/80 dark:border-white/5 p-6 flex flex-col h-screen sticky top-0 backdrop-blur-md shrink-0 justify-between transition-colors duration-200">
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Warehouse size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-wide text-slate-800 dark:text-slate-100">Inventrix</h2>
            <span className="text-[0.65rem] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Smart Inventory</span>
          </div>
        </div>
        
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer group text-left ${
                  isActive 
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-l-2 border-indigo-500 pl-3.5' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Icon size={16} className={`shrink-0 transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'}`} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>
      
      <div className="mt-auto flex flex-col gap-3.5 pt-5 border-t border-slate-200/80 dark:border-white/5">
        {username && (
          <div className="flex flex-col px-1">
            <span className="text-[0.65rem] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">User Session</span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{username}</span>
          </div>
        )}
        <div className="flex justify-between items-center gap-2 pt-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">DB Online</span>
          </div>
          {onLogout && (
            <button 
              onClick={onLogout} 
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
