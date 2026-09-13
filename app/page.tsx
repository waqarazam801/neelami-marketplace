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
  Crown
} from 'lucide-react';

export default function HomePage() {
  const { auctions } = useAuction();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [sortOption, setSortOption] = useState<SortOption>('ending_soonest');

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
      <section className="relative overflow-hidden bg-gradient-to-b from-[#060D1D] via-[#081226] to-[#050A14] pt-12 pb-16 border-b border-amber-500/20">
        {/* Ambient Glows */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-amber-500/15 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0D182E] border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-lg shadow-amber-950/20">
                <Crown className="w-4 h-4 text-amber-400" />
                <span className="tracking-wide">Pakistan’s Premier Royal Auction Exchange</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white leading-[1.15]">
                Where Rare Treasures Find Their <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">Provenance.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl font-light">
                Discover and acquire museum-grade Mughal antiques, certified horology, precious gems, bespoke vehicles, and landmark properties through competitive, fair-market bidding in Pakistan.
              </p>

              {/* Quick Trust Badges */}
              <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-slate-300 pt-1">
                <span className="flex items-center gap-1.5 text-amber-300">
                  <ShieldCheck className="w-4 h-4 text-amber-400" /> Bank Escrow Protected
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Clock className="w-4 h-4 text-emerald-400" /> 2-Min Anti-Sniping Soft Close
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Award className="w-4 h-4 text-amber-400" /> 100% Certified Genuine
                </span>
              </div>

              {/* Elegant Search Console */}
              <div className="pt-2">
                <div className="relative flex items-center max-w-xl rounded-2xl bg-[#0B152A] border border-amber-500/30 p-2 shadow-2xl shadow-black focus-within:border-amber-400 transition-all">
                  <Search className="w-5 h-5 text-amber-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Rolex, Mughal Astrolabe, FJ40, Gulberg Plot..."
                    className="w-full bg-transparent px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-slate-400 hover:text-white px-2"
                    >
                      Clear
                    </button>
                  )}
                  <Link
                    href="#auction-grid"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shrink-0 transition-transform active:scale-95 shadow-md shadow-amber-950"
                  >
                    Search Lots
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Hero Spotlight Showcase */}
            {spotlightAuction && (
              <div className="lg:col-span-6">
                <div className="relative rounded-3xl bg-gradient-to-tr from-amber-500/30 via-slate-800/60 to-emerald-500/30 p-[1.5px] shadow-2xl shadow-amber-500/10">
                  <div className="bg-[#081020] rounded-[22px] p-6 sm:p-7 space-y-5">
                    {/* Header with Urgency & Lot Tag */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-black text-xs flex items-center gap-1.5 uppercase tracking-wider">
                          <Flame className="w-3.5 h-3.5 text-amber-400" /> Crown Lot
                        </span>
                        <span className="text-xs font-mono text-slate-400">LOT #{spotlightAuction.id.toUpperCase()}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/60">
                        {spotlightAuction.bidsCount} Bids Active
                      </span>
                    </div>

                    {/* Spotlight Image & Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                      <div className="relative sm:col-span-5 aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-amber-500/20 shadow-inner">
                        <Image
                          src={spotlightAuction.images[0]}
                          alt={spotlightAuction.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="sm:col-span-7 space-y-2.5">
                        <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                          {spotlightAuction.category}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-white line-clamp-2 leading-snug">
                          {spotlightAuction.title}
                        </h2>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {spotlightAuction.description}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                          <span>Consignor:</span>
                          <span className="font-bold text-slate-200">{spotlightAuction.seller.name}</span>
                          <span>•</span>
                          <span className="text-amber-400 font-semibold">{spotlightAuction.seller.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Live Hammer Price & Ticking Countdown */}
                    <div className="pt-4 border-t border-amber-500/15 grid grid-cols-1 sm:grid-cols-2 gap-4 items-end bg-[#0B152A]/80 p-4.5 rounded-2xl border border-amber-500/20">
                      <div>
                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                          Current Hammer Price (PKR)
                        </span>
                        <div className="text-3xl font-black text-amber-400 font-mono tracking-tight mt-0.5">
                          {formatPKR(spotlightAuction.currentBid)}
                        </div>
                        <span className="text-[11px] text-emerald-400 font-medium">
                          Next Min Increment: +{formatPKR(spotlightAuction.minIncrement)}
                        </span>
                      </div>

                      <div className="sm:text-right">
                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block mb-1">
                          Time Left To Bid
                        </span>
                        <div className="inline-block sm:float-right">
                          <CountdownTimer endTime={spotlightAuction.endTime} showLabels={false} />
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <Link
                      href={`/auction/${spotlightAuction.id}`}
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-950/60 transition-transform active:scale-[0.98]"
                    >
                      <Gavel className="w-4 h-4" />
                      <span>Enter Live Bidding Room</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Prestige Stats Ticker Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#0C172E] via-[#0E1A34] to-[#0C172E] border border-amber-500/20 p-6 sm:p-8 shadow-2xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-amber-500/10">
            <div className="pt-3 lg:pt-0">
              <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400">₨ 4.8 Billion+</div>
              <p className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">Total Hammer Volume</p>
            </div>

            <div className="pt-3 lg:pt-0">
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">100% Insured</div>
              <p className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">Escrow Bank Guarantee</p>
            </div>

            <div className="pt-3 lg:pt-0">
              <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400">14,200+ Lots</div>
              <p className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">Certified Antiquities & Goods</p>
            </div>

            <div className="pt-3 lg:pt-0">
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">50,000+</div>
              <p className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">Verified Pakistani Bidders</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Auction Listings Container */}
      <div id="auction-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Categories Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Explore Curated Auction Lots</span>
            </h2>
            <span className="text-xs text-amber-300/80 font-mono font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#091224] border border-amber-500/20">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                statusFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setStatusFilter('ending_soon')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                statusFilter === 'ending_soon'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-amber-400 hover:bg-amber-950/40'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              Ending Soon
            </button>
            <button
              onClick={() => setStatusFilter('live')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                statusFilter === 'live'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Active Bidding
            </button>
            <button
              onClick={() => setStatusFilter('closed')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                statusFilter === 'closed'
                  ? 'bg-red-700 text-white font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Past / Closed
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
            <span className="text-slate-400 font-medium">Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="bg-[#0D182E] text-slate-200 border border-amber-500/30 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-400 font-semibold"
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
          <div className="text-center py-20 px-4 bg-[#081020] rounded-3xl border border-dashed border-amber-500/20 space-y-3">
            <Gavel className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-serif font-bold text-slate-200">No matching auctions found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your category filter, keyword search, or status selection.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Grateful Collectors & Consignors (Gratitude & Trust Section) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="rounded-3xl bg-gradient-to-b from-[#091326] to-[#060D1D] border border-amber-500/20 p-8 sm:p-12 space-y-10 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-amber-400" /> A Platform Built on Gratitude & Trust
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Words from Our Collectors & Consignors
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Thousands of successful bidding wars and consignments across Lahore, Karachi, Islamabad, and beyond.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#081020]/90 border border-amber-500/15 space-y-4 relative">
              <Quote className="w-8 h-8 text-amber-500/20 absolute top-4 right-4" />
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "Consigning our ancestral 18th-century Mughal astrolabe with Neelami.com achieved 180% of our reserve price. The escrow settlement through Lahore bank trust gave our family absolute peace of mind."
              </p>
              <div className="pt-2 border-t border-slate-800">
                <div className="font-bold text-white text-xs">Malik Salman Qureshi</div>
                <div className="text-[11px] text-amber-400">Art & Antique Consignor • Lahore</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#081020]/90 border border-amber-500/15 space-y-4 relative">
              <Quote className="w-8 h-8 text-amber-500/20 absolute top-4 right-4" />
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "Winning my grail 1968 Rolex Submariner was thrilling! The anti-sniping protection made the bidding war completely fair, and the armored escort delivery to Clifton, Karachi arrived with full authentication papers."
              </p>
              <div className="pt-2 border-t border-slate-800">
                <div className="font-bold text-white text-xs">Dr. Ayesha Siddiqui</div>
                <div className="text-[11px] text-amber-400">Horology Collector • Karachi</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#081020]/90 border border-amber-500/15 space-y-4 relative">
              <Quote className="w-8 h-8 text-amber-500/20 absolute top-4 right-4" />
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "Neelami has modernized how high-value commercial properties are traded in Pakistan. Clear title verification and transparent bids eliminated the usual middlemen chaos for our Gulberg III land acquisition."
              </p>
              <div className="pt-2 border-t border-slate-800">
                <div className="font-bold text-white text-xs">Chaudhry Bilal Tariq</div>
                <div className="text-[11px] text-amber-400">Real Estate Investor • Islamabad</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Bidding Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-b from-[#081124] to-[#050A14] border border-amber-500/20 p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              The Neelami Auction Standard
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Strict authenticity protocols, transparent live counters, and guaranteed escrow protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#070E1C] border border-amber-500/15 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black font-mono text-lg">
                1
              </div>
              <h3 className="font-serif font-bold text-slate-100 text-base">Appraisal & Consignment</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every lot undergoes rigorous inspection by certified gemologists, horologists, and antique appraisers before entering the exchange.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#070E1C] border border-amber-500/15 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black font-mono text-lg">
                2
              </div>
              <h3 className="font-serif font-bold text-slate-100 text-base">Anti-Sniping Live Bids</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bids placed within the final 2 minutes trigger an automatic 2-minute clock extension, guaranteeing every genuine collector a fair counter-opportunity.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#070E1C] border border-amber-500/15 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center font-black font-mono text-lg">
                3
              </div>
              <h3 className="font-serif font-bold text-slate-100 text-base">Insured Bank Escrow</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Funds remain secured in regulated escrow trust until the winning bidder receives, inspects, and approves their acquisition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Royal Consignment Invitation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-950/40 via-[#0B152A] to-emerald-950/40 border border-amber-500/30 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5 justify-center md:justify-start">
              <Crown className="w-4 h-4 text-amber-400" /> Consign With Neelami Royal Exchange
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Have Rare Assets or Collections to Auction in Pakistan?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-light">
              Connect directly with high-net-worth collectors and investors across Karachi, Lahore, and Islamabad. Achieve maximum hammer value with complete discretion.
            </p>
          </div>

          <Link
            href="/sell"
            className="shrink-0 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-2xl shadow-amber-950/60 flex items-center gap-2 transition-transform active:scale-95"
          >
            <span>Submit a Consignment</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
