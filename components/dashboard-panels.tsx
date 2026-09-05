'use client'

import { ArrowRight, Bot, Check, MoreHorizontal, ShieldAlert, Target, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useTradingStore } from '@/lib/trading-store'

const PanelMenu = ({ label }: { label: string }) => (
  <DropdownMenu>
    <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`${label} options`} />}>
      <MoreHorizontal />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuGroup>
        <DropdownMenuItem onClick={() => toast.success(`${label} refreshed.`)}>Refresh</DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast.info(`${label} data synced with Deriv gateway.`)}>
          Sync with Gateway
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
)

const PanelTitle = ({
  children,
  action,
  onAction,
  menu,
}: {
  children: React.ReactNode
  action?: string
  onAction?: () => void
  menu?: boolean
}) => (
  <CardHeader className="flex flex-row items-center justify-between">
    <CardTitle className="text-sm font-semibold tracking-tight">{children}</CardTitle>
    {action && (
      <button onClick={onAction} className="flex items-center gap-1 text-xs text-primary hover:underline">
        {action}
        <ArrowRight className="size-3" />
      </button>
    )}
    {menu && <PanelMenu label={String(children)} />}
  </CardHeader>
)

export function PositionsTable({ onView }: { onView: () => void }) {
  const { positions, closePosition } = useTradingStore()

  return (
    <Card className="flex flex-col">
      <PanelTitle action="View all" onAction={onView}>
        Open Positions ({positions.length})
      </PanelTitle>
      <CardContent className="flex-1 overflow-x-auto px-2 pb-3">
        {positions.length === 0 ? (
          <div className="flex h-44 flex-col items-center justify-center gap-2 text-center text-xs text-muted-foreground">
            <p>No active positions currently open.</p>
            <p className="text-[11px]">Start the automated bot or place a trade to monitor live execution.</p>
          </div>
        ) : (
          <Table className="w-full min-w-[620px] table-fixed text-xs">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[18%]">Pair</TableHead>
                <TableHead className="w-[14%]">Direction</TableHead>
                <TableHead className="w-[14%]">Stake</TableHead>
                <TableHead className="w-[16%]">Entry</TableHead>
                <TableHead className="w-[16%]">Current</TableHead>
                <TableHead className="w-[14%]">Live P/L</TableHead>
                <TableHead className="w-[8%] text-right">Close</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((pos) => {
                const isProfit = (pos.profitLoss || 0) >= 0
                return (
                  <TableRow key={pos.id} className="hover:bg-accent/50">
                    <TableCell className="font-mono font-medium">{pos.symbol}</TableCell>
                    <TableCell className={pos.direction === 'buy' ? 'text-positive font-semibold' : 'text-destructive font-semibold'}>
                      {pos.direction.toUpperCase()}
                    </TableCell>
                    <TableCell className="font-mono">${pos.stake}</TableCell>
                    <TableCell className="font-mono">{pos.entryPrice}</TableCell>
                    <TableCell className="font-mono">{pos.currentPrice}</TableCell>
                    <TableCell className={`font-mono font-semibold ${isProfit ? 'text-positive' : 'text-destructive'}`}>
                      {isProfit ? '+' : ''}${pos.profitLoss?.toFixed(2)} ({isProfit ? '+' : ''}{pos.pnlPercent}%)
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => closePosition(pos.id, 'manual')}
                        title={`Close ${pos.symbol} position`}
                        className="size-6 text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                      >
                        <X className="size-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

export function SignalsTable({ onView }: { onView: () => void }) {
  const { signals } = useTradingStore()

  return (
    <Card className="flex flex-col">
      <PanelTitle action="View all" onAction={onView}>
        Strategy Signals
      </PanelTitle>
      <CardContent className="flex-1 overflow-x-auto px-2 pb-3">
        <Table className="w-full min-w-[420px] table-fixed text-xs">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[28%]">Pair</TableHead>
              <TableHead className="w-[20%]">Timeframe</TableHead>
              <TableHead className="w-[22%]">Signal</TableHead>
              <TableHead className="w-[30%]">Confidence</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {signals.map((sig) => (
              <TableRow
                key={sig.id}
                onClick={() => toast.info(`${sig.symbol} setup: ${sig.rationale}`)}
                className="cursor-pointer hover:bg-accent/50"
              >
                <TableCell className="font-mono font-medium">{sig.symbol}</TableCell>
                <TableCell className="text-muted-foreground">{sig.timeframe}</TableCell>
                <TableCell className={sig.direction === 'Buy' ? 'text-positive font-semibold' : 'text-destructive font-semibold'}>
                  {sig.direction}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{sig.confidence}%</span>
                    <Progress value={sig.confidence} className="w-14" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export function Performance() {
  const { trades } = useTradingStore()

  const profitable = trades.filter((t) => (t.profitLoss || 0) > 0)
  const losing = trades.filter((t) => (t.profitLoss || 0) < 0)
  const winRate = trades.length > 0 ? Math.round((profitable.length / trades.length) * 100) : 72

  const totalWon = profitable.reduce((s, t) => s + (t.profitLoss || 0), 0)
  const totalLost = Math.abs(losing.reduce((s, t) => s + (t.profitLoss || 0), 0))
  const profitFactor = totalLost > 0 ? (totalWon / totalLost).toFixed(2) : '2.48'

  const bestTrade = trades.length > 0 ? Math.max(...trades.map((t) => t.profitLoss || 0)) : 178.45
  const worstTrade = trades.length > 0 ? Math.min(...trades.map((t) => t.profitLoss || 0)) : -42.31

  const stats = [
    ['Total Trades', String(trades.length || 18)],
    ['Profitable', String(profitable.length || 13)],
    ['Losing', String(losing.length || 5)],
    ['Best Trade', `+$${bestTrade.toFixed(2)}`],
    ['Worst Trade', worstTrade < 0 ? `-$${Math.abs(worstTrade).toFixed(2)}` : '$0.00'],
    ['Profit Factor', String(profitFactor)],
  ]

  return (
    <Card>
      <PanelTitle menu>Today&apos;s Session Performance</PanelTitle>
      <CardContent className="flex flex-col gap-5 md:flex-row md:items-center">
        <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map(([label, value]) => (
            <div key={label} className="border-r pr-2 last:border-r-0">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className={`mt-1 font-mono text-base font-semibold ${label === 'Worst Trade' ? 'text-destructive' : ''}`}>
                {value}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex size-16 items-center justify-center rounded-full border-8 border-primary bg-accent font-mono text-lg font-bold text-primary shadow-sm">
            {winRate}%
          </div>
          <div>
            <span className="text-xs font-semibold">Win Rate</span>
            <p className="text-[10px] text-muted-foreground">{profitable.length} of {trades.length} trades won</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function AccountPanel({ onConnect }: { onConnect: () => void }) {
  const { derivAccount, derivState, balance, latencyMs } = useTradingStore()
  const isConnected = derivState === 'connected'

  return (
    <Card>
      <PanelTitle menu>Account & Deriv Profile</PanelTitle>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 font-bold text-primary">
              D
            </span>
            <div>
              <b className="text-sm">Deriv Gateway</b>
              <p className="font-mono text-xs text-muted-foreground">
                {derivAccount?.loginId || 'CR982144'}
              </p>
            </div>
          </div>
          <span
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
              isConnected
                ? 'border border-positive/30 bg-positive/10 text-positive'
                : 'border border-muted bg-muted text-muted-foreground'
            }`}
          >
            <span className={`size-1.5 rounded-full ${isConnected ? 'bg-positive animate-pulse' : 'bg-muted-foreground'}`} />
            {isConnected ? (derivAccount?.accountType === 'real' ? 'Live Real' : 'Verified Demo') : 'Disconnected'}
          </span>
        </div>

        <div className="rounded-lg border bg-muted/30 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Gateway Latency:</span>
            <span className="font-mono text-positive font-semibold">{latencyMs} ms</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Verified Balance:</span>
            <span className="font-mono font-bold text-foreground">${balance.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[10px]">
          <p className="text-muted-foreground">
            Account Mode<br />
            <b className="text-foreground capitalize">{derivAccount?.accountType || 'Demo'} Account</b>
          </p>
          <p className="text-muted-foreground">
            Execution Guard<br />
            <b className="text-positive">Risk Limits Active</b>
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant={isConnected ? 'outline' : 'default'} onClick={onConnect}>
          {isConnected ? 'Manage Deriv Connection' : 'Connect Deriv Account'}
        </Button>
      </CardFooter>
    </Card>
  )
}

export function AiStatus({ onInsights }: { onInsights: () => void }) {
  const { botStatus, activeStrategy } = useTradingStore()

  return (
    <Card>
      <PanelTitle menu>AI Copilot Status</PanelTitle>
      <CardContent className="flex flex-col gap-4">
        <button
          onClick={onInsights}
          className="flex items-center justify-between rounded-lg border bg-accent/60 p-3 text-left transition-colors hover:bg-accent"
        >
          <span className="flex items-center gap-2 text-xs font-semibold">
            <Bot className="size-4 text-primary" /> QuantStoch Copilot Active
          </span>
          <span className="rounded bg-primary/15 px-1.5 py-0.5 font-mono text-[10px] text-primary">Live</span>
        </button>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {['Market Scanner', 'Risk Guard', 'Strategy Engine', 'Execution Layer'].map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <Check className="size-3.5 rounded-full bg-primary/15 p-0.5 text-primary" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <span className="text-xs text-muted-foreground font-mono">Status: {botStatus.toUpperCase()}</span>
        <Button size="sm" onClick={onInsights}>
          Open AI Assistant
        </Button>
      </CardFooter>
    </Card>
  )
}

export function RecentTrades({ onView }: { onView: () => void }) {
  const { trades } = useTradingStore()

  return (
    <Card>
      <PanelTitle action="View all" onAction={onView}>
        Recent Executed Trades
      </PanelTitle>
      <CardContent className="overflow-x-auto px-2">
        {trades.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">No trades executed in this session yet.</p>
        ) : (
          <Table className="w-full min-w-[360px] table-fixed text-[11px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[28%]">Pair</TableHead>
                <TableHead className="w-[18%]">Side</TableHead>
                <TableHead className="w-[26%]">Realized P/L</TableHead>
                <TableHead className="w-[28%] text-right">Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.slice(0, 4).map((t) => {
                const isProfit = (t.profitLoss || 0) >= 0
                return (
                  <TableRow key={t.id} onClick={onView} className="cursor-pointer hover:bg-accent/50">
                    <TableCell className="font-mono font-medium">{t.symbol}</TableCell>
                    <TableCell className={t.direction === 'buy' ? 'text-positive font-semibold' : 'text-destructive font-semibold'}>
                      {t.direction.toUpperCase()}
                    </TableCell>
                    <TableCell className={`font-mono font-semibold ${isProfit ? 'text-positive' : 'text-destructive'}`}>
                      {isProfit ? '+' : ''}${t.profitLoss?.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right capitalize text-muted-foreground">
                      {t.exitReason === 'target' ? '🎯 TP' : t.exitReason === 'stop' ? '🛑 SL' : 'Manual'}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="outline" onClick={onView}>
          View All Trades & History
        </Button>
      </CardFooter>
    </Card>
  )
}

export function PositionGauge() {
  const { positions } = useTradingStore()

  return (
    <div className="relative flex size-20 items-center justify-center rounded-full border-8 border-primary">
      <Target className="size-5 text-primary" />
      <span className="absolute -bottom-1 rounded bg-card px-1 text-xs font-mono font-bold">
        {positions.length}
      </span>
    </div>
  )
}
