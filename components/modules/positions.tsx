'use client'

import { useMemo, useState } from 'react'
import { Bot, Search, ShieldCheck, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader, StatCard, directionClass, money, plClass } from '@/components/modules/shared'
import { useTradingStore } from '@/lib/trading-store'

type PositionItem = {
  id: string
  pair: string
  direction: 'Buy' | 'Sell'
  size: number
  entry: string
  current: string
  pl: number
  plPct: number
  strategy: string
}

export function PositionsModule() {
  const { positions, closePosition: storeClosePosition, partialClosePosition } = useTradingStore()
  const [query, setQuery] = useState('')
  const [direction, setDirection] = useState('all')
  const [toClose, setToClose] = useState<PositionItem | null>(null)

  const mappedPositions: PositionItem[] = useMemo(
    () =>
      positions.map((p) => ({
        id: p.id,
        pair: p.symbol,
        direction: (p.direction.charAt(0).toUpperCase() + p.direction.slice(1)) as 'Buy' | 'Sell',
        size: Number((p.stake / 100).toFixed(2)),
        entry: String(p.entryPrice),
        current: String(p.currentPrice),
        pl: p.profitLoss || 0,
        plPct: p.pnlPercent || 0,
        strategy: p.strategy,
      })),
    [positions],
  )

  const filtered = useMemo(
    () =>
      mappedPositions.filter(
        (p) =>
          p.pair.toLowerCase().includes(query.toLowerCase()) &&
          (direction === 'all' || p.direction.toLowerCase() === direction),
      ),
    [mappedPositions, query, direction],
  )

  const totals = useMemo(() => {
    const openPl = mappedPositions.reduce((sum, p) => sum + p.pl, 0)
    const exposure = mappedPositions.reduce((sum, p) => sum + p.size, 0)
    return { openPl, exposure, count: mappedPositions.length }
  }, [mappedPositions])

  const closePosition = () => {
    if (!toClose) return
    storeClosePosition(toClose.id, 'manual')
    setToClose(null)
  }

  const breakEven = (p: PositionItem) => {
    toast.info(`${p.pair} stop loss moved to break-even at ${p.entry}.`)
  }

  const partialClose = (p: PositionItem) => {
    partialClosePosition(p.id, 0.5)
  }

  return (
    <>
      <PageHeader
        title="Open Positions"
        subtitle="Monitor exposure, manage risk, and act on AI recommendations."
        actions={
          <Button variant="outline" size="sm" onClick={() => toast.info('Positions refreshed.')}>
            Refresh
          </Button>
        }
      />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Open P&L" value={money(totals.openPl, { sign: true })} hint="Unrealized" tone={totals.openPl >= 0 ? 'positive' : 'destructive'} />
        <StatCard label="Total Exposure" value={`${totals.exposure.toFixed(2)} lots`} hint="Across all pairs" />
        <StatCard label="Active Positions" value={String(totals.count)} hint="Margin usage 25%" icon={<ShieldCheck className="size-4" />} />
      </div>

      <Card className="mb-4">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search pair" className="pl-9" />
          </div>
          <Select value={direction} onValueChange={(value) => value && setDirection(value)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All directions</SelectItem>
              <SelectItem value="buy">Buy only</SelectItem>
              <SelectItem value="sell">Sell only</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Positions ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto px-2 pb-3">
          <Table className="w-full min-w-[760px]">
            <TableHeader>
              <TableRow>
                {['Pair', 'Direction', 'Size', 'Entry', 'Current', 'P/L', 'P/L %', 'Actions'].map((h) => (
                  <TableHead key={h}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.pair}</TableCell>
                  <TableCell className={directionClass(p.direction)}>{p.direction}</TableCell>
                  <TableCell className="font-mono">{p.size.toFixed(2)}</TableCell>
                  <TableCell className="font-mono">{p.entry}</TableCell>
                  <TableCell className="font-mono">{p.current}</TableCell>
                  <TableCell className={`font-mono ${plClass(p.pl)}`}>{money(p.pl, { sign: true })}</TableCell>
                  <TableCell className={plClass(p.plPct)}>
                    {p.plPct >= 0 ? '+' : ''}
                    {p.plPct}%
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => breakEven(p)}>
                        B/E
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => partialClose(p)}>
                        50%
                      </Button>
                      <Button variant="ghost" size="icon-sm" aria-label={`Close ${p.pair}`} onClick={() => setToClose(p)}>
                        <X />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No positions match your filters.</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Bot className="size-4 text-primary" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          <p className="rounded-lg border bg-accent/40 p-3">XAU/USD is up 1.67% — consider taking partial profit into the next resistance zone.</p>
          <p className="rounded-lg border bg-accent/40 p-3">USD/CAD is in drawdown; the stop is well placed but watch the upcoming BoC statement.</p>
          <p className="rounded-lg border bg-accent/40 p-3">Overall book bias is long. Total exposure is within the 5% daily risk budget.</p>
        </CardContent>
      </Card>

      <Dialog open={!!toClose} onOpenChange={(open) => !open && setToClose(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close {toClose?.pair} position?</DialogTitle>
            <DialogDescription>
              This will close {toClose?.size.toFixed(2)} lots at the current price for a result of{' '}
              {toClose ? money(toClose.pl, { sign: true }) : ''}. This is a simulated action.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button variant="destructive" onClick={closePosition}>
              Close position
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
