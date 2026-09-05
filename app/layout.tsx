import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { TradingProvider } from '@/lib/trading-store'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'https://deriv-bot-dashboard.vercel.app',
  ),
  title: 'QuantStoch | Deriv Bot Operations',
  description: 'Autonomous trading bot dashboard with real-time TradingView charts, risk safeguards, and live Deriv WebSocket telemetry.',
  openGraph: {
    title: 'QuantStoch | Deriv Bot Operations',
    description: 'Autonomous trading bot dashboard with real-time TradingView charts, risk safeguards, and live Deriv WebSocket telemetry.',
    siteName: 'QuantStoch Trading System',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'QuantStoch Deriv Bot Operations Dashboard',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuantStoch | Deriv Bot Operations',
    description: 'Autonomous trading bot dashboard with real-time TradingView charts, risk safeguards, and live Deriv WebSocket telemetry.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/icon-dark-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/icon-light-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#eff8ff' },
    { media: '(prefers-color-scheme: dark)', color: '#080e1a' },
  ],
}

const themeScript = `try{const t=localStorage.getItem('ocean-theme')||'dark';document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(t)}catch(e){}`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-background" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* OpenGraph & Social Cards */}
        <meta property="og:title" content="QuantStoch | Deriv Bot Operations" />
        <meta property="og:description" content="Autonomous trading bot dashboard with real-time TradingView charts, risk safeguards, and live Deriv WebSocket telemetry." />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="QuantStoch | Deriv Bot Operations" />
        <meta name="twitter:description" content="Autonomous trading bot dashboard with real-time TradingView charts, risk safeguards, and live Deriv WebSocket telemetry." />
        <meta name="twitter:image" content="/og-image.png" />
        {/* Candlestick Favicon */}
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon-dark-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" sizes="180x180" />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`} suppressHydrationWarning>
        <TradingProvider>
          {children}
          <Toaster position="bottom-right" richColors />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </TradingProvider>
      </body>
    </html>
  )
}
