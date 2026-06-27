import React, { useState } from 'react';
import { Edit2, Trash2, Search, MapPin, Warehouse } from 'lucide-react';

const WarehousesPage = ({ warehouses = [], onAdd, onUpdate, onDelete, addToast }) => {
  const [formData, setFormData] = useState({ warehouse_id: '', name: '', location: '' });
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Selection state for multi-delete
  const [selectedIds, setSelectedIds] = useState([]);

  const startEdit = (warehouse) => {
    setEditId(warehouse.warehouse_id);
    setFormData({
      warehouse_id: warehouse.warehouse_id,
      name: warehouse.name,
      location: warehouse.location || ''
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData({ warehouse_id: '', name: '', location: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.warehouse_id === '' || !formData.name) {
      addToast('Warehouse ID and Name are required', 'error');
      return;
    }

    if (editId) {
      const success = await onUpdate('warehouses', editId, {
        name: formData.name,
        location: formData.location
      });
      if (success) cancelEdit();
    } else {
      const success = await onAdd('warehouses', {
        warehouse_id: Number(formData.warehouse_id),
        name: formData.name,
        location: formData.location
      });
      if (success) {
        setFormData({ warehouse_id: '', name: '', location: '' });
      }
    }
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete warehouse ID "${id}"?`)) {
      onDelete('warehouses', id);
      setSelectedIds(prev => prev.filter(selected => selected !== id));
    }
  };

  // Selection helpers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const ids = filteredWarehouses.map(w => w.warehouse_id);
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
    if (window.confirm(`Are you sure you want to delete the ${selectedIds.length} selected warehouses?`)) {
      let successCount = 0;
      let failCount = 0;
      for (const id of selectedIds) {
        const success = await onDelete('warehouses', id);
        if (success) successCount++;
        else failCount++;
      }
      setSelectedIds([]);
      if (failCount > 0) {
        addToast(`Deleted ${successCount} warehouses. ${failCount} warehouses could not be deleted because they currently store active inventory items.`, 'error');
      } else {
        addToast(`Successfully deleted ${successCount} warehouses.`, 'success');
      }
    }
  };

  const filteredWarehouses = warehouses.filter(w => 
    w.warehouse_id.toString().includes(searchQuery) ||
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (w.location && w.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start animate-fade-in transition-colors duration-200">
      {/* Form Section */}
      <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-white/70 dark:bg-slate-900/30 backdrop-blur-md shadow-sm dark:shadow-xl">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-white/5 pb-4 mb-5">
          {editId ? 'Edit Warehouse' : 'Add Warehouse'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-505 dark:text-slate-400">Warehouse ID</label>
            <input
              type="number"
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/55 transition-all disabled:opacity-50"
              placeholder="e.g. 1"
              value={formData.warehouse_id}
              onChange={(e) => setFormData({ ...formData, warehouse_id: e.target.value })}
              disabled={editId !== null}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-550 dark:text-slate-400">Warehouse Name</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              placeholder="e.g. Central India Logistics"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-550 dark:text-slate-400">Location</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              placeholder="e.g. Bhopal, MP"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all cursor-pointer">
              {editId ? 'Save Changes' : 'Add Warehouse'}
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
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">View Warehouses ({filteredWarehouses.length})</span>
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
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-505" />
            <input
              type="text"
              placeholder="Search by ID, Name or Location..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-505 focus:outline-none focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div>
          {filteredWarehouses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-400 dark:text-slate-550 mb-4">
                <Warehouse size={20} />
              </div>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Warehouses Found</h3>
              <p className="text-xs text-slate-400 dark:text-slate-550 mt-1 max-w-[260px]">No warehouses match your search query or database is empty.</p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[calc(100vh-270px)] overflow-y-auto pr-1">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="sticky top-0 z-10 bg-slate-100/90 dark:bg-slate-955/95 backdrop-blur-md">
                    <th className="pb-3 pt-1.5 border-b border-slate-200 dark:border-white/5 text-center w-10">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer w-3.5 h-3.5"
                        checked={filteredWarehouses.length > 0 && selectedIds.length === filteredWarehouses.length}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="pb-3 pt-1.5 font-semibold text-slate-550 dark:text-slate-400 border-b border-slate-200 dark:border-white/5 uppercase tracking-wider">ID</th>
                    <th className="pb-3 pt-1.5 font-semibold text-slate-550 dark:text-slate-400 border-b border-slate-200 dark:border-white/5 uppercase tracking-wider">Warehouse Name</th>
                    <th className="pb-3 pt-1.5 font-semibold text-slate-550 dark:text-slate-400 border-b border-slate-200 dark:border-white/5 uppercase tracking-wider">Location</th>
                    <th className="pb-3 pt-1.5 font-semibold text-slate-550 dark:text-slate-400 border-b border-slate-200 dark:border-white/5 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWarehouses.map((w) => (
                    <tr key={w.warehouse_id} className="hover:bg-slate-100/50 dark:hover:bg-white/[0.01] transition-all">
                      <td className="py-3.5 border-b border-slate-200 dark:border-white/5 text-center">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer w-3.5 h-3.5"
                          checked={selectedIds.includes(w.warehouse_id)}
                          onChange={() => handleSelectRow(w.warehouse_id)}
                        />
                      </td>
                      <td className="py-3.5 border-b border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 font-bold">{w.warehouse_id}</td>
                      <td className="py-3.5 border-b border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300">{w.name}</td>
                      <td className="py-3.5 border-b border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                          <span>{w.location ? w.location : <span className="text-[0.7rem] text-slate-400 dark:text-slate-600 italic">No Location</span>}</span>
                        </div>
                      </td>
                      <td className="py-3.5 border-b border-slate-200 dark:border-white/5">
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(w)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[0.7rem] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-500/20 dark:hover:bg-indigo-500/20 transition-all cursor-pointer"
                          >
                            <Edit2 size={11} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(w.warehouse_id)}
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

export default WarehousesPage;
