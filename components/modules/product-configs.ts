import type { ModuleConfig } from '@/components/modules/module-scaffold'

export const productConfigs: Record<string, ModuleConfig> = {
  'Market Scanner': {
    title: 'Market Scanner', subtitle: 'Filter markets by momentum, volatility, structure, and strategy fit.', primary: 'Run scan',
    stats: [['Markets Scanned', '48', 'Demo universe'], ['Setups Found', '7', '3 high confidence'], ['Top Score', '91 / 100', 'XAU/USD'], ['Last Scan', 'Just now', 'Demo results']],
    sections: [
      { title: 'Top Opportunities', rows: [
        { name: 'XAU/USD', detail: 'Bullish breakout · H1 trend aligned', value: '91', status: 'Strong', progress: 91 },
        { name: 'EUR/USD', detail: 'Pullback into demand · M15 trigger forming', value: '84', status: 'Watch', progress: 84 },
        { name: 'GBP/JPY', detail: 'Momentum continuation · elevated volatility', value: '78', status: 'Medium', progress: 78 },
        { name: 'NAS100', detail: 'Range compression · breakout pending', value: '73', status: 'Watch', progress: 73 },
      ]},
      { title: 'Scanner Rules', rows: [
        { name: 'Trend alignment', detail: 'H1 and H4 direction must agree', status: 'Enabled' },
        { name: 'Minimum confidence', detail: 'Only show scores above 70', value: '70', status: 'Enabled' },
        { name: 'News protection', detail: 'Hide setups near high-impact events', status: 'Enabled' },
        { name: 'Spread filter', detail: 'Exclude markets above spread limit', value: '2.0 pips', status: 'Enabled' },
      ]},
    ],
  },
  'Strategy Builder': {
    title: 'Strategy Builder', subtitle: 'Design rule-based strategies before testing or enabling automation.', primary: 'Create draft',
    stats: [['Drafts', '3', 'Saved locally in demo'], ['Rules', '12', 'Across drafts'], ['Validated', '0', 'Backtest required'], ['Automation', 'Off', 'No broker connected']],
    sections: [
      { title: 'Strategy Drafts', rows: [
        { name: 'London Momentum', detail: 'Trend filter + session breakout', status: 'Draft', progress: 72 },
        { name: 'Gold Reversal', detail: 'Liquidity sweep + momentum confirmation', status: 'Draft', progress: 58 },
        { name: 'NY Continuation', detail: 'Pullback entry after New York open', status: 'Draft', progress: 41 },
      ]},
      { title: 'Rule Blocks', rows: [
        { name: 'Market condition', detail: 'Choose trend, range, volatility, or session filters', status: 'IF' },
        { name: 'Entry confirmation', detail: 'Combine indicators and price-action triggers', status: 'AND' },
        { name: 'Risk and exit', detail: 'Define stop, target, trailing, and position size', status: 'THEN' },
        { name: 'Safety controls', detail: 'News, spread, drawdown, and daily loss guards', status: 'GUARD' },
      ]},
    ],
  },
  'Broker Hub': {
    title: 'Broker Hub', subtitle: 'Prepare broker connections and review execution requirements safely.', primary: 'Add demo connection',
    stats: [['Connected Brokers', '0', 'No live broker linked'], ['Execution', 'Disabled', 'Safe demo mode'], ['Accounts', '0', 'Awaiting connection'], ['Credentials', 'None', 'Nothing stored']],
    sections: [
      { title: 'Supported Connection Types', rows: [
        { name: 'MetaTrader 5', detail: 'Requires a secure server-side bridge', status: 'Not connected' },
        { name: 'cTrader', detail: 'Requires approved Open API credentials', status: 'Not connected' },
        { name: 'Interactive Brokers', detail: 'Requires gateway and account authorization', status: 'Not connected' },
        { name: 'TradingView alerts', detail: 'Webhook-based signal intake only', status: 'Not connected' },
      ]},
      { title: 'Connection Checklist', rows: [
        { name: 'Authorize account', detail: 'Use broker-approved authentication only', status: 'Required' },
        { name: 'Confirm permissions', detail: 'Start read-only before enabling execution', status: 'Required' },
        { name: 'Set risk limits', detail: 'Daily loss and per-trade caps must be configured', status: 'Required' },
        { name: 'Test in demo', detail: 'Validate orders before any live activation', status: 'Required' },
      ]},
    ],
  },
  'AI Connections': {
    title: 'AI Connections', subtitle: 'Configure analysis providers without exposing credentials in the browser.', primary: 'Add demo provider',
    stats: [['Connected Providers', '0', 'No AI provider linked'], ['Model Calls', '0', 'No live requests'], ['Credential Storage', 'Server only', 'Required for launch'], ['Fallback', 'Rules engine', 'Demo mode']],
    sections: [
      { title: 'Provider Options', rows: [
        { name: 'Vercel AI Gateway', detail: 'Recommended routing layer for supported models', status: 'Not connected' },
        { name: 'OpenAI-compatible model', detail: 'Analysis and structured explanations', status: 'Not connected' },
        { name: 'Anthropic-compatible model', detail: 'Market summaries and reasoning', status: 'Not connected' },
        { name: 'Local rules engine', detail: 'Deterministic demo insights without external calls', status: 'Demo active' },
      ]},
      { title: 'AI Responsibilities', rows: [
        { name: 'Signal explanation', detail: 'Explain why a rules-based signal was produced', status: 'Planned' },
        { name: 'Risk review', detail: 'Flag concentration and event risk', status: 'Planned' },
        { name: 'Journal coaching', detail: 'Summarize recurring behavior patterns', status: 'Planned' },
        { name: 'Trade execution', detail: 'AI cannot bypass strategy and risk controls', status: 'Blocked' },
      ]},
    ],
  },
  Automation: {
    title: 'Automation', subtitle: 'Control the path from approved strategy signals to broker execution.', primary: 'Create automation',
    stats: [['Automations', '0', 'No live workflows'], ['Execution', 'Disabled', 'Broker required'], ['Safety Checks', '4', 'Must all pass'], ['Pending Actions', '0', 'Nothing queued']],
    sections: [
      { title: 'Workflow Stages', rows: [
        { name: 'Receive strategy signal', detail: 'Only from an enabled and validated strategy', status: 'Demo' },
        { name: 'Run risk checks', detail: 'Exposure, drawdown, spread, and event filters', status: 'Required' },
        { name: 'Request approval', detail: 'Optional human confirmation before execution', status: 'Enabled' },
        { name: 'Route broker order', detail: 'Unavailable until a broker is securely connected', status: 'Locked' },
      ]},
      { title: 'Global Safeguards', rows: [
        { name: 'Emergency stop', detail: 'Pause all new order requests immediately', status: 'Armed' },
        { name: 'Daily loss cap', detail: 'Block activity after configured drawdown', value: '3%', status: 'Demo' },
        { name: 'Maximum positions', detail: 'Limit simultaneous market exposure', value: '4', status: 'Demo' },
        { name: 'High-impact news lock', detail: 'Pause around selected economic events', status: 'Enabled' },
      ]},
    ],
  },
  History: {
    title: 'Trade History', subtitle: 'Review completed, cancelled, and rejected trade records.', primary: 'Import demo trades',
    stats: [['Closed Trades', '124', 'Demo dataset'], ['Net Result', '+$8,421', 'Simulated'], ['Rejected', '6', 'Risk filters'], ['Avg Duration', '3h 18m', 'Demo dataset']],
    sections: [
      { title: 'Recent Activity', rows: [
        { name: 'EUR/USD · Buy', detail: 'Closed May 24 · QuantStoch Core', value: '+$184.20', status: 'Demo' },
        { name: 'XAU/USD · Sell', detail: 'Closed May 23 · Gold Reversal', value: '+$312.80', status: 'Demo' },
        { name: 'GBP/USD · Buy', detail: 'Closed May 23 · London Momentum', value: '-$96.40', status: 'Demo' },
        { name: 'USD/JPY · Sell', detail: 'Rejected May 22 · correlation guard', value: '$0.00', status: 'Blocked' },
      ]},
      { title: 'Execution Review', rows: [
        { name: 'Rule compliance', detail: 'Trades matching the approved strategy plan', value: '92%', progress: 92 },
        { name: 'Risk compliance', detail: 'Trades within position-size policy', value: '100%', progress: 100 },
        { name: 'Average slippage', detail: 'Illustrative execution quality', value: '0.3 pip', progress: 22 },
        { name: 'Manual overrides', detail: 'Trades changed after signal generation', value: '4', progress: 18 },
      ]},
    ],
  },
  Journal: {
    title: 'Trading Journal', subtitle: 'Capture decisions, emotions, screenshots, and lessons for every trade.', primary: 'New journal entry',
    stats: [['Entries', '28', 'Demo journal'], ['Plan Followed', '82%', 'Last 30 entries'], ['Top Mistake', 'Early exit', '6 occurrences'], ['Review Streak', '7 days', 'Demo status']],
    sections: [
      { title: 'Recent Entries', rows: [
        { name: 'EUR/USD continuation', detail: 'Followed plan · calm · waited for confirmation', status: 'Reviewed' },
        { name: 'XAU/USD reversal', detail: 'Good entry · moved stop too early', status: 'Review' },
        { name: 'GBP/USD breakout', detail: 'Entered before session confirmation', status: 'Lesson' },
        { name: 'Weekly reflection', detail: 'Best performance came from fewer, clearer setups', status: 'Summary' },
      ]},
      { title: 'Behavior Patterns', rows: [
        { name: 'Plan adherence', detail: 'Improving across the last four weeks', value: '82%', progress: 82 },
        { name: 'Overtrading', detail: 'Two sessions exceeded planned trade count', value: 'Low', progress: 24 },
        { name: 'Early exits', detail: 'Most common execution mistake', value: '6', progress: 52 },
        { name: 'Post-trade reviews', detail: 'Entries reviewed within 24 hours', value: '89%', progress: 89 },
      ]},
    ],
  },
  Notifications: {
    title: 'Notifications', subtitle: 'Control signal, risk, system, and account alerts.', primary: 'Test notification',
    stats: [['Unread', '3', 'Demo notifications'], ['Channels', '1', 'In-app only'], ['Critical Alerts', 'Enabled', 'Risk events'], ['Quiet Hours', '22:00–06:00', 'Local setting']],
    sections: [
      { title: 'Recent Notifications', rows: [
        { name: 'Risk limit reminder', detail: 'Automation remains disabled without a broker', status: 'Important' },
        { name: 'XAU/USD scanner result', detail: 'Demo confidence score reached 91', status: 'Scanner' },
        { name: 'Journal review due', detail: 'Two demo trades need reflection notes', status: 'Journal' },
        { name: 'Weekly report available', detail: 'Performance summary created from demo data', status: 'Report' },
      ]},
      { title: 'Alert Preferences', rows: [
        { name: 'Strategy signals', detail: 'Notify when a validated strategy creates a setup', status: 'Enabled' },
        { name: 'Risk events', detail: 'Always notify on blocked or paused activity', status: 'Required' },
        { name: 'Economic calendar', detail: 'Alert before selected high-impact releases', status: 'Enabled' },
        { name: 'Product updates', detail: 'Occasional feature and maintenance messages', status: 'Paused' },
      ]},
    ],
  },
  Subscription: {
    title: 'Subscription', subtitle: 'Review plan access, usage boundaries, and billing readiness.', primary: 'Compare plans',
    stats: [['Current Plan', 'Demo', 'No active billing'], ['Renewal', 'Not scheduled', 'Stripe not connected'], ['Seats', '1', 'Demo workspace'], ['Amount Due', '$0', 'No charge created']],
    sections: [
      { title: 'Plan Capabilities', rows: [
        { name: 'Dashboard and TradingView', detail: 'Market overview and manual analysis tools', status: 'Available' },
        { name: 'Strategy testing', detail: 'Backtesting and demo strategy workflows', status: 'Available' },
        { name: 'Broker automation', detail: 'Requires an eligible plan and broker connection', status: 'Locked' },
        { name: 'AI analysis', detail: 'Requires a configured AI provider', status: 'Locked' },
      ]},
      { title: 'Billing Status', rows: [
        { name: 'Payment provider', detail: 'Stripe integration has not been configured', status: 'Not connected' },
        { name: 'Payment method', detail: 'No card or bank details are stored', status: 'None' },
        { name: 'Invoices', detail: 'No live invoices have been generated', status: 'None' },
        { name: 'Cancellation', detail: 'No paid subscription is active', status: 'Not applicable' },
      ]},
    ],
  },
  'API Center': {
    title: 'API Center', subtitle: 'Plan secure API access, webhooks, scopes, and audit controls.', primary: 'Create demo key',
    stats: [['Live Keys', '0', 'No credentials issued'], ['Webhooks', '0', 'No endpoints connected'], ['Requests', '0', 'No live traffic'], ['Mode', 'Sandbox', 'UI demonstration']],
    sections: [
      { title: 'API Access', rows: [
        { name: 'Read-only analytics', detail: 'View account metrics and reports', status: 'Not issued' },
        { name: 'Strategy management', detail: 'Create and update strategy configurations', status: 'Not issued' },
        { name: 'Trade execution', detail: 'Requires broker, authentication, and strict scopes', status: 'Locked' },
        { name: 'Audit events', detail: 'Read immutable security and activity records', status: 'Not issued' },
      ]},
      { title: 'Webhook Events', rows: [
        { name: 'signal.created', detail: 'A validated strategy produced a signal', status: 'Available later' },
        { name: 'risk.blocked', detail: 'A risk control prevented progression', status: 'Available later' },
        { name: 'trade.updated', detail: 'Broker-reported order or position change', status: 'Broker required' },
        { name: 'report.ready', detail: 'A scheduled report finished generating', status: 'Available later' },
      ]},
    ],
  },
}
