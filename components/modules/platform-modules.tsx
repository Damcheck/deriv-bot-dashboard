'use client'

import { useMemo, useRef, useState } from 'react'
import { AlertTriangle, BarChart3, Bot, BrainCircuit, Check, CircleDollarSign, CircleOff, Clock3, ExternalLink, KeyRound, LockKeyhole, Pause, Play, PlugZap, Power, Radio, RotateCcw, Send, ShieldCheck, Sparkles, Square, WalletCards, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageHeader, StatCard } from '@/components/modules/shared'
import { useTradingStore } from '@/lib/trading-store'
import { readiness, type AiProvider } from '@/lib/platform-contracts'

/* ─── Overview ─── */
export function OverviewModule({ onNavigate }: { onNavigate: (name: string) => void }) {
  const { derivState, botStatus, currentPlan, positions, balance, equity } = useTradingStore()
  const isConnected = derivState === 'connected'
  const isBotRunning = botStatus === 'running'

  return <>
    <PageHeader title="Trading bot overview" subtitle="Connect Deriv, verify safeguards, and monitor the Python execution service from one place." actions={<Badge variant={isConnected && isBotRunning ? 'default' : 'outline'}>{isConnected && isBotRunning ? 'System Active' : 'Setup required'}</Badge>} />
    <div className="my-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Deriv account" value={isConnected ? 'Connected' : 'Not connected'} hint={isConnected ? `Balance: $${balance.toLocaleString()}` : 'Connect to begin'} icon={<PlugZap />} tone={isConnected ? 'positive' : undefined} />
      <StatCard label="Bot status" value={botStatus.charAt(0).toUpperCase() + botStatus.slice(1)} hint={isBotRunning ? `${positions.length} active positions` : 'Start from Trading Bot page'} icon={<Bot />} tone={isBotRunning ? 'positive' : undefined} />
      <StatCard label="Subscription" value={currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} hint="Active plan" icon={<WalletCards />} />
      <StatCard label="Equity" value={`$${equity.toLocaleString()}`} hint={`${positions.length} open positions`} icon={<ShieldCheck />} />
    </div>
    <div className="grid gap-3 xl:grid-cols-[1.35fr_1fr]">
      <Card><CardHeader><CardTitle>Launch readiness</CardTitle><CardDescription>Complete these items in order before live trading is possible.</CardDescription></CardHeader><CardContent className="flex flex-col gap-2">{readiness.map((item, index) => { const done = (item.id === 'deriv' && isConnected) || (item.id === 'subscription' && currentPlan !== 'starter'); return <button key={item.id} onClick={() => onNavigate(item.id === 'deriv' ? 'Deriv Account' : item.id === 'subscription' ? 'Subscription' : item.id === 'bot_server' || item.id === 'risk' ? 'Trading Bot' : 'Settings')} className="flex items-center gap-3 rounded-lg border p-3 text-left hover:bg-accent"><span className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs ${done ? 'bg-positive/15 text-positive' : 'bg-muted'}`}>{done ? <Check className="size-4" /> : index + 1}</span><span className="min-w-0 flex-1"><b className="block text-sm">{item.label}</b><small className="block text-muted-foreground">{item.detail}</small></span><Badge variant={done ? 'default' : 'secondary'}>{done ? 'Done' : 'Required'}</Badge></button> })}</CardContent></Card>
      <Card><CardHeader><CardTitle>System boundary</CardTitle><CardDescription>Who is responsible for each action.</CardDescription></CardHeader><CardContent className="flex flex-col gap-4 text-sm"><div><b>Dashboard</b><p className="text-muted-foreground">Configuration, monitoring, billing, and consent.</p></div><Separator /><div><b>Python service</b><p className="text-muted-foreground">Strategy runtime, safeguards, Deriv WebSocket, and all trade execution.</p></div><Separator /><div><b>AI provider</b><p className="text-muted-foreground">Market context and explanations only. Never execution.</p></div></CardContent></Card>
    </div>
  </>
}

/* ─── Deriv Account ─── */
export function DerivAccountModule() {
  const { derivAccount, derivState, balance, latencyMs, connectDeriv, disconnectDeriv, isSimulationMode, toggleSimulationMode } = useTradingStore()
  const [token, setToken] = useState('')
  const [connecting, setConnecting] = useState(false)
  const isConnected = derivState === 'connected'

  const handleConnect = async () => {
    setConnecting(true)
    await connectDeriv(token || undefined)
    setConnecting(false)
  }

  return <>
    <PageHeader title="Deriv Account" subtitle="Authorize your Deriv account through the WebSocket gateway." actions={isConnected ? <Button variant="destructive" onClick={disconnectDeriv}><Power data-icon="inline-start" />Disconnect</Button> : <Button onClick={handleConnect} disabled={connecting}><ExternalLink data-icon="inline-start" />{connecting ? 'Connecting...' : 'Connect Deriv'}</Button>} />
    <div className="my-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Connection" value={isConnected ? 'Active' : 'Disconnected'} hint={isConnected ? `Latency: ${latencyMs}ms` : 'No active session'} tone={isConnected ? 'positive' : undefined} />
      <StatCard label="Account" value={derivAccount?.loginId || 'None'} hint={derivAccount?.accountType === 'real' ? 'Live Account' : 'Demo Account'} />
      <StatCard label="Balance" value={isConnected ? `$${balance.toLocaleString()}` : '—'} hint={derivAccount?.currency || 'USD'} />
      <StatCard label="Mode" value={isSimulationMode ? 'Simulation' : 'Live Gateway'} hint="Toggle below" />
    </div>
    <div className="grid gap-3 xl:grid-cols-2">
      <Card><CardHeader><CardTitle>Connection settings</CardTitle><CardDescription>Enter your Deriv API token to connect. Leave blank for demo mode.</CardDescription></CardHeader><CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2"><Label htmlFor="deriv-token">API Token</Label><Input id="deriv-token" type="password" placeholder="Enter your Deriv API token" value={token} onChange={(e) => setToken(e.target.value)} autoComplete="off" /></div>
        <div className="flex items-center justify-between gap-4 rounded-lg border p-3"><div><b className="text-sm">Simulation Mode</b><p className="text-xs text-muted-foreground">Use virtual portfolio with live price simulation</p></div><Switch checked={isSimulationMode} onCheckedChange={toggleSimulationMode} /></div>
        <Button onClick={handleConnect} disabled={connecting} className="w-full">{connecting ? 'Establishing connection...' : isConnected ? 'Reconnect' : 'Connect to Deriv'}</Button>
      </CardContent></Card>
      <Card><CardHeader><CardTitle>Connection status</CardTitle><CardDescription>Real-time gateway diagnostics.</CardDescription></CardHeader><CardContent className="flex flex-col gap-3">{[
        ['WebSocket', isConnected ? 'Connected' : 'Disconnected', isConnected],
        ['Auth Status', isConnected ? 'Authorized' : 'Pending', isConnected],
        ['Latency', isConnected ? `${latencyMs}ms` : '—', isConnected],
        ['Account Type', derivAccount?.accountType || 'N/A', !!derivAccount],
        ['Scopes', derivAccount?.scopes?.join(', ') || 'None', !!derivAccount],
      ].map(([label, value, ok]) => <div key={label as string} className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{label}</span><span className={`flex items-center gap-1.5 font-mono ${ok ? 'text-positive' : 'text-muted-foreground'}`}>{ok ? <Check className="size-3.5" /> : <CircleOff className="size-3.5" />}{value as string}</span></div>)}</CardContent></Card>
    </div>
  </>
}

/* ─── Trading Bot ─── */
export function TradingBotModule() {
  const { botStatus, activeStrategy, setActiveStrategy, selectedMarket, setSelectedMarket, riskConfig, updateRiskConfig, botLogs, uptimeSeconds, startBot, pauseBot, resumeBot, emergencyStop, positions, derivState } = useTradingStore()
  const isRunning = botStatus === 'running'
  const isPaused = botStatus === 'paused'
  const uptime = `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m ${uptimeSeconds % 60}s`

  return <>
    <PageHeader title="Trading Bot" subtitle="Monitor and control your automated trading bot in real-time." actions={<div className="flex gap-2">
      {isRunning && <Button variant="outline" onClick={pauseBot}><Pause data-icon="inline-start" />Pause</Button>}
      {isPaused && <Button variant="outline" onClick={resumeBot}><Play data-icon="inline-start" />Resume</Button>}
      {(isRunning || isPaused) && <Button variant="destructive" onClick={emergencyStop}><Square data-icon="inline-start" />Emergency Stop</Button>}
      {botStatus === 'idle' && <Button onClick={startBot} disabled={derivState !== 'connected'}><Play data-icon="inline-start" />Start Bot</Button>}
    </div>} />
    <div className="my-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Status" value={botStatus.charAt(0).toUpperCase() + botStatus.slice(1)} hint={isRunning ? 'Autonomous execution active' : isPaused ? 'Monitoring only' : 'Ready to start'} icon={<Radio />} tone={isRunning ? 'positive' : isPaused ? undefined : undefined} />
      <StatCard label="Uptime" value={isRunning || isPaused ? uptime : '0h 0m 0s'} hint="Since last start" icon={<Clock3 />} />
      <StatCard label="Active Positions" value={String(positions.length)} hint={`Max: ${riskConfig.maxOpenPositions}`} />
      <StatCard label="Strategy" value={activeStrategy.split(' ').slice(0, 2).join(' ')} hint={activeStrategy} />
    </div>
    <div className="grid gap-3 xl:grid-cols-2">
      <Card><CardHeader><CardTitle>Risk Configuration</CardTitle><CardDescription>Adjust risk parameters for the bot execution engine.</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border p-3"><Label className="text-muted-foreground text-xs">Risk per trade</Label><div className="mt-1 flex items-center gap-2"><Input type="number" value={riskConfig.riskPerTradePercent} onChange={(e) => updateRiskConfig({ riskPerTradePercent: Number(e.target.value) })} className="font-mono" min={0.1} max={5} step={0.1} /><span className="text-sm">%</span></div></div>
        <div className="rounded-lg border p-3"><Label className="text-muted-foreground text-xs">Daily loss limit</Label><div className="mt-1 flex items-center gap-2"><Input type="number" value={riskConfig.dailyLossLimitPercent} onChange={(e) => updateRiskConfig({ dailyLossLimitPercent: Number(e.target.value) })} className="font-mono" min={1} max={10} step={0.5} /><span className="text-sm">%</span></div></div>
        <div className="rounded-lg border p-3"><Label className="text-muted-foreground text-xs">Max open positions</Label><Input type="number" value={riskConfig.maxOpenPositions} onChange={(e) => updateRiskConfig({ maxOpenPositions: Number(e.target.value) })} className="mt-1 font-mono" min={1} max={20} /></div>
        <div className="rounded-lg border p-3"><Label className="text-muted-foreground text-xs">Emergency stop</Label><p className="mt-1 font-mono font-semibold text-positive">{riskConfig.emergencyStopEnabled ? 'Enabled' : 'Disabled'}</p></div>
      </CardContent></Card>
      <Card className="flex flex-col"><CardHeader><CardTitle>Bot Activity Log</CardTitle><CardDescription>Real-time execution log feed.</CardDescription></CardHeader><CardContent className="flex-1 overflow-hidden"><ScrollArea className="h-[280px]"><div className="flex flex-col gap-1.5 pr-3">{botLogs.slice(0, 20).map((log) => <div key={log.id} className="flex gap-2 rounded-md border px-2.5 py-1.5 text-xs"><span className="shrink-0 font-mono text-muted-foreground">{log.timestamp}</span><span className={`${log.type === 'error' ? 'text-destructive' : log.type === 'success' ? 'text-positive' : log.type === 'trade' ? 'text-primary' : log.type === 'risk' ? 'text-yellow-500' : 'text-muted-foreground'}`}>{log.message}</span></div>)}</div></ScrollArea></CardContent></Card>
    </div>
    <Card className="mt-3"><CardHeader><CardTitle>Strategy & Market</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-4">
      <div className="flex flex-col gap-2 min-w-48"><Label>Active Strategy</Label><Select value={activeStrategy} onValueChange={(v) => v && setActiveStrategy(v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{['QuantStoch Core v1.4', 'Alpha Trend', 'Momentum Scalper', 'Swing Master'].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectGroup></SelectContent></Select></div>
      <div className="flex flex-col gap-2 min-w-48"><Label>Target Market</Label><Select value={selectedMarket} onValueChange={(v) => v && setSelectedMarket(v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{['EUR/USD', 'GBP/USD', 'XAU/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD'].map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectGroup></SelectContent></Select></div>
    </CardContent></Card>
  </>
}

/* ─── Positions & History ─── */
export function PositionsHistoryModule() {
  const { positions, trades, closePosition, closeAllPositions, balance } = useTradingStore()
  const totalPnl = positions.reduce((s, p) => s + (p.profitLoss || 0), 0)
  const realizedPnl = trades.reduce((s, t) => s + (t.profitLoss || 0), 0)

  return <>
    <PageHeader title="Positions & History" subtitle="Live open positions and executed trade history." actions={<div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => toast.info('Positions refreshed.')}>Refresh</Button>{positions.length > 0 && <Button variant="destructive" size="sm" onClick={closeAllPositions}>Close All</Button>}</div>} />
    <div className="mb-4 grid gap-3 sm:grid-cols-4">
      <StatCard label="Open positions" value={String(positions.length)} hint="Currently active" tone={positions.length > 0 ? 'positive' : undefined} />
      <StatCard label="Unrealized P&L" value={`${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}`} hint="Floating" tone={totalPnl >= 0 ? 'positive' : 'destructive'} />
      <StatCard label="Realized P&L" value={`${realizedPnl >= 0 ? '+' : ''}$${realizedPnl.toFixed(2)}`} hint={`${trades.length} closed trades`} tone={realizedPnl >= 0 ? 'positive' : 'destructive'} />
      <StatCard label="Account Balance" value={`$${balance.toLocaleString()}`} hint="After realized P&L" />
    </div>
    {/* Open positions */}
    <Card className="mb-3"><CardHeader><CardTitle>Open Positions ({positions.length})</CardTitle></CardHeader><CardContent className="overflow-x-auto"><Table className="w-full min-w-[700px] text-xs"><TableHeader><TableRow><TableHead>Pair</TableHead><TableHead>Direction</TableHead><TableHead>Stake</TableHead><TableHead>Entry</TableHead><TableHead>Current</TableHead><TableHead>P&L</TableHead><TableHead>Strategy</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader><TableBody>{positions.length === 0 ? <TableRow><TableCell colSpan={8} className="py-8 text-center text-muted-foreground">No open positions.</TableCell></TableRow> : positions.map((p) => { const isProfit = (p.profitLoss || 0) >= 0; return <TableRow key={p.id}><TableCell className="font-mono font-medium">{p.symbol}</TableCell><TableCell className={p.direction === 'buy' ? 'text-positive font-semibold' : 'text-destructive font-semibold'}>{p.direction.toUpperCase()}</TableCell><TableCell className="font-mono">${p.stake}</TableCell><TableCell className="font-mono">{p.entryPrice}</TableCell><TableCell className="font-mono">{p.currentPrice}</TableCell><TableCell className={`font-mono font-semibold ${isProfit ? 'text-positive' : 'text-destructive'}`}>{isProfit ? '+' : ''}${p.profitLoss?.toFixed(2)}</TableCell><TableCell className="text-muted-foreground">{p.strategy}</TableCell><TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => closePosition(p.id, 'manual')} className="text-destructive hover:bg-destructive/15">Close</Button></TableCell></TableRow> })}</TableBody></Table></CardContent></Card>
    {/* Trade history */}
    <Card><CardHeader><CardTitle>Trade History ({trades.length})</CardTitle></CardHeader><CardContent className="overflow-x-auto"><Table className="w-full min-w-[700px] text-xs"><TableHeader><TableRow><TableHead>Pair</TableHead><TableHead>Direction</TableHead><TableHead>Entry</TableHead><TableHead>Exit</TableHead><TableHead>P&L</TableHead><TableHead>Duration</TableHead><TableHead>Reason</TableHead><TableHead>Strategy</TableHead></TableRow></TableHeader><TableBody>{trades.length === 0 ? <TableRow><TableCell colSpan={8} className="py-8 text-center text-muted-foreground">No trades executed yet.</TableCell></TableRow> : trades.slice(0, 20).map((t) => { const isProfit = (t.profitLoss || 0) >= 0; return <TableRow key={t.id}><TableCell className="font-mono font-medium">{t.symbol}</TableCell><TableCell className={t.direction === 'buy' ? 'text-positive font-semibold' : 'text-destructive font-semibold'}>{t.direction.toUpperCase()}</TableCell><TableCell className="font-mono">{t.entryPrice}</TableCell><TableCell className="font-mono">{t.exitPrice}</TableCell><TableCell className={`font-mono font-semibold ${isProfit ? 'text-positive' : 'text-destructive'}`}>{isProfit ? '+' : ''}${t.profitLoss?.toFixed(2)}</TableCell><TableCell>{t.duration}</TableCell><TableCell className="capitalize">{t.exitReason === 'target' ? '🎯 TP' : t.exitReason === 'stop' ? '🛑 SL' : 'Manual'}</TableCell><TableCell className="text-muted-foreground">{t.strategy}</TableCell></TableRow> })}</TableBody></Table></CardContent></Card>
  </>
}

/* ─── AI Assistant ─── */
export function AiAssistantModule() {
  const { aiMessages, sendAiMessage, clearAiMessages, signals } = useTradingStore()
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const send = (text: string) => {
    const value = text.trim()
    if (!value) return
    sendAiMessage(value)
    setInput('')
    window.setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100)
  }

  const prompts = ['What is the best setup right now?', 'Summarize my risk exposure', 'How is the bot performing?', 'Explain the EUR/USD signal']

  return <>
    <PageHeader title="AI Assistant" subtitle="Your trading copilot for setups, risk analysis, and market context." actions={<Button variant="outline" size="sm" onClick={clearAiMessages}>Clear chat</Button>} />
    <div className="grid grid-cols-12 gap-3">
      <Card className="col-span-12 flex h-[640px] flex-col xl:col-span-8">
        <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm"><Bot className="size-4 text-primary" /> Trading Assistant</CardTitle></CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
          <ScrollArea className="min-h-0 flex-1 pr-2" viewportRef={scrollRef}><div className="flex flex-col gap-3">{aiMessages.map((msg) => <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'border bg-accent/50'}`}>{msg.content}</div></div>)}</div></ScrollArea>
          <div className="flex flex-wrap gap-2">{prompts.map((p) => <button key={p} onClick={() => send(p)} className="rounded-full border px-3 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground">{p}</button>)}</div>
          <form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); send(input) }}><Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about markets, setups, or risk..." aria-label="Message" /><Button type="submit" size="icon" aria-label="Send message"><Send /></Button></form>
        </CardContent>
      </Card>
      <div className="col-span-12 flex flex-col gap-3 xl:col-span-4">
        <Card><CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm"><Sparkles className="size-4 text-primary" /> Top Signals</CardTitle></CardHeader><CardContent className="flex flex-col gap-3">{signals.slice(0, 4).map((s) => <div key={s.id}><div className="mb-1 flex items-center justify-between text-xs"><span className="font-mono">{s.symbol} {s.direction}</span><span className="font-mono text-primary">{s.confidence}%</span></div><Progress value={s.confidence} /></div>)}</CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Assistant Memory</CardTitle></CardHeader><CardContent className="flex flex-col gap-2 text-xs text-muted-foreground"><p className="rounded-lg border p-2">Prefers 1% risk per trade with a 2R minimum.</p><p className="rounded-lg border p-2">Focus pairs: EUR/USD, GBP/USD, XAU/USD.</p><p className="rounded-lg border p-2">Avoids trading during red-folder news.</p></CardContent></Card>
      </div>
    </div>
  </>
}

/* ─── Analytics ─── */
export function AnalyticsModule() {
  const { trades, positions, balance, equity, dailyPnl } = useTradingStore()

  const stats = useMemo(() => {
    const profitable = trades.filter((t) => (t.profitLoss || 0) > 0)
    const losing = trades.filter((t) => (t.profitLoss || 0) < 0)
    const winRate = trades.length > 0 ? ((profitable.length / trades.length) * 100).toFixed(1) : '—'
    const totalWon = profitable.reduce((s, t) => s + (t.profitLoss || 0), 0)
    const totalLost = Math.abs(losing.reduce((s, t) => s + (t.profitLoss || 0), 0))
    const profitFactor = totalLost > 0 ? (totalWon / totalLost).toFixed(2) : trades.length > 0 ? '∞' : '—'
    const netReturn = trades.reduce((s, t) => s + (t.profitLoss || 0), 0)
    const best = trades.length > 0 ? Math.max(...trades.map((t) => t.profitLoss || 0)) : 0
    const worst = trades.length > 0 ? Math.min(...trades.map((t) => t.profitLoss || 0)) : 0
    return { winRate, profitFactor, netReturn, best, worst, profitable: profitable.length, losing: losing.length, totalTrades: trades.length }
  }, [trades])

  return <>
    <PageHeader title="Analytics" subtitle="Performance metrics calculated from your live trading data." actions={<Badge variant="outline">{trades.length} trades analyzed</Badge>} />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Net Return" value={`${stats.netReturn >= 0 ? '+' : ''}$${stats.netReturn.toFixed(2)}`} hint="All closed trades" tone={stats.netReturn >= 0 ? 'positive' : 'destructive'} />
      <StatCard label="Win Rate" value={`${stats.winRate}%`} hint={`${stats.profitable} / ${stats.totalTrades} trades`} />
      <StatCard label="Profit Factor" value={String(stats.profitFactor)} hint="Gross wins / losses" />
      <StatCard label="Daily P&L" value={`${dailyPnl >= 0 ? '+' : ''}$${dailyPnl.toFixed(2)}`} hint="Today" tone={dailyPnl >= 0 ? 'positive' : 'destructive'} />
    </div>
    <div className="mt-3 grid gap-3 xl:grid-cols-2">
      <Card><CardHeader><CardTitle>Session Breakdown</CardTitle></CardHeader><CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">{[
        ['Total Trades', stats.totalTrades], ['Profitable', stats.profitable], ['Losing', stats.losing],
        ['Best Trade', `+$${stats.best.toFixed(2)}`], ['Worst Trade', stats.worst < 0 ? `-$${Math.abs(stats.worst).toFixed(2)}` : '$0.00'],
        ['Equity', `$${equity.toLocaleString()}`],
      ].map(([label, value]) => <div key={label as string} className="border-r pr-2 last:border-r-0"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-mono text-base font-semibold">{value}</p></div>)}</CardContent></Card>
      <Card><CardHeader><CardTitle>Account Overview</CardTitle></CardHeader><CardContent className="flex flex-col gap-3">{[
        ['Balance', `$${balance.toLocaleString()}`], ['Equity', `$${equity.toLocaleString()}`],
        ['Open Exposure', `$${positions.reduce((s, p) => s + p.stake, 0).toLocaleString()}`],
        ['Unrealized P&L', `${positions.reduce((s, p) => s + (p.profitLoss || 0), 0) >= 0 ? '+' : ''}$${positions.reduce((s, p) => s + (p.profitLoss || 0), 0).toFixed(2)}`],
      ].map(([label, value]) => <div key={label as string} className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{label}</span><span className="font-mono font-semibold">{value}</span></div>)}</CardContent></Card>
    </div>
  </>
}

/* ─── Subscription ─── */
export function SubscriptionModule() {
  const { currentPlan, upgradePlan } = useTradingStore()

  const plans = [
    { id: 'starter' as const, name: 'Starter', price: '$0', detail: 'Monitor one Deriv demo account', features: ['Demo account access', 'Basic market data', 'Community support'] },
    { id: 'pro' as const, name: 'Pro', price: '$29/mo', detail: 'One live account and full analytics', features: ['Live account trading', 'Full analytics suite', 'AI assistant access', 'Priority support'] },
    { id: 'scale' as const, name: 'Scale', price: '$79/mo', detail: 'Higher limits and priority support', features: ['Unlimited positions', 'Priority execution', 'Advanced backtesting', 'Dedicated support', 'Custom strategies'] },
  ]

  return <>
    <PageHeader title="Subscription" subtitle="Choose a plan that fits your trading needs." actions={<Badge variant="default">Current: {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}</Badge>} />
    <div className="mt-4 grid gap-3 md:grid-cols-3">{plans.map((plan) => {
      const isCurrent = currentPlan === plan.id
      return <Card key={plan.id} className={isCurrent ? 'border-primary/50 ring-1 ring-primary/20' : ''}><CardHeader><div className="flex items-center justify-between"><CardTitle>{plan.name}</CardTitle>{isCurrent && <Badge>Active</Badge>}</div><CardDescription>{plan.detail}</CardDescription><p className="mt-2 font-mono text-2xl font-bold">{plan.price}</p></CardHeader><CardContent className="flex flex-col gap-2">{plan.features.map((f) => <div key={f} className="flex items-center gap-2 text-sm"><Check className="size-4 text-positive" />{f}</div>)}</CardContent><CardFooter><Button className="w-full" variant={isCurrent ? 'outline' : 'default'} onClick={() => { if (!isCurrent) { upgradePlan(plan.id) } }}>{isCurrent ? 'Current Plan' : 'Upgrade'}</Button></CardFooter></Card>
    })}</div>
  </>
}

/* ─── Settings ─── */
export function PlatformSettingsModule() {
  const { riskConfig, updateRiskConfig, isSimulationMode, toggleSimulationMode, resetTradingData, activeStrategy } = useTradingStore()

  return <>
    <PageHeader title="Settings" subtitle="Platform configuration, risk management, and data controls." actions={<Button variant="destructive" size="sm" onClick={resetTradingData}><RotateCcw data-icon="inline-start" />Reset All Data</Button>} />
    <div className="grid gap-3 xl:grid-cols-2">
      <Card><CardHeader><CardTitle>Risk Management</CardTitle><CardDescription>Global risk safeguards applied to bot execution.</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border p-3"><Label className="text-xs text-muted-foreground">Risk per trade</Label><p className="mt-1 font-mono text-lg font-semibold">{riskConfig.riskPerTradePercent}%</p></div>
        <div className="rounded-lg border p-3"><Label className="text-xs text-muted-foreground">Daily loss limit</Label><p className="mt-1 font-mono text-lg font-semibold">{riskConfig.dailyLossLimitPercent}%</p></div>
        <div className="rounded-lg border p-3"><Label className="text-xs text-muted-foreground">Max open positions</Label><p className="mt-1 font-mono text-lg font-semibold">{riskConfig.maxOpenPositions}</p></div>
        <div className="rounded-lg border p-3"><Label className="text-xs text-muted-foreground">Emergency stop</Label><p className="mt-1 font-mono text-lg font-semibold text-positive">{riskConfig.emergencyStopEnabled ? 'Enabled' : 'Disabled'}</p></div>
      </CardContent></Card>
      <Card><CardHeader><CardTitle>Platform Controls</CardTitle><CardDescription>Execution and simulation settings.</CardDescription></CardHeader><CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 rounded-lg border p-3"><div><b className="text-sm">Simulation Mode</b><p className="text-xs text-muted-foreground">Trade with virtual portfolio using simulated prices</p></div><Switch checked={isSimulationMode} onCheckedChange={toggleSimulationMode} /></div>
        <div className="flex items-center justify-between gap-4 rounded-lg border p-3"><div><b className="text-sm">Active Strategy</b><p className="text-xs text-muted-foreground">Currently selected trading algorithm</p></div><span className="font-mono text-sm text-primary">{activeStrategy}</span></div>
        <div className="flex items-center justify-between gap-4 rounded-lg border p-3"><div><b className="text-sm">Emergency Stop</b><p className="text-xs text-muted-foreground">Auto-halt on daily loss limit breach</p></div><Switch checked={riskConfig.emergencyStopEnabled} onCheckedChange={(checked) => updateRiskConfig({ emergencyStopEnabled: checked })} /></div>
      </CardContent></Card>
    </div>
  </>
}
