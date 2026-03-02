import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from './providers'

// Use system fonts (no Google Fonts network request required during build)
const interVariable  = '--font-inter'
const playfairVariable = '--font-playfair'

export const metadata: Metadata = {
  title: {
    default: 'Haven Housesits — Find Your Perfect House Sit',
    template: '%s | Haven Housesits',
  },
  description:
    'Haven Housesits connects trusted home owners with verified sitters worldwide. Browse free and paid sits, filter by pet type, location and dates. Better than TrustedHousesitters — more listings, more flexibility, better value.',
  keywords: [
    'house sitting',
    'housesitting',
    'pet sitting',
    'travel',
    'house sitter',
    'paid house sitting',
    'free house sitting',
    'home exchange',
  ],
  authors: [{ name: 'Haven Housesits' }],
  creator: 'Haven Housesits',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://havenhousesits.com',
    siteName: 'Haven Housesits',
    title: 'Haven Housesits — Find Your Perfect House Sit',
    description:
      'Browse free & paid house sits worldwide. Verified sitters, flexible options, premium add-ons.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Haven Housesits',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Haven Housesits',
    description: 'Browse free & paid house sits worldwide.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#5BA4A4',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-haven-cream font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
