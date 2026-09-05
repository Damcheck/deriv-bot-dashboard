'use client'

import { useState } from 'react'
import { Bot, Play, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader, StatCard, money, plClass } from '@/components/modules/shared'
import { useTradingStore } from '@/lib/trading-store'

const equity = [10000, 10180, 10120, 10420, 10680, 10510, 10920, 11240, 11080, 11520, 11890, 12140, 12010, 12480, 12860, 13120]
const months = [
  ['January', 4.2], ['February', -1.4], ['March', 6.1], ['April', 2.8], ['May', 5.4], ['June', -0.9],
] as const
const sampleTrades = [
  ['EUR/USD', 'Buy', '+$182.40', 'Win'], ['GBP/USD', 'Sell', '-$64.10', 'Loss'], ['XAU/USD', 'Buy', '+$318.90', 'Win'],
  ['USD/JPY', 'Sell', '+$142.20', 'Win'], ['AUD/USD', 'Buy', '-$38.70', 'Loss'], ['USD/CAD', 'Sell', '+$96.30', 'Win'],
]

function EquityCurve({ data }: { data: number[] }) {
  const w = 640
  const h = 220
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const points = data.map((v, i) => `${(i * w) / (data.length - 1)},${h - ((v - min) / range) * (h - 20) - 10}`).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-56 w-full" role="img" aria-label="Backtest equity curve">
      <polyline fill="none" stroke="var(--primary)" strokeWidth="2.5" points={points} />
      <polygon fill="color-mix(in srgb, var(--primary) 14%, transparent)" points={`0,${h} ${points} ${w},${h}`} />
    </svg>
  )
}

export function BacktestingModule() {
  const { activeStrategy, setActiveStrategy, selectedMarket, setSelectedMarket, trades: storeTrades } = useTradingStore()
  const [strategy, setStrategy] = useState(activeStrategy || 'QuantStoch Core v1.4')
  const [market, setMarket] = useState(selectedMarket || 'EUR/USD')
  const [from, setFrom] = useState('2024-01-01')
  const [to, setTo] = useState('2024-06-30')
  const [progress, setProgress] = useState(100)
  const [running, setRunning] = useState(false)
  const [hasRun, setHasRun] = useState(true)

  const run = () => {
    setRunning(true)
    setHasRun(false)
    setProgress(0)
    const timer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          window.clearInterval(timer)
          setRunning(false)
          setHasRun(true)
          toast.success('Backtest complete.')
          return 100
        }
        return current + 10
      })
    }, 120)
  }

  const reset = () => {
    setProgress(100)
    setHasRun(true)
    toast.info('Backtest configuration reset.')
  }

  return (
    <>
      <PageHeader title="Backtesting" subtitle="Validate strategies against historical market data." />
      <div className="grid grid-cols-12 gap-3">
        <Card className="col-span-12 xl:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Configuration</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Strategy</Label>
              <Select value={strategy} onValueChange={(value) => value && setStrategy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['QuantStoch Core v1.4', 'Alpha Trend', 'Momentum Scalper', 'Swing Master'].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Market</Label>
              <Select value={market} onValueChange={(value) => value && setMarket(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['EUR/USD', 'GBP/USD', 'XAU/USD', 'USD/JPY'].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="from">From</Label>
              <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="to">To</Label>
              <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            {running && <Progress value={progress} />}
            <div className="flex gap-2">
              <Button className="flex-1" onClick={run} disabled={running}>
                <Play data-icon="inline-start" /> {running ? `${progress}%` : 'Run backtest'}
              </Button>
              <Button variant="outline" size="icon" aria-label="Reset" onClick={reset}>
                <RotateCcw />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="col-span-12 flex flex-col gap-3 xl:col-span-9">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Net Profit" value={money(3120, { sign: true })} hint="+31.2%" tone="positive" />
            <StatCard label="Win Rate" value="71.8%" hint="142 / 198 trades" />
            <StatCard label="Profit Factor" value="2.41" hint="Gross win / loss" />
            <StatCard label="Max Drawdown" value="-8.4%" hint="Peak to trough" tone="destructive" />
          </div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Equity Curve — {strategy}</CardTitle>
            </CardHeader>
            <CardContent>{hasRun ? <EquityCurve data={equity} /> : <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">Running simulation... {progress}%</div>}</CardContent>
          </Card>
          <div className="grid gap-3 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Monthly Results</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {months.map(([label, value]) => (
                  <div key={label} className="flex items-center gap-3 text-sm">
                    <span className="w-24 text-muted-foreground">{label}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div className={value >= 0 ? 'h-full bg-positive' : 'h-full bg-destructive'} style={{ width: `${Math.min(Math.abs(value) * 12, 100)}%` }} />
                    </div>
                    <span className={`w-12 text-right font-mono ${plClass(value)}`}>{value}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Trade Sample</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto px-2 pb-3">
                <Table className="w-full min-w-[360px]">
                  <TableHeader>
                    <TableRow>
                      {['Pair', 'Side', 'P/L', 'Result'].map((h) => (
                        <TableHead key={h}>{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(storeTrades.length > 0
                      ? storeTrades.slice(0, 6).map((t) => [
                          t.symbol,
                          t.direction === 'buy' ? 'Buy' : 'Sell',
                          `${(t.profitLoss || 0) >= 0 ? '+' : ''}$${t.profitLoss?.toFixed(2)}`,
                          (t.profitLoss || 0) >= 0 ? 'Win' : 'Loss',
                        ])
                      : sampleTrades
                    ).map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono font-medium">{row[0]}</TableCell>
                        <TableCell className={row[1] === 'Buy' ? 'text-positive font-semibold' : 'text-destructive font-semibold'}>{row[1]}</TableCell>
                        <TableCell className={`font-mono ${row[2].startsWith('+') ? 'text-positive' : 'text-destructive'}`}>{row[2]}</TableCell>
                        <TableCell>{row[3]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Bot className="size-4 text-primary" /> AI Review
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              This configuration shows a healthy 2.41 profit factor with controlled drawdown. Performance dips in
              February and June align with high-impact news weeks — enabling the news filter could smooth the equity curve.
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
