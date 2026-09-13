'use client';

import React from 'react';
import { Bid } from '../types/auction';
import { formatRelativeTime } from '../utils/formatters';
import { useAuction } from '../context/AuctionContext';
import { Gavel, Trophy, User, ShieldCheck } from 'lucide-react';

interface LiveBidFeedProps {
  bids: Bid[];
  currentBid: number;
}

export const LiveBidFeed: React.FC<LiveBidFeedProps> = ({ bids, currentBid }) => {
  const { formatPrice } = useAuction();
  if (bids.length === 0) {
    return (
      <div className="text-center py-8 px-4 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
        <Gavel className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-xs font-semibold text-slate-400">No bids placed yet</p>
        <p className="text-[11px] text-slate-500 mt-0.5">Be the first to place the opening bid!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
      {bids.map((bid, index) => {
        const isHighest = index === 0;

        return (
          <div
            key={bid.id}
            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
              isHighest
                ? 'bg-gradient-to-r from-amber-500/10 via-slate-900 to-emerald-500/10 border-amber-500/40 shadow-lg shadow-amber-950/20'
                : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isHighest
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {isHighest ? <Trophy className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-200">
                    {bid.bidderName}
                  </span>
                  {isHighest && (
                    <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30">
                      High Bidder
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  {formatRelativeTime(bid.timestamp)}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div
                className={`font-mono font-black ${
                  isHighest ? 'text-amber-400 text-base' : 'text-slate-300 text-sm'
                }`}
              >
                {formatPrice(bid.amount)}
              </div>
              <div className="text-[10px] text-emerald-500/80 flex items-center justify-end gap-1">
                <ShieldCheck className="w-3 h-3 inline" /> Verified
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
