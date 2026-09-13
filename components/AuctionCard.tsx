'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AuctionItem } from '../types/auction';
import { useAuction } from '../context/AuctionContext';
import { CountdownTimer } from './CountdownTimer';
import { formatPKR } from '../utils/formatters';
import { Heart, Gavel, MapPin, Zap, CheckCircle2, ShieldCheck } from 'lucide-react';

interface AuctionCardProps {
  auction: AuctionItem;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({ auction }) => {
  const { isWatched, toggleWatchlist, formatPrice } = useAuction();
  const watched = isWatched(auction.id);
  const reserveMet = auction.currentBid >= auction.reservePrice;

  return (
    <div className="group flex flex-col bg-gradient-to-b from-[#0E182D] to-[#080E1C] rounded-3xl border border-amber-500/20 hover:border-amber-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10 overflow-hidden hover:-translate-y-1">
      {/* Thumbnail & Badges Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
        <Image
          src={auction.images[0]}
          alt={auction.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        />

        {/* Gradient Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080E1C] via-transparent to-black/40 pointer-events-none" />

        {/* Live Timer Badge (Top Left) */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <CountdownTimer endTime={auction.endTime} compact />
        </div>

        {/* Watchlist Heart Button (Top Right) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWatchlist(auction.id);
          }}
          className={`absolute top-3.5 right-3.5 z-10 p-2.5 rounded-full backdrop-blur-md transition-all ${
            watched
              ? 'bg-red-500 text-white shadow-lg shadow-red-900/50 scale-105'
              : 'bg-black/50 text-slate-300 hover:text-amber-300 hover:bg-black/80'
          }`}
          title={watched ? 'Remove from Watchlist' : 'Add to Watchlist'}
        >
          <Heart className={`w-4 h-4 ${watched ? 'fill-current' : ''}`} />
        </button>

        {/* Category & Condition Badges (Bottom of image) */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-[11px] font-semibold text-slate-300 pointer-events-none">
          <span className="px-2.5 py-1 rounded-lg bg-[#070D1B]/90 backdrop-blur-md border border-amber-500/30 text-amber-300 font-medium">
            {auction.category}
          </span>
          <span className="flex items-center gap-1 text-slate-300 bg-black/70 px-2.5 py-1 rounded-lg backdrop-blur-md text-[10px]">
            <MapPin className="w-3 h-3 text-amber-400" />
            {auction.seller.city}
          </span>
        </div>
      </div>

      {/* Content Info */}
      <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
            <span>LOT #{auction.id.toUpperCase()}</span>
            <span className="text-emerald-400 flex items-center gap-0.5">
              <ShieldCheck className="w-3 h-3" /> Certified Lot
            </span>
          </div>

          <Link href={`/auction/${auction.id}`} className="block group-hover:text-amber-300 transition-colors">
            <h3 className="font-serif font-bold text-slate-100 text-lg line-clamp-1 leading-snug">
              {auction.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {auction.description}
          </p>
        </div>

        {/* Pricing and Bid Stats */}
        <div className="pt-3.5 border-t border-amber-500/15">
          <div className="flex items-end justify-between mb-3.5">
            <div>
              <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 block">
                Current Hammer Bid
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-amber-400 font-mono tracking-tight">
                  {formatPrice(auction.currentBid)}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800/90 text-slate-200 font-mono border border-slate-700/60">
                <Gavel className="w-3 h-3 text-amber-400" />
                {auction.bidsCount} {auction.bidsCount === 1 ? 'Bid' : 'Bids'}
              </span>
              <div className="mt-1">
                {reserveMet ? (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center justify-end gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Reserve Met
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-slate-400">
                    Reserve: {formatPrice(auction.reservePrice, true)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Link
            href={`/auction/${auction.id}`}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/60 transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Enter Live Bidding Room</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
