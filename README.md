# QuantStoch Deriv Bot Platform

QuantStoch is a safety-first Next.js operations dashboard for a separately hosted Python trading bot. The dashboard configures and monitors the system; only the Python service may communicate trade actions to Deriv.

## Current architecture

- **Next.js dashboard:** responsive Overview, Deriv Account, Trading Bot, Positions & History, AI Assistant, Analytics, Subscription, and Settings screens.
- **Shared contracts:** typed readiness, Deriv account, bot health/commands/events, risk, positions, trades, audit events, AI provider, and billing models in `lib/platform-contracts.ts`.
- **Python service (future):** owns the Deriv WebSocket session, strategy runtime, risk enforcement, trade execution, reconciliation, and immutable audit generation.
- **Server persistence (future):** owns users, encrypted credentials, OAuth state, entitlements, risk policies, and audit records.

The current UI is a truthful front-end boundary. Preview records are labeled, unavailable actions are disabled, and no live connection or payment is simulated.

## Intentionally disabled

The following remain locked until authentication, a database, encrypted secret storage, credentials, and the Python service are supplied:

- Deriv OAuth completion and token persistence
- AI API-key validation and persistence
- Bot start, pause, resume, and emergency-stop commands
- Live positions, history, performance, and analytics
- Stripe Checkout, Customer Portal, webhooks, and entitlements
- Profile, password, and 2FA mutations

Never store Deriv tokens, AI keys, bot credentials, Stripe secrets, or encryption keys in browser storage or expose them through client logs.

## Required environment variables

Names only; do not commit values:

```text
APP_URL
AUTH_SECRET
DATABASE_URL
CREDENTIAL_ENCRYPTION_KEY
DERIV_APP_ID
DERIV_REDIRECT_URI
BOT_API_BASE_URL
BOT_WEBSOCKET_URL
BOT_SERVICE_TOKEN
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_STARTER
STRIPE_PRICE_PRO
STRIPE_PRICE_SCALE
```

BYOK AI credentials should be encrypted per user in the database rather than configured as global environment variables.

## Deriv application setup

1. Register a Deriv application and use the production dashboard URL plus `/api/integrations/deriv/callback` as the exact redirect URI.
2. Request the minimum scopes: account read and trade. Do not request payments.
3. Start OAuth only for an authenticated user. Generate a short-lived, single-use state value tied to that user and redirect destination.
4. In the callback, validate state before accepting credentials, encrypt tokens immediately, and never place returned tokens in reusable client state, URLs, analytics, or logs.
5. The Python service obtains the user-scoped token through an authenticated server-to-server boundary and calls Deriv WebSocket `authorize`.
6. Revoke tokens and close active bot sessions when a user disconnects the account.

## Proposed Python API contract

All endpoints use HTTPS, JSON, request IDs, short-lived service authentication, per-user/account authorization, and rate limiting. Commands require an idempotency key and expected current status.

```text
GET  /v1/health
GET  /v1/status
GET  /v1/configuration
PUT  /v1/configuration
POST /v1/commands
GET  /v1/positions
GET  /v1/trades
GET  /v1/audit-events
WS   /v1/events
```

`POST /v1/commands` accepts `start`, `pause`, `resume`, or `emergency_stop` with `accountId`, `idempotencyKey`, and `expectedStatus`. Before accepting a command, the service must verify account ownership, Deriv authorization, active entitlement, persisted risk limits, consent, and execution-lock state. The WebSocket publishes authenticated `status.changed`, `trade.opened`, `trade.updated`, `trade.closed`, `risk.blocked`, and `connection.changed` events; clients must reconcile with REST after reconnecting.

## AI provider requirements

The UI supports OpenAI, Anthropic, Google, and custom OpenAI-compatible metadata. API keys must be submitted over HTTPS to an authenticated server route, validated without logging, encrypted with an independently managed key, and decrypted only for the scoped provider request. Custom base URLs must be allowlisted or protected against SSRF. AI output is informational and may never invoke Deriv or bypass deterministic strategy and risk checks.

## Stripe production setup

1. Create server-owned products/prices for Starter, Pro, and Scale; never accept a client-supplied price or total.
2. Create Checkout Sessions server-side after validating the plan, integer quantity, aggregate limits, user, and current entitlement.
3. Use a stable idempotency key for Checkout creation and store the resulting customer/subscription IDs.
4. Create Customer Portal sessions only for the authenticated owner of the Stripe customer.
5. Verify raw webhook payload signatures and process Checkout/subscription lifecycle events idempotently.
6. Derive entitlements from persisted, verified webhook state—not redirect query strings or client state.
7. Lock execution immediately when an entitlement expires or becomes invalid, while preserving emergency-stop access.

## Future auth and database responsibilities

Recommended records include users/sessions, Deriv accounts and encrypted tokens, AI provider configurations, subscriptions/entitlements, risk policies with versions, bot commands, positions, trades, and append-only audit events. Every query must be scoped to the authenticated user. Use authenticated encryption with key versioning and rotation, redact logs, enforce unique idempotency keys, validate all inputs, and define retention/deletion procedures.

## Local development

```bash
pnpm install
pnpm dev
pnpm build
pnpm exec tsc --noEmit
```

## Production-readiness checklist

- [ ] Authentication and per-user authorization are enforced
- [ ] Database migrations, backups, and retention policies are tested
- [ ] Credentials are encrypted, redacted, and rotatable
- [ ] Deriv OAuth state, callback, authorize, reconnect, and revoke flows are tested
- [ ] Python REST/WebSocket authentication and reconciliation are tested
- [ ] Risk limits are persisted and enforced by the execution service
- [ ] Emergency stop remains available during degraded operation
- [ ] Commands and billing operations are idempotent
- [ ] Stripe signatures, prices, quantities, and entitlements are verified server-side
- [ ] Audit logs cover every command, trade, risk rejection, and connection change
- [ ] Disclosures and explicit live-trading consent are recorded
- [ ] Desktop/mobile navigation, empty states, and error states are browser-tested
- [ ] Build, type checks, dependency review, and security review pass
