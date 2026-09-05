import type { ModuleConfig } from '@/components/modules/module-scaffold'

export const marketConfigs: Record<string, ModuleConfig> = {
  Strategies: {
    title: 'Strategy Lab', subtitle: 'Enable, configure, clone, and compare your trading systems.', primary: 'Create strategy',
    stats: [['Active', '3', 'of 4 strategies'], ['Best Return', '+18.4%', 'QuantStoch Core'], ['Avg Win Rate', '69.2%', 'Last 30 days'], ['Signals Today', '14', '9 executed']],
    sections: [
      { title: 'Live Strategies', rows: [
        { name: 'QuantStoch Core v1.4', detail: 'Stochastic momentum + trend filter', value: '+18.4%', status: 'Active', progress: 82 },
        { name: 'Alpha Trend', detail: 'Multi-timeframe trend continuation', value: '+12.1%', status: 'Active', progress: 76 },
        { name: 'Momentum Scalper', detail: 'London and New York session scalper', value: '+8.7%', status: 'Active', progress: 68 },
        { name: 'Swing Master', detail: 'Daily structure and key zones', value: '+4.2%', status: 'Paused', progress: 61 },
      ]},
      { title: 'Rule Flow', rows: [
        { name: 'Market condition', detail: 'H4 trend is bullish', status: 'IF' },
        { name: 'Entry trigger', detail: 'M15 stochastic crosses above 20', status: 'AND' },
        { name: 'Risk rule', detail: 'Risk 1% with 2.5R target', status: 'THEN' },
        { name: 'News guard', detail: 'Pause 30m before red-folder news', status: 'FILTER' },
      ]},
    ],
  },
  Analytics: {
    title: 'Performance Analytics', subtitle: 'Explore returns, drawdown, timing, and instrument performance.', primary: 'Refresh analysis',
    stats: [['Net Profit', '+$8,421', '+43.2% YTD'], ['Profit Factor', '2.48', 'Healthy'], ['Sharpe Ratio', '1.86', 'Risk adjusted'], ['Max Drawdown', '-8.4%', '14-day recovery']],
    sections: [
      { title: 'Instrument Breakdown', rows: [
        { name: 'EUR/USD', detail: '42 trades · 76% win rate', value: '+$2,940', progress: 88 },
        { name: 'XAU/USD', detail: '31 trades · 71% win rate', value: '+$2,180', progress: 74 },
        { name: 'GBP/USD', detail: '28 trades · 68% win rate', value: '+$1,740', progress: 63 },
        { name: 'USD/JPY', detail: '24 trades · 62% win rate', value: '+$861', progress: 48 },
      ]},
      { title: 'Session Performance', rows: [
        { name: 'London Open', detail: '08:00–11:00 UTC', value: '+$3,820', status: 'Best' },
        { name: 'New York Open', detail: '13:30–16:00 UTC', value: '+$2,940', status: 'Strong' },
        { name: 'London Close', detail: '15:00–17:00 UTC', value: '+$1,280', status: 'Stable' },
        { name: 'Asian Session', detail: '00:00–06:00 UTC', value: '+$381', status: 'Low volume' },
      ]},
    ],
  },
  'Market News': {
    title: 'Market News', subtitle: 'Track high-impact stories and their effect on your watchlist.', primary: 'Mark all read',
    stats: [['Risk Sentiment', 'Risk-on', 'Moderate strength'], ['High Impact', '3', 'Next 24 hours'], ['Saved', '7', 'Reading list'], ['Market Pulse', 'Bullish', '58 / 100']],
    sections: [
      { title: 'Top Stories', rows: [
        { name: 'Dollar eases before Fed minutes', detail: 'USD · 12 minutes ago', status: 'High impact' },
        { name: 'Gold advances as yields retreat', detail: 'XAU/USD · 28 minutes ago', status: 'Bullish' },
        { name: 'Sterling steady after inflation print', detail: 'GBP/USD · 43 minutes ago', status: 'Medium' },
        { name: 'Yen intervention risk returns', detail: 'USD/JPY · 1 hour ago', status: 'High impact' },
      ]},
      { title: 'Sentiment by Market', rows: [
        { name: 'EUR/USD', detail: 'Positive coverage is increasing', value: '68%', progress: 68 },
        { name: 'GBP/USD', detail: 'Mixed macro commentary', value: '51%', progress: 51 },
        { name: 'XAU/USD', detail: 'Strong safe-haven demand', value: '74%', progress: 74 },
        { name: 'USD/JPY', detail: 'Bearish USD sentiment', value: '39%', progress: 39 },
      ]},
    ],
  },
  Calendar: {
    title: 'Economic Calendar', subtitle: 'Plan around scheduled releases and market-moving events.', primary: 'Set event alert',
    stats: [['Next Event', '00:42:18', 'US Durable Goods'], ['High Impact', '4', 'Today'], ['Currencies', '6', 'Filtered'], ['Alerts', '3', 'Active']],
    sections: [
      { title: 'Today · May 24', rows: [
        { name: 'German GDP QoQ', detail: '07:00 UTC · Forecast 0.2% · Previous 0.2%', value: '0.2%', status: 'Released' },
        { name: 'UK Retail Sales', detail: '08:00 UTC · Forecast -0.4% · Previous 0.8%', value: '-0.2%', status: 'Released' },
        { name: 'US Durable Goods Orders', detail: '12:30 UTC · Forecast -0.8% · Previous 0.9%', status: 'High impact' },
        { name: 'Fed Governor Waller Speaks', detail: '14:35 UTC · Monetary policy remarks', status: 'Speech' },
      ]},
      { title: 'AI Impact Guide', rows: [
        { name: 'EUR/USD', detail: 'Reduce size before US durable goods', status: 'Caution' },
        { name: 'GBP/USD', detail: 'Retail sales surprise supports GBP', status: 'Bullish' },
        { name: 'XAU/USD', detail: 'Watch yield reaction after Fed remarks', status: 'Watch' },
        { name: 'USD/JPY', detail: 'Event sensitivity remains elevated', status: 'High risk' },
      ]},
    ],
  },
}
