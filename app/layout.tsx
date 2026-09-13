import type { Metadata } from 'next';
import './globals.css';
import { AuctionProvider } from '../context/AuctionContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { NotificationToast } from '../components/NotificationToast';

export const metadata: Metadata = {
  title: 'Neelami.com | Pakistan’s Royal Auction House & Bidding Exchange',
  description: 'Bid on museum-grade Mughal antiques, certified luxury timepieces, precious gems, vehicles, and landmark properties across Pakistan in Pakistani Rupees (PKR ₨).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#050A14] text-slate-100 font-sans antialiased selection:bg-amber-400 selection:text-slate-950">
        <AuctionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <NotificationToast />
        </AuctionProvider>
      </body>
    </html>
  );
}
