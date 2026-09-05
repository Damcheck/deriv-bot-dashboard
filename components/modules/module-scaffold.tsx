'use client'

import { useMemo, useState } from 'react'
import { Download, Play, Search, Settings2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { PageHeader, Sparkline, StatCard } from '@/components/modules/shared'

export type ModuleConfig = {
  title: string
  subtitle: string
  primary: string
  stats: [string, string, string][]
  sections: {
    title: string
    rows: { name: string; detail: string; value?: string; status?: string; progress?: number }[]
  }[]
}

export function ModuleScaffold({ config }: { config: ModuleConfig }) {
  const [query, setQuery] = useState('')
  const [running, setRunning] = useState(false)
  const [enabled, setEnabled] = useState<Record<string, boolean>>({})
  const [period, setPeriod] = useState('30D')

  const filtered = useMemo(
    () =>
      config.sections.map((section) => ({
        ...section,
        rows: section.rows.filter((row) => `${row.name} ${row.detail}`.toLowerCase().includes(query.toLowerCase())),
      })),
    [config, query],
  )

  const execute = () => {
    setRunning(true)
    toast.info(`${config.primary} started.`)
    window.setTimeout(() => {
      setRunning(false)
      toast.success(`${config.primary} completed successfully (demo).`)
    }, 900)
  }

  return (
    <>
      <PageHeader
        title={config.title}
        subtitle={config.subtitle}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.success(`${config.title} data exported.`)}>
              <Download data-icon="inline-start" /> Export
            </Button>
            <Button size="sm" onClick={execute} disabled={running}>
              <Play data-icon="inline-start" /> {running ? 'Running...' : config.primary}
            </Button>
          </>
        }
      />
      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {config.stats.map(([label, value, hint], index) => (
          <StatCard key={label} label={label} value={value} hint={hint} tone={index === 0 ? 'positive' : 'default'} />
        ))}
      </div>
      <Card className="mb-4">
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${config.title.toLowerCase()}`} className="pl-9" />
          </div>
          <div className="flex overflow-hidden rounded-lg border">
            {['7D', '30D', '90D', '1Y'].map((item) => (
              <button key={item} onClick={() => setPeriod(item)} className={`px-3 py-2 text-xs ${period === item ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'}`}>{item}</button>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-3 xl:grid-cols-2">
        {filtered.map((section, sectionIndex) => (
          <Card key={section.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">{section.title}</CardTitle>
              <Sparkline points={[2, 5, 3, 7, 6, 9, 8, 12, 10, 14].map((v) => v + sectionIndex)} />
            </CardHeader>
            <CardContent className="flex flex-col gap-1 px-2 pb-3">
              {section.rows.map((row) => {
                const key = `${section.title}-${row.name}`
                return (
                  <div key={key} className="flex items-center justify-between gap-3 rounded-lg px-3 py-3 hover:bg-accent">
                    <button onClick={() => toast.info(`${row.name}: ${row.detail}`)} className="min-w-0 flex-1 text-left">
                      <span className="block truncate text-sm font-medium">{row.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">{row.detail}</span>
                      {row.progress !== undefined && <Progress value={row.progress} className="mt-2" />}
                    </button>
                    <span className="flex shrink-0 items-center gap-3">
                      {row.status && <span className="rounded-md bg-primary/15 px-2 py-1 text-xs text-primary">{row.status}</span>}
                      {row.value && <span className="font-mono text-sm">{row.value}</span>}
                      <Switch checked={enabled[key] ?? false} onCheckedChange={(checked) => { setEnabled((current) => ({ ...current, [key]: checked })); toast.success(`${row.name} ${checked ? 'enabled' : 'disabled'}.`) }} aria-label={`Toggle ${row.name}`} />
                    </span>
                  </div>
                )
              })}
              {section.rows.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No matching items.</p>}
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-3">
        <CardContent className="flex items-center gap-3 p-4 text-sm text-muted-foreground">
          <Settings2 className="size-4 text-primary" />
          All controls operate in interactive demo mode. No live trades, credentials, or external services are used.
        </CardContent>
      </Card>
    </>
  )
}
