'use client'

import { useMemo, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Copy, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageHeader, StatCard } from '@/components/modules/shared'
import { useTradingStore } from '@/lib/trading-store'

type Signal = {
  id: string
  pair: string
  timeframe: string
  direction: 'Buy' | 'Sell'
  confidence: number
  entry: string
  stop: string
  target: string
  rationale: string
}

export function SignalsModule() {
  const { signals: storeSignals } = useTradingStore()
  const [dismissed, setDismissed] = useState<string[]>([])
  const [direction, setDirection] = useState('all')
  const [minConf, setMinConf] = useState('all')

  const signals: Signal[] = useMemo(() => {
    return storeSignals
      .filter((s) => !dismissed.includes(s.id))
      .map((s) => ({
        id: s.id,
        pair: s.symbol,
        timeframe: s.timeframe,
        direction: s.direction,
        confidence: s.confidence,
        entry: String(s.entryPrice),
        stop: String(s.stopLoss),
        target: String(s.takeProfit),
        rationale: s.rationale,
      }))
  }, [storeSignals, dismissed])

  const filtered = useMemo(
    () =>
      signals.filter(
        (s) =>
          (direction === 'all' || s.direction.toLowerCase() === direction) &&
          (minConf === 'all' || s.confidence >= Number(minConf)),
      ),
    [signals, direction, minConf],
  )

  const dismiss = (id: string, pair: string) => {
    setDismissed((prev) => [...prev, id])
    toast.info(`${pair} signal dismissed.`)
  }

  return (
    <>
      <PageHeader
        title="Strategy Signals"
        subtitle="AI-generated setups with entry, stop, target, and rationale."
        actions={
          <Button variant="outline" size="sm" onClick={() => toast.info('Scanning markets for new signals...')}>
            Scan now
          </Button>
        }
      />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Active Signals" value={String(signals.length)} hint="Live now" />
        <StatCard label="Avg Confidence" value={`${Math.round(signals.reduce((a, s) => a + s.confidence, 0) / (signals.length || 1))}%`} hint="Across setups" />
        <StatCard label="Buy / Sell" value={`${signals.filter((s) => s.direction === 'Buy').length} / ${signals.filter((s) => s.direction === 'Sell').length}`} hint="Direction split" />
      </div>

      <Card className="mb-4">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <Select value={direction} onValueChange={(value) => value && setDirection(value)}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All directions</SelectItem>
              <SelectItem value="buy">Buy signals</SelectItem>
              <SelectItem value="sell">Sell signals</SelectItem>
            </SelectContent>
          </Select>
          <Select value={minConf} onValueChange={(value) => value && setMinConf(value)}>
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any confidence</SelectItem>
              <SelectItem value="80">80%+ confidence</SelectItem>
              <SelectItem value="85">85%+ confidence</SelectItem>
              <SelectItem value="90">90%+ confidence</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        {filtered.map((s) => (
          <Card key={s.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                {s.direction === 'Buy' ? (
                  <ArrowUpRight className="size-5 text-positive" />
                ) : (
                  <ArrowDownRight className="size-5 text-destructive" />
                )}
                {s.pair}
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">{s.timeframe}</span>
              </CardTitle>
              <span className={`text-sm font-medium ${s.direction === 'Buy' ? 'text-positive' : 'text-destructive'}`}>{s.direction}</span>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-mono text-primary">{s.confidence}%</span>
                </div>
                <Progress value={s.confidence} />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg border p-2">
                  <p className="text-muted-foreground">Entry</p>
                  <p className="mt-1 font-mono">{s.entry}</p>
                </div>
                <div className="rounded-lg border p-2">
                  <p className="text-muted-foreground">Stop</p>
                  <p className="mt-1 font-mono text-destructive">{s.stop}</p>
                </div>
                <div className="rounded-lg border p-2">
                  <p className="text-muted-foreground">Target</p>
                  <p className="mt-1 font-mono text-positive">{s.target}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{s.rationale}</p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button className="flex-1" onClick={() => toast.success(`Opened ${s.direction} trade on ${s.pair} (demo).`)}>
                Open trade
              </Button>
              <Button variant="outline" size="icon" aria-label="Copy signal" onClick={() => toast.success(`${s.pair} signal copied.`)}>
                <Copy />
              </Button>
              <Button variant="outline" size="icon" aria-label="Dismiss signal" onClick={() => dismiss(s.id, s.pair)}>
                <X />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">No signals match your filters right now.</CardContent>
        </Card>
      )}
    </>
  )
}
