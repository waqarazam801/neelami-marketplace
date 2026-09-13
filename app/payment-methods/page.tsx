'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Building2, 
  CreditCard, 
  Smartphone, 
  FileText, 
  QrCode, 
  Lock, 
  ArrowLeft,
  CheckCircle2,
  Clock,
  Banknote,
  HelpCircle,
  Award
} from 'lucide-react';

export default function PaymentMethodsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> State Bank of Pakistan Approved Escrow
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white">
          Payment Methods & Escrow Protection
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-light">
          Neelami.com ensures 100% financial security for both buyers and consignors. Learn how deposits, winning payments, and payouts work across Pakistan.
        </p>
      </div>

      {/* Escrow Mechanism Explainer Card */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0C172E] via-[#0E1A34] to-[#0A1326] border border-amber-500/30 p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-white">How the Neelami Escrow System Protects You</h2>
            <p className="text-xs text-slate-400 mt-0.5">Funds are held in corporate trust at Habib Bank Limited (HBL) & Meezan Bank.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-[#081020] border border-amber-500/15 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 font-mono font-bold flex items-center justify-center text-sm border border-emerald-800">
              1
            </div>
            <h3 className="font-bold text-white text-sm">Winning Bid Deposit</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When an auction concludes, the winning bidder deposits the hammer price into the designated Neelami Trust Escrow account via Raast, Bank Wire, or Card.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#081020] border border-amber-500/15 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 font-mono font-bold flex items-center justify-center text-sm border border-amber-800">
              2
            </div>
            <h3 className="font-bold text-white text-sm">Insured Dispatch & Handover</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The consignor is notified that funds are locked. The item is dispatched with tracked armored logistics or handed over under authorized supervision.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#081020] border border-amber-500/15 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 font-mono font-bold flex items-center justify-center text-sm border border-blue-800">
              3
            </div>
            <h3 className="font-bold text-white text-sm">Inspection & Payout</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The buyer has 48 hours to inspect authenticity and condition. Once the handover slip is verified, funds are released directly to the seller's Pakistani bank account.
            </p>
          </div>
        </div>
      </div>

      {/* Critical Rule: Pay Company, NOT the Seller Person */}
      <div className="rounded-3xl bg-gradient-to-r from-red-950/40 via-[#181120] to-amber-950/40 border border-red-500/50 p-6 sm:p-8 space-y-4 shadow-2xl">
        <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-5 h-5 text-red-400" />
          <span>MANDATORY BUYER PROTECTION POLICY</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
          Always Pay Neelami.com (The Company) — NEVER The Seller Directly
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed pt-1">
          <div className="p-4 rounded-2xl bg-black/50 border border-red-500/20 space-y-1.5">
            <span className="font-bold text-red-400 text-sm block">❌ What You Must NEVER Do:</span>
            <p className="text-slate-300">
              Never transfer funds directly to a seller's personal bank account, personal Raast, JazzCash, EasyPaisa, or cash. Direct peer-to-peer transfers circumvent the escrow system and void all buyer insurance, authenticity reports, and refund rights.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-black/50 border border-emerald-500/20 space-y-1.5">
            <span className="font-bold text-emerald-400 text-sm block">✅ What You MUST Do:</span>
            <p className="text-slate-300">
              Transfer funds exclusively to <strong>Neelami.com Official Company Trust</strong>. The company acts as your neutral legal escrow trustee, holding the money until you physically inspect and approve your delivery. Only then does Neelami disburse payment to the consignor.
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Payment Channels Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-white">
          Accepted Pakistani Payment Channels (To Neelami.com)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Raast */}
          <div className="p-6 rounded-3xl bg-[#0A1326] border border-amber-500/20 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Raast Instant Payment (State Bank of Pakistan)</h3>
                <span className="text-[11px] text-emerald-400 font-mono">0% Processing Fee • Instant 24/7 Clearance</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pakistan's official instant payment system. Pay in seconds from any mobile banking app (HBL, Meezan, Alfalah, Standard Chartered, UBL, MCB) using our official Raast ID or QR code.
            </p>
            <div className="p-3 rounded-xl bg-[#070D1B] border border-slate-800 text-xs font-mono flex items-center justify-between text-slate-300">
              <span>Official Escrow Raast ID:</span>
              <span className="font-bold text-amber-400">neelami.escrow@hbl</span>
            </div>
          </div>

          {/* 2. Direct Bank Wire */}
          <div className="p-6 rounded-3xl bg-[#0A1326] border border-amber-500/20 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">1Link IBFT & Direct Bank Transfer</h3>
                <span className="text-[11px] text-blue-400 font-mono">Real-Time Gross Settlement (RTGS) for High Value</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Direct transfer to our dedicated trust accounts at Habib Bank Limited and Meezan Bank. Recommended for transactions above ₨ 500,000 up to Crores.
            </p>
            <div className="p-3 rounded-xl bg-[#070D1B] border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
              <div>Title: <strong>Neelami Escrow Trustee Private Limited</strong></div>
              <div>IBAN: <strong>PK36 MEZN 0001 2345 6789 0123</strong></div>
            </div>
          </div>

          {/* 3. Debit & Credit Cards */}
          <div className="p-6 rounded-3xl bg-[#0A1326] border border-amber-500/20 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Visa, Mastercard, & PayPak</h3>
                <span className="text-[11px] text-emerald-400 font-mono">3D-Secure 2.0 • OTP Protected</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              We accept all domestic Pakistani bank debit/credit cards (PayPak, Visa, Mastercard) as well as international cards from overseas Pakistani collectors. 256-bit SSL encrypted.
            </p>
          </div>

          {/* 4. Mobile Wallets */}
          <div className="p-6 rounded-3xl bg-[#0A1326] border border-amber-500/20 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">JazzCash & EasyPaisa</h3>
                <span className="text-[11px] text-purple-400 font-mono">Instant MPIN Push Prompt</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Fast and convenient checkout for smaller lots (up to ₨ 200,000). Enter your mobile number and approve the payment right on your phone screen.
            </p>
          </div>

          {/* 5. Certified Banker's Pay Order (Special Lots) */}
          <div className="p-6 rounded-3xl bg-[#0A1326] border border-amber-500/20 space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Banker's Cheque / Pay Order (Vehicles & Real Estate)</h3>
                <span className="text-[11px] text-amber-400 font-mono">Standard for High-Value Assets (Millions & Crores)</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              For high-value lots like commercial plots (e.g. Gulberg III Lahore) or collector vehicles (Toyota FJ40 restomod), buyers can issue a certified Banker's Pay Order drawn from any scheduled bank in Pakistan in favor of "Neelami Escrow Trustee (Pvt) Ltd". Physical handover is executed at LDA / registry office upon clearance.
            </p>
          </div>
        </div>
      </div>

      {/* Seller Payout FAQ */}
      <div className="p-8 rounded-3xl bg-[#081020] border border-amber-500/20 space-y-6">
        <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
          <Banknote className="w-5 h-5 text-emerald-400" />
          <span>How Sellers Receive Their Payouts</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-[#0B152A] border border-slate-800 space-y-1.5">
            <div className="font-bold text-white">Direct IBFT to Any Pakistani Bank:</div>
            <p className="text-slate-400">
              Payouts are wired directly to your IBAN (HBL, Meezan, MCB, Bank Alfalah, Allied Bank, Askari, etc.) within 24 hours of buyer inspection approval.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0B152A] border border-slate-800 space-y-1.5">
            <div className="font-bold text-white">Consignor Commission Transparency:</div>
            <p className="text-slate-400">
              Zero listing fees. Standard consignment success fee is only 3% of the final hammer price, deducted automatically prior to wire transfer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
