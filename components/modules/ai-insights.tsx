'use client'

import { useRef, useState } from 'react'
import { Bot, Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PageHeader } from '@/components/modules/shared'
import { useTradingStore } from '@/lib/trading-store'

const prompts = [
  'What is the best setup right now?',
  'Summarize my open risk exposure',
  'How is the bot performing?',
  'Explain the EUR/USD signal',
]

export function AiInsightsModule() {
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

  return (
    <>
      <PageHeader
        title="AI Insights"
        subtitle="Your trading copilot for setups, risk, and market context."
        actions={<Button variant="outline" size="sm" onClick={clearAiMessages}>Clear chat</Button>}
      />
      <div className="grid grid-cols-12 gap-3">
        <Card className="col-span-12 flex h-[640px] flex-col xl:col-span-8">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Bot className="size-4 text-primary" /> Trading Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
            <ScrollArea className="min-h-0 flex-1 pr-2" viewportRef={scrollRef}>
              <div className="flex flex-col gap-3">
                {aiMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'border bg-accent/50'}`}>
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="flex flex-wrap gap-2">
              {prompts.map((prompt) => (
                <button key={prompt} onClick={() => send(prompt)} className="rounded-full border px-3 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground">
                  {prompt}
                </button>
              ))}
            </div>
            <form
              className="flex items-center gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                send(input)
              }}
            >
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && (event.nativeEvent.isComposing || event.keyCode === 229)) event.preventDefault()
                }}
                placeholder="Ask about markets, setups, or risk..."
                aria-label="Message"
              />
              <Button type="submit" size="icon" aria-label="Send message">
                <Send />
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="col-span-12 flex flex-col gap-3 xl:col-span-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Sparkles className="size-4 text-primary" /> Market Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              {[
                ['Bias', 'Risk-on', 'text-positive'],
                ['Volatility', 'Elevated', 'text-foreground'],
                ['Liquidity', 'Deep — London open', 'text-foreground'],
                ['USD Strength', 'Softening', 'text-destructive'],
              ].map(([label, value, tone]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className={tone}>{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Top Opportunities</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {signals.slice(0, 4).map((s) => (
                <div key={s.id}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-mono">{s.symbol} {s.direction}</span>
                    <span className="font-mono text-primary">{s.confidence}%</span>
                  </div>
                  <Progress value={s.confidence} />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Assistant Memory</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-xs text-muted-foreground">
              <p className="rounded-lg border p-2">Prefers 1% risk per trade with a 2R minimum.</p>
              <p className="rounded-lg border p-2">Focus pairs: EUR/USD, GBP/USD, XAU/USD.</p>
              <p className="rounded-lg border p-2">Avoids trading during red-folder news.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
