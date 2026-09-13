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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-white min-h-screen">
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-700 mb-2 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Worldwide Multi-Currency & Bank Escrow Protection
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900">
          Worldwide Payment Methods & Escrow Trust
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-light">
          Neelami.com ensures 100% financial safety for collectors and consignors globally. Settle winning lots in USD ($), AED (د.إ), GBP (£), EUR (€), or PKR (₨) with bank-grade legal custody.
        </p>
      </div>

      {/* Escrow Mechanism Explainer Card */}
      <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-md space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-slate-900">How the Neelami Global Escrow System Protects You</h2>
            <p className="text-xs text-slate-500 mt-0.5">Funds are held in corporate trust at Standard Chartered, Habib Bank Limited (HBL) & Meezan Bank.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-mono font-bold flex items-center justify-center text-sm border border-emerald-200">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Winning Bid Deposit</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When an auction concludes, the winning bidder deposits the hammer price into the designated Neelami Trust Escrow account via Raast, Bank Wire, or Card.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 font-mono font-bold flex items-center justify-center text-sm border border-amber-200">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Insured Dispatch & Handover</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The consignor is notified that funds are locked. The item is dispatched with tracked armored logistics or handed over under authorized supervision.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 font-mono font-bold flex items-center justify-center text-sm border border-blue-200">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Inspection & Payout</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The buyer has 48 hours to inspect authenticity and condition. Once the handover slip is verified, funds are released directly to the seller's Pakistani bank account.
            </p>
          </div>
        </div>
      </div>

      {/* Critical Rule: Pay Company, NOT the Seller Person */}
      <div className="rounded-3xl bg-red-50/60 border border-red-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-5 h-5 text-red-600" />
          <span>MANDATORY BUYER PROTECTION POLICY</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
          Always Pay Neelami.com (The Company) — NEVER The Seller Directly
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700 leading-relaxed pt-1">
          <div className="p-4 rounded-2xl bg-white border border-red-200 space-y-1.5 shadow-sm">
            <span className="font-bold text-red-700 text-sm block">❌ What You Must NEVER Do:</span>
            <p className="text-slate-600">
              Never transfer funds directly to a seller's personal bank account, personal Raast, JazzCash, EasyPaisa, or cash. Direct peer-to-peer transfers circumvent the escrow system and void all buyer insurance, authenticity reports, and refund rights.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-emerald-200 space-y-1.5 shadow-sm">
            <span className="font-bold text-emerald-800 text-sm block">✅ What You MUST Do:</span>
            <p className="text-slate-600">
              Transfer funds exclusively to <strong>Neelami.com Official Company Trust</strong>. The company acts as your neutral legal escrow trustee, holding the money until you physically inspect and approve your delivery. Only then does Neelami disburse payment to the consignor.
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Payment Channels Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              Accepted Global & Domestic Payment Channels
            </h2>
            <p className="text-xs text-slate-500 mt-1">Multi-currency trust settlement for international and Pakistani collectors.</p>
          </div>
          <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 w-fit">
            Supported: USD • EUR • GBP • AED • PKR
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Global Cards & Apple Pay */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Global Cards & Apple Pay (Worldwide)</h3>
                <span className="text-[11px] text-emerald-700 font-mono">Visa • Mastercard • Amex • Apple Pay • Google Pay</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instant checkout for international buyers in USA, UK, Europe, UAE, Canada, and Australia. 3D-Secure 2.0 encrypted with bank-level fraud detection.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-emerald-800 flex items-center justify-between">
              <span>Settlement Currencies:</span>
              <span className="font-bold text-slate-900">USD, EUR, GBP, AED, PKR</span>
            </div>
          </div>

          {/* 2. SWIFT International Wire */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">SWIFT & IBAN Global Bank Wire</h3>
                <span className="text-[11px] text-blue-700 font-mono">Standard Chartered Global Escrow Custody</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Direct international wire transfers for six-figure and seven-figure fine art, rare horology, and collector motorcars. Complete with escrow confirmation advice within 2-4 hours.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 space-y-1">
              <div>Beneficiary: <strong className="text-slate-900">Neelami International Escrow Limited</strong></div>
              <div>SWIFT / BIC: <strong className="text-slate-900">SCBLPKKAX</strong> (Standard Chartered Trust)</div>
            </div>
          </div>

          {/* 3. Raast */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">State Bank Raast Instant P2M (Pakistan)</h3>
                <span className="text-[11px] text-emerald-700 font-mono">0% Processing Fee • Instant 24/7 Clearance</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pakistan's official instant payment system. Pay in seconds from any mobile banking app (HBL, Meezan, Alfalah, Standard Chartered, UBL, MCB) using our official Raast ID or QR code.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono flex items-center justify-between text-slate-700">
              <span>Official Escrow Raast ID:</span>
              <span className="font-bold text-amber-800 font-mono">neelami.escrow@hbl</span>
            </div>
          </div>

          {/* 4. Direct Bank Wire (Pakistan 1Link) */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">1Link IBFT & Domestic Bank Transfer</h3>
                <span className="text-[11px] text-purple-700 font-mono">Real-Time Gross Settlement (RTGS)</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Direct transfer to our dedicated trust accounts at Habib Bank Limited and Meezan Bank. Recommended for domestic transactions above ₨ 500,000 up to Crores.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 space-y-1">
              <div>Title: <strong className="text-slate-900">Neelami Escrow Trustee Private Limited</strong></div>
              <div>IBAN: <strong className="text-slate-900">PK36 MEZN 0001 2345 6789 0123</strong></div>
            </div>
          </div>

          {/* 5. Debit & Credit Cards */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Visa, Mastercard, & PayPak</h3>
                <span className="text-[11px] text-emerald-700 font-mono">3D-Secure 2.0 • OTP Protected</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              We accept all domestic Pakistani bank debit/credit cards (PayPak, Visa, Mastercard) as well as international cards from overseas Pakistani collectors. 256-bit SSL encrypted.
            </p>
          </div>

          {/* 6. Mobile Wallets */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">JazzCash & EasyPaisa</h3>
                <span className="text-[11px] text-purple-700 font-mono">Instant MPIN Push Prompt</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fast and convenient checkout for smaller lots (up to ₨ 200,000). Enter your mobile number and approve the payment right on your phone screen.
            </p>
          </div>

          {/* 7. Certified Banker's Pay Order (Special Lots) */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Banker's Cheque / Pay Order (Vehicles & Real Estate)</h3>
                <span className="text-[11px] text-amber-800 font-mono">Standard for High-Value Assets (Millions & Crores)</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              For high-value lots like commercial plots (e.g. Gulberg III Lahore) or collector vehicles (Toyota FJ40 restomod), buyers can issue a certified Banker's Pay Order drawn from any scheduled bank in Pakistan in favor of "Neelami Escrow Trustee (Pvt) Ltd". Physical handover is executed at LDA / registry office upon clearance.
            </p>
          </div>
        </div>
      </div>

      {/* Worldwide Logistics & Customs Handling */}
      <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-slate-900">Worldwide Insured Courier & Customs Clearance</h2>
            <p className="text-xs text-slate-500 mt-0.5">Global air cargo with end-to-end provenance security.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700">
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-sm">
            <span className="font-bold text-amber-800 block">DHL Express Worldwide:</span>
            <p className="text-slate-500">Door-to-door tracked transit across 140+ countries within 3-5 business days.</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-sm">
            <span className="font-bold text-emerald-800 block">100% Transit Marine Insurance:</span>
            <p className="text-slate-500">Every consigned lot is fully insured against theft, loss, or handling damage.</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-sm">
            <span className="font-bold text-blue-800 block">Export & Heritage Clearance:</span>
            <p className="text-slate-500">Formal export documentation and antiquity certification provided by Neelami curators.</p>
          </div>
        </div>
      </div>

      {/* Seller Payout FAQ */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
          <Banknote className="w-5 h-5 text-emerald-700" />
          <span>How Sellers Receive Their Payouts</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900">Direct IBFT to Any Pakistani Bank:</div>
            <p className="text-slate-500">
              Payouts are wired directly to your IBAN (HBL, Meezan, MCB, Bank Alfalah, Allied Bank, Askari, etc.) within 24 hours of buyer inspection approval.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900">Consignor Commission Transparency:</div>
            <p className="text-slate-500">
              Zero listing fees. Standard consignment success fee is only 3% of the final hammer price, deducted automatically prior to wire transfer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
