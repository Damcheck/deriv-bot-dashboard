'use client'

import { AiAssistantModule, AnalyticsModule, DerivAccountModule, OverviewModule, PlatformSettingsModule, PositionsHistoryModule, SubscriptionModule, TradingBotModule } from '@/components/modules/platform-modules'
import { TradingModule } from '@/components/modules/trading'
import { BacktestingModule } from '@/components/modules/backtesting'
import { SignalsModule } from '@/components/modules/signals'
import { PositionsModule } from '@/components/modules/positions'
import { SettingsModule } from '@/components/modules/settings'

export function ModuleRouter({ active, onNavigate }: { active: string; onNavigate: (name: string) => void }) {
  if (active === 'Overview') return <OverviewModule onNavigate={onNavigate} />
  if (active === 'Deriv Account') return <DerivAccountModule />
  if (active === 'Trading Bot') return <TradingBotModule />
  if (active === 'Terminal' || active === 'Trading') return <TradingModule />
  if (active === 'Positions & History') return <PositionsHistoryModule />
  if (active === 'Positions') return <PositionsModule />
  if (active === 'Strategy Signals' || active === 'Signals') return <SignalsModule />
  if (active === 'AI Assistant' || active === 'AI Insights') return <AiAssistantModule />
  if (active === 'Backtesting') return <BacktestingModule />
  if (active === 'Analytics') return <AnalyticsModule />
  if (active === 'Subscription') return <SubscriptionModule />
  if (active === 'Settings') return <SettingsModule />
  return <OverviewModule onNavigate={onNavigate} />
}
