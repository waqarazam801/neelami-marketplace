'use client';

import React, { useState } from 'react';
import { AuctionItem } from '../types/auction';
import { formatPKR } from '../utils/formatters';
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
  Printer
} from 'lucide-react';

interface EscrowPaymentModalProps {
  auction: AuctionItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type PaymentMethodType = 'raast' | 'bank_transfer' | 'card' | 'wallet' | 'pay_order';

export const EscrowPaymentModal: React.FC<EscrowPaymentModalProps> = ({
  auction,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('raast');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0B152A] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isPaid ? (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  SAFE-ESCROW SETTLEMENT
                </span>
                <span className="text-xs text-slate-400">LOT #{auction.id.toUpperCase()}</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-white">
                Payment & Escrow Deposit
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Your payment is held safely by Neelami.com until your item is delivered, inspected, and verified.
              </p>
            </div>

            {/* Direct Warning: Pay Company, NOT Seller */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-xs text-amber-200 space-y-1">
              <div className="flex items-center gap-2 text-amber-300 font-bold uppercase tracking-wide">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Pay to Neelami.com (Company) — NEVER to the Seller Person</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed pl-6">
                For buyer safety, you are depositing funds into <strong>Neelami.com (Private) Limited Official Trust</strong>. The consignor ({auction.seller.name}) is only paid after you inspect and sign off on the delivery.
              </p>
            </div>

            {/* Price Breakdown */}
            <div className="p-4.5 rounded-2xl bg-[#081020] border border-amber-500/20 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Winning Hammer Bid:</span>
                <span className="font-mono font-bold text-sm text-slate-100">{formatPKR(hammerPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Neelami Escrow Protection (1%):</span>
                <span className="font-mono font-semibold">{formatPKR(escrowFee)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Insured Nationwide Delivery ({auction.shippingInfo.city}):</span>
                <span className="font-mono font-semibold">
                  {shippingFee === 0 ? 'Complimentary' : formatPKR(shippingFee)}
                </span>
              </div>
              <div className="pt-2 border-t border-amber-500/15 flex items-center justify-between font-bold text-sm">
                <span className="text-amber-300">Total Escrow Deposit (PKR):</span>
                <span className="text-xl font-mono text-amber-400">{formatPKR(totalAmount)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Choose Pakistani Payment Method:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. Raast Instant Transfer */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('raast')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    selectedMethod === 'raast'
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-950'
                      : 'bg-[#081020] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <span>Raast Instant P2M</span>
                      <span className="text-[9px] bg-emerald-950 text-emerald-300 px-1 rounded font-mono">0% Fee</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      Instant State Bank Raast ID / QR. Any Pakistani Bank app.
                    </p>
                  </div>
                </button>

                {/* 2. Direct Bank Wire / 1Link */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('bank_transfer')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    selectedMethod === 'bank_transfer'
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-950'
                      : 'bg-[#081020] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Bank Wire / 1Link IBFT</div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      HBL, Meezan, Alfalah, Standard Chartered Trust Account.
                    </p>
                  </div>
                </button>

                {/* 3. Debit / Credit Card */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    selectedMethod === 'card'
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-950'
                      : 'bg-[#081020] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Visa / Mastercard / PayPak</div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      Local & international cards with 3D Secure OTP.
                    </p>
                  </div>
                </button>

                {/* 4. Mobile Wallets */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('wallet')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    selectedMethod === 'wallet'
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-950'
                      : 'bg-[#081020] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">JazzCash & EasyPaisa</div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      Instant mobile wallet PIN approval (up to ₨ 2 Lac).
                    </p>
                  </div>
                </button>

                {/* 5. Banker's Pay Order (High Value) */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('pay_order')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 sm:col-span-2 ${
                    selectedMethod === 'pay_order'
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-950'
                      : 'bg-[#081020] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Certified Banker's Cheque / Pay Order (Vehicles & Land)</div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      Drawn in favor of "Neelami Escrow Trustee (Pvt) Ltd". Vault inspection upon bank clearance.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Selected Method Details Preview */}
            <div className="p-4 rounded-2xl bg-[#081020] border border-amber-500/15 text-xs space-y-2">
              {selectedMethod === 'raast' && (
                <div className="space-y-1">
                  <div className="font-bold text-amber-300">State Bank Raast Instant Transfer:</div>
                  <div className="text-slate-300 flex items-center justify-between font-mono bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                    <span>Raast ID: <strong>neelami.escrow@hbl</strong></span>
                    <span className="text-emerald-400 font-bold">Instant Verification</span>
                  </div>
                </div>
              )}

              {selectedMethod === 'bank_transfer' && (
                <div className="space-y-1">
                  <div className="font-bold text-blue-300">Meezan Bank Escrow Trust Account:</div>
                  <div className="text-slate-300 text-[11px] font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-0.5">
                    <div>Title: <strong>Neelami Escrow Trustee Private Limited</strong></div>
                    <div>IBAN: <strong>PK36 MEZN 0001 2345 6789 0123</strong></div>
                    <div>Branch: Main Gulberg Branch, Lahore</div>
                  </div>
                </div>
              )}

              {selectedMethod === 'card' && (
                <div className="space-y-1">
                  <div className="font-bold text-emerald-300">Visa, Mastercard, & PayPak Gateway:</div>
                  <p className="text-slate-400 text-[11px]">
                    Encrypted via 256-bit SSL. OTP will be sent to your registered Pakistani bank mobile number.
                  </p>
                </div>
              )}

              {selectedMethod === 'wallet' && (
                <div className="space-y-1">
                  <div className="font-bold text-purple-300">JazzCash / EasyPaisa Mobile Checkout:</div>
                  <p className="text-slate-400 text-[11px]">
                    Enter your mobile wallet number to receive an instant MPIN confirmation prompt on your phone.
                  </p>
                </div>
              )}

              {selectedMethod === 'pay_order' && (
                <div className="space-y-1">
                  <div className="font-bold text-amber-300">Certified Banker's Pay Order:</div>
                  <p className="text-slate-400 text-[11px]">
                    Issue pay order from any scheduled bank in Pakistan. Physical handover scheduled at LDA Lahore / registry office.
                  </p>
                </div>
              )}
            </div>

            {/* Escrow Guarantee Notice */}
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-start gap-2.5 text-xs text-emerald-300">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">100% Escrow Protection:</span> The seller ({auction.seller.name}) will not receive payment until you inspect and accept the lot.
              </div>
            </div>

            {/* Submit Action */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-emerald-950 transition-all transform active:scale-98 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isProcessing ? 'Verifying with Bank...' : `Deposit ${formatPKR(totalAmount)} to Escrow`}
              </span>
            </button>
          </div>
        ) : (
          /* Payment Success State */
          <div className="text-center py-4 space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-3xl bg-emerald-950 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-950">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                PAYMENT CONFIRMED • FUNDS SECURED IN ESCROW
              </span>
              <h3 className="text-2xl font-serif font-bold text-white mt-1">
                Escrow Deposit Received!
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Your payment for <strong className="text-slate-200">{auction.title}</strong> has been secured in Habib Bank Limited Escrow Trust.
              </p>
            </div>

            {/* Receipt Summary */}
            <div className="p-5 rounded-2xl bg-[#081020] border border-amber-500/20 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Transaction Reference:</span>
                <span className="font-mono font-bold text-amber-400">{txId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Payment Channel:</span>
                <span className="font-bold text-slate-200 uppercase">{selectedMethod.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Amount Deposited:</span>
                <span className="font-mono font-black text-emerald-400 text-sm">{formatPKR(totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Logistics Escort:</span>
                <span className="text-slate-200">{auction.shippingInfo.estimatedDays}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Bank Slip</span>
              </button>
              <button
                onClick={onClose}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-950"
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
