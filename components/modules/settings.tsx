'use client'

import { useState } from 'react'
import { Bell, KeyRound, Save, ShieldCheck, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/modules/shared'
import { useTradingStore } from '@/lib/trading-store'

const notificationRows = [
  ['Trade executions', 'Notify when orders are opened or closed'],
  ['New signals', 'Notify when a high-confidence signal appears'],
  ['Risk warnings', 'Notify when exposure approaches a limit'],
  ['Daily report', 'Send the daily performance summary'],
] as const

export function SettingsModule() {
  const { riskConfig, updateRiskConfig, isSimulationMode, toggleSimulationMode, resetTradingData } = useTradingStore()
  const [name, setName] = useState('Levox Trader')
  const [email, setEmail] = useState('levox@quantstoch.demo')
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    Object.fromEntries(notificationRows.map(([label]) => [label, true])),
  )

  const save = () => toast.success('Settings saved successfully.')

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Manage your profile, preferences, notifications, and account security."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetTradingData}>Reset All Data</Button>
            <Button size="sm" onClick={save}><Save data-icon="inline-start" /> Save changes</Button>
          </div>
        }
      />
      <Tabs defaultValue="profile" className="gap-4">
        <TabsList>
          <TabsTrigger value="profile"><UserRound /> Profile</TabsTrigger>
          <TabsTrigger value="trading"><ShieldCheck /> Trading</TabsTrigger>
          <TabsTrigger value="notifications"><Bell /> Notifications</TabsTrigger>
          <TabsTrigger value="security"><KeyRound /> Security</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader><CardTitle>Profile details</CardTitle><CardDescription>Information displayed across your workspace.</CardDescription></CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <label className="flex flex-col gap-2"><Label htmlFor="display-name">Display name</Label><Input id="display-name" value={name} onChange={(event) => setName(event.target.value)} /></label>
              <label className="flex flex-col gap-2"><Label htmlFor="email">Email address</Label><Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
              <label className="flex flex-col gap-2"><Label htmlFor="timezone">Timezone</Label><Select defaultValue="utc"><SelectTrigger id="timezone"><SelectValue /></SelectTrigger><SelectContent><SelectGroup><SelectItem value="utc">UTC</SelectItem><SelectItem value="london">Europe / London</SelectItem><SelectItem value="new-york">America / New York</SelectItem><SelectItem value="tokyo">Asia / Tokyo</SelectItem></SelectGroup></SelectContent></Select></label>
              <label className="flex flex-col gap-2"><Label htmlFor="currency">Account currency</Label><Select defaultValue="usd"><SelectTrigger id="currency"><SelectValue /></SelectTrigger><SelectContent><SelectGroup><SelectItem value="usd">USD — US Dollar</SelectItem><SelectItem value="eur">EUR — Euro</SelectItem><SelectItem value="gbp">GBP — Pound Sterling</SelectItem></SelectGroup></SelectContent></Select></label>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trading">
          <Card><CardHeader><CardTitle>Trading defaults & Safeguards</CardTitle><CardDescription>Live parameters applied to the execution engine.</CardDescription></CardHeader><CardContent className="grid gap-5 md:grid-cols-2">
            <label className="flex flex-col gap-2"><Label htmlFor="risk">Risk per trade (%)</Label><Input id="risk" type="number" value={riskConfig.riskPerTradePercent} onChange={(e) => updateRiskConfig({ riskPerTradePercent: Number(e.target.value) })} min={0.1} max={5} step={0.1} /></label>
            <label className="flex flex-col gap-2"><Label htmlFor="loss-limit">Daily loss limit (%)</Label><Input id="loss-limit" type="number" value={riskConfig.dailyLossLimitPercent} onChange={(e) => updateRiskConfig({ dailyLossLimitPercent: Number(e.target.value) })} min={1} max={10} step={0.5} /></label>
            <label className="flex flex-col gap-2"><Label htmlFor="max-pos">Max open positions</Label><Input id="max-pos" type="number" value={riskConfig.maxOpenPositions} onChange={(e) => updateRiskConfig({ maxOpenPositions: Number(e.target.value) })} min={1} max={20} /></label>
            <div className="flex items-center justify-between gap-4 rounded-lg border p-3"><div><b className="text-sm">Simulation Mode</b><p className="text-xs text-muted-foreground">Virtual portfolio execution</p></div><Switch checked={isSimulationMode} onCheckedChange={toggleSimulationMode} /></div>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card><CardHeader><CardTitle>Notification preferences</CardTitle><CardDescription>Choose what reaches you inside the dashboard.</CardDescription></CardHeader><CardContent className="flex flex-col gap-1">{notificationRows.map(([label, description]) => <div key={label} className="flex items-center justify-between gap-4 rounded-lg px-3 py-4 hover:bg-accent"><span><span className="block text-sm font-medium">{label}</span><span className="block text-xs text-muted-foreground">{description}</span></span><Switch checked={notifications[label]} onCheckedChange={(checked) => setNotifications((current) => ({ ...current, [label]: checked }))} aria-label={`Toggle ${label}`} /></div>)}</CardContent></Card>
        </TabsContent>
        <TabsContent value="security">
          <div className="grid gap-3 xl:grid-cols-2">
            <Card><CardHeader><CardTitle>Password</CardTitle><CardDescription>Use a unique password for this account.</CardDescription></CardHeader><CardContent className="flex flex-col gap-4"><label className="flex flex-col gap-2"><Label htmlFor="current-password">Current password</Label><Input id="current-password" type="password" /></label><label className="flex flex-col gap-2"><Label htmlFor="new-password">New password</Label><Input id="new-password" type="password" /></label><Button className="self-start" onClick={() => toast.success('Password updated in demo mode.')}>Update password</Button></CardContent></Card>
            <Card><CardHeader><CardTitle>Two-factor authentication</CardTitle><CardDescription>Add a verification step when signing in.</CardDescription></CardHeader><CardContent className="flex items-center justify-between gap-4"><span><span className="block text-sm font-medium">Authenticator app</span><span className="block text-xs text-muted-foreground">Not configured</span></span><Button variant="outline" onClick={() => toast.success('Authenticator setup opened (demo).')}>Set up</Button></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}
