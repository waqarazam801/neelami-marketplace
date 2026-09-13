import { Currency } from '../types/auction';

/**
 * Currency rates relative to 1 PKR
 */
const RATES_TO_PKR: Record<Currency, number> = {
  PKR: 1,
  USD: 278,
  AED: 75.8,
  GBP: 365,
  EUR: 305,
};

export const CURRENCY_CONFIG: Record<Currency, { symbol: string; label: string; flag: string; name: string }> = {
  USD: { symbol: '$', label: 'USD', flag: '🌐', name: 'US Dollar' },
  PKR: { symbol: '₨ ', label: 'PKR', flag: '🇵🇰', name: 'Pakistani Rupee' },
  AED: { symbol: 'AED ', label: 'AED', flag: '🇦🇪', name: 'UAE Dirham' },
  GBP: { symbol: '£', label: 'GBP', flag: '🇬🇧', name: 'British Pound' },
  EUR: { symbol: '€', label: 'EUR', flag: '🇪🇺', name: 'Euro' },
};

export function formatPriceByCurrency(amountInPKR: number, currency: Currency = 'USD', compact = false): string {
  const rate = RATES_TO_PKR[currency] || 1;
  const converted = amountInPKR / rate;
  const symbol = CURRENCY_CONFIG[currency]?.symbol || '$';

  if (compact) {
    if (currency === 'PKR') {
      if (converted >= 10000000) return `₨ ${(converted / 10000000).toFixed(2)} Cr`;
      if (converted >= 100000) return `₨ ${(converted / 100000).toFixed(2)} Lac`;
      if (converted >= 1000) return `₨ ${(converted / 1000).toFixed(0)}k`;
    } else {
      if (converted >= 1000000) return `${symbol}${(converted / 1000000).toFixed(2)}M`;
      if (converted >= 1000) return `${symbol}${(converted / 1000).toFixed(1)}k`;
    }
  }

  // Formatting with commas
  const formattedNumber = Math.round(converted).toLocaleString(currency === 'PKR' ? 'en-PK' : 'en-US');
  return `${symbol}${formattedNumber}`;
}

export function formatPKR(amount: number, compact = false): string {
  return formatPriceByCurrency(amount, 'USD', compact);
}

export function formatPKRFull(amount: number): string {
  return formatPriceByCurrency(amount, 'USD', false);
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
  const diffHours = Math.floor(diffMinutes / 24);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
