'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useAuction } from '../../context/AuctionContext';
import { formatPKR, getTimeRemaining } from '../../utils/formatters';
import { CountdownTimer } from '../../components/CountdownTimer';
import { EscrowPaymentModal } from '../../components/EscrowPaymentModal';
import { AuctionItem } from '../../types/auction';
import { 
  Gavel, 
  Trophy, 
  Heart, 
  Package, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  AlertTriangle,
  Wallet,
  TrendingUp,
  MapPin
} from 'lucide-react';

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') as 'bids' | 'won' | 'listings' | 'watchlist' || 'bids';

  const { 
    currentUser, 
    auctions, 
    watchlist,
    currency,
    formatPrice
  } = useAuction();

  const [activeTab, setActiveTab] = useState<'bids' | 'won' | 'listings' | 'watchlist'>(
    initialTab === 'watchlist' ? 'watchlist' : initialTab === 'won' ? 'won' : 'bids'
  );

  const [payingAuction, setPayingAuction] = useState<AuctionItem | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Active bids placed by current user
  const myBidsAuctions = useMemo(() => {
    return auctions.filter((auction) => 
      auction.bids.some((b) => b.bidderId === currentUser.id)
    );
  }, [auctions, currentUser.id]);

  // Won auctions
  const wonAuctions = useMemo(() => {
    return auctions.filter((auction) => {
      if (auction.status === 'closed' && auction.winnerId === currentUser.id) return true;
      const time = getTimeRemaining(auction.endTime);
      if (time.isExpired && auction.bids.length > 0 && auction.bids[0].bidderId === currentUser.id) {
        return true;
      }
      return false;
    });
  }, [auctions, currentUser.id]);

  // My listings (seller items)
  const myListings = useMemo(() => {
    return auctions.filter((auction) => auction.seller.id === currentUser.id);
  }, [auctions, currentUser.id]);

  // Watchlist items
  const watchedAuctions = useMemo(() => {
    return auctions.filter((auction) => watchlist.includes(auction.id));
  }, [auctions, watchlist]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Overview Card */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-emerald-500/60 shadow-lg shadow-emerald-950">
              <Image src={currentUser.avatar} alt={currentUser.name} fill className="object-cover" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{currentUser.name}</h1>
                <span className="flex items-center gap-0.5 text-xs text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span>{currentUser.email}</span>
                <span>•</span>
                <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3 text-slate-400" /> {currentUser.city}</span>
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] font-mono uppercase bg-slate-800 text-amber-400 font-bold px-2 py-0.5 rounded">
                  {currentUser.role} Account
                </span>
                <span className="text-xs text-slate-400">Member since {currentUser.joinedDate}</span>
              </div>
            </div>
          </div>

          {/* Wallet Balance Card */}
          <div className="w-full sm:w-auto p-4 rounded-2xl bg-slate-950 border border-slate-800/90 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Escrow Wallet Balance ({currency})
              </span>
              <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono mt-0.5">
                {formatPrice(currentUser.walletBalance)}
              </div>
              <span className="text-[10px] text-emerald-400">Verified for Bidding</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveTab('bids')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'bids'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Gavel className="w-4 h-4" />
          <span>My Active Bids</span>
          <span className="px-1.5 py-0.5 rounded-full bg-black/30 font-mono text-[10px]">
            {myBidsAuctions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('won')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'won'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Won Lots</span>
          <span className="px-1.5 py-0.5 rounded-full bg-black/30 font-mono text-[10px]">
            {wonAuctions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'listings'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Listed Auctions</span>
          <span className="px-1.5 py-0.5 rounded-full bg-black/30 font-mono text-[10px]">
            {myListings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('watchlist')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'watchlist'
              ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Watchlist</span>
          <span className="px-1.5 py-0.5 rounded-full bg-black/30 font-mono text-[10px]">
            {watchedAuctions.length}
          </span>
        </button>
      </div>

      {/* Tab Content 1: Active Bids */}
      {activeTab === 'bids' && (
        <div className="space-y-4">
          {myBidsAuctions.length === 0 ? (
            <div className="text-center py-16 px-4 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800 space-y-3">
              <Gavel className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-200">No active bids yet</h3>
              <p className="text-xs text-slate-400">Discover items ending soon and place your first competitive bid.</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
              >
                Browse Auctions
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {myBidsAuctions.map((auction) => {
                const isWinning = auction.bids.length > 0 && auction.bids[0].bidderId === currentUser.id;
                const userHighestBid = auction.bids.find((b) => b.bidderId === currentUser.id)?.amount || 0;

                return (
                  <div
                    key={auction.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                        <Image src={auction.images[0]} alt={auction.title} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-emerald-400 font-semibold">{auction.category}</span>
                          <span className="text-xs text-slate-500 font-mono">LOT #{auction.id}</span>
                        </div>
                        <Link href={`/auction/${auction.id}`} className="font-bold text-slate-100 text-sm hover:text-emerald-400 transition-colors line-clamp-1">
                          {auction.title}
                        </Link>
                        <div className="flex items-center gap-3 text-xs mt-1">
                          <span className="text-slate-400">Your Bid: <strong className="font-mono text-slate-200">{formatPrice(userHighestBid)}</strong></span>
                          <span>•</span>
                          <span className="text-slate-400">Current Hammer: <strong className="font-mono text-amber-400">{formatPrice(auction.currentBid)}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div>
                        {isWinning ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 font-bold text-xs border border-emerald-800">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            Highest Bidder
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950 text-amber-400 font-bold text-xs border border-amber-800">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Outbid!
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        <CountdownTimer endTime={auction.endTime} compact />
                      </div>

                      <Link
                        href={`/auction/${auction.id}`}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white font-bold text-xs transition-colors"
                      >
                        {isWinning ? 'View Lot' : 'Raise Bid'}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Won Lots */}
      {activeTab === 'won' && (
        <div className="space-y-4">
          {/* Company Payment Rule Banner */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300">Mandatory Buyer Protection:</span> Winning payments must be transferred strictly to <strong>Neelami.com Official Company Accounts</strong>, NEVER to the seller personally. The company holds your funds in trust and only releases them to the seller after you receive and sign off on the delivery inspection.
            </div>
          </div>

          {wonAuctions.length === 0 ? (
            <div className="text-center py-16 px-4 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800 space-y-3">
              <Trophy className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-200">No won auctions yet</h3>
              <p className="text-xs text-slate-400">Place bids on ending soon lots to secure your winning bid!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {wonAuctions.map((auction) => (
                <div
                  key={auction.id}
                  className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-emerald-500/40">
                      <Image src={auction.images[0]} alt={auction.title} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                          <Trophy className="w-3.5 h-3.5" /> AUCTION WON
                        </span>
                        <span className="text-xs text-slate-500 font-mono">LOT #{auction.id}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm mt-0.5">{auction.title}</h4>
                      <p className="text-xs text-slate-400">
                        Winning Hammer Price: <span className="font-mono font-bold text-amber-400">{formatPrice(auction.currentBid)}</span> • Seller: {auction.seller.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => alert(`Certificate of Ownership generated for LOT #${auction.id}. Consignment slip dispatched.`)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                    >
                      Download Invoice
                    </button>
                    <button
                      onClick={() => {
                        setPayingAuction(auction);
                        setIsPaymentModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/40 transition-colors"
                    >
                      Escrow Settlement
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 3: My Listed Auctions */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200">Consigned Lots by {currentUser.name}</h3>
            <Link
              href="/sell"
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-950/40 hover:bg-emerald-500 transition-colors"
            >
              + List Another Item
            </Link>
          </div>

          {myListings.length === 0 ? (
            <div className="text-center py-16 px-4 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800 space-y-3">
              <Package className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-200">No active listings for this user</h3>
              <p className="text-xs text-slate-400">List an item or switch to Fatima Noor (Seller) to view seller lots.</p>
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
              >
                Create Listing
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {myListings.map((auction) => (
                <div
                  key={auction.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                      <Image src={auction.images[0]} alt={auction.title} fill className="object-cover" />
                    </div>
                    <div>
                      <span className="text-xs text-emerald-400 font-semibold">{auction.category}</span>
                      <h4 className="font-bold text-white text-sm">{auction.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>Current High: <strong className="font-mono text-amber-400">{formatPrice(auction.currentBid)}</strong></span>
                        <span>•</span>
                        <span>{auction.bidsCount} Bids Placed</span>
                        <span>•</span>
                        <span>Reserve: {formatPrice(auction.reservePrice)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <CountdownTimer endTime={auction.endTime} compact />
                    <Link
                      href={`/auction/${auction.id}`}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
                    >
                      Manage Lot
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 4: Watchlist */}
      {activeTab === 'watchlist' && (
        <div className="space-y-4">
          {watchedAuctions.length === 0 ? (
            <div className="text-center py-16 px-4 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800 space-y-3">
              <Heart className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-200">Your Watchlist is empty</h3>
              <p className="text-xs text-slate-400">Click the heart icon on any auction lot to track its countdown and bidding wars.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {watchedAuctions.map((auction) => (
                <div
                  key={auction.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-950 shrink-0">
                      <Image src={auction.images[0]} alt={auction.title} fill className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-emerald-400 font-semibold uppercase">{auction.category}</span>
                      <h4 className="font-bold text-slate-100 text-xs line-clamp-1">{auction.title}</h4>
                      <p className="text-xs font-mono font-bold text-amber-400 mt-1">{formatPrice(auction.currentBid)}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <CountdownTimer endTime={auction.endTime} compact />
                    <Link
                      href={`/auction/${auction.id}`}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      Bid Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Escrow Payment Checkout Modal */}
      <EscrowPaymentModal
        auction={payingAuction}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
          <div className="inline-block w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-semibold">Loading Neelami Dashboard...</p>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
