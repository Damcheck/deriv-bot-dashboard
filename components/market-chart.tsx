'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const periods = ['1m', '5m', '15m', '1H', '4H', '1D'] as const
const symbols = [
  'EUR/USD',
  'GBP/USD',
  'USD/JPY',
  'XAU/USD',
  'USD/CAD',
  'AUD/USD',
  'BTC/USD',
  'ETH/USD',
] as const

const tradingViewSymbols: Record<(typeof symbols)[number], string> = {
  'EUR/USD': 'FX:EURUSD',
  'GBP/USD': 'FX:GBPUSD',
  'USD/JPY': 'FX:USDJPY',
  'XAU/USD': 'OANDA:XAUUSD',
  'USD/CAD': 'FX:USDCAD',
  'AUD/USD': 'FX:AUDUSD',
  'BTC/USD': 'COINBASE:BTCUSD',
  'ETH/USD': 'COINBASE:ETHUSD',
}

const tradingViewIntervals: Record<(typeof periods)[number], string> = {
  '1m': '1',
  '5m': '5',
  '15m': '15',
  '1H': '60',
  '4H': '240',
  '1D': 'D',
}

export function MarketChart({ live = true }: { live?: boolean }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [period, setPeriod] = useState<(typeof periods)[number]>('15m')
  const [symbol, setSymbol] = useState<(typeof symbols)[number]>('EUR/USD')
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [isLoaded, setIsLoaded] = useState(false)

  // Listen for dark/light mode switches from the document root
  useEffect(() => {
    const readTheme = () => setTheme(document.documentElement.classList.contains('light') ? 'light' : 'dark')
    readTheme()

    const observer = new MutationObserver(readTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // Mount/update real-time TradingView widget matching current theme and symbol
  useEffect(() => {
    if (!live || !containerRef.current) return

    setIsLoaded(false)
    containerRef.current.innerHTML = ''

    const widgetContainer = document.createElement('div')
    widgetContainer.className = 'tradingview-widget-container'
    widgetContainer.style.width = '100%'
    widgetContainer.style.height = '100%'

    const widgetDiv = document.createElement('div')
    widgetDiv.className = 'tradingview-widget-container__widget'
    widgetDiv.style.width = '100%'
    widgetDiv.style.height = '100%'
    widgetContainer.appendChild(widgetDiv)

    // Palette matched strictly to app/globals.css theme variables
    const isDark = theme === 'dark'
    const bgColor = isDark ? '#10192c' : '#f7fbff'
    const gridColor = isDark ? 'rgba(30, 45, 74, 0.45)' : 'rgba(189, 221, 248, 0.45)'

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: tradingViewSymbols[symbol] || 'FX:EURUSD',
      interval: tradingViewIntervals[period] || '15',
      timezone: 'Etc/UTC',
      theme: isDark ? 'dark' : 'light',
      style: '1', // 1 = Real-time Japanese Candlesticks
      locale: 'en',
      backgroundColor: bgColor,
      gridColor: gridColor,
      hide_top_toolbar: false,
      hide_legend: false,
      hide_side_toolbar: true, // Clean uncluttered view
      hide_volume: true, // No follow-come indicator (strictly no volume bars)
      studies: [], // No attached default indicators
      allow_symbol_change: true,
      save_image: false,
      calendar: false,
      support_host: 'https://www.tradingview.com',
    })

    script.onload = () => setIsLoaded(true)
    widgetContainer.appendChild(script)
    containerRef.current.appendChild(widgetContainer)

    const timer = window.setTimeout(() => setIsLoaded(true), 1500)

    return () => {
      window.clearTimeout(timer)
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [live, period, symbol, theme])

  return (
    <section className="glass-panel rounded-xl border p-3 sm:p-4 lg:p-5" aria-labelledby="market-title">
      <div className="flex flex-col gap-4">
        {/* Header with Title and Live Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <h2 id="market-title" className="font-sans text-base font-semibold tracking-tight">
              Market Overview
            </h2>
            <span className="text-xs text-muted-foreground">· Real-Time Chart</span>
          </div>

          <span className="flex items-center gap-2 rounded-full border border-positive/30 bg-positive/10 px-3 py-1 text-xs font-medium text-positive">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-positive opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-positive" />
            </span>
            Real-time Live
          </span>
        </div>

        {/* Market Pair Dropdown & Timeframe Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="font-mono font-medium" />}>
                {symbol}
                <ChevronDown data-icon="inline-end" className="size-3.5 opacity-70" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-44">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Select Market</DropdownMenuLabel>
                  {symbols.map((item) => (
                    <DropdownMenuItem
                      key={item}
                      onClick={() => setSymbol(item)}
                      className="flex items-center justify-between font-mono text-xs"
                    >
                      <span>{item}</span>
                      {item === symbol && <Check className="size-4 text-primary" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex overflow-hidden rounded-lg border bg-muted/40 p-0.5" aria-label="Chart timeframe">
              {periods.map((item) => (
                <button
                  key={item}
                  onClick={() => setPeriod(item)}
                  className={`min-h-7 rounded-md px-2.5 text-xs font-medium transition-all ${
                    period === item
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                  aria-pressed={period === item}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Candlestick stream · {symbol}
          </p>
        </div>

        {/* Real-time TradingView Container */}
        <div className="relative h-[380px] min-h-[340px] w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-colors duration-200 sm:h-[440px] lg:h-[500px]">
          {live ? (
            <>
              <div
                ref={containerRef}
                className="h-full w-full"
                aria-label={`${symbol} ${period} live TradingView chart`}
              />
              {!isLoaded && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-card/80 text-xs text-muted-foreground backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <span className="size-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Loading real-time market stream...
                  </div>
                </div>
              )}
            </>
          ) : (
            <div
              className="flex h-full flex-col justify-between p-5"
              role="img"
              aria-label={`${symbol} ${period} simulated price chart`}
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{symbol} · {period}</span>
                <span className="font-mono text-positive">1.08952 +0.36%</span>
              </div>
              <svg className="h-56 w-full text-primary" viewBox="0 0 800 220" preserveAspectRatio="none" aria-hidden="true">
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  points="0,175 55,150 105,166 155,118 210,136 270,92 325,112 380,78 435,105 490,62 545,84 600,48 655,70 710,34 760,50 800,20"
                />
              </svg>
              <p className="text-right text-xs text-muted-foreground">Interactive demo market series</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Real-time price feed · zero indicator overlay</span>
          <span>Powered by TradingView</span>
        </div>
      </div>
    </section>
  )
}
