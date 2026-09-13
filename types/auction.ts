export type Category = 
  | 'All'
  | 'Antiques & Art'
  | 'Electronics & Gadgets'
  | 'Luxury Watches'
  | 'Vehicles & Motors'
  | 'Jewelry & Gems'
  | 'Real Estate & Land'
  | 'Collectibles';

export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  bidderAvatar?: string;
  amount: number;
  timestamp: string; // ISO string
  isAutoBid?: boolean;
}

export interface Seller {
  id: string;
  name: string;
  rating: number;
  salesCount: number;
  verified: boolean;
  city: string;
  avatar?: string;
}

export interface ShippingInfo {
  city: string;
  cost: number;
  estimatedDays: string;
  pickupAvailable: boolean;
}

export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  category: Category;
  condition: 'Brand New' | 'Like New' | 'Used - Mint' | 'Antique / Vintage' | 'Refurbished';
  images: string[];
  startingBid: number;
  currentBid: number;
  reservePrice: number;
  minIncrement: number;
  buyNowPrice?: number;
  bidsCount: number;
  seller: Seller;
  startTime: string;
  endTime: string;
  status: 'live' | 'ending_soon' | 'upcoming' | 'closed';
  winnerId?: string;
  winnerName?: string;
  featured?: boolean;
  shippingInfo: ShippingInfo;
  specifications: Record<string, string>;
  bids: Bid[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller';
  avatar: string;
  walletBalance: number;
  rating: number;
  city: string;
  joinedDate: string;
}

export type FilterStatus = 'all' | 'live' | 'ending_soon' | 'upcoming' | 'closed';
export type SortOption = 'ending_soonest' | 'bids_high' | 'price_low' | 'price_high' | 'newest';
