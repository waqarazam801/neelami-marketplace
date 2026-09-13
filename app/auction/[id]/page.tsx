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
  ShoppingBag,
  Camera,
  Box,
  Video
} from 'lucide-react';
import Model3DViewer from '../../../components/Model3DViewer';
import VideoWalkthrough from '../../../components/VideoWalkthrough';

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

  const [mediaMode, setMediaMode] = useState<'photos' | '3d' | 'video'>('photos');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 bg-white min-h-screen">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-emerald-700 font-semibold flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> All Auctions
          </Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">{auction.category}</span>
          <span>/</span>
          <span className="text-slate-500 font-mono">LOT #{auction.id}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-sm transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied!' : 'Share Lot'}</span>
          </button>

          <button
            onClick={() => toggleWatchlist(auction.id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-colors shadow-sm ${
              watched
                ? 'bg-red-50 text-red-600 border-red-300'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
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
          {/* Interactive Media Switcher Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto shadow-sm">
            <button
              onClick={() => setMediaMode('photos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                mediaMode === 'photos'
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Photos ({auction.images.length})</span>
            </button>

            <button
              onClick={() => setMediaMode('3d')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                mediaMode === '3d'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-600 hover:text-amber-800 hover:bg-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D Model (360°)</span>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-full border border-amber-300">
                Interactive
              </span>
            </button>

            <button
              onClick={() => setMediaMode('video')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                mediaMode === 'video'
                  ? 'bg-cyan-700 text-white shadow-md'
                  : 'text-slate-600 hover:text-cyan-800 hover:bg-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>4K Walkthrough</span>
              <span className="text-[10px] bg-cyan-100 text-cyan-900 px-1.5 py-0.5 rounded-full border border-cyan-300">
                HD Video
              </span>
            </button>
          </div>

          {/* Media Viewport Container */}
          {mediaMode === '3d' ? (
            <Model3DViewer
              modelType={auction.model3dType || 'watch'}
              title={auction.title}
            />
          ) : mediaMode === 'video' ? (
            <VideoWalkthrough
              videoUrl={auction.videoUrl}
              title={auction.title}
              posterUrl={auction.images[0]}
            />
          ) : (
            <>
              {/* Main Photo Viewer */}
              <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md">
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
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-slate-200 text-xs">
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
                          ? 'border-emerald-600 scale-105 shadow-md'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Product Overview & Description */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">About this Lot</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {auction.description}
            </p>

            {/* Seller Bar */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  {auction.seller.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-900">{auction.seller.name}</span>
                    {auction.seller.verified && (
                      <span className="flex items-center gap-0.5 text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Consignor
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>★ {auction.seller.rating} Rating</span>
                    <span>•</span>
                    <span>{auction.seller.salesCount} Completed Sales</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3 text-amber-600" /> {auction.seller.city}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Info Tabs: Live Bids, Specs, Shipping */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <button
                onClick={() => setActiveTab('bids')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'bids'
                    ? 'bg-emerald-700 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Live Bid History ({auction.bidsCount})
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'specs'
                    ? 'bg-emerald-700 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Specifications & Appraisal
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'shipping'
                    ? 'bg-emerald-700 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Shipping & Escrow
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'bids' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Latest Bidding Stream</span>
                  <span className="font-mono text-emerald-700 font-bold">Auto-Refreshes Live</span>
                </div>
                <LiveBidFeed bids={auction.bids} currentBid={auction.currentBid} />
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {Object.entries(auction.specifications || {}).map(([key, value]) => (
                  <div key={key} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                    <span className="text-slate-500 font-medium">{key}:</span>
                    <span className="font-semibold text-slate-900 text-right">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block">Dispatch Location:</span>
                    <span className="text-slate-900 font-bold text-sm mt-0.5">{auction.shippingInfo.city}, Pakistan</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block">Insured Courier Fee:</span>
                    <span className="text-slate-900 font-bold text-sm mt-0.5">
                      {auction.shippingInfo.cost === 0 ? 'Complimentary Delivery' : formatPrice(auction.shippingInfo.cost)}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block">Estimated Delivery:</span>
                    <span className="text-slate-900 font-bold text-sm mt-0.5">{auction.shippingInfo.estimatedDays}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block">Local In-Person Pickup:</span>
                    <span className="text-emerald-700 font-bold text-sm mt-0.5">
                      {auction.shippingInfo.pickupAvailable ? 'Available upon appointment' : 'Courier delivery only'}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 leading-relaxed space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Neelami Company Escrow Rule:</span>
                  </div>
                  <p className="text-xs text-slate-700">
                    Winning buyers pay <strong>Neelami.com (The Company)</strong> directly, NEVER the seller ({auction.seller.name}) personally. The company holds your funds in bank trust and only pays the seller after you receive and sign the physical inspection handover slip.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Bidding Command Console */}
        <div className="lg:col-span-5 space-y-6 sticky top-20">
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xl shadow-slate-200/50 space-y-6">
            {/* Lot Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  {auction.category}
                </span>
                <span className="text-xs font-mono text-slate-500">LOT #{auction.id.toUpperCase()}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 leading-tight">
                {auction.title}
              </h1>
            </div>

            {/* Countdown Clock Panel */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" /> Time Remaining
                </span>
                {timeRemaining.totalSeconds <= 120 && !timeRemaining.isExpired && (
                  <span className="text-xs font-bold text-red-600 flex items-center gap-1 animate-pulse">
                    <Flame className="w-3.5 h-3.5" /> Anti-Sniping Active
                  </span>
                )}
              </div>
              <CountdownTimer endTime={auction.endTime} onExpire={() => setIsWinnerModalOpen(true)} />
            </div>

            {/* Current Price & Reserve Details */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Current Highest Bid ({currency})
                  </span>
                  <div className="text-3xl font-black text-amber-700 font-mono mt-0.5">
                    {formatPrice(auction.currentBid)}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Total Bids
                  </span>
                  <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">
                    {auction.bidsCount}
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600">Starting Bid: {formatPrice(auction.startingBid)}</span>
                {reserveMet ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Reserve Met
                  </span>
                ) : (
                  <span className="text-amber-800 font-medium">
                    Reserve: {formatPrice(auction.reservePrice)}
                  </span>
                )}
              </div>

              {/* High Bidder Indicator */}
              {isCurrentUserHighestBidder && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>You are currently the highest bidder on this lot!</span>
                </div>
              )}
            </div>

            {/* Bidding Controls Form */}
            {timeRemaining.isExpired || auction.status === 'closed' ? (
              <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">This Auction Has Closed</h4>
                <p className="text-xs text-slate-600">The hammer has dropped. Winner: {auction.winnerName || auction.bids[0]?.bidderName || 'N/A'}.</p>
              </div>
            ) : (
              <form onSubmit={handlePlaceBid} className="space-y-4">
                {/* Quick Bid Increment Buttons */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-2">
                    Quick Bid Increments (Min Increment: +{formatPrice(auction.minIncrement)})
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickBid(1)}
                      className="py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-800 transition-colors"
                    >
                      +{formatPrice(auction.minIncrement, true)}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickBid(2)}
                      className="py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-800 transition-colors"
                    >
                      +{formatPrice(auction.minIncrement * 2, true)}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickBid(5)}
                      className="py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-800 transition-colors"
                    >
                      +{formatPrice(auction.minIncrement * 5, true)}
                    </button>
                  </div>
                </div>

                {/* Custom Bid Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Or Enter Custom Bid (Base ₨ PKR)
                    </label>
                    <span className="text-[11px] text-emerald-700 font-mono font-semibold">
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
                      className="w-full bg-white border border-slate-300 rounded-xl pl-8 pr-4 py-3 text-slate-900 text-base font-mono font-bold focus:outline-none focus:border-emerald-600 transition-colors shadow-inner"
                    />
                  </div>

                  {bidError && (
                    <p className="text-xs font-semibold text-red-600 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {bidError}
                    </p>
                  )}
                </div>

                {/* Place Bid Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-black text-sm shadow-xl shadow-emerald-700/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Gavel className="w-4 h-4" />
                  <span>
                    Place Bid of {formatPrice(typeof customBidAmount === 'number' && customBidAmount > 0 ? customBidAmount : minRequiredBid)}
                  </span>
                </button>

                {/* Buy It Now Option */}
                {auction.buyNowPrice && (
                  <div className="pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Buy It Now for {formatPrice(auction.buyNowPrice)}</span>
                    </button>
                    <p className="text-[10px] text-slate-500 text-center mt-1">
                      Skip the auction and purchase this lot immediately.
                    </p>
                  </div>
                )}
              </form>
            )}

            {/* Live Testing Simulation Toggle */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="font-bold text-slate-800 block">Simulate Live Competitors</span>
                <span className="text-[10px] text-slate-500">Receive realistic counter-bids automatically</span>
              </div>
              <button
                type="button"
                onClick={() => setIsSimulationActive(!isSimulationActive)}
                className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors border ${
                  isSimulationActive
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-slate-200 text-slate-700 border-slate-300'
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
