'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuction } from '../context/AuctionContext';
import { AuctionCard } from '../components/AuctionCard';
import { CategoryPills } from '../components/CategoryPills';
import { CountdownTimer } from '../components/CountdownTimer';
import { Category, SortOption, FilterStatus } from '../types/auction';
import { formatPKR } from '../utils/formatters';
import { 
  Search, 
  Flame, 
  ArrowRight, 
  ShieldCheck, 
  Gavel, 
  Sparkles, 
  Clock, 
  Award,
  Lock,
  ChevronRight,
  Star,
  Quote,
  CheckCircle2,
  Building,
  Crown,
  Box,
  X
} from 'lucide-react';
import TiltCard3D from '../components/TiltCard3D';
import Model3DViewer from '../components/Model3DViewer';
import AnimatedMarketplaceShowcase from '../components/AnimatedMarketplaceShowcase';
import GSAPThreeHeroStage from '../components/GSAPThreeHeroStage';

export default function HomePage() {
  const { auctions, currency, formatPrice } = useAuction();

  const [heroMode, setHeroMode] = useState<'3d_stage' | 'spotlight'>('3d_stage');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [sortOption, setSortOption] = useState<SortOption>('ending_soonest');
  const [showSpotlight3DModal, setShowSpotlight3DModal] = useState(false);

  // Spotlight featured auction
  const spotlightAuction = useMemo(() => {
    return auctions.find((a) => a.id === 'auc-101') || auctions[0];
  }, [auctions]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: auctions.length };
    auctions.forEach((a) => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });
    return counts;
  }, [auctions]);

  // Filter and sort auctions
  const filteredAuctions = useMemo(() => {
    return auctions
      .filter((auction) => {
        if (selectedCategory !== 'All' && auction.category !== selectedCategory) {
          return false;
        }
        if (statusFilter === 'ending_soon' && auction.status !== 'ending_soon') {
          return false;
        }
        if (statusFilter === 'live' && auction.status !== 'live' && auction.status !== 'ending_soon') {
          return false;
        }
        if (statusFilter === 'closed' && auction.status !== 'closed') {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = auction.title.toLowerCase().includes(q);
          const matchDesc = auction.description.toLowerCase().includes(q);
          const matchCategory = auction.category.toLowerCase().includes(q);
          const matchCity = auction.seller.city.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCategory && !matchCity) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'ending_soonest') {
          return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
        }
        if (sortOption === 'bids_high') {
          return b.bidsCount - a.bidsCount;
        }
        if (sortOption === 'price_high') {
          return b.currentBid - a.currentBid;
        }
        if (sortOption === 'price_low') {
          return a.currentBid - b.currentBid;
        }
        if (sortOption === 'newest') {
          return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
        }
        return 0;
      });
  }, [auctions, selectedCategory, statusFilter, searchQuery, sortOption]);

  return (
    <div className="space-y-16 pb-20">
      {/* Majestic Royal Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/60 via-slate-50/50 to-white pt-12 pb-16 border-b border-slate-200">
        {/* Ambient Glows */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-amber-200/30 via-emerald-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-amber-300 text-amber-900 text-xs font-semibold shadow-sm">
                <Crown className="w-4 h-4 text-amber-600" />
                <span className="tracking-wide font-bold">Worldwide Premier Royal Auction Exchange</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-slate-900 leading-[1.15]">
                Where Rare Treasures Find Their <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700">Provenance.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal">
                Discover and acquire museum-grade antiques, certified horology, precious gems, bespoke vehicles, and landmark properties through competitive, fair-market bidding worldwide.
              </p>

              {/* Quick Trust Badges */}
              <div className="flex flex-wrap items-center gap-5 text-xs font-semibold text-slate-700 pt-1">
                <span className="flex items-center gap-1.5 text-amber-800">
                  <ShieldCheck className="w-4 h-4 text-amber-600" /> Bank & Global Escrow Protected
                </span>
                <span className="flex items-center gap-1.5 text-emerald-800">
                  <Clock className="w-4 h-4 text-emerald-600" /> 2-Min Anti-Sniping Soft Close
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Award className="w-4 h-4 text-amber-600" /> Worldwide Insured Logistics
                </span>
              </div>

              {/* Elegant Search Console */}
              <div className="pt-2">
                <div className="relative flex items-center max-w-xl rounded-2xl bg-white border border-slate-300 p-2 shadow-lg focus-within:border-amber-500 transition-all">
                  <Search className="w-5 h-5 text-amber-600 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Rolex, Mughal Astrolabe, FJ40, Gulberg Plot..."
                    className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-slate-500 hover:text-slate-900 px-2"
                    >
                      Clear
                    </button>
                  )}
                  <Link
                    href="#auction-grid"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shrink-0 transition-transform active:scale-95 shadow-md shadow-amber-950/20"
                  >
                    Search Lots
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Hero Spotlight or Live 3D GSAP Stage */}
            <div className="lg:col-span-6 space-y-3">
              {/* Hero View Switcher Pill */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 p-1 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm">
                  <button
                    onClick={() => setHeroMode('3d_stage')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      heroMode === '3d_stage'
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                    <span>🌟 2026 Live 3D Stage</span>
                  </button>
                  <button
                    onClick={() => setHeroMode('spotlight')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      heroMode === 'spotlight'
                        ? 'bg-slate-900 text-white shadow-md font-black'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Crown Lot #AUC-101</span>
                  </button>
                </div>

                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300 font-bold hidden sm:inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Three.js + GSAP 60FPS
                </span>
              </div>

              {heroMode === '3d_stage' ? (
                <GSAPThreeHeroStage initialArtifact="lamp" compact />
              ) : (
                spotlightAuction && (
                  <TiltCard3D maxAngle={5}>
                    <div className="relative rounded-3xl bg-gradient-to-tr from-amber-300/40 via-slate-200/60 to-emerald-300/40 p-[1.5px] shadow-xl">
                      <div className="bg-white rounded-[22px] p-6 sm:p-7 space-y-5 border border-slate-200">
                        {/* Header with Urgency & Lot Tag */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-black text-xs flex items-center gap-1.5 uppercase tracking-wider">
                              <Flame className="w-3.5 h-3.5 text-amber-600" /> Crown Lot
                            </span>
                            <span className="text-xs font-mono text-slate-500 font-semibold">LOT #{spotlightAuction.id.toUpperCase()}</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300">
                            {spotlightAuction.bidsCount} Bids Active
                          </span>
                        </div>

                        {/* Spotlight Image & Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                          <div className="relative sm:col-span-5 aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner group/thumb">
                            <Image
                              src={spotlightAuction.images[0]}
                              alt={spotlightAuction.title}
                              fill
                              className="object-cover"
                            />
                            {spotlightAuction.model3dType && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setShowSpotlight3DModal(true);
                                }}
                                className="absolute inset-x-2 bottom-2 py-1.5 px-2.5 rounded-xl bg-amber-500 text-slate-950 text-[11px] font-bold flex items-center justify-center gap-1 shadow-md hover:bg-amber-400 transition-colors backdrop-blur-sm"
                              >
                                <Box className="w-3.5 h-3.5" />
                                <span>Inspect in 3D</span>
                              </button>
                            )}
                          </div>

                          <div className="sm:col-span-7 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                                {spotlightAuction.category}
                              </div>
                              {spotlightAuction.model3dType && (
                                <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1 font-mono font-bold">
                                  <Box className="w-3 h-3" /> 360° Mesh
                                </span>
                              )}
                            </div>
                            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 line-clamp-2 leading-snug">
                              {spotlightAuction.title}
                            </h2>
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                              {spotlightAuction.description}
                            </p>

                            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                              <span>Consignor:</span>
                              <span className="font-bold text-slate-800">{spotlightAuction.seller.name}</span>
                              <span>•</span>
                              <span className="text-amber-700 font-semibold">{spotlightAuction.seller.city}</span>
                            </div>
                          </div>
                        </div>

                        {/* Live Hammer Price & Ticking Countdown */}
                        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 items-end bg-slate-50 p-4.5 rounded-2xl border border-slate-200">
                          <div>
                            <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">
                              Current Hammer Price ({currency})
                            </span>
                            <div className="text-3xl font-black text-amber-700 font-mono tracking-tight mt-0.5">
                              {formatPrice(spotlightAuction.currentBid)}
                            </div>
                            <span className="text-[11px] text-emerald-700 font-semibold">
                              Next Min Increment: +{formatPrice(spotlightAuction.minIncrement)}
                            </span>
                          </div>

                          <div className="sm:text-right">
                            <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 block mb-1">
                              Time Left To Bid
                            </span>
                            <div className="inline-block sm:float-right">
                              <CountdownTimer endTime={spotlightAuction.endTime} showLabels={false} />
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                          {spotlightAuction.model3dType && (
                            <button
                              type="button"
                              onClick={() => setShowSpotlight3DModal(true)}
                              className="sm:col-span-5 flex items-center justify-center gap-1.5 py-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-amber-900 border border-amber-300 font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
                            >
                              <Box className="w-4 h-4 text-amber-600" />
                              <span>3D Inspect</span>
                            </button>
                          )}
                          <Link
                            href={`/auction/${spotlightAuction.id}`}
                            className={`${
                              spotlightAuction.model3dType ? 'sm:col-span-7' : 'sm:col-span-12'
                            } flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-transform active:scale-[0.98]`}
                          >
                            <Gavel className="w-4 h-4" />
                            <span>Enter Bidding Room</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </TiltCard3D>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Prestige Stats Ticker Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            <div className="pt-3 lg:pt-0">
              <div className="text-2xl sm:text-3xl font-black font-mono text-amber-700">
                {currency === 'USD' ? '$18.5M+' : currency === 'PKR' ? '₨ 4.8B+' : formatPrice(4800000000, true) + '+'}
              </div>
              <p className="text-xs uppercase tracking-wider text-slate-500 mt-1 font-semibold">Global Hammer Volume</p>
            </div>

            <div className="pt-3 lg:pt-0">
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-700">100% Insured</div>
              <p className="text-xs uppercase tracking-wider text-slate-500 mt-1 font-semibold">Escrow Bank Guarantee</p>
            </div>

            <div className="pt-3 lg:pt-0">
              <div className="text-2xl sm:text-3xl font-black font-mono text-amber-700">14,200+ Lots</div>
              <p className="text-xs uppercase tracking-wider text-slate-500 mt-1 font-semibold">Certified Antiquities & Goods</p>
            </div>

            <div className="pt-3 lg:pt-0">
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-700">140+ Countries</div>
              <p className="text-xs uppercase tracking-wider text-slate-500 mt-1 font-semibold">Global Bidders & Collectors</p>
            </div>
          </div>
        </div>
      </section>

      {/* Royal 3D Interactive Exhibition Vault (Awwwards 2026 GSAP + Three.js Showcase) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 text-amber-950 border border-amber-300 text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>GSAP + Three.js • Awwwards 2026 Exhibition</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight">
            Touch, Orbit & Experience Crown Antiquities in 3D WebGL
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-normal">
            Interact with 24-karat gold repousse craftsmanship, test the magic lamp with particle bursts, rotate certified horological movements, and inspect gemstone refractions in real-time.
          </p>
        </div>

        <GSAPThreeHeroStage initialArtifact="crown" />
      </section>

      {/* Animated Motion Video Experience for Bidders & Sellers */}
      <AnimatedMarketplaceShowcase />

      {/* Main Auction Listings Container */}
      <div id="auction-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Categories Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>Explore Curated Auction Lots</span>
            </h2>
            <span className="text-xs text-amber-900 font-mono font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-300">
              {filteredAuctions.length} Active Lots In Pakistan
            </span>
          </div>
          <CategoryPills
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categoryCounts={categoryCounts}
          />
        </div>

        {/* Filters and Sorting Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                statusFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setStatusFilter('ending_soon')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                statusFilter === 'ending_soon'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-amber-800 hover:bg-amber-50'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              Ending Soon
            </button>
            <button
              onClick={() => setStatusFilter('live')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                statusFilter === 'live'
                  ? 'bg-emerald-700 text-white font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Active Bidding
            </button>
            <button
              onClick={() => setStatusFilter('closed')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                statusFilter === 'closed'
                  ? 'bg-red-700 text-white font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Past / Closed
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
            <span className="text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="bg-slate-50 text-slate-800 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-400 font-semibold shadow-sm"
            >
              <option value="ending_soonest">Ending Soonest</option>
              <option value="bids_high">Most Bids</option>
              <option value="price_high">Price: High to Low</option>
              <option value="price_low">Price: Low to High</option>
              <option value="newest">Newly Listed</option>
            </select>
          </div>
        </div>

        {/* Auctions Grid */}
        {filteredAuctions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4 bg-slate-50 rounded-3xl border border-dashed border-slate-300 space-y-3">
            <Gavel className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-serif font-bold text-slate-800">No matching auctions found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your category filter, keyword search, or status selection.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-semibold text-slate-800"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Grateful Collectors & Consignors (Gratitude & Trust Section) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8 sm:p-12 space-y-10 shadow-sm">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-600" /> A Platform Built on Gratitude & Trust
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Words from Our Collectors & Consignors
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Thousands of successful bidding wars and consignments across Lahore, Karachi, Islamabad, and beyond.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 relative shadow-sm">
              <Quote className="w-8 h-8 text-amber-400/20 absolute top-4 right-4" />
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Consigning our ancestral 18th-century Mughal astrolabe with Neelami.com achieved 180% of our reserve price. The escrow settlement through Lahore bank trust gave our family absolute peace of mind."
              </p>
              <div className="pt-2 border-t border-slate-100">
                <div className="font-bold text-slate-900 text-xs">Malik Salman Qureshi</div>
                <div className="text-[11px] text-amber-700 font-semibold">Art & Antique Consignor • Lahore</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 relative shadow-sm">
              <Quote className="w-8 h-8 text-amber-400/20 absolute top-4 right-4" />
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Winning my grail 1968 Rolex Submariner was thrilling! The anti-sniping protection made the bidding war completely fair, and the armored escort delivery to Clifton, Karachi arrived with full authentication papers."
              </p>
              <div className="pt-2 border-t border-slate-100">
                <div className="font-bold text-slate-900 text-xs">Dr. Ayesha Siddiqui</div>
                <div className="text-[11px] text-amber-700 font-semibold">Horology Collector • Karachi</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 relative shadow-sm">
              <Quote className="w-8 h-8 text-amber-400/20 absolute top-4 right-4" />
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Neelami has modernized how high-value commercial properties are traded in Pakistan. Clear title verification and transparent bids eliminated the usual middlemen chaos for our Gulberg III land acquisition."
              </p>
              <div className="pt-2 border-t border-slate-100">
                <div className="font-bold text-slate-900 text-xs">Chaudhry Bilal Tariq</div>
                <div className="text-[11px] text-amber-700 font-semibold">Real Estate Investor • Islamabad</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Bidding Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              The Neelami Auction Standard
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Strict authenticity protocols, transparent live counters, and guaranteed escrow protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center font-black font-mono text-lg">
                1
              </div>
              <h3 className="font-serif font-bold text-slate-900 text-base">Appraisal & Consignment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every lot undergoes rigorous inspection by certified gemologists, horologists, and antique appraisers before entering the exchange.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-black font-mono text-lg">
                2
              </div>
              <h3 className="font-serif font-bold text-slate-900 text-base">Anti-Sniping Live Bids</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bids placed within the final 2 minutes trigger an automatic 2-minute clock extension, guaranteeing every genuine collector a fair counter-opportunity.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 border border-blue-300 flex items-center justify-center font-black font-mono text-lg">
                3
              </div>
              <h3 className="font-serif font-bold text-slate-900 text-base">Insured Bank Escrow</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Funds remain secured in regulated escrow trust until the winning bidder receives, inspects, and approves their acquisition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Royal Consignment Invitation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-50/70 via-white to-emerald-50/70 border border-amber-200 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-800 font-bold flex items-center gap-1.5 justify-center md:justify-start">
              <Crown className="w-4 h-4 text-amber-600" /> Consign With Neelami Royal Exchange
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Have Rare Assets or Collections to Auction in Pakistan?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-normal">
              Connect directly with high-net-worth collectors and investors across Karachi, Lahore, and Islamabad. Achieve maximum hammer value with complete discretion.
            </p>
          </div>

          <Link
            href="/sell"
            className="shrink-0 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg flex items-center gap-2 transition-transform active:scale-95"
          >
            <span>Submit a Consignment</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Homepage 3D Inspection Modal */}
      {showSpotlight3DModal && spotlightAuction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-gradient-to-b from-neutral-900 to-neutral-950 rounded-3xl border border-amber-500/40 p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Box className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                    Interactive 3D Virtual Vault
                  </span>
                  <h3 className="font-serif font-bold text-white text-lg line-clamp-1">
                    {spotlightAuction.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowSpotlight3DModal(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
                title="Close Viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3D Model Canvas */}
            <Model3DViewer
              modelType={spotlightAuction.model3dType || 'watch'}
              title={spotlightAuction.title}
            />

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-neutral-800 text-xs">
              <span className="text-neutral-400">
                Touch or drag to rotate 360° • Zoom to inspect surface craftsmanship
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowSpotlight3DModal(false)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-neutral-700 text-neutral-300 hover:bg-neutral-800 font-semibold"
                >
                  Close
                </button>
                <Link
                  href={`/auction/${spotlightAuction.id}`}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-neutral-950 font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-amber-950/60"
                >
                  <Gavel className="w-4 h-4" /> Place Bid Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
