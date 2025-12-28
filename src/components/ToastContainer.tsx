import React from 'react';
import { useUI } from '@/hooks/useUI';
import { Icon } from './Icon';

export const ToastContainer: React.FC = () => {
  const { toasts, hideToast } = useUI();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto flex items-center p-4 rounded-lg shadow-lg border animate-slide-in-right
            ${
              toast.type === 'success' ? 'bg-slate-800 border-green-500 text-green-100' :
              toast.type === 'error' ? 'bg-slate-800 border-red-500 text-red-100' :
              toast.type === 'warning' ? 'bg-slate-800 border-yellow-500 text-yellow-100' :
              'bg-slate-800 border-blue-500 text-blue-100'
            }
          `}
        >
          <div className="flex-shrink-0 mr-3">
            <Icon 
              name={
                toast.type === 'success' ? 'check' :
                toast.type === 'error' ? 'close' :
                toast.type === 'warning' ? 'warning' :
                'info'
              } 
              className={`w-5 h-5 ${
                toast.type === 'success' ? 'text-green-500' :
                toast.type === 'error' ? 'text-red-500' :
                toast.type === 'warning' ? 'text-yellow-500' :
                'text-blue-500'
              }`}
            />
          </div>
          <div className="flex-1 text-sm font-medium">{toast.message}</div>
          <button
            onClick={() => hideToast(toast.id)}
            className="ml-4 text-slate-400 hover:text-slate-200 focus:outline-none"
          >
            <Icon name="close" className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
