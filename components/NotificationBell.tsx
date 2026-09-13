'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuction } from '../context/AuctionContext';
import { 
  Bell, 
  AlertTriangle, 
  Flame, 
  Trophy, 
  Clock, 
  Gavel, 
  Check, 
  Trash2, 
  ArrowRight,
  X
} from 'lucide-react';

export const NotificationBell: React.FC = () => {
  const { 
    notifications, 
    unreadNotificationCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    clearAllNotifications,
    formatPrice
  } = useAuction();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const displayedNotifications = filter === 'unread' 
    ? notifications.filter((n) => !n.read) 
    : notifications;

  const getIcon = (type: string) => {
    switch (type) {
      case 'outbid':
        return (
          <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-200 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
        );
      case 'anti_snipe':
        return (
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 shrink-0">
            <Flame className="w-4 h-4" />
          </div>
        );
      case 'won':
        return (
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            <Trophy className="w-4 h-4" />
          </div>
        );
      case 'ending_soon':
        return (
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
            <Gavel className="w-4 h-4" />
          </div>
        );
    }
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMinutes = Math.floor((Date.now() - date.getTime()) / 60000);
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-amber-700 transition-colors"
        title="Auction Activity & Outbid Alerts"
        aria-label="Open Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadNotificationCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-pulse">
            {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
          </span>
        )}
      </button>

      {/* Dropdown Surface */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {/* Header */}
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-slate-900">Activity Alerts</span>
              {unreadNotificationCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                  {unreadNotificationCount} New
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              {unreadNotificationCount > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsAsRead}
                  className="p-1 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-200 transition-colors text-[11px] flex items-center gap-1"
                  title="Mark all as read"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Read All</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllNotifications}
                  className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-200 transition-colors"
                  title="Clear all alerts"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="px-3.5 py-2 border-b border-slate-100 flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                filter === 'unread'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Unread ({unreadNotificationCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {displayedNotifications.length === 0 ? (
              <div className="text-center py-10 px-4 space-y-2">
                <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-600">
                  {filter === 'unread' ? 'No unread alerts' : 'No notifications yet'}
                </p>
                <p className="text-[11px] text-slate-400">
                  When you place bids or get counter-bid, instant alerts appear here.
                </p>
              </div>
            ) : (
              displayedNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationAsRead(notif.id)}
                  className={`p-3.5 transition-colors flex items-start gap-3 hover:bg-slate-50 cursor-pointer ${
                    !notif.read ? 'bg-amber-50/40' : 'bg-white'
                  }`}
                >
                  {getIcon(notif.type)}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1 mb-0.5">
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                        {formatTimestamp(notif.timestamp)}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>

                    {/* Direct Action Link */}
                    {notif.auctionId && (
                      <div className="mt-2 flex items-center justify-between">
                        {notif.amount && (
                          <span className="text-[11px] font-mono font-bold text-amber-700">
                            {formatPrice(notif.amount)}
                          </span>
                        )}
                        <Link
                          href={notif.type === 'won' ? '/dashboard?tab=won' : `/auction/${notif.auctionId}`}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            setIsOpen(false);
                          }}
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors ml-auto ${
                            notif.type === 'outbid'
                              ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
                              : notif.type === 'won'
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          }`}
                        >
                          <span>{notif.type === 'outbid' ? 'Counter-Bid Now' : notif.type === 'won' ? 'Escrow Settlement' : 'View Lot'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>

                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
            <Link
              href="/dashboard?tab=bids"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center justify-center gap-1"
            >
              <span>View All My Bids & Activity in Dashboard</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
