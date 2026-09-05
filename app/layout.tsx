import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { TradingProvider } from '@/lib/trading-store'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'QuantStoch | Deriv Bot Operations',
  description: 'Connect Deriv, configure safeguards, and monitor your externally hosted trading bot from a safety-first operations dashboard.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
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
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
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
