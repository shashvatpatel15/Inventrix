import React, { useState } from 'react';
import { Edit2, Trash2, Search, Package } from 'lucide-react';

const ProductsPage = ({ products = [], warehouses = [], onAdd, onUpdate, onDelete, addToast }) => {
  const [formData, setFormData] = useState({ product_id: '', name: '', qty: '', price: '', warehouse_id: '' });
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selection state for multi-delete
  const [selectedIds, setSelectedIds] = useState([]);

  // Autocomplete warehouse search state
  const [warehouseSearch, setWarehouseSearch] = useState('');
  const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);

  const startEdit = (product) => {
    setEditId(product.product_id);
    setFormData({
      product_id: product.product_id,
      name: product.name,
      qty: product.qty,
      price: product.price,
      warehouse_id: product.warehouse_id || ''
    });
    const warehouse = warehouses.find(w => w.warehouse_id === product.warehouse_id);
    setWarehouseSearch(warehouse ? `${warehouse.warehouse_id} - ${warehouse.name} (${warehouse.location})` : `W. ID: ${product.warehouse_id}`);
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData({ product_id: '', name: '', qty: '', price: '', warehouse_id: '' });
    setWarehouseSearch('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.product_id || !formData.name || formData.qty === '' || formData.price === '' || !formData.warehouse_id) {
      addToast('Please fill all fields, including a valid Warehouse selection', 'error');
      return;
    }

    if (editId) {
      const success = await onUpdate('products', editId, {
        name: formData.name,
        qty: Number(formData.qty),
        price: Number(formData.price),
        warehouse_id: Number(formData.warehouse_id)
      });
      if (success) cancelEdit();
    } else {
      const success = await onAdd('products', {
        product_id: formData.product_id,
        name: formData.name,
        qty: Number(formData.qty),
        price: Number(formData.price),
        warehouse_id: Number(formData.warehouse_id)
      });
      if (success) {
        setFormData({ product_id: '', name: '', qty: '', price: '', warehouse_id: '' });
        setWarehouseSearch('');
      }
    }
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete product "${id}"?`)) {
      onDelete('products', id);
      setSelectedIds(prev => prev.filter(selected => selected !== id));
    }
  };

  // Selection actions
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const ids = filteredProducts.map(p => p.product_id);
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
    if (window.confirm(`Are you sure you want to delete the ${selectedIds.length} selected products?`)) {
      let successCount = 0;
      let failCount = 0;
      for (const id of selectedIds) {
        const success = await onDelete('products', id);
        if (success) successCount++;
        else failCount++;
      }
      setSelectedIds([]);
      if (failCount > 0) {
        addToast(`Deleted ${successCount} products. ${failCount} products could not be deleted because they are referenced in purchase/sales orders.`, 'error');
      } else {
        addToast(`Successfully deleted ${successCount} products.`, 'success');
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.product_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredWarehouses = warehouseSearch.trim() === ''
    ? warehouses
    : warehouses.filter(w => 
        w.warehouse_id.toString().includes(warehouseSearch) ||
        w.name.toLowerCase().includes(warehouseSearch.toLowerCase()) ||
        (w.location && w.location.toLowerCase().includes(warehouseSearch.toLowerCase()))
      );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start animate-fade-in transition-colors duration-200">
      {/* Form Section */}
      <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-white/70 dark:bg-slate-900/30 backdrop-blur-md shadow-sm dark:shadow-xl">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-white/5 pb-4 mb-5">
          {editId ? 'Edit Product' : 'Add Product'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Product ID</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all disabled:opacity-50"
              placeholder="e.g. P101"
              value={formData.product_id}
              onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
              disabled={editId !== null}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Product Name</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              placeholder="e.g. AC Servo Motor"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Quantity</label>
            <input
              type="number"
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              placeholder="e.g. 50"
              value={formData.qty}
              onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
              min="0"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Price (₹)</label>
            <input
              type="number"
              step="0.01"
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              placeholder="e.g. 4500.00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              min="0"
              required
            />
            {formData.qty && formData.price && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                Valuation: ₹{(Number(formData.qty) * Number(formData.price)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5 relative">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Warehouse</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              placeholder="Search warehouse..."
              value={warehouseSearch}
              onChange={(e) => {
                setWarehouseSearch(e.target.value);
                setFormData({ ...formData, warehouse_id: '' });
                setShowWarehouseDropdown(true);
              }}
              onFocus={() => setShowWarehouseDropdown(true)}
              onBlur={() => {
                setTimeout(() => setShowWarehouseDropdown(false), 250);
              }}
              required
            />
            {showWarehouseDropdown && (
              <div className="absolute top-[102%] left-0 right-0 max-h-48 overflow-y-auto z-20 mt-1 bg-white dark:bg-slate-955 border border-slate-200 dark:border-white/10 rounded-xl shadow-lg dark:shadow-2xl backdrop-blur-lg">
                {filteredWarehouses.length === 0 ? (
                  <div className="p-3 text-xs text-slate-400 dark:text-slate-505 italic">No warehouses found</div>
                ) : (
                  filteredWarehouses.slice(0, 10).map((w) => (
                    <div
                      key={w.warehouse_id}
                      onClick={() => {
                        setFormData({ ...formData, warehouse_id: w.warehouse_id.toString() });
                        setWarehouseSearch(`${w.warehouse_id} - ${w.name} (${w.location})`);
                        setShowWarehouseDropdown(false);
                      }}
                      className="px-4 py-3 cursor-pointer text-xs border-b border-slate-100 dark:border-white/5 hover:bg-slate-55 dark:hover:bg-white/5 transition-all text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 text-left"
                    >
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 mr-2">ID: {w.warehouse_id}</span>
                      <span>{w.name}</span>
                      <span className="block text-[0.675rem] text-slate-400 dark:text-slate-505 mt-0.5">{w.location}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-2">
            <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all cursor-pointer">
              {editId ? 'Save Changes' : 'Add Product'}
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
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">View Products ({filteredProducts.length})</span>
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
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div>
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-400 dark:text-slate-505 mb-4">
                <Package size={20} />
              </div>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Products Found</h3>
              <p className="text-xs text-slate-400 dark:text-slate-505 mt-1 max-w-[260px]">No products match your search query or catalog is empty.</p>
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
                        checked={filteredProducts.length > 0 && selectedIds.length === filteredProducts.length}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="pb-3 pt-1.5 font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/5 uppercase tracking-wider">ID</th>
                    <th className="pb-3 pt-1.5 font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/5 uppercase tracking-wider">Name</th>
                    <th className="pb-3 pt-1.5 font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/5 uppercase tracking-wider">Qty</th>
                    <th className="pb-3 pt-1.5 font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/5 uppercase tracking-wider">Price</th>
                    <th className="pb-3 pt-1.5 font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/5 uppercase tracking-wider">Warehouse</th>
                    <th className="pb-3 pt-1.5 font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/5 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => {
                    const warehouse = warehouses.find(w => w.warehouse_id === p.warehouse_id);
                    const isLowStock = Number(p.qty) <= 10;
                    return (
                      <tr key={p.product_id} className="hover:bg-slate-100/50 dark:hover:bg-white/[0.01] transition-all">
                        <td className="py-3.5 border-b border-slate-200 dark:border-white/5 text-center">
                          <input 
                            type="checkbox" 
                            className="rounded border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer w-3.5 h-3.5"
                            checked={selectedIds.includes(p.product_id)}
                            onChange={() => handleSelectRow(p.product_id)}
                          />
                        </td>
                        <td className="py-3.5 border-b border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 font-bold">{p.product_id}</td>
                        <td className="py-3.5 border-b border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 font-medium">{p.name}</td>
                        <td className="py-3.5 border-b border-slate-200 dark:border-white/5">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[0.675rem] border ${
                            isLowStock 
                              ? 'bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 animate-pulse' 
                              : 'bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {p.qty}
                          </span>
                        </td>
                        <td className="py-3.5 border-b border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 font-mono">₹{Number(p.price).toFixed(2)}</td>
                        <td className="py-3.5 border-b border-slate-200 dark:border-white/5 text-slate-550 dark:text-slate-400">
                          {warehouse ? `${warehouse.name} (${p.warehouse_id})` : `W. ID: ${p.warehouse_id}`}
                        </td>
                        <td className="py-3.5 border-b border-slate-200 dark:border-white/5">
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(p)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[0.7rem] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-500/20 dark:hover:bg-indigo-500/20 transition-all cursor-pointer"
                            >
                              <Edit2 size={11} />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(p.product_id)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[0.7rem] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 hover:bg-rose-500/20 dark:hover:bg-rose-500/20 transition-all cursor-pointer"
                            >
                              <Trash2 size={11} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
