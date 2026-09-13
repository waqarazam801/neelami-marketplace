'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { AuctionItem } from '../types/auction';
import { formatPKR } from '../utils/formatters';
import { Trophy, CheckCircle, ShieldCheck, X, FileText, ArrowRight, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface WinnerModalProps {
  auction: AuctionItem;
  isOpen: boolean;
  onClose: () => void;
  winnerName: string;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({
  auction,
  isOpen,
  onClose,
  winnerName,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire celebratory confetti!
      const duration = 2.5 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#10B981', '#F59E0B', '#3B82F6'],
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#10B981', '#F59E0B', '#3B82F6'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3">
          <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 border border-amber-500/30 text-amber-400 shadow-inner">
            <Trophy className="w-10 h-10 animate-bounce" />
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white">
            Mubarak! Auction Won 🎉
          </h2>
          <p className="text-sm text-slate-300">
            Congratulations <span className="font-bold text-amber-400">{winnerName}</span>! You have successfully secured this item on Neelami.com.
          </p>
        </div>

        {/* Certificate Card */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800 text-slate-400">
            <span>Official Neelami Award Slip</span>
            <span className="font-mono text-emerald-400">LOT #{auction.id.toUpperCase()}</span>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 text-sm">{auction.title}</h4>
            <p className="text-xs text-slate-400">Seller: {auction.seller.name} ({auction.seller.city})</p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">Winning Hammer Price:</span>
            <span className="text-lg font-black font-mono text-amber-400">
              {formatPKR(auction.currentBid)}
            </span>
          </div>
        </div>

        {/* Escrow Protection Notice */}
        <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 flex items-start gap-2.5 text-xs text-emerald-300">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Neelami Safe-Escrow Guarantee:</span> Your funds are held safely by Neelami.com until item delivery & verification are confirmed.
          </div>
        </div>

        {/* Critical Notice: Pay Company Not Seller */}
        <div className="mt-2.5 p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-start gap-2.5 text-xs text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300">Company Custody Rule:</span> Send payment strictly to <strong>Neelami.com Company Account</strong>, NEVER to the seller ({auction.seller.name}) directly. Direct transfers to sellers are strictly prohibited and void all escrow guarantees.
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
          >
            Keep Browsing
          </button>
          <Link
            href="/dashboard?tab=won"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-colors"
          >
            <span>Proceed to Settlement</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
