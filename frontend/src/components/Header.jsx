import React from 'react';
import { Search, Database, Clock, Sun, Moon } from 'lucide-react';

const Header = ({ pageTitle, searchVal, setSearchVal, searchPlaceholder, theme, toggleTheme }) => {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 border-b border-slate-200/60 dark:border-white/5 bg-white/70 dark:bg-slate-950/60 text-slate-800 dark:text-slate-100 backdrop-blur-md sticky top-0 z-10 transition-colors duration-200">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 capitalize">{pageTitle}</h1>
      </div>
      
      {setSearchVal !== undefined && (
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder={searchPlaceholder || "Search..."}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-slate-100/70 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
          />
        </div>
      )}
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400">
          <Clock size={13} className="text-slate-400 dark:text-slate-500" />
          <span>{today}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold">
          <Database size={13} className="text-emerald-600 dark:text-emerald-400" />
          <span>Online</span>
        </div>
        {toggleTheme && (
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-white/5 transition-all cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
