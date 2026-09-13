'use client';

import React from 'react';
import { useAuction } from '../context/AuctionContext';
import { X, Gavel, AlertTriangle, Trophy, ShieldAlert, Clock } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notifications, clearNotification } = useAuction();

  // Show only unread toasts, up to 3
  const activeToasts = notifications.filter((n) => !n.read).slice(0, 3);

  if (activeToasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {activeToasts.map((notif) => {
        let Icon = Gavel;
        let bgClass = 'bg-white border-slate-200 text-slate-800 shadow-slate-200/50';
        let iconBg = 'bg-slate-100 text-slate-700';

        if (notif.type === 'outbid') {
          Icon = AlertTriangle;
          bgClass = 'bg-white border-red-300 text-slate-900 shadow-red-500/10';
          iconBg = 'bg-red-50 text-red-600 border border-red-200';
        } else if (notif.type === 'anti_snipe') {
          Icon = ShieldAlert;
          bgClass = 'bg-white border-amber-300 text-slate-900 shadow-amber-500/10';
          iconBg = 'bg-amber-50 text-amber-600 border border-amber-200';
        } else if (notif.type === 'won') {
          Icon = Trophy;
          bgClass = 'bg-white border-emerald-300 text-slate-900 shadow-emerald-500/10';
          iconBg = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
        } else if (notif.type === 'ending_soon') {
          Icon = Clock;
          bgClass = 'bg-white border-blue-300 text-slate-900 shadow-blue-500/10';
          iconBg = 'bg-blue-50 text-blue-600 border border-blue-200';
        }

        return (
          <div
            key={notif.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300 ${bgClass}`}
          >
            <div className={`p-2 rounded-xl ${iconBg} shrink-0 mt-0.5`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 text-xs leading-relaxed">
              <div className="font-bold text-slate-900 mb-0.5">{notif.title}</div>
              <p className="text-slate-600">{notif.message}</p>
            </div>
            <button
              onClick={() => clearNotification(notif.id)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors shrink-0"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
