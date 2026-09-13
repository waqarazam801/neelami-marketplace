/**
 * Currency and time formatters for Neelami.com (PKR focus)
 */

export function formatPKR(amount: number, compact = false): string {
  if (compact) {
    if (amount >= 10000000) {
      // Crores
      return `₨ ${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      // Lakhs
      return `₨ ${(amount / 100000).toFixed(2)} Lac`;
    }
    if (amount >= 1000) {
      return `₨ ${(amount / 1000).toFixed(0)}k`;
    }
  }

  return '₨ ' + amount.toLocaleString('en-PK');
}

export function formatPKRFull(amount: number): string {
  return '₨ ' + amount.toLocaleString('en-PK');
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  totalSeconds: number;
}

export function getTimeRemaining(endTimeISO: string): TimeLeft {
  const total = Date.parse(endTimeISO) - Date.now();
  
  if (total <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      totalSeconds: 0,
    };
  }

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
    totalSeconds: Math.floor(total / 1000),
  };
}

export function formatRelativeTime(dateISO: string): string {
  const diffMs = Date.now() - new Date(dateISO).getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
