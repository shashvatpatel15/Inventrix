import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MetricCards from './components/MetricCards';
import Toast from './components/Toast';

// Pages
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import SuppliersPage from './pages/SuppliersPage';
import WarehousesPage from './pages/WarehousesPage';
import PurchaseOrdersPage from './pages/PurchaseOrdersPage';
import SalesOrdersPage from './pages/SalesOrdersPage';
import AboutUsPage from './pages/AboutUsPage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function App() {
  const [currentPage, setCurrentPage] = useState('products');
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  
  // Auth state
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [username, setUsername] = useState(localStorage.getItem('username') || null);
  
  // Loading & Toast States
  const [toasts, setToasts] = useState([]);

  // Theme state
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth Action handlers
  const handleLoginSuccess = (userToken, userVal) => {
    localStorage.setItem('token', userToken);
    localStorage.setItem('username', userVal);
    setToken(userToken);
    setUsername(userVal);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
    addToast('Logged out successfully', 'success');
  };

  // API Fetch helper with Auth headers
  const loadData = async (type, setter) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/${type}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 401 || response.status === 403) {
        handleLogout();
        return;
      }
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const data = await response.json();
      setter(data || []);
    } catch (err) {
      console.error(`Database error: Could not fetch ${type}:`, err);
    }
  };

  // Load data and setup background polling loop dependent on token
  useEffect(() => {
    if (!token) return;

    const fetchAll = () => {
      loadData('products', setProducts);
      loadData('suppliers', setSuppliers);
      loadData('warehouses', setWarehouses);
      loadData('purchase-orders', setPurchaseOrders);
      loadData('sales-orders', setSalesOrders);
    };

    fetchAll();

    const interval = setInterval(fetchAll, 15000);
    return () => clearInterval(interval);
  }, [token]);

  // API Add mutation with Auth headers
  const handleAdd = async (type, payload) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${type}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (response.status === 401 || response.status === 403) {
        handleLogout();
        return false;
      }
      const result = await response.json();
      if (response.ok) {
        addToast(result.message || 'Item added successfully', 'success');
        refreshResource(type);
        return true;
      } else {
        addToast(result.message || 'Error occurred', 'error');
        return false;
      }
    } catch (err) {
      addToast('Network error: Could not connect to backend server', 'error');
      return false;
    }
  };

  // API Update mutation with Auth headers
  const handleUpdate = async (type, id, payload) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${type}/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (response.status === 401 || response.status === 403) {
        handleLogout();
        return false;
      }
      const result = await response.json();
      if (response.ok) {
        addToast(result.message || 'Item updated successfully', 'success');
        refreshResource(type);
        return true;
      } else {
        addToast(result.message || 'Error occurred', 'error');
        return false;
      }
    } catch (err) {
      addToast('Network error: Could not connect to backend server', 'error');
      return false;
    }
  };

  // API Delete mutation with Auth headers
  const handleDelete = async (type, id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${type}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 401 || response.status === 403) {
        handleLogout();
        return false;
      }
      const result = await response.json();
      if (response.ok) {
        addToast(result.message || 'Item deleted successfully', 'success');
        refreshResource(type);
        return true;
      } else {
        addToast(result.message || 'Deletion constraint active', 'error');
        return false;
      }
    } catch (err) {
      addToast('Network error: Could not connect to backend server', 'error');
      return false;
    }
  };

  // Smart refetch logic based on mutated entity
  const refreshResource = (type) => {
    if (type === 'products') {
      loadData('products', setProducts);
    } else if (type === 'suppliers') {
      loadData('suppliers', setSuppliers);
    } else if (type === 'warehouses') {
      loadData('warehouses', setWarehouses);
      loadData('products', setProducts);
    } else if (type === 'purchase-orders') {
      loadData('purchase-orders', setPurchaseOrders);
      loadData('products', setProducts);
    } else if (type === 'sales-orders') {
      loadData('sales-orders', setSalesOrders);
      loadData('products', setProducts);
    }
  };

  // Render correct page view
  const renderPage = () => {
    switch (currentPage) {
      case 'products':
        return (
          <ProductsPage
            products={products}
            warehouses={warehouses}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            addToast={addToast}
          />
        );
      case 'suppliers':
        return (
          <SuppliersPage
            suppliers={suppliers}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            addToast={addToast}
          />
        );
      case 'warehouses':
        return (
          <WarehousesPage
            warehouses={warehouses}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            addToast={addToast}
          />
        );
      case 'purchase-orders':
        return (
          <PurchaseOrdersPage
            purchaseOrders={purchaseOrders}
            products={products}
            suppliers={suppliers}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            addToast={addToast}
          />
        );
      case 'sales-orders':
        return (
          <SalesOrdersPage
            salesOrders={salesOrders}
            products={products}
            suppliers={suppliers}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            addToast={addToast}
          />
        );
      case 'about-us':
        return <AboutUsPage />;
      default:
        return <ProductsPage products={products} warehouses={warehouses} />;
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'products': return 'Inventory Catalog';
      case 'suppliers': return 'Vendor Network';
      case 'warehouses': return 'Distribution Centers';
      case 'purchase-orders': return 'Inbound Replenishment';
      case 'sales-orders': return 'Outbound Orders';
      case 'about-us': return 'System Information';
      default: return 'Dashboard';
    }
  };

  if (!token) {
    return (
      <>
        <LoginPage onLoginSuccess={handleLoginSuccess} addToast={addToast} theme={theme} toggleTheme={toggleTheme} />
        <Toast toasts={toasts} removeToast={removeToast} />
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-x-hidden text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Background Ambience blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none"></div>

      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        username={username}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 flex flex-col min-h-screen relative z-10">
        <Header pageTitle={getPageTitle()} theme={theme} toggleTheme={toggleTheme} />
        
        {currentPage !== 'about-us' && (
          <MetricCards 
            products={products} 
            warehouses={warehouses} 
            suppliers={suppliers} 
          />
        )}
        
        <div className="flex-1 p-6 overflow-y-auto">
          {renderPage()}
        </div>
      </main>

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;
