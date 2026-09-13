'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AuctionItem } from '../types/auction';
import { useAuction } from '../context/AuctionContext';
import { CountdownTimer } from './CountdownTimer';
import { formatPKR } from '../utils/formatters';
import { Heart, Gavel, MapPin, Zap, CheckCircle2, ShieldCheck, Box, Video } from 'lucide-react';
import TiltCard3D from './TiltCard3D';

interface AuctionCardProps {
  auction: AuctionItem;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({ auction }) => {
  const { isWatched, toggleWatchlist, formatPrice } = useAuction();
  const watched = isWatched(auction.id);
  const reserveMet = auction.currentBid >= auction.reservePrice;

  return (
    <TiltCard3D className="h-full">
      <div className="group flex flex-col h-full bg-white rounded-3xl border border-slate-200 hover:border-amber-400/80 transition-all duration-500 hover:shadow-xl hover:shadow-amber-500/10 overflow-hidden">
        {/* Thumbnail & Badges Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
          <Image
            src={auction.images[0]}
            alt={auction.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          />

          {/* Gradient Shadow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

          {/* Live Timer Badge & 3D / Video indicator (Top Left) */}
          <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5 items-start">
            <CountdownTimer endTime={auction.endTime} compact />
            {auction.model3dType && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 shadow-md backdrop-blur-md uppercase tracking-wider">
                <Box className="w-3 h-3" /> 3D View
              </span>
            )}
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
                ? 'bg-red-500 text-white shadow-lg shadow-red-900/40 scale-105'
                : 'bg-black/50 text-white hover:text-amber-300 hover:bg-black/80'
            }`}
            title={watched ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            <Heart className={`w-4 h-4 ${watched ? 'fill-current' : ''}`} />
          </button>

          {/* Category & Condition Badges (Bottom of image) */}
          <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-[11px] font-semibold text-white pointer-events-none">
            <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-amber-400/40 text-amber-300 font-medium">
              {auction.category}
            </span>
            <span className="flex items-center gap-1 text-white bg-black/70 px-2.5 py-1 rounded-lg backdrop-blur-md text-[10px]">
              <MapPin className="w-3 h-3 text-amber-400" />
              {auction.seller.city}
            </span>
          </div>
        </div>

        {/* Content Info */}
        <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mb-1">
              <span>LOT #{auction.id.toUpperCase()}</span>
              <span className="text-emerald-700 flex items-center gap-0.5 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Certified Lot
              </span>
            </div>

            <Link href={`/auction/${auction.id}`} className="block group-hover:text-amber-700 transition-colors">
              <h3 className="font-serif font-bold text-slate-900 text-lg line-clamp-1 leading-snug">
                {auction.title}
              </h3>
            </Link>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
              {auction.description}
            </p>
          </div>

          {/* Pricing and Bid Stats */}
          <div className="pt-3.5 border-t border-slate-100">
            <div className="flex items-end justify-between mb-3.5">
              <div>
                <span className="text-[9px] uppercase font-black tracking-widest text-slate-500 block">
                  Current Hammer Bid
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-black text-amber-700 font-mono tracking-tight">
                    {formatPrice(auction.currentBid)}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-mono border border-slate-200">
                  <Gavel className="w-3 h-3 text-amber-600" />
                  {auction.bidsCount} {auction.bidsCount === 1 ? 'Bid' : 'Bids'}
                </span>
                <div className="mt-1">
                  {reserveMet ? (
                    <span className="text-[10px] font-bold text-emerald-700 flex items-center justify-end gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Reserve Met
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-500">
                      Reserve: {formatPrice(auction.reservePrice, true)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Link
              href={`/auction/${auction.id}`}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 hover:from-emerald-600 hover:to-teal-600 active:scale-[0.98] text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Enter Live Bidding Room</span>
            </Link>
          </div>
        </div>
      </div>
    </TiltCard3D>
  );
};
