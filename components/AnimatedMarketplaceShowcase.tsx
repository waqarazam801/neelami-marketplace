'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Gavel, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  DollarSign, 
  Globe, 
  CheckCircle, 
  ArrowRight, 
  Play, 
  Pause,
  Award,
  Users
} from 'lucide-react';

export default function AnimatedMarketplaceShowcase() {
  const [activeTab, setActiveTab] = useState<'bidders' | 'sellers'>('bidders');
  const [isPlaying, setIsPlaying] = useState(true);

  const bidderVideo = 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-luxury-watch-clockwork-42617-large.mp4';
  const sellerVideo = 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-and-showing-an-antique-brass-pocket-watch-41159-large.mp4';

  const videoRef = React.useRef<HTMLVideoElement>(null);

  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Top Header & Interactive Segment Selector */}
        <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-amber-50/40 via-white to-emerald-50/40">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5 text-amber-700" />
              <span>Animated Experience Guide</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
              How Neelami Empowers Both Bidders & Sellers
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Select your goal to see how our real-time exchange and escrow protect every transaction.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center p-1.5 rounded-2xl bg-slate-100 border border-slate-200 shrink-0">
            <button
              onClick={() => {
                setActiveTab('bidders');
                setIsPlaying(true);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'bidders'
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Gavel className="w-4 h-4" />
              <span>For Bidders</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('sellers');
                setIsPlaying(true);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'sellers'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>For Sellers</span>
            </button>
          </div>
        </div>

        {/* Dynamic Video & Step Card Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 items-center">
          {/* Left: Cinematic Looping Video Screen */}
          <div className="lg:col-span-6 relative aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-xl border border-slate-200 group">
            <video
              ref={videoRef}
              key={activeTab}
              src={activeTab === 'bidders' ? bidderVideo : sellerVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Ambient Dark Gradient for Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

            {/* Video Play/Pause Overlay */}
            <button
              onClick={toggleVideo}
              className="absolute bottom-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all shadow"
              title={isPlaying ? 'Pause Motion Video' : 'Play Motion Video'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            {/* Video Live Callout Overlay */}
            <div className="absolute bottom-4 left-4 text-white z-10">
              <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-600 px-2 py-0.5 rounded-md inline-block mb-1">
                {activeTab === 'bidders' ? 'Real-Time Clockwork Auction' : 'Museum Appraisal & Consignment'}
              </span>
              <p className="text-sm font-serif font-bold text-white leading-snug">
                {activeTab === 'bidders'
                  ? 'Feel the rush of real-time hammer strikes in Pakistan Rupees'
                  : 'Reach 50,000+ verified buyers across Lahore, Karachi & Overseas'}
              </p>
            </div>
          </div>

          {/* Right: 3 Value Pillars with Action */}
          <div className="lg:col-span-6 space-y-4">
            {activeTab === 'bidders' ? (
              <>
                <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">3D & 4K Condition Inspection</h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Rotate 360° in WebGL, zoom into dial movements, and watch 4K curator walkthroughs before placing your first bid.
                    </p>
                  </div>
                </div>

                <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 font-bold shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">100% Insured Company Escrow</h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Never wire money to a stranger. You pay Neelami.com company escrow. Funds are released only after you physically inspect the lot.
                    </p>
                  </div>
                </div>

                <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800 font-bold shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Anti-Sniping Soft Close</h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Bids in the last 2 minutes extend the clock automatically. No bots, no last-second sniping—just authentic fair bidding.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/#auction-grid"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                  >
                    <Gavel className="w-4 h-4 text-amber-300" />
                    <span>Browse Live Lots & Place Bids</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 font-bold shrink-0">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">0% Upfront Listing Fee</h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      List your rare watch, classic vehicle, gemstone, or plot for free. Commission is only paid upon successful hammer settlement.
                    </p>
                  </div>
                </div>

                <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-purple-100 text-purple-800 font-bold shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Worldwide High-Net-Worth Reach</h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Showcase your lot to verified collectors across Pakistan, UAE, UK, USA, and Europe with multi-currency bidding.
                    </p>
                  </div>
                </div>

                <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Guaranteed Payout Within 48 Hours</h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Buyer funds are secured in bank escrow prior to lot release, ensuring zero bounced checks or payment disputes.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/sell"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                  >
                    <span>Consign Your Item Today</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
