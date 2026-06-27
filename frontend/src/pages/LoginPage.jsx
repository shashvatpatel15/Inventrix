import React, { useState } from 'react';
import { Warehouse, Lock, User, Eye, EyeOff, Sun, Moon } from 'lucide-react';

const LoginPage = ({ onLoginSuccess, addToast, theme, toggleTheme }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      addToast('Please enter both username and password', 'error');
      return;
    }

    setLoading(true);
    const endpoint = isRegister ? 'register' : 'login';
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${apiBase}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      
      if (response.ok) {
        if (isRegister) {
          addToast(data.message || 'Registration successful! Please log in.', 'success');
          setIsRegister(false);
          setPassword('');
        } else {
          addToast('Welcome back, ' + data.username, 'success');
          onLoginSuccess(data.token, data.username);
        }
      } else {
        addToast(data.message || 'Authentication failed', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Could not connect to authentication server', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative p-6 bg-slate-100 dark:bg-slate-950 overflow-hidden transition-colors duration-200">
      {/* Background Ambience Blobs */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-cyan-500/10 dark:bg-cyan-500/5 blur-[120px] pointer-events-none"></div>

      {/* Floating Theme Switcher */}
      {toggleTheme && (
        <button 
          onClick={toggleTheme}
          className="absolute top-6 right-6 p-2.5 rounded-xl bg-white hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-white/5 transition-all cursor-pointer shadow-sm z-20"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      )}

      <div className="w-full max-w-[420px] p-8 rounded-2xl border border-slate-200 dark:border-white/5 bg-white/70 dark:bg-slate-900/30 backdrop-blur-md shadow-2xl z-10 animate-fade-in">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
            <Warehouse size={24} />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Inventrix</h2>
          <p className="text-xs text-slate-500 mt-2 font-medium max-w-xs leading-relaxed">
            {isRegister ? 'Create your enterprise account' : 'Sign in to access your inventory dashboard'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <User size={13} className="text-indigo-600 dark:text-indigo-400" />
              <span>Username</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2 relative">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Lock size={13} className="text-indigo-600 dark:text-indigo-400" />
              <span>Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full pl-4 pr-10 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                placeholder="Enter password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-11 mt-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span>
            {isRegister ? 'Already have an account?' : "Don't have an account yet?"}
          </span>
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setUsername('');
              setPassword('');
            }}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 ml-1.5 underline cursor-pointer hover:no-underline transition-all"
          >
            {isRegister ? 'Sign In' : 'Register'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
