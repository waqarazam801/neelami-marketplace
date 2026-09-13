'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuction } from '../context/AuctionContext';
import { DEMO_USERS } from '../data/mockAuctions';
import { CURRENCY_CONFIG } from '../utils/formatters';
import { Currency } from '../types/auction';
import { 
  Gavel, 
  Heart, 
  PlusCircle, 
  User, 
  ChevronDown, 
  Radio, 
  ShieldCheck, 
  Menu, 
  X,
  Sparkles,
  Award,
  Globe,
  Volume2,
  VolumeX
} from 'lucide-react';
import { NotificationBell } from './NotificationBell';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUser, 
    watchlist, 
    isSimulationActive, 
    setIsSimulationActive,
    currency,
    setCurrency,
    formatPrice,
    soundEnabled,
    toggleSound
  } = useAuction();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 text-slate-800 shadow-sm">
      {/* Top Prestige Bar */}
      <div className="bg-slate-50 border-b border-slate-200 text-xs py-1.5 px-4 text-center flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-800 font-medium mx-auto sm:mx-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          <span className="tracking-wide">
            Neelami.com — Global Luxury Auction House & Secure Escrow Exchange
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-slate-600 text-xs">
          {/* Worldwide Currency Selector */}
          <div className="relative">
            <button
              onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
              className="flex items-center gap-1.5 text-amber-900 font-mono font-bold bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-full border border-amber-300 shadow-sm transition-all text-xs"
              title="Change Global Currency"
            >
              <Globe className="w-3.5 h-3.5 text-amber-700" />
              <span>{CURRENCY_CONFIG[currency]?.flag || '🌐'}</span>
              <span>{currency} ({CURRENCY_CONFIG[currency]?.symbol.trim()})</span>
              <ChevronDown className="w-3 h-3 text-amber-700/80" />
            </button>

            {isCurrencyMenuOpen && (
              <div
                className="absolute right-0 mt-1.5 w-56 rounded-xl bg-white border border-amber-200 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 text-left"
                onClick={() => setIsCurrencyMenuOpen(false)}
              >
                <div className="px-2.5 py-1.5 border-b border-slate-100 text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-amber-600" /> Select Global Currency
                </div>
                {(Object.keys(CURRENCY_CONFIG) as Currency[]).map((curKey) => {
                  const cfg = CURRENCY_CONFIG[curKey];
                  const isSelected = currency === curKey;
                  return (
                    <button
                      key={curKey}
                      onClick={() => {
                        setCurrency(curKey);
                        setIsCurrencyMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors ${
                        isSelected
                          ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{cfg.flag}</span>
                        <span>{cfg.name}</span>
                      </div>
                      <span className="font-mono text-amber-800 font-bold">{cfg.symbol.trim()}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Simulation Toggle */}
          <button
            onClick={() => setIsSimulationActive(!isSimulationActive)}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all border ${
              isSimulationActive
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
            title="Toggle background competitor bidding simulation"
          >
            <Radio className={`w-3 h-3 ${isSimulationActive ? 'text-emerald-600 animate-pulse' : ''}`} />
            <span>Live Competitors: {isSimulationActive ? 'ACTIVE' : 'PAUSED'}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 p-[1.5px] shadow-md group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Gavel className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-[9px] text-white font-black">
              ✓
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-serif font-black tracking-wider text-slate-900">NEELAMI</span>
              <span className="text-[10px] font-black tracking-widest text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                .COM
              </span>
            </div>
            <p className="text-[9px] tracking-widest text-amber-800 uppercase font-bold">
              EST. ROYAL AUCTION HOUSE • WORLDWIDE ESCROW
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold">
          <Link href="/" className="text-slate-700 hover:text-amber-700 transition-colors">
            All Lots
          </Link>
          <Link href="/?status=ending_soon" className="text-amber-700 hover:text-amber-800 flex items-center gap-1.5 transition-colors font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Ending Soon
          </Link>
          <Link href="/dashboard" className="text-slate-700 hover:text-emerald-700 transition-colors">
            My Bids & Escrow
          </Link>
          <Link href="/payment-methods" className="text-slate-700 hover:text-amber-700 transition-colors">
            Payments & Escrow
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3.5">
          {/* Sell Consignment Button */}
          <Link
            href="/sell"
            className="hidden sm:inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Consign Item</span>
          </Link>

          {/* Watchlist Quick Button */}
          <Link
            href="/dashboard?tab=watchlist"
            className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-amber-700 transition-colors"
            title="Watchlist"
          >
            <Heart className="w-4 h-4" />
            {watchlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                {watchlist.length}
              </span>
            )}
          </Link>

          {/* Real-Time Activity & Outbid Notification Bell */}
          <NotificationBell />

          {/* Authentic Auctioneer Audio & Gavel Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 ${
              soundEnabled
                ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-sm'
                : 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-600'
            }`}
            title={soundEnabled ? 'Auctioneer Audio: ON (Click to Mute Gavel Sound)' : 'Auctioneer Audio: MUTED (Click to Enable Sound)'}
            aria-label="Toggle Auction Sound"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-amber-700" />
                <span className="hidden xl:inline text-[10px] font-bold uppercase tracking-wider text-amber-900">Audio ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="hidden xl:inline text-[10px] font-bold uppercase tracking-wider text-slate-500">Muted</span>
              </>
            )}
          </button>

          {/* User Profile & Demo Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all text-left shadow-sm"
            >
              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-amber-400 shrink-0">
                <Image
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="hidden lg:block">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  {currentUser.name}
                  <ShieldCheck className="w-3 h-3 text-amber-600 inline" />
                </div>
                <div className="text-[10px] font-mono text-emerald-700 font-semibold capitalize">
                  {currentUser.role} • {formatPrice(currentUser.walletBalance, true)}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500 hidden sm:block" />
            </button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-serif font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    Demo Collector Accounts
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Switch profiles to test buying & selling workflows:</p>
                </div>

                <div className="py-1 space-y-1">
                  {DEMO_USERS.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => setCurrentUser(user)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                        currentUser.id === user.id
                          ? 'bg-amber-50 border border-amber-300 text-slate-900'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-200">
                        <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold truncate flex items-center justify-between">
                          <span>{user.name}</span>
                          <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-amber-800 border border-amber-300">
                            {user.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate font-mono">
                          {formatPrice(user.walletBalance)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-2 px-1">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  >
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>View Member Dashboard</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-3">
          {/* Mobile Currency Picker */}
          <div className="pb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold text-amber-800 block mb-1.5 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Currency ({currency}):
            </span>
            <div className="grid grid-cols-5 gap-1.5">
              {(Object.keys(CURRENCY_CONFIG) as Currency[]).map((curKey) => (
                <button
                  key={curKey}
                  onClick={() => setCurrency(curKey)}
                  className={`py-1.5 px-1 rounded-lg text-center text-xs font-mono font-bold transition-colors ${
                    currency === curKey
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {curKey}
                </button>
              ))}
            </div>
          </div>

          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 hover:text-amber-700"
          >
            All Auctions
          </Link>
          <Link
            href="/?status=ending_soon"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-amber-700"
          >
            🔥 Ending Soon
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 hover:text-emerald-700"
          >
            My Bids & Dashboard
          </Link>
          <Link
            href="/sell"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm shadow"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Consign Item</span>
          </Link>
        </div>
      )}
    </header>
  );
};
