'use client';

import React from 'react';
import Link from 'next/link';
import { Gavel, ShieldCheck, Truck, Clock, Lock, Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 text-slate-400 text-xs">
      {/* Trust Badges */}
      <div className="border-b border-slate-900/80 py-8 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200 text-sm">100% Verified Authenticity</h4>
              <p className="text-slate-400 text-xs mt-0.5">Every high-value timepiece, antique, vehicle, and gem is certified by licensed appraisers.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/40">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200 text-sm">Neelami Safe-Escrow</h4>
              <p className="text-slate-400 text-xs mt-0.5">Funds are protected in bank escrow until delivery inspection is signed off by buyer.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-950/60 text-blue-400 border border-blue-800/40">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200 text-sm">Anti-Sniping Protocol</h4>
              <p className="text-slate-400 text-xs mt-0.5">Automated soft-close guarantees fair bidding wars without bot last-second sniping.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-800/40">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200 text-sm">Secure Nationwide Transport</h4>
              <p className="text-slate-400 text-xs mt-0.5">Armored escort and tracked high-value logistics across all major cities in Pakistan.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Gavel className="w-4 h-4 text-amber-300" />
            </div>
            <span className="text-lg font-black tracking-tight text-white">NEELAMI.COM</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Pakistan’s premier real-time online auction and bidding marketplace for rare collectibles, luxury timepieces, electronics, real estate, and motors.
          </p>
          <div className="pt-2 text-emerald-400 font-mono text-xs">
            All prices quoted in Pakistani Rupees (PKR ₨)
          </div>
        </div>

        <div>
          <h4 className="font-bold text-slate-200 text-sm mb-3">Auctions</h4>
          <ul className="space-y-2">
            <li><Link href="/?category=Luxury Watches" className="hover:text-emerald-400 transition-colors">Luxury Watches</Link></li>
            <li><Link href="/?category=Antiques & Art" className="hover:text-emerald-400 transition-colors">Antiques & Mughal Curios</Link></li>
            <li><Link href="/?category=Electronics & Gadgets" className="hover:text-emerald-400 transition-colors">Electronics & Tech</Link></li>
            <li><Link href="/?category=Vehicles & Motors" className="hover:text-emerald-400 transition-colors">Classic Cars & Motors</Link></li>
            <li><Link href="/?category=Real Estate & Land" className="hover:text-emerald-400 transition-colors">Prime Plots & Commercial Land</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-200 text-sm mb-3">Auction Services</h4>
          <ul className="space-y-2">
            <li><Link href="/sell" className="hover:text-emerald-400 transition-colors">Sell an Item (Consignment)</Link></li>
            <li><Link href="/dashboard" className="hover:text-emerald-400 transition-colors">Buyer Escrow Dashboard</Link></li>
            <li><Link href="/dashboard?tab=watchlist" className="hover:text-emerald-400 transition-colors">Personal Watchlist</Link></li>
            <li><span className="text-slate-500">Corporate & Estate Neelami</span></li>
            <li><span className="text-slate-500">Valuation & Appraisal Services</span></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-200 text-sm mb-3">Auction Concierge</h4>
          <p className="text-xs text-slate-400 mb-3">
            Our auction specialists in Lahore, Karachi, and Islamabad are available 7 days a week:
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>+92 (42) 111-NEELAMI</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>support@neelami.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-900 py-4 text-center text-slate-600 text-[11px]">
        © {new Date().getFullYear()} Neelami.com (Private) Limited. All rights reserved. Registered Auction Exchange Pakistan.
      </div>
    </footer>
  );
};
