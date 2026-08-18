import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Starfield from '@/components/layout/Starfield';
import ChatBot from '@/components/layout/ChatBot';
import EducationModal from '@/components/home/EducationModal';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from 'next';
import { SITE_URL, SITE_NAME, SITE_LOCALE, absoluteUrl } from '@/lib/site';
import { SITE_CONFIG } from '@/lib/constants';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: '/',
  },
  // Explicit crawl directives. max-image-preview:large is what allows a full-size
  // thumbnail in Google results rather than a cropped one.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'TheEthicalTrader — Institutional Trading Education',
    description: 'Master ICT, SMC, and Order Flow. Professional trading intelligence combined with real execution frameworks.',
    url: '/',
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    type: 'website',
    // Images come from app/opengraph-image.tsx. The previous manual reference to
    // /og-image.webp pointed at a file that does not exist in public/, so every
    // social share rendered without a preview image.
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TheEthicalTrader — Professional Trading Edge',
    description: 'Learn ICT, Smart Money Concepts, and Order Flow from professionals.',
  }
};

/**
 * Organization + WebSite structured data.
 *
 * The previous markup declared an EducationalOrganization with a hardcoded $149
 * Offer. Offer markup asserts a machine-readable price and availability, which
 * Google can surface as a rich result and hold to account, so pricing is left out
 * of structured data entirely and stays on the pricing section where it is managed.
 */
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      description: 'Trading education and market intelligence covering ICT, Smart Money Concepts and order flow.',
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/icon.png'),
      },
      sameAs: [SITE_CONFIG.links.telegram],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        url: absoluteUrl('/contact'),
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en-IN',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&family=Cabinet+Grotesk:wght@300;400;500;700;800&family=Fira+Code:wght@300;400;500&display=swap" rel="stylesheet" />
        <link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@300,400,500,700,800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
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
