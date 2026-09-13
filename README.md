# Neelami.com — Pakistan's Premier Online Auction & Bidding Marketplace

Neelami.com is a full-featured, real-time online auction marketplace engineered for luxury timepieces, Mughal antiquities, rare electronics, vehicles, and high-value properties across Pakistan.

All currency transactions, starting bids, and increments are denominated in **Pakistani Rupees (PKR ₨)**.

---

## 🌟 Key Features

1. **Live Auction Bidding Rooms**:
   - High-precision real-time countdown timer with auto-refreshing bid streams.
   - Dynamic quick-increment bid buttons (`+₨ 50,000`, `+₨ 100,000`, `+₨ 250,000`).
   - Custom bid input with minimum required threshold validation.
   - **Anti-Sniping Engine (Soft Close)**: Any bid placed within the final 2 minutes automatically extends the auction clock by 2 minutes, preventing bot sniping.
   - Optional **Buy It Now** instant purchase option.

2. **Consignment & Seller Hub (`/sell`)**:
   - Comprehensive lot submission form with category selection, condition grading, high-res photos, starting bid, reserve price, bid increment, and duration (15 mins test run up to 7 days).
   - Nationwide logistics information (Lahore, Karachi, Islamabad, Peshawar, Quetta, Multan).

3. **Neelami Member Dashboard (`/dashboard`)**:
   - **My Active Bids**: Live tracker highlighting whether you are the "Highest Bidder" or have been "Outbid", with 1-click counter-bidding.
   - **Won Lots**: Celebration slips, downloadable consignment invoices, and safe-escrow handover verification.
   - **My Listed Auctions**: Seller management panel for monitoring incoming bids and reserve status.
   - **Watchlist**: Real-time bookmarks with urgency indicators.

4. **Live Competitor Simulator**:
   - Toggleable simulated bidding engine that places realistic competing bids in the background so you can immediately experience live bidding wars and outbid alerts.

5. **Instant Demo Profile Switcher**:
   - 1-click dropdown in the header to alternate between **Hamza Khan (Buyer)**, **Fatima Noor (Seller)**, and other bidders.

---

## 🚀 Getting Started

```bash
# Navigate to project directory
cd C:\Users\GA\.gemini\antigravity\scratch\neelami-marketplace

# Start the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
