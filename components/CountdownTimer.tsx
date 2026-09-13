'use client';

import React, { useState, useEffect } from 'react';
import { getTimeRemaining, TimeLeft } from '../utils/formatters';
import { Clock, Flame, ShieldAlert } from 'lucide-react';

interface CountdownTimerProps {
  endTime: string;
  onExpire?: () => void;
  compact?: boolean;
  showLabels?: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endTime,
  onExpire,
  compact = false,
  showLabels = true,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeRemaining(endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTimeRemaining(endTime);
      setTimeLeft(remaining);

      if (remaining.isExpired) {
        clearInterval(timer);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onExpire]);

  if (timeLeft.isExpired) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 font-semibold text-xs border border-red-200 dark:border-red-900">
        <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
        Auction Closed
      </div>
    );
  }

  // Critical urgency: < 2 minutes (Anti-Sniping threshold)
  const isAntiSnipeZone = timeLeft.totalSeconds <= 120;
  // Urgent: < 30 minutes
  const isUrgent = timeLeft.totalSeconds <= 1800;

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold transition-colors ${
          isAntiSnipeZone
            ? 'bg-red-600 text-white animate-pulse shadow-md shadow-red-500/30'
            : isUrgent
            ? 'bg-amber-500 text-slate-900'
            : 'bg-slate-800 text-emerald-400 border border-slate-700'
        }`}
      >
        {isAntiSnipeZone ? <Flame className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
        <span>
          {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
          {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      {isAntiSnipeZone && (
        <div className="flex items-center gap-1.5 text-xs font-bold text-red-500 animate-bounce">
          <ShieldAlert className="w-4 h-4" />
          <span>Anti-Sniping Active (2m auto-extension)</span>
        </div>
      )}

      <div className="grid grid-flow-col gap-2 text-center auto-cols-max">
        {timeLeft.days > 0 && (
          <div className="flex flex-col p-2 bg-slate-900/80 rounded-lg border border-slate-800 text-white min-w-[54px]">
            <span className="font-mono text-2xl font-black text-amber-400">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            {showLabels && <span className="text-[10px] uppercase tracking-wider text-slate-400">Days</span>}
          </div>
        )}

        <div className="flex flex-col p-2 bg-slate-900/80 rounded-lg border border-slate-800 text-white min-w-[54px]">
          <span className="font-mono text-2xl font-black text-amber-400">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          {showLabels && <span className="text-[10px] uppercase tracking-wider text-slate-400">Hours</span>}
        </div>

        <div className="flex flex-col p-2 bg-slate-900/80 rounded-lg border border-slate-800 text-white min-w-[54px]">
          <span
            className={`font-mono text-2xl font-black ${
              isUrgent ? 'text-red-400 animate-pulse' : 'text-amber-400'
            }`}
          >
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          {showLabels && <span className="text-[10px] uppercase tracking-wider text-slate-400">Mins</span>}
        </div>

        <div className="flex flex-col p-2 bg-slate-900/80 rounded-lg border border-slate-800 text-white min-w-[54px]">
          <span
            className={`font-mono text-2xl font-black ${
              isAntiSnipeZone ? 'text-red-500 animate-ping' : 'text-emerald-400'
            }`}
          >
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          {showLabels && <span className="text-[10px] uppercase tracking-wider text-slate-400">Secs</span>}
        </div>
      </div>
    </div>
  );
};
