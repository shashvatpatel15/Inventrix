import React from 'react';
import { Database, Layers, Shield, Zap, Terminal } from 'lucide-react';

const AboutUsPage = () => {
  return (
    <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-white/70 dark:bg-slate-900/30 backdrop-blur-md shadow-sm dark:shadow-xl animate-fade-in max-w-3xl mx-auto transition-colors duration-200">
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-white/5 pb-4 mb-5">About Inventrix</h2>
      <div className="flex flex-col gap-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <div>
          <p className="text-base text-slate-700 dark:text-slate-200 mb-3 font-medium">
            Inventrix is a modern, high-performance **Inventory Management System** built with a React + Vite frontend and a structured Node.js Express backend using a MySQL database.
          </p>
          <p>
            This application supports full **CRUD** (Create, Read, Update, Delete) transactions with relational database constraints, ACID-compliant transactions for restocking (Purchase Orders) and orders processing (Sales Orders), and a professional glassmorphic dashboard layout.
          </p>
        </div>

        <div className="border-t border-slate-200 dark:border-white/5 pt-5">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4">
            <Layers size={16} className="text-indigo-600 dark:text-indigo-400" />
            <span>Architecture & Technology Stack</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/20 shadow-md">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-3">
                <Zap size={14} className="text-cyan-600 dark:text-cyan-400" />
                <span>Frontend (Client)</span>
              </h4>
              <ul className="list-disc pl-4 flex flex-col gap-1 text-[0.8rem] text-slate-600 dark:text-slate-400">
                <li>React 19 & Vite 8</li>
                <li>Tailwind CSS Styling</li>
                <li>Lucide Vector Icons</li>
                <li>Dynamic Search Filters</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/20 shadow-md">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-3">
                <Terminal size={14} className="text-indigo-600 dark:text-indigo-400" />
                <span>Backend (API Server)</span>
              </h4>
              <ul className="list-disc pl-4 flex flex-col gap-1 text-[0.8rem] text-slate-600 dark:text-slate-400">
                <li>Node.js & Express</li>
                <li>Prisma ORM Client</li>
                <li>Global Error Handling</li>
                <li>Dotenv Environment</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/20 shadow-md">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-3">
                <Database size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>Database (Storage)</span>
              </h4>
              <ul className="list-disc pl-4 flex flex-col gap-1 text-[0.8rem] text-slate-600 dark:text-slate-400">
                <li>MySQL 8 Database</li>
                <li>Relational Integrity (FKs)</li>
                <li>Row-level locking (Pessimistic)</li>
                <li>Prisma Schema Definition</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-white/5 pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2 text-slate-400 dark:text-slate-500">
          <div>
            <p className="text-xs">Inventrix Enterprise © 2026. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-semibold">
            <Shield size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>Enterprise System</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
