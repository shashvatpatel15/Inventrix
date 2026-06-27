import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ toasts = [], removeToast }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          onClose={() => removeToast(toast.id)} 
        />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = toast.type === 'success';
  const Icon = isSuccess ? CheckCircle : AlertCircle;

  return (
    <div 
      className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md shadow-xl pointer-events-auto animate-slide-in transition-all duration-300 ${
        isSuccess 
          ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200' 
          : 'bg-rose-950/80 border-rose-500/30 text-rose-200'
      }`}
    >
      <Icon size={18} className={isSuccess ? 'text-emerald-400 shrink-0' : 'text-rose-400 shrink-0'} />
      <span className="text-sm font-medium flex-1">{toast.message}</span>
      <button 
        onClick={onClose} 
        className="text-white/40 hover:text-white/80 transition-colors p-1 rounded-lg hover:bg-white/5 cursor-pointer"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;
