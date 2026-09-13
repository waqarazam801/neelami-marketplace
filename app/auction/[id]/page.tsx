'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuction } from '../../../context/AuctionContext';
import { AuctionItem } from '../../../types/auction';
import { CountdownTimer } from '../../../components/CountdownTimer';
import { LiveBidFeed } from '../../../components/LiveBidFeed';
import { WinnerModal } from '../../../components/WinnerModal';
import { formatPKR, getTimeRemaining } from '../../../utils/formatters';
import { playBidChime, playGavelStrike } from '../../../utils/sound';
import { 
  Heart, 
  Share2, 
  ShieldCheck, 
  Gavel, 
  Clock, 
  MapPin, 
  Truck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft,
  Flame,
  Zap,
  Radio,
  FileCheck,
  ShoppingBag
} from 'lucide-react';

export default function AuctionRoomPage() {
  const params = useParams();
  const router = useRouter();
  const auctionId = params.id as string;

  const { 
    auctions, 
    currentUser, 
    placeBid, 
    buyItNow, 
    isWatched, 
    toggleWatchlist,
    isSimulationActive,
    setIsSimulationActive,
    currency,
    formatPrice
  } = useAuction();

  // Find auction item
  const auction = useMemo(() => {
    return auctions.find((a: AuctionItem) => a.id === auctionId);
  }, [auctions, auctionId]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'bids' | 'specs' | 'shipping'>('bids');
  const [customBidAmount, setCustomBidAmount] = useState<number | ''>('');
  const [bidError, setBidError] = useState<string>('');
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!auction) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-4">
        <Gavel className="w-16 h-16 text-slate-600 mx-auto" />
        <h1 className="text-2xl font-bold text-white">Auction Lot Not Found</h1>
        <p className="text-sm text-slate-400">The auction you are looking for may have expired or been removed.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Marketplace
        </Link>
      </div>
    );
  }

  const timeRemaining = getTimeRemaining(auction.endTime);
  const minRequiredBid = auction.currentBid + auction.minIncrement;
  const watched = isWatched(auction.id);
  const reserveMet = auction.currentBid >= auction.reservePrice;
  const isCurrentUserHighestBidder = 
    auction.bids.length > 0 && auction.bids[0].bidderId === currentUser.id;

  // Handle Quick Increments
  const handleQuickBid = (incrementMulti: number) => {
    const targetAmount = auction.currentBid + auction.minIncrement * incrementMulti;
    setCustomBidAmount(targetAmount);
    setBidError('');
  };

  // Submit Bid
  const handlePlaceBid = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setBidError('');

    const bidToPlace = typeof customBidAmount === 'number' && customBidAmount > 0 
      ? customBidAmount 
      : minRequiredBid;

    if (bidToPlace < minRequiredBid) {
      setBidError(`Bid must be at least ${formatPrice(minRequiredBid)}.`);
      return;
    }

    const result = placeBid(auction.id, bidToPlace);
    if (!result.success) {
      setBidError(result.message);
    } else {
      setCustomBidAmount('');
      playBidChime();
    }
  };

  // Handle Buy Now
  const handleBuyNow = () => {
    if (!auction.buyNowPrice) return;
    if (window.confirm(`Confirm immediate purchase of "${auction.title}" for ${formatPrice(auction.buyNowPrice)}?`)) {
      const result = buyItNow(auction.id);
      if (result.success) {
        playGavelStrike();
        setIsWinnerModalOpen(true);
      }
    }
  };

  // Share link handler
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-emerald-400 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> All Auctions
          </Link>
          <span>/</span>
          <span className="text-slate-300">{auction.category}</span>
          <span>/</span>
          <span className="text-slate-500 font-mono">LOT #{auction.id}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied!' : 'Share Lot'}</span>
          </button>

          <button
            onClick={() => toggleWatchlist(auction.id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-colors ${
              watched
                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${watched ? 'fill-current' : ''}`} />
            <span>{watched ? 'Watching' : 'Add to Watchlist'}</span>
          </button>
        </div>
      </div>

      {/* Main Auction Room Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Gallery & Lot Description */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Photo Viewer */}
          <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
            <Image
              src={auction.images[selectedImageIndex] || auction.images[0]}
              alt={auction.title}
              fill
              priority
              className="object-cover"
            />

            {/* Live Status Badge overlay */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-emerald-400 font-bold text-xs flex items-center gap-1.5 shadow">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                LIVE BIDDING
              </span>
              <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-slate-300 text-xs">
                {auction.condition}
              </span>
            </div>
          </div>

          {/* Thumbnails */}
          {auction.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {auction.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-emerald-500 scale-105 shadow-md shadow-emerald-950/50'
                      : 'border-slate-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Product Overview & Description */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-slate-100">About this Lot</h2>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {auction.description}
            </p>

            {/* Seller Bar */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  {auction.seller.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-200">{auction.seller.name}</span>
                    {auction.seller.verified && (
                      <span className="flex items-center gap-0.5 text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                        <ShieldCheck className="w-3 h-3" /> Verified Consignor
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>★ {auction.seller.rating} Rating</span>
                    <span>•</span>
                    <span>{auction.seller.salesCount} Completed Sales</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {auction.seller.city}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Info Tabs: Live Bids, Specs, Shipping */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab('bids')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'bids'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Live Bid History ({auction.bidsCount})
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'specs'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Specifications & Appraisal
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'shipping'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Shipping & Escrow
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'bids' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Latest Bidding Stream</span>
                  <span className="font-mono text-emerald-400">Auto-Refreshes Live</span>
                </div>
                <LiveBidFeed bids={auction.bids} currentBid={auction.currentBid} />
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {Object.entries(auction.specifications || {}).map(([key, value]) => (
                  <div key={key} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                    <span className="text-slate-400">{key}:</span>
                    <span className="font-semibold text-slate-200 text-right">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block">Dispatch Location:</span>
                    <span className="text-slate-200 font-bold text-sm mt-0.5">{auction.shippingInfo.city}, Pakistan</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block">Insured Courier Fee:</span>
                    <span className="text-slate-200 font-bold text-sm mt-0.5">
                      {auction.shippingInfo.cost === 0 ? 'Complimentary Delivery' : formatPrice(auction.shippingInfo.cost)}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block">Estimated Delivery:</span>
                    <span className="text-slate-200 font-bold text-sm mt-0.5">{auction.shippingInfo.estimatedDays}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block">Local In-Person Pickup:</span>
                    <span className="text-emerald-400 font-bold text-sm mt-0.5">
                      {auction.shippingInfo.pickupAvailable ? 'Available upon appointment' : 'Courier delivery only'}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 leading-relaxed space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Neelami Company Escrow Rule:</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Winning buyers pay <strong>Neelami.com (The Company)</strong> directly, NEVER the seller ({auction.seller.name}) personally. The company holds your funds in bank trust and only pays the seller after you receive and sign the physical inspection handover slip.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Bidding Command Console */}
        <div className="lg:col-span-5 space-y-6 sticky top-20">
          <div className="rounded-3xl bg-gradient-to-b from-[#0C172E] via-[#0A1326] to-[#060D1A] border border-amber-500/30 p-6 sm:p-7 shadow-2xl shadow-black/80 space-y-6">
            {/* Lot Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {auction.category}
                </span>
                <span className="text-xs font-mono text-slate-400">LOT #{auction.id.toUpperCase()}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">
                {auction.title}
              </h1>
            </div>

            {/* Countdown Clock Panel */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Time Remaining
                </span>
                {timeRemaining.totalSeconds <= 120 && !timeRemaining.isExpired && (
                  <span className="text-xs font-bold text-red-400 flex items-center gap-1 animate-pulse">
                    <Flame className="w-3.5 h-3.5" /> Anti-Sniping Active
                  </span>
                )}
              </div>
              <CountdownTimer endTime={auction.endTime} onExpire={() => setIsWinnerModalOpen(true)} />
            </div>

            {/* Current Price & Reserve Details */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Current Highest Bid ({currency})
                  </span>
                  <div className="text-3xl font-black text-amber-400 font-mono mt-0.5">
                    {formatPrice(auction.currentBid)}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Total Bids
                  </span>
                  <div className="text-xl font-bold text-slate-200 font-mono mt-0.5">
                    {auction.bidsCount}
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Starting Bid: {formatPrice(auction.startingBid)}</span>
                {reserveMet ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Reserve Met
                  </span>
                ) : (
                  <span className="text-amber-400/90 font-medium">
                    Reserve: {formatPrice(auction.reservePrice)}
                  </span>
                )}
              </div>

              {/* High Bidder Indicator */}
              {isCurrentUserHighestBidder && (
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>You are currently the highest bidder on this lot!</span>
                </div>
              )}
            </div>

            {/* Bidding Controls Form */}
            {timeRemaining.isExpired || auction.status === 'closed' ? (
              <div className="p-5 rounded-2xl bg-red-950/30 border border-red-900/40 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
                <h4 className="font-bold text-white text-sm">This Auction Has Closed</h4>
                <p className="text-xs text-slate-400">The hammer has dropped. Winner: {auction.winnerName || auction.bids[0]?.bidderName || 'N/A'}.</p>
              </div>
            ) : (
              <form onSubmit={handlePlaceBid} className="space-y-4">
                {/* Quick Bid Increment Buttons */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    Quick Bid Increments (Min Increment: +{formatPrice(auction.minIncrement)})
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickBid(1)}
                      className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-colors"
                    >
                      +{formatPrice(auction.minIncrement, true)}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickBid(2)}
                      className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-colors"
                    >
                      +{formatPrice(auction.minIncrement * 2, true)}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickBid(5)}
                      className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-colors"
                    >
                      +{formatPrice(auction.minIncrement * 5, true)}
                    </button>
                  </div>
                </div>

                {/* Custom Bid Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Or Enter Custom Bid (Base ₨ PKR)
                    </label>
                    <span className="text-[11px] text-emerald-400 font-mono">
                      Min: {formatPrice(minRequiredBid)}
                    </span>
                  </div>

                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                      ₨
                    </span>
                    <input
                      type="number"
                      value={customBidAmount}
                      onChange={(e) => {
                        setCustomBidAmount(e.target.value ? Number(e.target.value) : '');
                        setBidError('');
                      }}
                      placeholder={minRequiredBid.toString()}
                      min={minRequiredBid}
                      step={auction.minIncrement}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-4 py-3 text-white text-base font-mono font-bold focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  {bidError && (
                    <p className="text-xs font-semibold text-red-400 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {bidError}
                    </p>
                  )}
                </div>

                {/* Place Bid Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-sm shadow-xl shadow-emerald-950/60 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Gavel className="w-4 h-4" />
                  <span>
                    Place Bid of {formatPrice(typeof customBidAmount === 'number' && customBidAmount > 0 ? customBidAmount : minRequiredBid)}
                  </span>
                </button>

                {/* Buy It Now Option */}
                {auction.buyNowPrice && (
                  <div className="pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Buy It Now for {formatPrice(auction.buyNowPrice)}</span>
                    </button>
                    <p className="text-[10px] text-slate-400 text-center mt-1">
                      Skip the auction and purchase this lot immediately.
                    </p>
                  </div>
                )}
              </form>
            )}

            {/* Live Testing Simulation Toggle */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs bg-slate-950/40 p-3 rounded-xl">
              <div>
                <span className="font-bold text-slate-300 block">Simulate Live Competitors</span>
                <span className="text-[10px] text-slate-400">Receive realistic counter-bids automatically</span>
              </div>
              <button
                type="button"
                onClick={() => setIsSimulationActive(!isSimulationActive)}
                className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors border ${
                  isSimulationActive
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-700'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {isSimulationActive ? 'Active ●' : 'Paused ○'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Winner Modal */}
      <WinnerModal
        auction={auction}
        isOpen={isWinnerModalOpen}
        onClose={() => setIsWinnerModalOpen(false)}
        winnerName={currentUser.name}
      />
    </div>
  );
}
