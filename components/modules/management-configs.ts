import type { ModuleConfig } from '@/components/modules/module-scaffold'

export const managementConfigs: Record<string, ModuleConfig> = {
  'Risk Management': {
    title: 'Risk Management',
    subtitle: 'Monitor exposure, drawdown, and protective limits across the account.',
    primary: 'Recalculate risk',
    stats: [
      ['Account Risk', '3.2%', 'of 6% daily cap'],
      ['Open Exposure', '$8,420', '4 correlated pairs'],
      ['Margin Level', '842%', 'Healthy'],
      ['Max Drawdown', '-8.4%', 'Within limit'],
    ],
    sections: [
      {
        title: 'Risk Limits',
        rows: [
          { name: 'Daily loss limit', detail: 'Auto-pause bot when reached', value: '6.0%', status: 'Armed', progress: 53 },
          { name: 'Per-trade risk', detail: 'Maximum risk per position', value: '1.0%', status: 'Active', progress: 33 },
          { name: 'Max open positions', detail: 'Concurrent trades allowed', value: '8', status: 'Active', progress: 75 },
          { name: 'Correlation guard', detail: 'Limit exposure to correlated pairs', value: 'On', status: 'Active', progress: 60 },
        ],
      },
      {
        title: 'Exposure by Currency',
        rows: [
          { name: 'USD', detail: 'Net long across 3 pairs', value: '42%', progress: 42 },
          { name: 'EUR', detail: 'Net long via EUR/USD', value: '26%', progress: 26 },
          { name: 'XAU', detail: 'Long gold position', value: '18%', progress: 18 },
          { name: 'JPY', detail: 'Short via USD/JPY', value: '14%', progress: 14 },
        ],
      },
    ],
  },
  Reports: {
    title: 'Reports',
    subtitle: 'Generate, download, and schedule performance and tax reports.',
    primary: 'Generate report',
    stats: [
      ['Generated', '38', 'This year'],
      ['Scheduled', '3', 'Automated'],
      ['Last Export', 'May 24', 'Daily summary'],
      ['Storage', '1.2 GB', 'of 10 GB'],
    ],
    sections: [
      {
        title: 'Report Templates',
        rows: [
          { name: 'Daily performance summary', detail: 'P&L, win rate, and open risk', status: 'PDF' },
          { name: 'Monthly statement', detail: 'Full account statement with fees', status: 'PDF' },
          { name: 'Tax report (realized P&L)', detail: 'Ready for accountant export', status: 'CSV' },
          { name: 'Strategy attribution', detail: 'Returns broken down by strategy', status: 'XLSX' },
        ],
      },
      {
        title: 'Recent Exports',
        rows: [
          { name: 'Daily summary — May 24', detail: 'Generated 09:15 UTC', value: '82 KB', status: 'Ready' },
          { name: 'Weekly review — Wk 21', detail: 'Generated May 20', value: '146 KB', status: 'Ready' },
          { name: 'April statement', detail: 'Generated May 1', value: '318 KB', status: 'Ready' },
          { name: 'Q1 tax report', detail: 'Generated Apr 3', value: '204 KB', status: 'Ready' },
        ],
      },
    ],
  },
  'API & Integrations': {
    title: 'API & Integrations',
    subtitle: 'Review the connection areas required for live trading and external services.',
    primary: 'Open connection guide',
    stats: [
      ['Connected', '0', 'No external services'],
      ['API Calls', '0', 'No live traffic'],
      ['Webhooks', '0', 'Not configured'],
      ['Mode', 'Demo', 'Safe UI state'],
    ],
    sections: [
      {
        title: 'Connection Areas',
        rows: [
          { name: 'Broker connections', detail: 'Configure separately in Broker Hub', status: 'Not connected' },
          { name: 'AI providers', detail: 'Configure separately in AI Connections', status: 'Not connected' },
          { name: 'Notification channels', detail: 'In-app alerts are available in demo mode', status: 'Demo only' },
          { name: 'TradingView', detail: 'Public chart widget used for market visualization', status: 'Chart only' },
        ],
      },
      {
        title: 'Security Requirements',
        rows: [
          { name: 'Server-side secrets', detail: 'Credentials must never be stored in browser code', status: 'Required' },
          { name: 'Scoped permissions', detail: 'Start read-only and grant minimum access', status: 'Required' },
          { name: 'Webhook signatures', detail: 'Verify every incoming provider event', status: 'Required' },
          { name: 'Audit trail', detail: 'Record configuration and execution changes', status: 'Required' },
        ],
      },
    ],
  },
  'Help Center': {
    title: 'Help Center',
    subtitle: 'Find answers, read guides, and reach the support team.',
    primary: 'Contact support',
    stats: [
      ['Open Tickets', '1', 'Awaiting reply'],
      ['Avg Response', '2h', 'Support SLA'],
      ['Guides', '48', 'Articles'],
      ['Status', 'All systems', 'Operational'],
    ],
    sections: [
      {
        title: 'Popular Guides',
        rows: [
          { name: 'Getting started with QuantStoch', detail: 'Set up your first strategy', status: 'Guide' },
          { name: 'Understanding stochastic signals', detail: 'How entries are generated', status: 'Guide' },
          { name: 'Configuring risk limits', detail: 'Protect your account', status: 'Guide' },
          { name: 'Connecting your broker', detail: 'Link MetaTrader in minutes', status: 'Guide' },
        ],
      },
      {
        title: 'Support Tickets',
        rows: [
          { name: '#4821 — Withdrawal question', detail: 'Opened May 23 · Billing', status: 'Open' },
          { name: '#4790 — Signal delay on XAU', detail: 'Resolved May 18 · Technical', status: 'Closed' },
          { name: '#4762 — API key rotation', detail: 'Resolved May 12 · Security', status: 'Closed' },
          { name: '#4711 — Strategy import help', detail: 'Resolved May 4 · General', status: 'Closed' },
        ],
      },
    ],
  },
}
