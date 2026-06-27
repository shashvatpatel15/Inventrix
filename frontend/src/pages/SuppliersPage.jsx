import React, { useState } from 'react';
import { Edit2, Trash2, Search, Truck } from 'lucide-react';

const SuppliersPage = ({ suppliers = [], onAdd, onUpdate, onDelete, addToast }) => {
  const [formData, setFormData] = useState({ supplier_id: '', name: '', phone_no: '' });
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Selection state for multi-delete
  const [selectedIds, setSelectedIds] = useState([]);

  const startEdit = (supplier) => {
    setEditId(supplier.supplier_id);
    setFormData({
      supplier_id: supplier.supplier_id,
      name: supplier.name,
      phone_no: supplier.phone_no || ''
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData({ supplier_id: '', name: '', phone_no: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.supplier_id || !formData.name) {
      addToast('Supplier ID and Name are required', 'error');
      return;
    }

    if (editId) {
      const success = await onUpdate('suppliers', editId, {
        name: formData.name,
        phone_no: formData.phone_no
      });
      if (success) cancelEdit();
    } else {
      const success = await onAdd('suppliers', formData);
      if (success) {
        setFormData({ supplier_id: '', name: '', phone_no: '' });
      }
    }
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete supplier "${id}"?`)) {
      onDelete('suppliers', id);
      setSelectedIds(prev => prev.filter(selected => selected !== id));
    }
  };

  // Selection helpers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const ids = filteredSuppliers.map(s => s.supplier_id);
      setSelectedIds(ids);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleBatchDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the ${selectedIds.length} selected suppliers?`)) {
      let successCount = 0;
      let failCount = 0;
      for (const id of selectedIds) {
        const success = await onDelete('suppliers', id);
        if (success) successCount++;
        else failCount++;
      }
      setSelectedIds([]);
      if (failCount > 0) {
        addToast(`Deleted ${successCount} suppliers. ${failCount} suppliers could not be deleted because they are associated with active inventory products or orders.`, 'error');
      } else {
        addToast(`Successfully deleted ${successCount} suppliers.`, 'success');
      }
    }
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.supplier_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start animate-fade-in transition-colors duration-200">
      {/* Form Section */}
      <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-white/70 dark:bg-slate-900/30 backdrop-blur-md shadow-sm dark:shadow-xl">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-white/5 pb-4 mb-5">
          {editId ? 'Edit Supplier' : 'Add Supplier'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-505 dark:text-slate-400">Supplier ID</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all disabled:opacity-50"
              placeholder="e.g. S901"
              value={formData.supplier_id}
              onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
              disabled={editId !== null}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-550 dark:text-slate-400">Supplier Name</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              placeholder="e.g. Bharat Electro"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-550 dark:text-slate-400">Phone Number</label>
            <input
              type="tel"
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 dark:focus:border-indigo-500/55 focus:ring-1 focus:ring-indigo-500/55 transition-all"
              placeholder="e.g. +91 9876543210"
              value={formData.phone_no}
              onChange={(e) => setFormData({ ...formData, phone_no: e.target.value })}
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all cursor-pointer">
              {editId ? 'Save Changes' : 'Add Supplier'}
            </button>
            {editId && (
              <button type="button" onClick={cancelEdit} className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all cursor-pointer">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-white/70 dark:bg-slate-900/30 backdrop-blur-md shadow-sm dark:shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-white/5 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">View Suppliers ({filteredSuppliers.length})</span>
            {selectedIds.length > 0 && (
              <button
                onClick={handleBatchDelete}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 hover:bg-rose-500/20 transition-all cursor-pointer animate-pulse"
              >
                <span>Delete Selected ({selectedIds.length})</span>
              </button>
            )}
          </div>
          <div className="relative w-full sm:max-w-[240px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search by ID or Name..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-55 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div>
          {filteredSuppliers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-400 dark:text-slate-505 mb-4">
                <Truck size={20} />
              </div>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Suppliers Found</h3>
              <p className="text-xs text-slate-400 dark:text-slate-505 mt-1 max-w-[260px]">No suppliers match your search query or database is empty.</p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[calc(100vh-270px)] overflow-y-auto pr-1">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="sticky top-0 z-10 bg-slate-100/90 dark:bg-slate-950/95 backdrop-blur-md">
                    <th className="pb-3 pt-1.5 border-b border-slate-200 dark:border-white/5 text-center w-10">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer w-3.5 h-3.5"
                        checked={filteredSuppliers.length > 0 && selectedIds.length === filteredSuppliers.length}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="pb-3 pt-1.5 font-semibold text-slate-505 dark:text-slate-400 border-b border-slate-200 dark:border-white/5 uppercase tracking-wider">ID</th>
                    <th className="pb-3 pt-1.5 font-semibold text-slate-505 dark:text-slate-400 border-b border-slate-200 dark:border-white/5 uppercase tracking-wider">Supplier Name</th>
                    <th className="pb-3 pt-1.5 font-semibold text-slate-505 dark:text-slate-400 border-b border-slate-200 dark:border-white/5 uppercase tracking-wider">Phone</th>
                    <th className="pb-3 pt-1.5 font-semibold text-slate-505 dark:text-slate-400 border-b border-slate-200 dark:border-white/5 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSuppliers.map((s) => (
                    <tr key={s.supplier_id} className="hover:bg-slate-100/50 dark:hover:bg-white/[0.01] transition-all">
                      <td className="py-3.5 border-b border-slate-200 dark:border-white/5 text-center">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer w-3.5 h-3.5"
                          checked={selectedIds.includes(s.supplier_id)}
                          onChange={() => handleSelectRow(s.supplier_id)}
                        />
                      </td>
                      <td className="py-3.5 border-b border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 font-bold">{s.supplier_id}</td>
                      <td className="py-3.5 border-b border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300">{s.name}</td>
                      <td className="py-3.5 border-b border-slate-200 dark:border-white/5 text-slate-550 dark:text-slate-400 font-mono">
                        {s.phone_no ? s.phone_no : <span className="text-[0.7rem] text-slate-400 dark:text-slate-600 font-sans italic">No Phone</span>}
                      </td>
                      <td className="py-3.5 border-b border-slate-200 dark:border-white/5">
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(s)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[0.7rem] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-500/20 dark:hover:bg-indigo-500/20 transition-all cursor-pointer"
                          >
                            <Edit2 size={11} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(s.supplier_id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[0.7rem] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 hover:bg-rose-500/20 dark:hover:bg-rose-500/20 transition-all cursor-pointer"
                          >
                            <Trash2 size={11} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuppliersPage;
