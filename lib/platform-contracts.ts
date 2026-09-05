export type ConnectionState = 'not_configured' | 'disconnected' | 'connecting' | 'connected' | 'degraded' | 'error'

export type ReadinessItem = {
  id: 'auth' | 'database' | 'deriv' | 'subscription' | 'bot_server' | 'risk'
  label: string
  state: ConnectionState
  required: boolean
  detail: string
}

export type BotStatus = 'locked' | 'offline' | 'idle' | 'running' | 'paused' | 'error'

export type RiskConfiguration = {
  riskPerTradePercent: number
  dailyLossLimitPercent: number
  maxOpenPositions: number
  emergencyStopEnabled: boolean
}

export type BotCommand = 'start' | 'pause' | 'resume' | 'emergency_stop'

export type BotCommandRequest = {
  command: BotCommand
  accountId: string
  idempotencyKey: string
  expectedStatus: BotStatus
}

export type BotEvent = {
  id: string
  type: 'status.changed' | 'trade.opened' | 'trade.updated' | 'trade.closed' | 'risk.blocked' | 'connection.changed'
  userId: string
  accountId: string
  occurredAt: string
  payload: Record<string, unknown>
}

export type AiProvider = 'openai' | 'anthropic' | 'google' | 'openai_compatible'

export type AiConnectionInput = {
  provider: AiProvider
  model: string
  apiKey: string
  baseUrl?: string
}

export type SubscriptionPlanId = 'starter' | 'pro' | 'scale'
export type SubscriptionStatus = 'inactive' | 'trialing' | 'active' | 'past_due' | 'canceled'

export type SubscriptionEntitlement = {
  planId: SubscriptionPlanId
  status: SubscriptionStatus
  liveTradingAllowed: boolean
  accountLimit: number
  validUntil: string | null
}

export type DerivAccount = {
  id: string
  loginId: string
  currency: string
  accountType: 'demo' | 'real'
  state: ConnectionState
  scopes: Array<'read' | 'trade'>
}

export type BotHealth = {
  state: ConnectionState
  version: string | null
  checkedAt: string
  restLatencyMs: number | null
  websocketConnected: boolean
}

export type Position = {
  id: string
  accountId: string
  symbol: string
  direction: 'buy' | 'sell'
  status: 'open' | 'closed'
  openedAt: string
  closedAt: string | null
  stake: number
  profitLoss: number | null
  currency: string
}

export type Trade = Position & {
  derivContractId: string
  exitReason: 'target' | 'stop' | 'manual' | 'expired' | null
}

export type AuditEvent = {
  id: string
  userId: string
  action: string
  outcome: 'accepted' | 'rejected' | 'failed'
  occurredAt: string
  correlationId: string
  metadata: Record<string, unknown>
}

export type BotApiContract = {
  'GET /v1/health': { response: BotHealth }
  'GET /v1/status': { response: { status: BotStatus; accountId: string | null } }
  'GET /v1/configuration': { response: RiskConfiguration }
  'PUT /v1/configuration': { request: RiskConfiguration; response: RiskConfiguration }
  'POST /v1/commands': { request: BotCommandRequest; response: { commandId: string; accepted: boolean } }
  'GET /v1/positions': { response: Position[] }
  'GET /v1/trades': { response: Trade[] }
  'GET /v1/audit-events': { response: AuditEvent[] }
}

export type CheckoutRequest = {
  planId: SubscriptionPlanId
  quantity: 1
  idempotencyKey: string
}

export type CheckoutResponse = { checkoutUrl: string }
export type PortalResponse = { portalUrl: string }
export type BillingWebhookEvent =
  | { type: 'checkout.session.completed'; customerId: string; subscriptionId: string }
  | { type: 'customer.subscription.updated' | 'customer.subscription.deleted'; customerId: string; subscriptionId: string }

export const readiness: ReadinessItem[] = [
  { id: 'auth', label: 'Platform account', state: 'not_configured', required: true, detail: 'Authentication is intentionally postponed.' },
  { id: 'database', label: 'Encrypted storage', state: 'not_configured', required: true, detail: 'A database and encryption key are required for provider tokens.' },
  { id: 'deriv', label: 'Deriv account', state: 'not_configured', required: true, detail: 'Register a Deriv OAuth application and redirect URI.' },
  { id: 'subscription', label: 'Subscription', state: 'not_configured', required: true, detail: 'Stripe products, webhooks, and entitlements are not connected.' },
  { id: 'bot_server', label: 'Python bot server', state: 'not_configured', required: true, detail: 'REST and WebSocket endpoints are awaiting the final contract.' },
  { id: 'risk', label: 'Risk safeguards', state: 'disconnected', required: true, detail: 'Persist and verify limits before execution can unlock.' },
]

export type WorkspaceReadiness = {
  account: ConnectionState
  encryptedStorage: ConnectionState
  deriv: ConnectionState
  subscription: ConnectionState
  botServer: ConnectionState
  riskPolicy: ConnectionState
  liveTradingConsent: ConnectionState
}

export const workspaceReadiness: WorkspaceReadiness = {
  account: 'not_configured',
  encryptedStorage: 'not_configured',
  deriv: 'not_configured',
  subscription: 'not_configured',
  botServer: 'not_configured',
  riskPolicy: 'disconnected',
  liveTradingConsent: 'not_configured',
}

export function workspaceProgress(state = workspaceReadiness) {
  const values = Object.values(state)
  return { completed: values.filter((value) => value === 'connected').length, total: values.length }
}

export function executionIsLocked(items: ReadinessItem[] | WorkspaceReadiness = readiness) {
  if (Array.isArray(items)) return items.some((item) => item.required && item.state !== 'connected')
  return Object.values(items).some((state) => state !== 'connected')
}
