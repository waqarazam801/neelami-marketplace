'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AuctionItem, Bid, UserProfile, Category, Currency, NotificationAlert } from '../types/auction';
import { INITIAL_AUCTIONS, DEMO_USERS } from '../data/mockAuctions';
import { getTimeRemaining, formatPriceByCurrency } from '../utils/formatters';
import { playAuthenticGavel, playOutbidAlert, playBidChime } from '../utils/sound';

interface AuctionContextType {
  auctions: AuctionItem[];
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  watchlist: string[];
  toggleWatchlist: (auctionId: string) => void;
  isWatched: (auctionId: string) => boolean;
  placeBid: (auctionId: string, amount: number) => { success: boolean; message: string };
  buyItNow: (auctionId: string) => { success: boolean; message: string };
  createAuction: (data: Omit<AuctionItem, 'id' | 'bids' | 'bidsCount' | 'currentBid'>) => string;
  notifications: NotificationAlert[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;
  clearNotification: (id: string) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  playSoundGavel: () => void;
  isSimulationActive: boolean;
  setIsSimulationActive: (active: boolean) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountInPKR: number, compact?: boolean) => string;
}

const DEFAULT_NOTIFICATIONS: NotificationAlert[] = [
  {
    id: 'notif-seed-1',
    auctionId: 'auc-101',
    lotTitle: '1972 Vintage Rolex Datejust 36mm Solid Gold Dial',
    lotImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    type: 'outbid',
    title: '⚠️ You were outbid by Farhan Saeed!',
    message: 'New highest bid is ₨ 1,280,000. Lot closing soon with anti-sniping protection.',
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    read: false,
    amount: 1280000,
    bidderName: 'Farhan Saeed (Karachi)',
  },
  {
    id: 'notif-seed-2',
    auctionId: 'auc-103',
    lotTitle: '1984 Toyota Land Cruiser FJ40 Restomod',
    lotImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    type: 'ending_soon',
    title: '⏰ Ending Soon: 1984 Toyota Land Cruiser FJ40',
    message: 'Less than 30 minutes remain on this Crown Lot. Current hammer: ₨ 4,800,000.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: false,
    amount: 4800000,
  },
  {
    id: 'notif-seed-3',
    auctionId: 'auc-102',
    lotTitle: 'Rare Kashmir Royal Blue Sapphire 4.82 Carats (GIA)',
    lotImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    type: 'won',
    title: '🛡️ Escrow Trust Established',
    message: 'Company escrow verified. Funds held safely in Standard Chartered Trust.',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    read: true,
    amount: 2400000,
  },
];

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

export const AuctionProvider = ({ children }: { children: ReactNode }) => {
  const [auctions, setAuctions] = useState<AuctionItem[]>(INITIAL_AUCTIONS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS[0]);
  const [watchlist, setWatchlist] = useState<string[]>(['auc-101', 'auc-103']);
  const [notifications, setNotifications] = useState<NotificationAlert[]>(DEFAULT_NOTIFICATIONS);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isSimulationActive, setIsSimulationActive] = useState<boolean>(true);
  const [currency, setCurrency] = useState<Currency>('USD');

  const formatPrice = useCallback((amountInPKR: number, compact?: boolean) => {
    return formatPriceByCurrency(amountInPKR, currency, compact);
  }, [currency]);

  // Load persisted data if any
  useEffect(() => {
    try {
      const savedAuctions = localStorage.getItem('neelami_auctions');
      if (savedAuctions) {
        setAuctions(JSON.parse(savedAuctions));
      }
      const savedWatchlist = localStorage.getItem('neelami_watchlist');
      if (savedWatchlist) {
        setWatchlist(JSON.parse(savedWatchlist));
      }
      const savedCurrency = localStorage.getItem('neelami_currency') as Currency;
      if (savedCurrency && ['USD', 'PKR', 'AED', 'GBP', 'EUR'].includes(savedCurrency)) {
        setCurrency(savedCurrency);
      }
      const savedSound = localStorage.getItem('neelami_sound_enabled');
      if (savedSound !== null) {
        setSoundEnabled(savedSound === 'true');
      }
      const savedNotifs = localStorage.getItem('neelami_notifications');
      if (savedNotifs) {
        setNotifications(JSON.parse(savedNotifs));
      }
    } catch (e) {
      console.warn('Storage read failed', e);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('neelami_currency', currency);
    } catch (e) {
      console.warn('Storage write failed', e);
    }
  }, [currency]);

  useEffect(() => {
    try {
      localStorage.setItem('neelami_auctions', JSON.stringify(auctions));
    } catch (e) {
      console.warn('Storage write failed', e);
    }
  }, [auctions]);

  useEffect(() => {
    try {
      localStorage.setItem('neelami_watchlist', JSON.stringify(watchlist));
    } catch (e) {
      console.warn('Storage write failed', e);
    }
  }, [watchlist]);

  useEffect(() => {
    try {
      localStorage.setItem('neelami_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn('Storage write failed', e);
    }
  }, [notifications]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('neelami_sound_enabled', String(next));
      } catch (e) {
        console.warn('Sound storage error', e);
      }
      if (next) {
        playAuthenticGavel();
      }
      return next;
    });
  }, []);

  const playSoundGavel = useCallback(() => {
    if (soundEnabled) {
      playAuthenticGavel();
    }
  }, [soundEnabled]);

  const addNotificationAlert = useCallback((alert: Omit<NotificationAlert, 'id' | 'timestamp' | 'read'>) => {
    const newAlert: NotificationAlert = {
      ...alert,
      id: 'notif-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newAlert, ...prev.slice(0, 19)]);
  }, []);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const toggleWatchlist = (auctionId: string) => {
    setWatchlist((prev) => {
      const exists = prev.includes(auctionId);
      if (exists) {
        return prev.filter((id) => id !== auctionId);
      } else {
        const item = auctions.find((a) => a.id === auctionId);
        if (item) {
          addNotificationAlert({
            auctionId: item.id,
            lotTitle: item.title,
            lotImage: item.images[0],
            type: 'bid',
            title: 'Added to Watchlist',
            message: `You are now tracking ${item.title.substring(0, 30)}...`,
          });
        }
        return [...prev, auctionId];
      }
    });
  };

  const isWatched = (auctionId: string) => watchlist.includes(auctionId);

  // Place a Bid with Anti-Sniping Protection & Audio Gavel
  const placeBid = useCallback((auctionId: string, amount: number): { success: boolean; message: string } => {
    let result = { success: false, message: '' };

    setAuctions((prev) =>
      prev.map((item) => {
        if (item.id !== auctionId) return item;

        const time = getTimeRemaining(item.endTime);
        if (time.isExpired || item.status === 'closed') {
          result = { success: false, message: 'This auction has already closed.' };
          return item;
        }

        const minRequired = item.currentBid + item.minIncrement;
        if (amount < minRequired) {
          result = {
            success: false,
            message: `Minimum acceptable bid is ${formatPriceByCurrency(minRequired, currency)}.`,
          };
          return item;
        }

        // Anti-Sniping Rule: If less than 2 minutes left, extend by 2 minutes
        let newEndTime = item.endTime;
        let snipeExtended = false;
        if (time.totalSeconds <= 120) {
          const extendedDate = new Date(Date.now() + 120 * 1000);
          newEndTime = extendedDate.toISOString();
          snipeExtended = true;
        }

        const newBid: Bid = {
          id: 'bid-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
          auctionId: item.id,
          bidderId: currentUser.id,
          bidderName: currentUser.name,
          bidderAvatar: currentUser.avatar,
          amount,
          timestamp: new Date().toISOString(),
        };

        result = {
          success: true,
          message: snipeExtended
            ? `Bid placed! 🛡️ Anti-sniping activated: auction extended by 2 mins.`
            : `Success! You are now the highest bidder at ₨ ${amount.toLocaleString('en-PK')}.`,
        };

        // Trigger Audio Feedback
        if (soundEnabled) {
          playAuthenticGavel();
        }

        // Add Notification
        addNotificationAlert({
          auctionId: item.id,
          lotTitle: item.title,
          lotImage: item.images[0],
          type: snipeExtended ? 'anti_snipe' : 'bid',
          title: snipeExtended ? '🛡️ Anti-Sniping Extended (+2m)' : 'Hammer Bid Accepted!',
          message: `Your bid of ₨ ${amount.toLocaleString('en-PK')} on ${item.title.substring(0, 26)}... is active.`,
          amount,
        });

        return {
          ...item,
          currentBid: amount,
          bidsCount: item.bidsCount + 1,
          endTime: newEndTime,
          status: time.totalSeconds <= 1800 ? 'ending_soon' : 'live',
          bids: [newBid, ...item.bids],
        };
      })
    );

    return result;
  }, [currentUser, soundEnabled, addNotificationAlert, currency]);

  // Buy It Now option
  const buyItNow = useCallback((auctionId: string): { success: boolean; message: string } => {
    let result = { success: false, message: '' };

    setAuctions((prev) =>
      prev.map((item) => {
        if (item.id !== auctionId) return item;
        if (!item.buyNowPrice) {
          result = { success: false, message: 'Buy It Now is not enabled for this item.' };
          return item;
        }

        const now = new Date().toISOString();
        const purchasePrice = item.buyNowPrice;

        const winningBid: Bid = {
          id: 'buy-now-' + Date.now(),
          auctionId: item.id,
          bidderId: currentUser.id,
          bidderName: currentUser.name,
          bidderAvatar: currentUser.avatar,
          amount: purchasePrice,
          timestamp: now,
        };

        result = {
          success: true,
          message: `Congratulations! You purchased ${item.title} immediately for ₨ ${purchasePrice.toLocaleString('en-PK')}.`,
        };

        if (soundEnabled) {
          playAuthenticGavel();
        }

        addNotificationAlert({
          auctionId: item.id,
          lotTitle: item.title,
          lotImage: item.images[0],
          type: 'won',
          title: 'Lot Purchased via Buy It Now!',
          message: `Immediate purchase confirmed for ₨ ${purchasePrice.toLocaleString('en-PK')}. Proceed to Escrow Settlement.`,
          amount: purchasePrice,
        });

        return {
          ...item,
          status: 'closed',
          endTime: now,
          currentBid: purchasePrice,
          bidsCount: item.bidsCount + 1,
          winnerId: currentUser.id,
          winnerName: currentUser.name,
          bids: [winningBid, ...item.bids],
        };
      })
    );

    return result;
  }, [currentUser, soundEnabled, addNotificationAlert]);

  // Consign and Create Auction
  const createAuction = useCallback(
    (data: Omit<AuctionItem, 'id' | 'bids' | 'bidsCount' | 'currentBid'>): string => {
      const newId = 'auc-' + Math.floor(100 + Math.random() * 900);
      const newAuction: AuctionItem = {
        ...data,
        id: newId,
        currentBid: data.startingBid,
        bidsCount: 0,
        bids: [],
      };

      setAuctions((prev) => [newAuction, ...prev]);

      addNotificationAlert({
        auctionId: newId,
        lotTitle: data.title,
        lotImage: data.images[0],
        type: 'bid',
        title: 'New Lot Consigned',
        message: `"${data.title.substring(0, 30)}..." is now live for worldwide bidding!`,
      });

      return newId;
    },
    [addNotificationAlert]
  );

  // Background Competitor Bidding Simulation with Real-Time Outbid Notification
  useEffect(() => {
    if (!isSimulationActive) return;

    const mockBidders = [
      { id: 'usr-sim-1', name: 'Shahid Afridi (Peshawar)' },
      { id: 'usr-sim-2', name: 'Maryam Nawaz (Lahore)' },
      { id: 'usr-sim-3', name: 'Kashif Mehmood (Karachi)' },
      { id: 'usr-sim-4', name: 'Dr. Zulfiqar (Islamabad)' },
      { id: 'usr-sim-5', name: 'Bilal Khan (Quetta)' },
    ];

    const interval = setInterval(() => {
      setAuctions((currentAuctions) => {
        // Pick an active auction with ending soon or high activity
        const candidates = currentAuctions.filter((a) => a.status === 'ending_soon' || a.status === 'live');
        if (candidates.length === 0) return currentAuctions;

        const target = candidates[Math.floor(Math.random() * candidates.length)];
        const time = getTimeRemaining(target.endTime);
        if (time.isExpired) return currentAuctions;

        // Chance of counter-bid
        if (Math.random() > 0.45) return currentAuctions;

        const bidder = mockBidders[Math.floor(Math.random() * mockBidders.length)];
        const increment = target.minIncrement * (Math.floor(Math.random() * 2) + 1);
        const newBidAmount = target.currentBid + increment;

        // Check anti-sniping for simulation too
        let newEndTime = target.endTime;
        if (time.totalSeconds <= 120) {
          newEndTime = new Date(Date.now() + 120 * 1000).toISOString();
        }

        const newBid: Bid = {
          id: 'sim-' + Date.now(),
          auctionId: target.id,
          bidderId: bidder.id,
          bidderName: bidder.name,
          amount: newBidAmount,
          timestamp: new Date().toISOString(),
        };

        return currentAuctions.map((item) => {
          if (item.id !== target.id) return item;

          // If current user was outbid, trigger Outbid Alert & Sound
          const wasCurrentUserLeading = item.bids.length > 0 && item.bids[0].bidderId === currentUser.id;
          if (wasCurrentUserLeading) {
            if (soundEnabled) {
              playOutbidAlert();
            }

            addNotificationAlert({
              auctionId: item.id,
              lotTitle: item.title,
              lotImage: item.images[0],
              type: 'outbid',
              title: `⚠️ Outbid on LOT #${item.id.toUpperCase()}!`,
              message: `${bidder.name} placed a higher bid of ₨ ${newBidAmount.toLocaleString('en-PK')}. Raise your bid to regain lead!`,
              amount: newBidAmount,
              bidderName: bidder.name,
            });
          }

          return {
            ...item,
            currentBid: newBidAmount,
            bidsCount: item.bidsCount + 1,
            endTime: newEndTime,
            bids: [newBid, ...item.bids],
          };
        });
      });
    }, 20000); // Trigger every 20s for exciting live feel

    return () => clearInterval(interval);
  }, [isSimulationActive, currentUser, soundEnabled, addNotificationAlert]);

  return (
    <AuctionContext.Provider
      value={{
        auctions,
        currentUser,
        setCurrentUser,
        watchlist,
        toggleWatchlist,
        isWatched,
        placeBid,
        buyItNow,
        createAuction,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearAllNotifications,
        clearNotification,
        soundEnabled,
        toggleSound,
        playSoundGavel,
        isSimulationActive,
        setIsSimulationActive,
        currency,
        setCurrency,
        formatPrice,
      }}
    >
      {children}
    </AuctionContext.Provider>
  );
};

export const useAuction = () => {
  const context = useContext(AuctionContext);
  if (!context) {
    throw new Error('useAuction must be used within an AuctionProvider');
  }
  return context;
};
