'use client';

import React, { useState } from 'react';
import { AuctionItem } from '../types/auction';
import { useAuction } from '../context/AuctionContext';
import { playBidChime } from '../utils/sound';
import confetti from 'canvas-confetti';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  Building2, 
  Smartphone, 
  FileText, 
  QrCode, 
  Lock, 
  ArrowRight,
  Clock,
  Printer,
  Globe
} from 'lucide-react';

interface EscrowPaymentModalProps {
  auction: AuctionItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type PaymentMethodType = 'raast' | 'bank_transfer' | 'card' | 'wallet' | 'pay_order' | 'swift_wire';

export const EscrowPaymentModal: React.FC<EscrowPaymentModalProps> = ({
  auction,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currency, formatPrice } = useAuction();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [txId, setTxId] = useState('');

  if (!isOpen || !auction) return null;

  const hammerPrice = auction.currentBid;
  const escrowFee = Math.round(hammerPrice * 0.01); // 1% escrow administration
  const shippingFee = auction.shippingInfo.cost;
  const totalAmount = hammerPrice + escrowFee + shippingFee;

  const handlePay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
      const generatedTx = 'RAAST-' + Math.floor(100000000 + Math.random() * 900000000);
      setTxId(generatedTx);
      playBidChime();

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10B981', '#F59E0B', '#3B82F6'],
      });

      if (onSuccess) onSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100 border border-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isPaid ? (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  SAFE-ESCROW SETTLEMENT
                </span>
                <span className="text-xs text-slate-500">LOT #{auction.id.toUpperCase()}</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-slate-900">
                Payment & Escrow Deposit
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Your payment is held safely by Neelami.com until your item is delivered, inspected, and verified.
              </p>
            </div>

            {/* Direct Warning: Pay Company, NOT Seller */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
              <div className="flex items-center gap-2 text-amber-800 font-bold uppercase tracking-wide">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Pay to Neelami.com (Company) — NEVER to the Seller Person</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed pl-6">
                For buyer safety, you are depositing funds into <strong>Neelami.com (Private) Limited Official Trust</strong>. The consignor ({auction.seller.name}) is only paid after you inspect and sign off on the delivery.
              </p>
            </div>

            {/* Price Breakdown */}
            <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Winning Hammer Bid:</span>
                <span className="font-mono font-bold text-sm text-slate-900">{formatPrice(hammerPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Neelami Escrow Protection (1%):</span>
                <span className="font-mono font-semibold text-slate-800">{formatPrice(escrowFee)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Insured Global / Domestic Delivery:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {shippingFee === 0 ? 'Complimentary' : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-sm">
                <span className="text-slate-800">Total Escrow Deposit ({currency}):</span>
                <span className="text-xl font-mono text-amber-700">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Choose Payment Method ({currency === 'PKR' ? 'Domestic Pakistan' : 'Worldwide & Multi-Currency'}):
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. Global Cards / Apple Pay */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    selectedMethod === 'card'
                      ? 'bg-amber-50/70 border-amber-500 text-slate-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <span>Card & Apple Pay</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded font-mono">Global</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      Visa, Mastercard, Amex, Apple Pay. 3D Secure 256-bit SSL.
                    </p>
                  </div>
                </button>

                {/* 2. SWIFT International Wire */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('swift_wire')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    selectedMethod === 'swift_wire'
                      ? 'bg-amber-50/70 border-amber-500 text-slate-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-800 shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <span>SWIFT Global Wire</span>
                      <span className="text-[9px] bg-blue-100 text-blue-800 px-1 rounded font-mono">USD/EUR/GBP</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      Standard Chartered Global Trust. Direct SWIFT transfer.
                    </p>
                  </div>
                </button>

                {/* 3. Raast Instant Transfer */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('raast')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    selectedMethod === 'raast'
                      ? 'bg-amber-50/70 border-amber-500 text-slate-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <span>Raast Instant P2M</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded font-mono">0% Fee</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      Instant State Bank Raast ID / QR for Pakistani bank apps.
                    </p>
                  </div>
                </button>

                {/* 4. Direct Bank Wire / 1Link */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('bank_transfer')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    selectedMethod === 'bank_transfer'
                      ? 'bg-amber-50/70 border-amber-500 text-slate-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-800 shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">1Link IBFT Bank Wire</div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      Habib Bank Limited & Meezan Bank Escrow Trust.
                    </p>
                  </div>
                </button>

                {/* 5. Mobile Wallets */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('wallet')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    selectedMethod === 'wallet'
                      ? 'bg-amber-50/70 border-amber-500 text-slate-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-orange-100 text-orange-800 shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">JazzCash & EasyPaisa</div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      Instant mobile wallet PIN approval.
                    </p>
                  </div>
                </button>

                {/* 6. Banker's Pay Order (High Value) */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('pay_order')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    selectedMethod === 'pay_order'
                      ? 'bg-amber-50/70 border-amber-500 text-slate-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Banker's Pay Order</div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      Certified Cheque for high-value lots (Vehicles/Estate).
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Selected Method Details Preview */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              {selectedMethod === 'swift_wire' && (
                <div className="space-y-1">
                  <div className="font-bold text-blue-800">Standard Chartered Global Escrow Account:</div>
                  <div className="text-slate-700 text-[11px] font-mono bg-white p-2.5 rounded-lg border border-slate-200 space-y-0.5">
                    <div>Beneficiary: <strong className="text-slate-900">Neelami International Escrow Limited</strong></div>
                    <div>SWIFT / BIC: <strong className="text-slate-900">SCBLPKKAX</strong></div>
                    <div>IBAN (USD/EUR/GBP): <strong className="text-slate-900">PK88 SCBL 0000 0011 2233 4455</strong></div>
                    <div>Correspondent: Standard Chartered Bank New York / London</div>
                  </div>
                </div>
              )}

              {selectedMethod === 'raast' && (
                <div className="space-y-1">
                  <div className="font-bold text-amber-800">State Bank Raast Instant Transfer:</div>
                  <div className="text-slate-700 flex items-center justify-between font-mono bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                    <span>Raast ID: <strong className="text-slate-900">neelami.escrow@hbl</strong></span>
                    <span className="text-emerald-700 font-bold">Instant Verification</span>
                  </div>
                </div>
              )}

              {selectedMethod === 'bank_transfer' && (
                <div className="space-y-1">
                  <div className="font-bold text-blue-800">Meezan Bank Escrow Trust Account:</div>
                  <div className="text-slate-700 text-[11px] font-mono bg-white p-2.5 rounded-lg border border-slate-200 space-y-0.5">
                    <div>Title: <strong className="text-slate-900">Neelami Escrow Trustee Private Limited</strong></div>
                    <div>IBAN: <strong className="text-slate-900">PK36 MEZN 0001 2345 6789 0123</strong></div>
                    <div>Branch: Main Gulberg Branch, Lahore</div>
                  </div>
                </div>
              )}

              {selectedMethod === 'card' && (
                <div className="space-y-1">
                  <div className="font-bold text-emerald-800">Visa, Mastercard, Amex, & Apple Pay Gateway:</div>
                  <p className="text-slate-500 text-[11px]">
                    Global checkout encrypted via 256-bit SSL. Multi-currency settlement in {currency}.
                  </p>
                </div>
              )}

              {selectedMethod === 'wallet' && (
                <div className="space-y-1">
                  <div className="font-bold text-purple-800">JazzCash / EasyPaisa Mobile Checkout:</div>
                  <p className="text-slate-500 text-[11px]">
                    Enter your mobile wallet number to receive an instant MPIN confirmation prompt on your phone.
                  </p>
                </div>
              )}

              {selectedMethod === 'pay_order' && (
                <div className="space-y-1">
                  <div className="font-bold text-amber-800">Certified Banker's Pay Order:</div>
                  <p className="text-slate-500 text-[11px]">
                    Issue pay order from any scheduled bank. Handover scheduled at certified registry office.
                  </p>
                </div>
              )}
            </div>

            {/* Escrow Guarantee Notice */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-950">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-900">100% Escrow Protection:</span> The seller ({auction.seller.name}) will not receive payment until you inspect and accept the lot.
              </div>
            </div>

            {/* Submit Action */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 hover:from-emerald-700 hover:to-amber-600 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-600/20 transition-all transform active:scale-98 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isProcessing ? 'Verifying with Escrow...' : `Deposit ${formatPrice(totalAmount)} to Escrow`}
              </span>
            </button>
          </div>
        ) : (
          /* Payment Success State */
          <div className="text-center py-4 space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
                PAYMENT CONFIRMED • FUNDS SECURED IN ESCROW
              </span>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mt-1">
                Escrow Deposit Received!
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Your payment for <strong className="text-slate-800">{auction.title}</strong> has been secured in Neelami Escrow Bank Trust.
              </p>
            </div>

            {/* Receipt Summary */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Transaction Reference:</span>
                <span className="font-mono font-bold text-amber-700">{txId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Payment Channel:</span>
                <span className="font-bold text-slate-800 uppercase">{selectedMethod.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Amount Deposited:</span>
                <span className="font-mono font-black text-emerald-700 text-sm">{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Logistics Escort:</span>
                <span className="text-slate-800">{auction.shippingInfo.estimatedDays}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Bank Slip</span>
              </button>
              <button
                onClick={onClose}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider shadow-md transition-colors"
              >
                Done & Return
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
