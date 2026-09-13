'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { AuctionItem } from '../types/auction';
import { useAuction } from '../context/AuctionContext';
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
  const { formatPrice } = useAuction();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3">
          <div className="inline-flex p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 shadow-inner">
            <Trophy className="w-10 h-10 animate-bounce" />
          </div>

          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Mubarak! Auction Won 🎉
          </h2>
          <p className="text-sm text-slate-600">
            Congratulations <span className="font-bold text-amber-800">{winnerName}</span>! You have successfully secured this item on Neelami.com.
          </p>
        </div>

        {/* Certificate Card */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200 text-slate-500">
            <span>Official Neelami Award Slip</span>
            <span className="font-mono text-emerald-700 font-bold">LOT #{auction.id.toUpperCase()}</span>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-sm">{auction.title}</h4>
            <p className="text-xs text-slate-500">Seller: {auction.seller.name} ({auction.seller.city})</p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">Winning Hammer Price:</span>
            <span className="text-lg font-black font-mono text-amber-700">
              {formatPrice(auction.currentBid)}
            </span>
          </div>
        </div>

        {/* Escrow Protection Notice */}
        <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-950">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-emerald-900">Neelami Safe-Escrow Guarantee:</span> Your funds are held safely by Neelami.com until item delivery & verification are confirmed.
          </div>
        </div>

        {/* Critical Notice: Pay Company Not Seller */}
        <div className="mt-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-950">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-900">Company Custody Rule:</span> Send payment strictly to <strong>Neelami.com Company Account</strong>, NEVER to the seller ({auction.seller.name}) directly. Direct transfers to sellers are strictly prohibited and void all escrow guarantees.
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-200 transition-colors"
          >
            Keep Browsing
          </button>
          <Link
            href="/dashboard?tab=won"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors"
          >
            <span>Proceed to Settlement</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
