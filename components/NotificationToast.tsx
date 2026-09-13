'use client';

import React from 'react';
import { useAuction } from '../context/AuctionContext';
import { X, Gavel, AlertTriangle, Trophy, ShieldAlert, CheckCircle } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notifications, clearNotification } = useAuction();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {notifications.map((notif) => {
        let Icon = Gavel;
        let bgClass = 'bg-slate-900 border-slate-700 text-white';
        let iconColor = 'text-emerald-400';

        if (notif.type === 'outbid') {
          Icon = AlertTriangle;
          bgClass = 'bg-amber-950/90 border-amber-500/50 text-amber-100 shadow-amber-900/20';
          iconColor = 'text-amber-400';
        } else if (notif.type === 'anti_snipe') {
          Icon = ShieldAlert;
          bgClass = 'bg-red-950/90 border-red-500/50 text-red-100 shadow-red-900/20';
          iconColor = 'text-red-400';
        } else if (notif.type === 'win') {
          Icon = Trophy;
          bgClass = 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100 shadow-emerald-900/20';
          iconColor = 'text-yellow-400';
        } else if (notif.type === 'create') {
          Icon = CheckCircle;
          bgClass = 'bg-blue-950/90 border-blue-500/50 text-blue-100 shadow-blue-900/20';
          iconColor = 'text-blue-400';
        }

        return (
          <div
            key={notif.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-slide-in ${bgClass}`}
          >
            <div className={`p-1.5 rounded-lg bg-black/20 ${iconColor} shrink-0 mt-0.5`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 text-xs leading-relaxed font-medium">
              {notif.message}
            </div>
            <button
              onClick={() => clearNotification(notif.id)}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors shrink-0"
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
