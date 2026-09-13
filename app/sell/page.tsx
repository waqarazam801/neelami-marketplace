'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuction } from '../../context/AuctionContext';
import { Category, AuctionItem } from '../../types/auction';
import { 
  PlusCircle, 
  Gavel, 
  Image as ImageIcon, 
  ShieldCheck, 
  HelpCircle, 
  ArrowLeft,
  Sparkles,
  Check,
  Globe
} from 'lucide-react';

const PRESET_SAMPLE_IMAGES = [
  { label: 'Rolex Watch', url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Classic Car', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80' },
  { label: 'MacBook Pro', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Sapphire Ring', url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Antique Relic', url: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Silk Carpet', url: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1000&q=80' },
];

export default function SellAuctionPage() {
  const router = useRouter();
  const { currentUser, createAuction, currency, formatPrice } = useAuction();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Luxury Watches');
  const [condition, setCondition] = useState<AuctionItem['condition']>('Like New');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_SAMPLE_IMAGES[0].url);
  const [startingBid, setStartingBid] = useState<number>(250000);
  const [reservePrice, setReservePrice] = useState<number>(300000);
  const [minIncrement, setMinIncrement] = useState<number>(10000);
  const [buyNowPrice, setBuyNowPrice] = useState<number | ''>(450000);
  const [durationHours, setDurationHours] = useState<number>(24);
  const [city, setCity] = useState('Lahore');
  const [shippingCost, setShippingCost] = useState<number>(1500);

  // Specifications
  const [specBrand, setSpecBrand] = useState('Omega');
  const [specModel, setSpecModel] = useState('Speedmaster Professional Moonwatch');
  const [specYear, setSpecYear] = useState('2021');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill in title and item description.');
      return;
    }

    setIsSubmitting(true);

    const startTime = new Date().toISOString();
    const endTime = new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString();

    const newId = createAuction({
      title,
      description,
      category,
      condition,
      images: [imageUrl],
      startingBid,
      reservePrice: reservePrice || startingBid,
      minIncrement,
      buyNowPrice: typeof buyNowPrice === 'number' && buyNowPrice > 0 ? buyNowPrice : undefined,
      seller: {
        id: currentUser.id,
        name: currentUser.name,
        rating: currentUser.rating,
        salesCount: 1,
        verified: true,
        city: city,
        avatar: currentUser.avatar,
      },
      startTime,
      endTime,
      status: durationHours <= 0.5 ? 'ending_soon' : 'live',
      featured: true,
      shippingInfo: {
        city,
        cost: shippingCost,
        estimatedDays: '1-3 Business Days Insured Courier',
        pickupAvailable: true,
      },
      specifications: {
        'Brand / Origin': specBrand || 'Authentic Consignment',
        'Model / Line': specModel || 'Collector Edition',
        'Year / Era': specYear || 'Contemporary',
        'Provenance': `Direct from ${currentUser.name}`,
      },
    });

    // Redirect to the new auction room
    router.push(`/auction/${newId}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-white min-h-screen">
      {/* Top Header */}
      <div className="space-y-2">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-700 mb-2 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Auctions
        </Link>
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <PlusCircle className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              List an Item on Neelami.com
            </h1>
            <p className="text-xs text-slate-500">
              Auction your luxury goods, electronics, art, and motors to verified bidders across Pakistan and worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* Main Listing Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Item Basic Details */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-mono">1</span>
            Item Identification & Category
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Item Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 1972 Vintage Rolex Datejust 36mm Solid Gold Dial"
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                >
                  <option value="Luxury Watches">Luxury Watches</option>
                  <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                  <option value="Vehicles & Motors">Vehicles & Motors</option>
                  <option value="Antiques & Art">Antiques & Art</option>
                  <option value="Jewelry & Gems">Jewelry & Gems</option>
                  <option value="Real Estate & Land">Real Estate & Land</option>
                  <option value="Collectibles">Collectibles</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Condition *
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as AuctionItem['condition'])}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                >
                  <option value="Brand New">Brand New (Factory Sealed)</option>
                  <option value="Like New">Like New (Mint with Box)</option>
                  <option value="Used - Mint">Used - Mint (Minor wear)</option>
                  <option value="Antique / Vintage">Antique / Vintage (Original Patina)</option>
                  <option value="Refurbished">Refurbished</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Detailed Description *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe provenance, history, box & papers, service records, flaws, and notable attributes..."
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Photos & Media */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-mono">2</span>
            Photos & Gallery
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Primary Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 font-mono"
              />
            </div>

            {/* Quick Presets */}
            <div>
              <span className="text-xs text-slate-500 block mb-2 font-medium">Or select from demo item presets:</span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {PRESET_SAMPLE_IMAGES.map((preset) => (
                  <button
                    type="button"
                    key={preset.label}
                    onClick={() => setImageUrl(preset.url)}
                    className={`relative rounded-xl overflow-hidden border-2 aspect-square p-0.5 transition-all ${
                      imageUrl === preset.url
                        ? 'border-emerald-600 scale-105 shadow-md'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={preset.url} alt={preset.label} fill className="object-cover" />
                    <span className="absolute bottom-1 left-1 right-1 bg-slate-900/80 text-[10px] text-white text-center rounded py-0.5 truncate font-semibold">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {imageUrl && (
              <div className="pt-2 flex items-center gap-4">
                <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-slate-50 border border-slate-200">
                  <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                </div>
                <div className="text-xs text-slate-500">
                  <p className="font-semibold text-emerald-700">Image Loaded Successfully</p>
                  <p className="text-[11px] text-slate-400">Will be featured on lot preview cards and live auction room.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Bidding & Pricing in PKR */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-mono">3</span>
              Auction Pricing & Global Conversion (Base PKR ₨)
            </h2>
            <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Active Currency: {currency}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Starting Bid (Base PKR ₨) *
              </label>
              <input
                type="number"
                required
                min={1000}
                step={1000}
                value={startingBid}
                onChange={(e) => setStartingBid(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 font-mono font-bold"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Worldwide Display: {formatPrice(startingBid)}</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Reserve Price (PKR ₨) *
              </label>
              <input
                type="number"
                required
                min={startingBid}
                step={1000}
                value={reservePrice}
                onChange={(e) => setReservePrice(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 font-mono font-bold"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Minimum price you are willing to sell for.</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Minimum Bid Increment (PKR ₨) *
              </label>
              <input
                type="number"
                required
                min={500}
                step={500}
                value={minIncrement}
                onChange={(e) => setMinIncrement(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Optional "Buy It Now" Price (PKR ₨)
              </label>
              <input
                type="number"
                min={reservePrice}
                step={1000}
                value={buyNowPrice}
                onChange={(e) => setBuyNowPrice(e.target.value ? Number(e.target.value) : '')}
                placeholder="Leave blank if auction only"
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 font-mono font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Auction Duration
              </label>
              <select
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
              >
                <option value={0.25}>15 Minutes (Instant Test Run)</option>
                <option value={1}>1 Hour (Fast-Paced Neelami)</option>
                <option value={6}>6 Hours (Same-Day Auction)</option>
                <option value={24}>24 Hours (1 Day)</option>
                <option value={72}>3 Days (Standard Lot)</option>
                <option value={168}>7 Days (Premier Showcase)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Specifications & Location */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-mono">4</span>
            Location & Logistics in Pakistan
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Item Location / City *
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
              >
                <option value="Lahore">Lahore</option>
                <option value="Karachi">Karachi</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Peshawar">Peshawar</option>
                <option value="Faisalabad">Faisalabad</option>
                <option value="Multan">Multan</option>
                <option value="Quetta">Quetta</option>
                <option value="Sialkot">Sialkot</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Courier & Escort Shipping (PKR ₨)
              </label>
              <input
                type="number"
                min={0}
                step={500}
                value={shippingCost}
                onChange={(e) => setShippingCost(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Brand / Maker / Artist
              </label>
              <input
                type="text"
                value={specBrand}
                onChange={(e) => setSpecBrand(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Model / Reference
              </label>
              <input
                type="text"
                value={specModel}
                onChange={(e) => setSpecModel(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Consignor Guarantee Notice */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-xs text-emerald-950">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-emerald-900">Neelami Seller Assurance:</span> All bids are legally binding contracts under Pakistan e-commerce laws. Winning payments are secured in escrow prior to dispatch.
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-black text-sm shadow-xl shadow-emerald-700/20 transition-transform active:scale-95 flex items-center gap-2"
          >
            <Gavel className="w-4 h-4" />
            <span>{isSubmitting ? 'Publishing Lot...' : 'Publish Lot for Bidding'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
