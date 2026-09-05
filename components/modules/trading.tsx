'use client'

import { useMemo, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Bot, Check, Clock3, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { PageHeader, directionClass, money, plClass } from '@/components/modules/shared'
import { useTradingStore } from '@/lib/trading-store'

const watchlist = [
  { pair: 'EUR/USD', price: '1.08952', change: 0.36, spread: '0.4' },
  { pair: 'GBP/USD', price: '1.27421', change: -0.18, spread: '0.6' },
  { pair: 'XAU/USD', price: '2,334.18', change: 0.72, spread: '0.9' },
  { pair: 'USD/JPY', price: '155.421', change: -0.27, spread: '0.5' },
  { pair: 'AUD/USD', price: '0.66502', change: 0.11, spread: '0.7' },
  { pair: 'USD/CAD', price: '1.35902', change: -0.09, spread: '0.6' },
]

const checklist = [
  ['Trend alignment (H1 + H4)', true],
  ['Stochastic oversold cross', true],
  ['Liquidity sweep confirmed', true],
  ['News window clear', false],
] as const

export function TradingModule() {
  const { openPosition, selectedMarket, setSelectedMarket, positions, trades } = useTradingStore()
  const [selected, setSelected] = useState(selectedMarket || 'EUR/USD')
  const [side, setSide] = useState<'Buy' | 'Sell'>('Buy')
  const [lots, setLots] = useState('0.50')
  const [entry, setEntry] = useState('1.08952')
  const [stop, setStop] = useState('1.08600')
  const [take, setTake] = useState('1.09600')
  const [localOrders, setLocalOrders] = useState<Array<{ pair: string; side: 'Buy' | 'Sell'; lots: string; status: string; pl: number; time: string }>>([])

  const orders = useMemo(() => {
    const liveFromPositions = positions.map((p) => ({
      pair: p.symbol,
      side: (p.direction === 'buy' ? 'Buy' : 'Sell') as 'Buy' | 'Sell',
      lots: (p.stake / 100).toFixed(2),
      status: 'Open',
      pl: p.profitLoss || 0,
      time: 'live',
    }))
    const closedFromTrades = trades.slice(0, 3).map((t) => ({
      pair: t.symbol,
      side: (t.direction === 'buy' ? 'Buy' : 'Sell') as 'Buy' | 'Sell',
      lots: (t.stake / 100).toFixed(2),
      status: 'Filled',
      pl: t.profitLoss || 0,
      time: t.duration || 'recent',
    }))
    return [...localOrders, ...liveFromPositions, ...closedFromTrades].slice(0, 6)
  }, [positions, trades, localOrders])

  const risk = useMemo(() => {
    const lotsNum = Number(lots) || 0
    const entryNum = Number(entry) || 0
    const stopNum = Number(stop) || 0
    const takeNum = Number(take) || 0
    const pipValue = selected.includes('JPY') ? 9.09 : 10
    const slPips = Math.abs(entryNum - stopNum) * (selected.includes('JPY') ? 100 : 10000)
    const tpPips = Math.abs(takeNum - entryNum) * (selected.includes('JPY') ? 100 : 10000)
    const riskAmount = slPips * pipValue * lotsNum
    const rewardAmount = tpPips * pipValue * lotsNum
    const rr = riskAmount > 0 ? rewardAmount / riskAmount : 0
    return { riskAmount, rewardAmount, rr, slPips, tpPips }
  }, [lots, entry, stop, take, selected])

  const submit = () => {
    const lotsNum = Number(lots)
    if (!lotsNum || lotsNum <= 0) {
      toast.error('Enter a valid lot size.')
      return
    }
    const entryNum = Number(entry) || 1.0
    const stake = Math.round(lotsNum * 500)

    openPosition({
      symbol: selected,
      direction: side.toLowerCase() as 'buy' | 'sell',
      stake,
      entryPrice: entryNum,
      strategy: 'Manual Execution',
    })

    setLocalOrders((prev) => [
      { pair: selected, side, lots, status: 'Open', pl: 0, time: 'just now' },
      ...prev,
    ])
  }

  return (
    <>
      <PageHeader
        title="Trading Terminal"
        subtitle="Analyze markets, run the AI checklist, and place simulated orders."
        actions={
          <span className="rounded-md bg-positive/15 px-2 py-1 text-xs font-medium text-positive">Session: London open</span>
        }
      />
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 flex flex-col gap-3 xl:col-span-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Watchlist</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 px-2 pb-3">
              {watchlist.map((item) => (
                <button
                  key={item.pair}
                  onClick={() => {
                    setSelected(item.pair)
                    setEntry(item.price.replace(',', ''))
                    const price = Number(item.price.replace(',', ''))
                    const offset = item.pair.includes('JPY') ? 0.35 : item.pair.includes('XAU') ? 6 : 0.0035
                    setStop((side === 'Buy' ? price - offset : price + offset).toFixed(item.pair.includes('JPY') ? 3 : item.pair.includes('XAU') ? 2 : 5))
                    setTake((side === 'Buy' ? price + offset * 2 : price - offset * 2).toFixed(item.pair.includes('JPY') ? 3 : item.pair.includes('XAU') ? 2 : 5))
                    toast.info(`${item.pair} loaded on terminal.`)
                  }}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${selected === item.pair ? 'bg-primary/15 text-foreground' : 'hover:bg-accent'}`}
                  aria-pressed={selected === item.pair}
                >
                  <span className="font-medium">{item.pair}</span>
                  <span className="flex flex-col items-end">
                    <span className="font-mono text-xs">{item.price}</span>
                    <span className={`text-[11px] ${item.change >= 0 ? 'text-positive' : 'text-destructive'}`}>
                      {item.change >= 0 ? '+' : ''}
                      {item.change}%
                    </span>
                  </span>
                </button>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Bot className="size-4 text-primary" />
                AI Entry Checklist
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {checklist.map(([label, done]) => (
                <div key={label} className="flex items-center gap-2 text-xs">
                  <Check
                    className={`size-4 rounded-full p-0.5 ${done ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}
                  />
                  <span className={done ? '' : 'text-muted-foreground'}>{label}</span>
                </div>
              ))}
              <Separator />
              <div>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-mono text-primary">82%</span>
                </div>
                <Progress value={82} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 flex flex-col gap-3 xl:col-span-6">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">{selected} Market Chart</CardTitle>
              <span className="font-mono text-xs text-positive">1.08952 +0.36%</span>
            </CardHeader>
            <CardContent className="flex h-72 flex-col justify-between p-5 pt-2" role="img" aria-label={`${selected} simulated price chart`}>
              <svg className="h-56 w-full text-primary" viewBox="0 0 800 220" preserveAspectRatio="none" aria-hidden="true">
                <polyline fill="none" stroke="currentColor" strokeWidth="3" points="0,175 55,150 105,166 155,118 210,136 270,92 325,112 380,78 435,105 490,62 545,84 600,48 655,70 710,34 760,50 800,20" />
              </svg>
              <p className="text-right text-xs text-muted-foreground">Interactive demo market series · 15m</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 px-2 pb-3">
              {orders.map((order, index) => (
                <div key={`${order.pair}-${index}`} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-accent">
                  <span className="flex items-center gap-2">
                    {order.side === 'Buy' ? (
                      <ArrowUpRight className="size-4 text-positive" />
                    ) : (
                      <ArrowDownRight className="size-4 text-destructive" />
                    )}
                    <span className="font-medium">{order.pair}</span>
                    <span className="text-xs text-muted-foreground">{order.lots} lots</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className={`text-xs ${order.status === 'Filled' ? 'text-positive' : 'text-muted-foreground'}`}>{order.status}</span>
                    {order.pl !== 0 && <span className={`font-mono text-xs ${plClass(order.pl)}`}>{money(order.pl, { sign: true })}</span>}
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock3 className="size-3" />
                      {order.time}
                    </span>
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 xl:col-span-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Order Ticket — {selected}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex overflow-hidden rounded-lg border">
                <button
                  onClick={() => setSide('Buy')}
                  className={`flex-1 py-2 text-sm font-medium ${side === 'Buy' ? 'bg-positive text-positive-foreground' : 'text-muted-foreground hover:bg-accent'}`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setSide('Sell')}
                  className={`flex-1 py-2 text-sm font-medium ${side === 'Sell' ? 'bg-destructive text-primary-foreground' : 'text-muted-foreground hover:bg-accent'}`}
                >
                  Sell
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="lots">Lot size</Label>
                <Input id="lots" inputMode="decimal" value={lots} onChange={(e) => setLots(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="entry">Entry</Label>
                <Input id="entry" inputMode="decimal" value={entry} onChange={(e) => setEntry(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="stop">Stop loss</Label>
                  <Input id="stop" inputMode="decimal" value={stop} onChange={(e) => setStop(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="take">Take profit</Label>
                  <Input id="take" inputMode="decimal" value={take} onChange={(e) => setTake(e.target.value)} />
                </div>
              </div>
              <Separator />
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Risk</span>
                  <span className={`font-mono ${directionClass('sell')}`}>{money(risk.riskAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reward</span>
                  <span className="font-mono text-positive">{money(risk.rewardAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Risk : Reward</span>
                  <span className="flex items-center gap-1 font-mono">
                    <TrendingUp className="size-3 text-primary" />1 : {risk.rr.toFixed(2)}
                  </span>
                </div>
              </div>
              <Button className="w-full" onClick={submit}>
                Place {side} order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
