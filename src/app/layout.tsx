import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Starfield from '@/components/layout/Starfield';
import ChatBot from '@/components/layout/ChatBot';
import EducationModal from '@/components/home/EducationModal';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://theethicaltrader.com'),
  title: {
    default: 'TheEthicalTrader — Master the Markets',
    template: '%s | TheEthicalTrader'
  },
  icons: {
    icon: '/favicon.ico?v=2',
    apple: '/apple-icon.png?v=2',
  },
  description: 'Learn ICT, Smart Money Concepts, and Order Flow trading with institutional-grade tools.',
  keywords: ['ICT trading', 'Smart Money Concepts', 'Order flow trading', 'Forex trading education', 'Stock Market', 'Crypto', 'Cumulative Delta', 'Depth of Market'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'TheEthicalTrader — Institutional Trading Education',
    description: 'Master ICT, SMC, and Order Flow. Professional trading intelligence combined with real execution frameworks.',
    url: '/',
    siteName: 'TheEthicalTrader',
    images: [{ url: '/og-image.webp', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TheEthicalTrader — Professional Trading Edge',
    description: 'Learn ICT, Smart Money Concepts, and Order Flow from professionals.',
    images: ['/og-image.webp'],
  }
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'TheEthicalTrader',
  description: 'Trading education platform focusing on ICT, SMC, and Order Flow.',
  url: 'https://theethicaltrader.com',
  offers: {
    '@type': 'Offer',
    price: '149.00',
    priceCurrency: 'USD',
    name: 'Pro Trader Subscription'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&family=Cabinet+Grotesk:wght@300;400;500;700;800&family=Fira+Code:wght@300;400;500&display=swap" rel="stylesheet" />
        <link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@300,400,500,700,800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans text-cream bg-void antialiased">
        <Starfield />
        <Header />
        <div className="relative z-10 w-full">
          {children}
        </div>
        <Footer />
        <EducationModal />
        <ChatBot />
        <SpeedInsights />
      </body>
    </html>
  );
}
