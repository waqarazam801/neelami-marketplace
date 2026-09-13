'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AuctionItem, Bid, UserProfile, Category } from '../types/auction';
import { INITIAL_AUCTIONS, DEMO_USERS } from '../data/mockAuctions';
import { getTimeRemaining } from '../utils/formatters';

interface NotificationMessage {
  id: string;
  type: 'bid' | 'outbid' | 'win' | 'anti_snipe' | 'create';
  message: string;
  timestamp: string;
}

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
  notifications: NotificationMessage[];
  clearNotification: (id: string) => void;
  isSimulationActive: boolean;
  setIsSimulationActive: (active: boolean) => void;
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

export const AuctionProvider = ({ children }: { children: ReactNode }) => {
  const [auctions, setAuctions] = useState<AuctionItem[]>(INITIAL_AUCTIONS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS[0]); // Hamza Khan (Buyer)
  const [watchlist, setWatchlist] = useState<string[]>(['auc-101', 'auc-103']);
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [isSimulationActive, setIsSimulationActive] = useState<boolean>(true);

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
    } catch (e) {
      console.warn('Storage read failed', e);
    }
  }, []);

  // Save to localStorage
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

  const addNotification = (type: NotificationMessage['type'], message: string) => {
    const newNotif: NotificationMessage = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      message,
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 7)]);
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const toggleWatchlist = (auctionId: string) => {
    setWatchlist((prev) => {
      const exists = prev.includes(auctionId);
      if (exists) {
        addNotification('create', 'Item removed from your watchlist.');
        return prev.filter((id) => id !== auctionId);
      } else {
        addNotification('create', 'Item added to your watchlist!');
        return [...prev, auctionId];
      }
    });
  };

  const isWatched = (auctionId: string) => watchlist.includes(auctionId);

  // Place a Bid with Anti-Sniping Protection
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
            message: `Minimum acceptable bid is ₨ ${minRequired.toLocaleString('en-PK')}.`,
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

        if (snipeExtended) {
          addNotification('anti_snipe', `🛡️ Anti-Sniping: Auction for "${item.title.substring(0, 30)}..." extended by 2 mins!`);
        } else {
          addNotification('bid', `New high bid placed: ₨ ${amount.toLocaleString('en-PK')} on "${item.title.substring(0, 26)}..."`);
        }

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
  }, [currentUser]);

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

        result = {
          success: true,
          message: `Congratulations! You purchased "${item.title}" for ₨ ${item.buyNowPrice.toLocaleString('en-PK')}.`,
        };

        addNotification('win', `🎉 Instant Purchase! "${item.title}" won by ${currentUser.name}!`);

        return {
          ...item,
          status: 'closed',
          currentBid: item.buyNowPrice,
          winnerId: currentUser.id,
          winnerName: currentUser.name,
        };
      })
    );

    return result;
  }, [currentUser]);

  // Create new auction
  const createAuction = (data: Omit<AuctionItem, 'id' | 'bids' | 'bidsCount' | 'currentBid'>): string => {
    const newId = 'auc-' + (Date.now() % 1000000);
    const newAuction: AuctionItem = {
      ...data,
      id: newId,
      currentBid: data.startingBid,
      bidsCount: 0,
      bids: [],
    };

    setAuctions((prev) => [newAuction, ...prev]);
    addNotification('create', `Your item "${newAuction.title}" is now LIVE for bidding!`);
    return newId;
  };

  // Simulated Competitor Bidding Generator for realistic experience
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

        // Skip if current user was not outbid or random chance
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

          // If current user was outbid, notify
          if (item.bids.length > 0 && item.bids[0].bidderId === currentUser.id) {
            addNotification('outbid', `⚠️ You were outbid on "${item.title.substring(0, 24)}..." at ₨ ${newBidAmount.toLocaleString('en-PK')}!`);
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
    }, 24000); // Trigger every 24s

    return () => clearInterval(interval);
  }, [isSimulationActive, currentUser]);

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
        clearNotification,
        isSimulationActive,
        setIsSimulationActive,
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
