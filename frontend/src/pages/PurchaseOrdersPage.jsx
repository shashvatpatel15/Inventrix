import React, { useState } from 'react';
import { Edit2, Trash2, Search, Calendar, FileText } from 'lucide-react';

const PurchaseOrdersPage = ({ purchaseOrders = [], products = [], suppliers = [], onAdd, onUpdate, onDelete, addToast }) => {
  const [formData, setFormData] = useState({ product_id: '', supplier_id: '', qty_req: '', price: '' });
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Selection state for multi-delete
  const [selectedIds, setSelectedIds] = useState([]);

  // Autocomplete search states
  const [productSearch, setProductSearch] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  const [supplierSearch, setSupplierSearch] = useState('');
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);

  const startEdit = (po) => {
    setEditId(po.po_id);
    setFormData({
      product_id: po.product_id,
      supplier_id: po.supplier_id,
      qty_req: po.qty_req,
      price: po.price
    });
    const prod = products.find(p => p.product_id === po.product_id);
    setProductSearch(prod ? `${prod.product_id} - ${prod.name} (In Stock: ${prod.qty})` : `Prod ID: ${po.product_id}`);
    const supp = suppliers.find(s => s.supplier_id === po.supplier_id);
    setSupplierSearch(supp ? `${supp.supplier_id} - ${supp.name}` : `Supp ID: ${po.supplier_id}`);
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData({ product_id: '', supplier_id: '', qty_req: '', price: '' });
    setProductSearch('');
    setSupplierSearch('');
  };

  const handleProductSelection = (product) => {
    setFormData({
      ...formData,
      product_id: product.product_id,
      price: product.price
    });
    setProductSearch(`${product.product_id} - ${product.name} (In Stock: ${product.qty})`);
    setShowProductDropdown(false);
  };

  const handleSupplierSelection = (supplier) => {
    setFormData({
      ...formData,
      supplier_id: supplier.supplier_id
    });
    setSupplierSearch(`${supplier.supplier_id} - ${supplier.name}`);
    setShowSupplierDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.product_id || !formData.supplier_id || formData.qty_req === '' || formData.price === '') {
      addToast('All fields are required, including valid Product and Supplier selections', 'error');
      return;
    }

    if (editId) {
      const success = await onUpdate('purchase-orders', editId, {
        product_id: formData.product_id,
        supplier_id: formData.supplier_id,
        qty_req: Number(formData.qty_req),
        price: Number(formData.price)
      });
      if (success) cancelEdit();
    } else {
      const success = await onAdd('purchase-orders', {
        product_id: formData.product_id,
        supplier_id: formData.supplier_id,
        qty_req: Number(formData.qty_req),
        price: Number(formData.price)
      });
      if (success) {
        setFormData({ product_id: '', supplier_id: '', qty_req: '', price: '' });
        setProductSearch('');
        setSupplierSearch('');
      }
    }
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete Purchase Order ID "${id}"?`)) {
      onDelete('purchase-orders', id);
      setSelectedIds(prev => prev.filter(selected => selected !== id));
    }
  };

  // Selection helpers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const ids = filteredOrders.map(po => po.po_id);
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
    if (window.confirm(`Are you sure you want to delete the ${selectedIds.length} selected purchase orders?`)) {
      let successCount = 0;
      let failCount = 0;
      for (const id of selectedIds) {
        const success = await onDelete('purchase-orders', id);
        if (success) successCount++;
        else failCount++;
      }
      setSelectedIds([]);
      if (failCount > 0) {
        addToast(`Deleted ${successCount} purchase orders. ${failCount} orders could not be deleted.`, 'error');
      } else {
        addToast(`Successfully deleted ${successCount} purchase orders.`, 'success');
      }
    }
  };

  const filteredOrders = purchaseOrders.filter(po => 
    po.po_id.toString().includes(searchQuery) ||
    po.product_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    po.supplier_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = productSearch.trim() === ''
    ? products
    : products.filter(p => 
        p.product_id.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.name.toLowerCase().includes(productSearch.toLowerCase())
      );

  const filteredSuppliers = supplierSearch.trim() === ''
    ? suppliers
    : suppliers.filter(s => 
        s.supplier_id.toLowerCase().includes(supplierSearch.toLowerCase()) ||
        s.name.toLowerCase().includes(supplierSearch.toLowerCase())
      );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start animate-fade-in transition-colors duration-200">
      {/* Form Section */}
      <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-white/70 dark:bg-slate-900/30 backdrop-blur-md shadow-sm dark:shadow-xl">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-white/5 pb-4 mb-5">
          {editId ? 'Edit Purchase Order' : 'Create Purchase Order'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 relative">
            <label className="text-xs font-semibold text-slate-505 dark:text-slate-400">Product</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              placeholder="Search product..."
              value={productSearch}
              onChange={(e) => {
                setProductSearch(e.target.value);
                setFormData({ ...formData, product_id: '', price: '' });
                setShowProductDropdown(true);
              }}
              onFocus={() => setShowProductDropdown(true)}
              onBlur={() => {
                setTimeout(() => setShowProductDropdown(false), 250);
              }}
              required
            />
            {showProductDropdown && (
              <div className="absolute top-[102%] left-0 right-0 max-h-48 overflow-y-auto z-20 mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl shadow-lg dark:shadow-2xl backdrop-blur-lg">
                {filteredProducts.length === 0 ? (
                  <div className="p-3 text-xs text-slate-400 dark:text-slate-505 italic">No products found</div>
                ) : (
                  filteredProducts.slice(0, 10).map((p) => (
                    <div
                      key={p.product_id}
                      onClick={() => handleProductSelection(p)}
                      className="px-4 py-3 cursor-pointer text-xs border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 text-left"
                    >
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 mr-2">ID: {p.product_id}</span>
                      <span>{p.name}</span>
                      <span className="block text-[0.675rem] text-slate-400 dark:text-slate-505 mt-0.5">Stock: {p.qty} | Price: ₹{p.price}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5 relative">
            <label className="text-xs font-semibold text-slate-505 dark:text-slate-400">Supplier</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              placeholder="Search supplier..."
              value={supplierSearch}
              onChange={(e) => {
                setSupplierSearch(e.target.value);
                setFormData({ ...formData, supplier_id: '' });
                setShowSupplierDropdown(true);
              }}
              onFocus={() => setShowSupplierDropdown(true)}
              onBlur={() => {
                setTimeout(() => setShowSupplierDropdown(false), 250);
              }}
              required
            />
            {showSupplierDropdown && (
              <div className="absolute top-[102%] left-0 right-0 max-h-48 overflow-y-auto z-20 mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl shadow-lg dark:shadow-2xl backdrop-blur-lg">
                {filteredSuppliers.length === 0 ? (
                  <div className="p-3 text-xs text-slate-400 dark:text-slate-505 italic">No suppliers found</div>
                ) : (
                  filteredSuppliers.slice(0, 10).map((s) => (
                    <div
                      key={s.supplier_id}
                      onClick={() => handleSupplierSelection(s)}
                      className="px-4 py-3 cursor-pointer text-xs border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 text-left"
                    >
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 mr-2">ID: {s.supplier_id}</span>
                      <span>{s.name}</span>
                      {s.phone_no && <span className="block text-[0.675rem] text-slate-400 dark:text-slate-505 mt-0.5">Phone: {s.phone_no}</span>}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-505 dark:text-slate-400">Quantity Requested</label>
            <input
              type="number"
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              placeholder="e.g. 100"
              value={formData.qty_req}
              onChange={(e) => setFormData({ ...formData, qty_req: e.target.value })}
              min="1"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-550 dark:text-slate-400">Purchase Price (₹)</label>
            <input
              type="number"
              step="0.01"
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              placeholder="e.g. 1200.00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              min="0"
              required
            />
            {formData.qty_req && formData.price && (
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
                Estimated Total: ₹{(Number(formData.qty_req) * Number(formData.price)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>

          <div className="flex gap-3 mt-2">
            <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all cursor-pointer">
              {editId ? 'Save Changes' : 'Create PO'}
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
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">View Purchase Orders ({filteredOrders.length})</span>
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
              placeholder="Search by PO ID, Product, Supplier..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-505 focus:outline-none focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div>
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-400 dark:text-slate-550 mb-4">
                <FileText size={20} />
              </div>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Purchase Orders</h3>
              <p className="text-xs text-slate-400 dark:text-slate-550 mt-1 max-w-[260px]">No purchase orders match your search query or database is empty.</p>
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
                        checked={filteredOrders.length > 0 && selectedIds.length === filteredOrders.length}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="pb-3 pt-1.5 font-semibold text-slate-550 dark:text-slate-400 border-b border-slate-200 dark:border-white/5 uppercase tracking-wider">PO ID</th>
                    <th className="pb-3 pt-1.5 font-semibold text-slate-550 dark:text-slate-400 border-b border-slate-200 dark:border-white/5 uppercase tracking-wider">Product</th>
                    <th className="pb-3 pt-1.5 font-semibold text-slate-550 dark:text-slate-400 border-b border-slate-200 dark:border-white/5 uppercase tracking-wider">Supplier</th>
                    <th className="pb-3 pt-1.5 font-semibold text-slate-550 dark:text-slate-400 border-b border-slate-200 dark:border-white/5 uppercase tracking-wider">Qty</th>
                    <th className="pb-3 pt-1.5 font-semibold text-slate-550 dark:text-slate-400 border-b border-slate-200 dark:border-white/5 uppercase tracking-wider">Price</th>
                    <th className="pb-3 pt-1.5 font-semibold text-slate-550 dark:text-slate-400 border-b border-slate-200 dark:border-white/5 uppercase tracking-wider">Total</th>
                    <th className="pb-3 pt-1.5 font-semibold text-slate-550 dark:text-slate-400 border-b border-slate-200 dark:border-white/5 uppercase tracking-wider">Order Date</th>
                    <th className="pb-3 pt-1.5 font-semibold text-slate-550 dark:text-slate-400 border-b border-slate-200 dark:border-white/5 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((po) => {
                    const product = products.find(p => p.product_id === po.product_id);
                    const supplier = suppliers.find(s => s.supplier_id === po.supplier_id);
                    return (
                      <tr key={po.po_id} className="hover:bg-slate-100/50 dark:hover:bg-white/[0.01] transition-all">
                        <td className="py-3.5 border-b border-slate-200 dark:border-white/5 text-center">
                          <input 
                            type="checkbox" 
                            className="rounded border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer w-3.5 h-3.5"
                            checked={selectedIds.includes(po.po_id)}
                            onChange={() => handleSelectRow(po.po_id)}
                          />
                        </td>
                        <td className="py-3.5 border-b border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 font-bold">#{po.po_id}</td>
                        <td className="py-3.5 border-b border-slate-200 dark:border-white/5">
                          <div className="flex flex-col">
                            <span className="text-slate-800 dark:text-slate-200 font-medium">{product ? product.name : po.product_id}</span>
                            <span className="text-[0.7rem] text-slate-400 dark:text-slate-505 mt-0.5">ID: {po.product_id}</span>
                          </div>
                        </td>
                        <td className="py-3.5 border-b border-slate-200 dark:border-white/5">
                          <div className="flex flex-col">
                            <span className="text-slate-700 dark:text-slate-300">{supplier ? supplier.name : po.supplier_id}</span>
                            <span className="text-[0.7rem] text-slate-400 dark:text-slate-550 mt-0.5">ID: {po.supplier_id}</span>
                          </div>
                        </td>
                        <td className="py-3.5 border-b border-slate-200 dark:border-white/5">
                          <span className="inline-block px-2.5 py-0.5 rounded-full font-semibold text-[0.675rem] bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                            {po.qty_req} units
                          </span>
                        </td>
                        <td className="py-3.5 border-b border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 font-mono">₹{Number(po.price).toFixed(2)}</td>
                        <td className="py-3.5 border-b border-slate-200 dark:border-white/5 text-indigo-600 dark:text-indigo-400 font-bold font-mono">
                          ₹{(Number(po.qty_req) * Number(po.price)).toFixed(2)}
                        </td>
                        <td className="py-3.5 border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-slate-400 dark:text-slate-550 shrink-0" />
                            <span>{new Date(po.order_date).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="py-3.5 border-b border-slate-200 dark:border-white/5">
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(po)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[0.7rem] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-500/20 dark:hover:bg-indigo-500/20 transition-all cursor-pointer"
                            >
                              <Edit2 size={11} />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(po.po_id)}
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

export default PurchaseOrdersPage;
