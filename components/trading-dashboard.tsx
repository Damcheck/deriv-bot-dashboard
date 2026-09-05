'use client'

import { useEffect, useMemo, useState } from 'react'
import { Activity as ActivityIcon, BarChart3, Bell, Bot, ChevronDown, Clock3, Gauge, LayoutDashboard, LineChart, LogOut, Menu, Moon, PlugZap, Radio, ScanSearch, Search, Settings, ShieldCheck, Sun, Target, TrendingUp, Users, WalletCards, Waves, Workflow, X } from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MarketChart } from '@/components/market-chart'
import { AccountPanel, AiStatus, Performance, PositionsTable, RecentTrades, SignalsTable } from '@/components/dashboard-panels'
import { ModuleRouter } from '@/components/modules/module-router'
import { useTradingStore } from '@/lib/trading-store'

const nav = [
  ['Dashboard', LayoutDashboard],
  ['Deriv Account', PlugZap],
  ['Trading Bot', Bot],
  ['Terminal', LineChart],
  ['Positions & History', Users],
  ['Strategy Signals', Radio],
  ['AI Assistant', Waves],
  ['Backtesting', Workflow],
  ['Analytics', BarChart3],
] as const
const secondary = [
  ['Subscription', WalletCards],
  ['Settings', Settings],
] as const
const strategies = ['QuantStoch Core v1.4', 'Alpha Trend', 'Momentum Scalper', 'Swing Master']
const ranges = ['1D', '7D', '30D', '90D', '1Y']

function Sparkline({ points }: { points: number[] }) {
  const w = 96, h = 35, max = Math.max(...points), min = Math.min(...points)
  return <svg className="h-9 w-24" viewBox={`0 0 ${w} ${h}`} aria-hidden="true"><polyline fill="none" stroke="var(--primary)" strokeWidth="1.5" points={points.map((p, i) => `${(i * w) / (points.length - 1)},${h - ((p - min) / (max - min)) * 30}`).join(' ')} /></svg>
}

function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  useEffect(() => {
    setTheme(document.documentElement.classList.contains('light') ? 'light' : 'dark')
  }, [])
  const toggle = () => setTheme((current) => {
    const next = current === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(next)
    return next
  })
  return { theme, toggle }
}

function Sidebar({ open, active, onSelect, onClose }: { open: boolean; active: string; onSelect: (name: string) => void; onClose: () => void }) {
  return (
    <aside className={`glass-sidebar fixed inset-y-0 left-0 z-40 flex h-dvh w-[min(88vw,15rem)] flex-col border-r transition-transform lg:w-60 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex shrink-0 items-center justify-between p-4">
        <div className="flex min-w-0 items-center gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/15 shadow-[inset_0_1px_0_rgb(255_255_255/0.18)]"><Waves className="text-primary" /></div><div className="min-w-0"><p className="truncate text-sm font-semibold tracking-wide">QUANTSTOCH</p><p className="truncate text-[11px] text-muted-foreground">TRADING SYSTEM</p></div></div>
        <Button variant="ghost" size="icon-sm" onClick={onClose} className="lg:hidden" aria-label="Close navigation"><X /></Button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-4">
        <nav className="flex flex-col gap-1">{nav.map(([name, Icon]) => <button key={name} onClick={() => onSelect(name)} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${active === name ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'}`}><Icon className="size-4" />{name}</button>)}</nav>
        <div className="my-3 border-t" />
        <nav className="flex flex-col gap-1">{secondary.map(([name, Icon]) => <button key={name} onClick={() => onSelect(name)} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${active === name ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'}`}><Icon className="size-4" />{name}</button>)}</nav>
        <div className="mt-6 flex flex-col gap-3">
          <Card><CardContent className="flex flex-col gap-3 p-3"><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><b className="text-sm">Setup incomplete</b></div><p className="text-xs leading-relaxed text-muted-foreground">Explore this dashboard safely, then connect Deriv, your bot, and subscription from here.</p><Button size="sm" onClick={() => onSelect('Deriv Account')}>Continue setup</Button></CardContent></Card>
          <DropdownMenu>
            <DropdownMenuTrigger render={<button className="flex items-center gap-3 rounded-lg border p-2 text-left" />}>
              <Avatar><AvatarFallback>L</AvatarFallback></Avatar><span className="flex-1 text-sm"><b>Levox Trader</b><small className="block text-primary">Premium Member</small></span><ChevronDown className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52"><DropdownMenuGroup><DropdownMenuLabel>My workspace</DropdownMenuLabel><DropdownMenuItem onClick={() => onSelect('Settings')}><Settings />Workspace settings</DropdownMenuItem><DropdownMenuItem onClick={() => onSelect('Analytics')}><Gauge />Performance analytics</DropdownMenuItem></DropdownMenuGroup><DropdownMenuSeparator /><DropdownMenuItem variant="destructive" onClick={() => toast.info('Sign out is unavailable in demo mode.')}><LogOut />Sign out</DropdownMenuItem></DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  )
}

export function TradingDashboard() {
  const [menu, setMenu] = useState(false)
  const [active, setActive] = useState('Dashboard')
  const [range, setRange] = useState('1D')
  const { theme, toggle } = useTheme()
  const {
    balance,
    equity,
    dailyPnl,
    positions,
    trades,
    botStatus,
    derivState,
    activeStrategy,
    setActiveStrategy,
  } = useTradingStore()

  const winRate = useMemo(() => {
    if (trades.length === 0) return 72.4
    const wins = trades.filter((t) => (t.profitLoss || 0) > 0).length
    return Number(((wins / trades.length) * 100).toFixed(1))
  }, [trades])

  const balancePct = useMemo(() => ((dailyPnl / (balance - dailyPnl)) * 100).toFixed(2), [dailyPnl, balance])

  const statusBadge = useMemo(() => {
    if (botStatus === 'running') {
      return { label: '● Bot Running (Autonomous)', color: 'text-positive border-positive/30 bg-positive/10', action: () => select('Trading Bot') }
    }
    if (botStatus === 'paused') {
      return { label: '● Bot Paused', color: 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10', action: () => select('Trading Bot') }
    }
    if (derivState === 'connected') {
      return { label: '● Deriv Connected (Idle)', color: 'text-primary border-primary/30 bg-primary/10', action: () => select('Trading Bot') }
    }
    return { label: '● Deriv Disconnected', color: 'text-muted-foreground border-border bg-muted', action: () => select('Deriv Account') }
  }, [botStatus, derivState])

  const metrics = useMemo(() => [
    ['Total Balance', `$${balance.toLocaleString()}`, `${Number(balancePct) >= 0 ? '+' : ''}${balancePct}% today`, WalletCards, [2, 4, 3, 7, 5, 9, 4, 3, 6, 5, 8, 7, 11]],
    ['Equity', `$${equity.toLocaleString()}`, `${Number(balancePct) >= 0 ? '+' : ''}${balancePct}% today`, ActivityIcon, [4, 2, 5, 2, 6, 3, 7, 4, 8, 7, 11]],
    ['Daily P&L', `${dailyPnl >= 0 ? '+' : ''}$${Math.abs(dailyPnl).toLocaleString()}`, `${Number(balancePct) >= 0 ? '+' : ''}${balancePct}%`, BarChart3, [1, 4, 3, 8, 9, 5, 3, 6, 8, 7, 10, 11]],
    ['Win Rate', `${winRate}%`, `${trades.length} trades`, Target, [2, 4, 5, 4, 2, 6, 3, 7, 6, 9, 11]],
  ] as const, [balance, equity, dailyPnl, winRate, balancePct, trades.length])

  const select = (name: string) => { setActive(name); setMenu(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar open={menu} active={active} onSelect={select} onClose={() => setMenu(false)} />
      {menu && <button className="fixed inset-0 z-30 bg-background/80 lg:hidden" onClick={() => setMenu(false)} aria-label="Close menu overlay" />}
      <div className="lg:pl-60">
        <header className="glass-header sticky top-0 z-20 flex h-16 items-center justify-between gap-2 border-b px-3 sm:px-4 lg:px-6">
          <Button variant="outline" size="icon" onClick={() => setMenu(true)} className="lg:hidden" aria-label="Open navigation"><Menu /></Button>
          <span className="hidden font-semibold lg:block">{active}</span>
          <div className="flex items-center gap-2">
            <button onClick={statusBadge.action} className={`hidden rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors sm:block ${statusBadge.color}`}>{statusBadge.label}</button>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="hidden md:flex" />}>Strategy: {activeStrategy}<ChevronDown data-icon="inline-end" /></DropdownMenuTrigger>
              <DropdownMenuContent align="end"><DropdownMenuGroup><DropdownMenuLabel>Active strategy</DropdownMenuLabel>{strategies.map((item) => <DropdownMenuItem key={item} onClick={() => { setActiveStrategy(item); toast.success(`Strategy switched to ${item}.`) }}>{item}</DropdownMenuItem>)}</DropdownMenuGroup></DropdownMenuContent>
            </DropdownMenu>
            <Dialog>
              <DialogTrigger render={<Button variant="outline" size="icon" aria-label="Search" />}><Search /></DialogTrigger>
              <DialogContent><DialogHeader><DialogTitle>Search markets</DialogTitle><DialogDescription>Find pairs, strategies, and reports.</DialogDescription></DialogHeader><input autoFocus placeholder="Try EUR/USD or QuantStoch Core" className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" /><DialogFooter showCloseButton /></DialogContent>
            </Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="Notifications" className="relative" />}><Bell /><span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">3</span></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64"><DropdownMenuGroup><DropdownMenuLabel>Notifications</DropdownMenuLabel><DropdownMenuItem onClick={() => toast.info('EUR/USD hit your take-profit level.')}>EUR/USD take-profit reached</DropdownMenuItem><DropdownMenuItem onClick={() => toast.info('New Buy signal on XAU/USD.')}>New signal: XAU/USD</DropdownMenuItem><DropdownMenuItem onClick={() => toast.info('Daily report is ready.')}>Daily report ready</DropdownMenuItem></DropdownMenuGroup><DropdownMenuSeparator /><DropdownMenuItem onClick={() => select('AI Assistant')}>View all signals</DropdownMenuItem></DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="icon" aria-label="Toggle theme" onClick={toggle}>{theme === 'dark' ? <Sun /> : <Moon />}</Button>
            <DropdownMenu>
              <DropdownMenuTrigger render={<button aria-label="Profile menu" />}><Avatar><AvatarFallback>L</AvatarFallback></Avatar></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48"><DropdownMenuGroup><DropdownMenuLabel>Levox Trader</DropdownMenuLabel><DropdownMenuItem onClick={() => select('Settings')}><Settings />Settings</DropdownMenuItem><DropdownMenuItem onClick={() => select('Analytics')}><Gauge />Performance</DropdownMenuItem></DropdownMenuGroup><DropdownMenuSeparator /><DropdownMenuItem variant="destructive" onClick={() => toast.info('Sign out is unavailable in demo mode.')}><LogOut />Sign out</DropdownMenuItem></DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="p-3 sm:p-4 lg:p-6">
          <div hidden={active !== 'Dashboard'}>
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div><h1 className="text-balance text-2xl font-semibold">Welcome back, Trader</h1><p className="mt-1 text-sm text-muted-foreground">{derivState === 'connected' && botStatus === 'running' ? 'Autonomous trading bot active · Deriv WebSocket streaming live ticks.' : derivState === 'connected' ? 'Deriv Gateway connected · Ready to activate trading bot.' : 'Live trading workspace · Connect your Deriv account to enable execution.'}</p></div>
            <div className="flex overflow-hidden rounded-lg border">{ranges.map((item) => <button key={item} onClick={() => { setRange(item); toast.info(`Showing ${item} overview.`) }} className={`px-3 py-2 text-xs ${range === item ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`} aria-pressed={range === item}>{item}</button>)}</div>
          </div>
          <section className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {metrics.map(([label, value, change, Icon, points]) => <Card key={label}><CardContent className="flex h-28 items-center justify-between p-4"><div><p className="text-xs text-primary">{label}</p><p className="mt-2 font-mono text-xl font-semibold">{value}</p><p className={`mt-2 text-xs ${String(change).startsWith('-') ? 'text-destructive' : 'text-positive'}`}>{change}</p></div><div className="flex h-full flex-col items-end justify-between"><span className="rounded-full bg-primary/15 p-2 text-primary"><Icon className="size-4" /></span><Sparkline points={points as unknown as number[]} /></div></CardContent></Card>)}
            <Card><CardContent className="flex h-28 items-center justify-between p-4"><div><p className="text-xs text-primary">Active Positions</p><p className="mt-2 font-mono text-xl font-semibold">{positions.length}</p><button onClick={() => select('Positions & History')} className="mt-2 text-xs text-primary hover:underline">View all →</button></div><button onClick={() => select('Positions & History')} aria-label={`View ${positions.length} active positions`} className="relative flex size-20 shrink-0 items-center justify-center rounded-full bg-[conic-gradient(var(--primary)_0_22%,#62c6f2_22%_39%,var(--positive)_39%_58%,#f6c453_58%_75%,var(--destructive)_75%_100%)] shadow-[0_0_24px_-10px_var(--primary)] transition-transform hover:scale-105"><span className="flex size-14 items-center justify-center rounded-full bg-card/95 font-mono text-xl font-semibold text-foreground shadow-inner">{positions.length}</span></button></CardContent></Card>
          </section>
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 flex flex-col gap-3 xl:col-span-9"><MarketChart live={true} /><div className="grid gap-3 lg:grid-cols-2"><PositionsTable onView={() => select('Positions & History')} /><SignalsTable onView={() => select('AI Assistant')} /></div><Performance /></div>
            <aside className="col-span-12 flex flex-col gap-3 xl:col-span-3"><AccountPanel onConnect={() => select('Deriv Account')} /><AiStatus onInsights={() => select('AI Assistant')} /><RecentTrades onView={() => select('Positions & History')} /></aside>
          </div>
          </div>
          {active !== 'Dashboard' && <ModuleRouter active={active} onNavigate={select} />}
        </main>
      </div>
    </div>
  )
}
