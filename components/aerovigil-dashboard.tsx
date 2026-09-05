'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  Bell,
  BrainCircuit,
  ChevronRight,
  CloudOff,
  Gauge,
  HeartPulse,
  LayoutDashboard,
  LineChart,
  Play,
  Radio,
  RotateCcw,
  Settings2,
  ShieldCheck,
  Thermometer,
  Wind,
  WifiOff,
  Zap,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { SimulationProvider, useSimulation } from '@/lib/simulation-context'
import {
  formatScenario,
  riskBg,
  riskColors,
  riskDescription,
  scenarioExpectedRisk,
  scenarios,
  type Scenario,
  type SimulationSnapshot,
} from '@/lib/simulation'

const nav = [
  ['Dashboard', LayoutDashboard],
  ['Risk Analysis', Gauge],
  ['Signal Monitor', Radio],
  ['Simulation', Zap],
  ['Alerts', Bell],
  ['Device / Edge AI', BrainCircuit],
  ['System Architecture', Settings2],
] as const

type IconType = typeof Activity

function Metric({
  label,
  value,
  unit,
  icon: Icon,
  tone = 'text-slate-950',
  sub,
}: {
  label: string
  value: string | number
  unit?: string
  icon: IconType
  tone?: string
  sub?: string
}) {
  return (
    <div className="border-l border-slate-200 pl-4">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
        <Icon className="size-3.5 text-teal-600" />
        {label}
      </div>
      <div className={`mt-2 text-2xl font-semibold tracking-tight ${tone}`}>
        {value}
        {unit && <span className="ml-1 text-xs font-normal text-slate-400">{unit}</span>}
      </div>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  )
}

function SectionTitle({ eyebrow, title, detail }: { eyebrow: string; title: string; detail?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4 border-b border-slate-200 pb-3">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-700">{eyebrow}</p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-950">{title}</h2>
      </div>
      {detail && <p className="hidden text-xs text-slate-500 sm:block">{detail}</p>}
    </div>
  )
}

function PipelineStage({
  label,
  status,
  detail,
}: {
  label: string
  status: string
  detail?: string
}) {
  return (
    <div className="border-l-2 border-teal-500 bg-white px-4 py-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-700">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-950">{status}</p>
      {detail && <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>}
    </div>
  )
}

function FlowArrow() {
  return (
    <div className="flex justify-center py-2 text-teal-600">
      <ArrowDown className="size-4" />
    </div>
  )
}

function DashboardShell() {
  const { scenario, setScenario, snapshot, runSimulation, resetSimulation, isRunning } = useSimulation()
  const [page, setPage] = useState<(typeof nav)[number][0]>('Dashboard')
  const levelTone = riskColors[snapshot.riskLevel]

  return (
    <div className="min-h-screen bg-[#f8fafb] text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-slate-200 bg-[#fbfcfc] lg:flex lg:flex-col">
        <div className="border-b border-slate-200 px-5 py-5">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="AeroVigil logo" className="h-8 w-auto" />
          </div>
        </div>
        <div className="mx-4 mt-5 border-l-2 border-teal-500 bg-teal-50/60 px-3 py-2.5">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-teal-800">
            <span className="size-1.5 rounded-full bg-teal-500" /> Simulation mode
          </div>
          <p className="mt-1 text-[10px] leading-4 text-teal-900/70">
            ON-DEVICE EDGE AI · NO CLOUD INFERENCE · OFFLINE-FIRST
          </p>
        </div>
        <nav className="mt-7 flex flex-1 flex-col gap-0.5 px-3">
          {nav.map(([name, Icon]) => (
            <button
              key={name}
              onClick={() => setPage(name)}
              className={`flex items-center gap-3 border-l-2 px-3 py-2.5 text-left text-xs transition ${
                page === name
                  ? 'border-teal-600 bg-slate-100 font-semibold text-slate-950'
                  : 'border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="size-3.5" />
              {name}
              <ChevronRight className={`ml-auto size-3 ${page === name ? 'text-teal-600' : 'opacity-0'}`} />
            </button>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-4 text-[10px] leading-4 text-slate-400">
          Prototype build · v0.1
          <br />
          <span className="text-teal-700">All sensor values simulated locally</span>
        </div>
      </aside>

      <main className="lg:pl-60">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-[#fbfcfc] px-5 py-4 md:px-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-700">{page}</p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">Respiratory monitoring console</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:flex">
              <WifiOff className="size-3.5 text-teal-600" /> Offline-first
            </div>
            <select
              aria-label="Select simulation scenario"
              value={scenario}
              onChange={(e) => setScenario(e.target.value as Scenario)}
              className="border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            >
              {scenarios.map((item) => (
                <option key={item} value={item}>
                  {formatScenario(item)}
                </option>
              ))}
            </select>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] p-5 md:p-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Live simulated telemetry · Patient 001</p>
              <div className="mt-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <span className={`size-1.5 rounded-full ${isRunning ? 'animate-pulse bg-amber-500' : 'bg-teal-500'}`} />
                {isRunning ? 'Pipeline running' : 'Stream active'}
                <span className="text-slate-300">|</span>
                Run #{snapshot.runCount}
              </div>
            </div>
            <div className={`border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${riskBg[snapshot.riskLevel]} ${levelTone}`}>
              Simulation: {formatScenario(scenario)}
            </div>
          </div>

          {page === 'Dashboard' && <DashboardPage data={snapshot} levelTone={levelTone} />}
          {page === 'Risk Analysis' && <RiskAnalysisPage data={snapshot} levelTone={levelTone} />}
          {page === 'Signal Monitor' && <SignalMonitorPage data={snapshot} />}
          {page === 'Simulation' && (
            <SimulationPage
              scenario={scenario}
              onChange={setScenario}
              data={snapshot}
              onRun={runSimulation}
              onReset={resetSimulation}
              isRunning={isRunning}
              levelTone={levelTone}
            />
          )}
          {page === 'Alerts' && <AlertsPage data={snapshot} />}
          {page === 'Device / Edge AI' && <EdgeAIPage data={snapshot} levelTone={levelTone} />}
          {page === 'System Architecture' && <ArchitecturePage data={snapshot} levelTone={levelTone} />}
        </div>
      </main>
    </div>
  )
}

export default function AeroVigilDashboard() {
  return (
    <SimulationProvider>
      <DashboardShell />
    </SimulationProvider>
  )
}

function RiskHero({ data, levelTone }: { data: SimulationSnapshot; levelTone: string }) {
  return (
    <section className={`border p-5 ${riskBg[data.riskLevel]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Current risk state</p>
          <h2 className={`mt-2 text-3xl font-semibold tracking-tight ${levelTone}`}>{data.riskLevel}</h2>
          <p className="mt-1 text-sm text-slate-600">{riskDescription(data.riskLevel)}</p>
        </div>
        <ShieldCheck className={`size-6 ${levelTone}`} />
      </div>
      <div className="mt-6">
        <div className="mb-2 flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
          <span>Risk score</span>
          <span>{data.riskScore} / 100</span>
        </div>
        <div className="h-1.5 bg-white/70">
          <div
            className={`h-full ${data.riskLevel === 'HIGH' ? 'bg-rose-500' : data.riskLevel === 'WATCH' ? 'bg-amber-500' : 'bg-emerald-500'}`}
            style={{ width: `${data.riskScore}%` }}
          />
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-500">{data.pipeline.stage3.alert}</p>
    </section>
  )
}

function TrendChart({ data }: { data: SimulationSnapshot }) {
  const chartData = useMemo(
    () => data.trend.map((risk, i) => ({ day: `Day ${i + 1}`, risk })),
    [data.trend],
  )
  return (
    <section className="border-t border-slate-200 pt-5">
      <SectionTitle eyebrow="Temporal output" title="7-day risk trend" detail="Stage 3 · daily aggregation" />
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0d9488" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#0d9488" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
            <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
            <Tooltip />
            <Area type="monotone" dataKey="risk" stroke="#0d9488" fill="url(#riskFill)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

function SignalChart({ data, title }: { data: SimulationSnapshot; title?: string }) {
  return (
    <div className="h-60 border-t border-slate-200 pt-4">
      {title && <p className="mb-3 text-xs font-semibold text-slate-700">{title}</p>}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data.signalSeries}>
          <CartesianGrid vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
          <YAxis yAxisId="left" domain={[70, 105]} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
          <YAxis yAxisId="right" orientation="right" domain={[0, 100]} hide />
          <Tooltip />
          <Line yAxisId="left" type="monotone" dataKey="spo2" name="SpO2" stroke="#0d9488" strokeWidth={2} dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="cough" name="Cough" stroke="#d97706" strokeWidth={2} dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="wheeze" name="Wheeze" stroke="#e11d48" strokeWidth={2} dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="pm25" name="PM2.5" stroke="#64748b" strokeWidth={2} dot={false} />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}

function DashboardPage({ data, levelTone }: { data: SimulationSnapshot; levelTone: string }) {
  return (
    <>
      <section className="grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">
        <RiskHero data={data} levelTone={levelTone} />
        <div>
          <SectionTitle eyebrow="Signal change" title="Why the risk changed" detail="Multimodal comparison to baseline" />
          <p className="max-w-xl text-sm leading-6 text-slate-600">{data.riskAnalysis}</p>
          <div className="mt-5 grid grid-cols-2 gap-y-4 sm:grid-cols-4">
            <Metric label="SpO2" value={data.spo2} unit="%" icon={HeartPulse} />
            <Metric label="Heart rate" value={data.hr} unit="BPM" icon={Activity} />
            <Metric label="HRV" value={data.hrv} unit="ms" icon={Gauge} />
            <Metric label="Motion" value={data.motion} unit="%" icon={Activity} />
          </div>
        </div>
      </section>

      <section className="mt-10">
        <SectionTitle eyebrow="Multimodal signals" title="Current sensor profile" detail="Simulated local stream · last 16 samples" />
        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <SignalChart data={data} />
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 content-start">
            <Metric label="Cough / wheeze" value={`${data.cough}%`} icon={Wind} sub={`Wheeze ${data.wheeze}% · Crackle ${data.crackle}%`} />
            <Metric label="Air quality" value={data.pm25} unit="µg/m³" icon={CloudOff} sub={`${data.temperature}°C · ${data.humidity}% humidity`} />
            <Metric label="HRV" value={data.hrv} unit="ms" icon={HeartPulse} />
            <Metric label="Risk score" value={data.riskScore} unit="/ 100" icon={Gauge} tone={levelTone} />
          </div>
        </div>
      </section>

      <div className="mt-10">
        <TrendChart data={data} />
      </div>
    </>
  )
}

function RiskAnalysisPage({ data, levelTone }: { data: SimulationSnapshot; levelTone: string }) {
  const { stage1, stage2, stage3 } = data.pipeline
  return (
    <>
      <section className="border-b border-slate-200 pb-7">
        <SectionTitle eyebrow="Analytical view" title="Cross-signal risk analysis" detail={`Current output · ${data.riskLevel}`} />
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          The simulated engine weights oxygenation, cardiac variability, acoustic respiratory events, environmental exposure, and activity into one transparent risk output. Not clinically validated.
        </p>
      </section>

      <section className="mt-8 grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">
        <RiskHero data={data} levelTone={levelTone} />
        <div>
          <SectionTitle eyebrow="Risk drivers" title="Why the score changed" detail="From three-stage pipeline" />
          <ul className="space-y-2">
            {stage3.riskFactors.map((factor) => (
              <li key={factor} className="flex items-start gap-2 text-sm text-slate-700">
                <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-teal-600" />
                {factor}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <PipelineStage
          label="Stage 1 · Respiratory"
          status={stage1.status}
          detail={`Severity: ${stage1.eventSeverity} · Trend: ${stage1.acousticTrend}`}
        />
        <PipelineStage
          label="Stage 2 · Fusion"
          status={stage2.status}
          detail={`Fused score ${stage2.fusedScore}/100 · Resp ${stage2.respiratoryScore} · Phys ${stage2.physiologyScore}`}
        />
        <PipelineStage
          label="Stage 3 · Temporal"
          status={stage3.status}
          detail={`Slope ${stage3.slope} · Trend: ${stage3.trend}`}
        />
      </section>
    </>
  )
}

function SignalMonitorPage({ data }: { data: SimulationSnapshot }) {
  const dailyChart = useMemo(
    () =>
      data.dailyAggregates.map((d) => ({
        day: d.label,
        spo2: d.physiology.spo2,
        hr: d.physiology.hr,
        hrv: d.physiology.hrv,
        cough: d.acoustic.cough,
        wheeze: d.acoustic.wheeze,
        pm25: d.environment.pm25,
        motion: d.motion.activity,
      })),
    [data.dailyAggregates],
  )

  return (
    <>
      <section className="border-b border-slate-200 pb-7">
        <SectionTitle eyebrow="Technical view" title="Sensor telemetry" detail="Simulated multimodal time-series" />
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          Inspect the synchronized local stream across respiratory acoustics, cardiac physiology, environmental exposure, and motion channels over 7 simulated days.
        </p>
      </section>

      <section className="mt-8">
        <SectionTitle eyebrow="Intra-day stream" title="Last 16 samples" detail="Correlated signal generation" />
        <SignalChart data={data} />
      </section>

      <section className="mt-10">
        <SectionTitle eyebrow="Daily aggregates" title="7-day sensor progression" detail="Scenario-correlated trends" />
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={dailyChart}>
              <CartesianGrid vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis yAxisId="left" domain={[80, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} hide />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="spo2" name="SpO2" stroke="#0d9488" strokeWidth={2} dot />
              <Line yAxisId="left" type="monotone" dataKey="hrv" name="HRV" stroke="#6366f1" strokeWidth={2} dot />
              <Line yAxisId="right" type="monotone" dataKey="cough" name="Cough" stroke="#d97706" strokeWidth={2} dot />
              <Line yAxisId="right" type="monotone" dataKey="pm25" name="PM2.5" stroke="#64748b" strokeWidth={2} dot />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
        <Metric label="SpO2" value={data.spo2} unit="%" icon={HeartPulse} />
        <Metric label="Heart rate" value={data.hr} unit="BPM" icon={Activity} />
        <Metric label="HRV" value={data.hrv} unit="ms" icon={Gauge} />
        <Metric label="Motion" value={data.motion} unit="%" icon={Activity} />
        <Metric label="Cough" value={data.cough} unit="%" icon={Wind} />
        <Metric label="Wheeze" value={data.wheeze} unit="%" icon={Wind} />
        <Metric label="PM2.5" value={data.pm25} unit="µg/m³" icon={CloudOff} />
        <Metric label="Humidity" value={data.humidity} unit="%" icon={Thermometer} />
      </section>
    </>
  )
}

// --- AEROVIGIL SIMULATION LAB ---

type AcousticEventType = 'COUGH' | 'WHEEZE' | 'CRACKLE' | 'BACKGROUND'

interface LabSimulationState {
  spo2: number
  hr: number
  hrv: number
  pm25: number
  temperature: number
  humidity: number
  motion: number
}

function calculateDeterministicRisk(state: LabSimulationState, acousticEvent: AcousticEventType, acousticConf: number) {
  let coughActivity = 5
  let wheezeActivity = 3
  let crackleActivity = 2
  let stage1Text = 'Nominal baseline acoustic activity'

  if (acousticEvent === 'COUGH') {
    coughActivity = Math.round(55 + (acousticConf / 100) * 40)
    wheezeActivity = 12
    crackleActivity = 5
    stage1Text = `Cough activity detected — ${acousticConf}%`
  } else if (acousticEvent === 'WHEEZE') {
    wheezeActivity = Math.round(50 + (acousticConf / 100) * 45)
    coughActivity = 25
    crackleActivity = 8
    stage1Text = `Wheeze detected — ${acousticConf}%`
  } else if (acousticEvent === 'CRACKLE') {
    crackleActivity = Math.round(45 + (acousticConf / 100) * 45)
    coughActivity = 30
    wheezeActivity = 20
    stage1Text = `Crackles detected — ${acousticConf}%`
  } else {
    coughActivity = 8
    wheezeActivity = 4
    crackleActivity = 2
    stage1Text = `Background acoustic profile nominal (${acousticConf}%)`
  }

  // SpO2 score
  let spo2Score = 0
  if (state.spo2 < 90) {
    spo2Score = 90 + (90 - state.spo2) * 2
  } else if (state.spo2 < 94) {
    spo2Score = 50 + (94 - state.spo2) * 10
  } else if (state.spo2 < 97) {
    spo2Score = 15 + (97 - state.spo2) * 11
  } else {
    spo2Score = 5
  }

  // HR score
  let hrScore = 0
  if (state.hr > 100) {
    hrScore = Math.min(100, 45 + (state.hr - 100) * 1.3)
  } else if (state.hr < 50) {
    hrScore = Math.min(100, 40 + (50 - state.hr) * 3)
  } else {
    hrScore = Math.abs(state.hr - 72) * 0.5
  }

  // HRV score
  let hrvScore = 0
  if (state.hrv < 25) {
    hrvScore = Math.min(100, 65 + (25 - state.hrv) * 2.3)
  } else if (state.hrv < 40) {
    hrvScore = 30 + (40 - state.hrv) * 2.3
  } else {
    hrvScore = Math.max(0, 20 - (state.hrv - 40) * 0.3)
  }

  // PM2.5 score
  let pmScore = 0
  if (state.pm25 > 100) {
    pmScore = Math.min(100, 75 + (state.pm25 - 100) * 0.5)
  } else if (state.pm25 > 45) {
    pmScore = 35 + (state.pm25 - 45) * 0.72
  } else {
    pmScore = Math.max(0, state.pm25 * 0.7)
  }

  const motionArtifact = Math.round(state.motion > 65 ? (state.motion - 65) * 2.8 : 0)
  const acousticScore = coughActivity * 0.45 + wheezeActivity * 0.45 + crackleActivity * 0.2

  let elevatedCount = 0
  if (acousticScore > 35) elevatedCount++
  if (spo2Score > 40) elevatedCount++
  if (hrvScore > 40) elevatedCount++
  if (pmScore > 40) elevatedCount++
  if (hrScore > 40) elevatedCount++

  const weightedPhysio = spo2Score * 0.55 + hrvScore * 0.30 + hrScore * 0.15
  const fusedScore = Math.min(
    100,
    Math.round(acousticScore * 0.38 + weightedPhysio * 0.42 + pmScore * 0.20)
  )

  let stage2Text = ''
  if (elevatedCount >= 3) {
    stage2Text = `${elevatedCount} multimodal signals elevated`
  } else if (elevatedCount >= 1) {
    stage2Text = `${elevatedCount} multimodal signal group elevated`
  } else {
    stage2Text = 'All multimodal signals nominal'
  }

  let temporalFactor = 0
  let stage3Text = ''
  if (fusedScore >= 68 || (spo2Score > 65 && acousticScore > 50)) {
    temporalFactor = 1.15
    stage3Text = 'Worsening temporal pattern'
  } else if (fusedScore >= 38 || elevatedCount >= 2) {
    temporalFactor = 1.05
    stage3Text = 'Early divergence pattern'
  } else {
    temporalFactor = 0.95
    stage3Text = 'Stable baseline trajectory'
  }

  const finalScore = Math.min(100, Math.max(0, Math.round(fusedScore * temporalFactor)))
  let finalLevel: 'LOW' | 'WATCH' | 'HIGH' = 'LOW'
  if (finalScore >= 70) {
    finalLevel = 'HIGH'
  } else if (finalScore >= 40) {
    finalLevel = 'WATCH'
  } else {
    finalLevel = 'LOW'
  }

  return {
    stage1: {
      status: stage1Text,
      cough: coughActivity,
      wheeze: wheezeActivity,
      crackle: crackleActivity,
      acousticScore: Math.round(acousticScore),
    },
    stage2: {
      status: stage2Text,
      fusedScore,
      elevatedCount,
      motionArtifact,
    },
    stage3: {
      status: stage3Text,
      trend: finalLevel === 'HIGH' ? 'Worsening' : finalLevel === 'WATCH' ? 'Diverging' : 'Stable',
    },
    riskScore: finalScore,
    riskLevel: finalLevel,
  }
}

function LiveAudioWaveform({
  isMicActive,
  onAudioClassified,
}: {
  isMicActive: boolean
  onAudioClassified?: (event: AcousticEventType, confidence: number, amplitude: number) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animFrameRef = useRef<number | null>(null)

  useEffect(() => {
    let active = true

    if (isMicActive) {
      const initMic = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
          if (!active) {
            stream.getTracks().forEach((track) => track.stop())
            return
          }
          streamRef.current = stream
          const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
          const ctx = new AudioContextClass()
          audioContextRef.current = ctx
          const source = ctx.createMediaStreamSource(stream)
          const analyser = ctx.createAnalyser()
          analyser.fftSize = 256
          analyser.smoothingTimeConstant = 0.75
          source.connect(analyser)
          analyserRef.current = analyser
        } catch (err) {
          console.warn('Microphone permission unavailable, using simulated input.', err)
        }
      }
      initMic()
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
      analyserRef.current = null
    }

    return () => {
      active = false
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
    }
  }, [isMicActive])

  useEffect(() => {
    let frame = 0

    const render = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const width = canvas.width
      const height = canvas.height
      ctx.clearRect(0, 0, width, height)

      // Subdued grid
      ctx.strokeStyle = '#e2e8f0'
      ctx.lineWidth = 1
      for (let x = 0; x < width; x += 32) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += 24) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Baseline center
      ctx.strokeStyle = '#cbd5e1'
      ctx.beginPath()
      ctx.moveTo(0, height / 2)
      ctx.lineTo(width, height / 2)
      ctx.stroke()

      const analyser = analyserRef.current

      if (analyser && isMicActive) {
        const bufferLength = analyser.fftSize
        const dataArray = new Uint8Array(bufferLength)
        analyser.getByteTimeDomainData(dataArray)

        let sumAmp = 0
        for (let i = 0; i < bufferLength; i++) {
          sumAmp += Math.abs(dataArray[i] - 128)
        }
        const avgAmp = sumAmp / bufferLength
        const normalizedAmp = Math.min(100, Math.round((avgAmp / 40) * 100))

        if (onAudioClassified) {
          if (normalizedAmp > 55) {
            onAudioClassified('COUGH', Math.min(96, 75 + Math.round(normalizedAmp * 0.2)), normalizedAmp)
          } else if (normalizedAmp > 30) {
            onAudioClassified('WHEEZE', Math.min(88, 60 + Math.round(normalizedAmp * 0.3)), normalizedAmp)
          } else if (normalizedAmp > 14) {
            onAudioClassified('CRACKLE', Math.min(78, 50 + Math.round(normalizedAmp * 0.3)), normalizedAmp)
          } else {
            onAudioClassified('BACKGROUND', Math.max(90, 98 - normalizedAmp), normalizedAmp)
          }
        }

        ctx.lineWidth = 1.5
        ctx.strokeStyle = '#0d9488'
        ctx.beginPath()
        const sliceWidth = width / bufferLength
        let x = 0
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0
          const y = (v * height) / 2
          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
          x += sliceWidth
        }
        ctx.lineTo(width, height / 2)
        ctx.stroke()
      } else {
        frame++
        ctx.lineWidth = 1.5
        ctx.strokeStyle = '#0d9488'
        ctx.beginPath()

        const points = 100
        const sliceWidth = width / points
        let x = 0

        for (let i = 0; i < points; i++) {
          const baseSin = Math.sin(i * 0.2 + frame * 0.06) * 10
          const harmonic = Math.sin(i * 0.45 - frame * 0.04) * 4
          const noise = (Math.random() - 0.5) * 2
          const y = height / 2 + baseSin + harmonic + noise

          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
          x += sliceWidth
        }
        ctx.stroke()
      }

      animFrameRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [isMicActive, onAudioClassified])

  return (
    <div className="relative border border-slate-200 bg-white">
      <canvas ref={canvasRef} width={640} height={96} className="h-24 w-full block" />
      <div className="pointer-events-none absolute right-3 top-2 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
        <span className={`size-1.5 rounded-full ${isMicActive ? 'bg-teal-500' : 'bg-slate-400'}`} />
        {isMicActive ? 'Live Audio Stream' : 'Simulated Baseline'}
      </div>
    </div>
  )
}

function SimulationPage({
  scenario,
  onChange,
  data,
  onRun,
  onReset,
  isRunning,
  levelTone,
}: {
  scenario: Scenario
  onChange: (s: Scenario) => void
  data: SimulationSnapshot
  onRun: () => void
  onReset: () => void
  isRunning: boolean
  levelTone: string
}) {
  const [isPatchOpen, setIsPatchOpen] = useState(false)
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(false)
  const [micStatusMsg, setMicStatusMsg] = useState<string>('Standby')

  const [acousticEvent, setAcousticEvent] = useState<AcousticEventType>('BACKGROUND')
  const [acousticConfidence, setAcousticConfidence] = useState<number>(95)

  // Physiological and Environmental values
  const [spo2, setSpo2] = useState<number>(98)
  const [hr, setHr] = useState<number>(72)
  const [hrv, setHrv] = useState<number>(55)
  const [pm25, setPm25] = useState<number>(16)
  const [temperature, setTemperature] = useState<number>(36.6)
  const [humidity, setHumidity] = useState<number>(45)
  const [motion, setMotion] = useState<number>(12)

  const handleApplyPreset = (preset: Scenario) => {
    onChange(preset)
    if (preset === 'NORMAL') {
      setSpo2(98)
      setHr(72)
      setHrv(58)
      setPm25(16)
      setTemperature(36.6)
      setHumidity(45)
      setMotion(14)
      setAcousticEvent('BACKGROUND')
      setAcousticConfidence(95)
    } else if (preset === 'EARLY DETERIORATION') {
      setSpo2(93)
      setHr(88)
      setHrv(34)
      setPm25(52)
      setTemperature(37.4)
      setHumidity(62)
      setMotion(22)
      setAcousticEvent('WHEEZE')
      setAcousticConfidence(82)
    } else if (preset === 'HIGH RISK') {
      setSpo2(87)
      setHr(118)
      setHrv(16)
      setPm25(115)
      setTemperature(38.6)
      setHumidity(78)
      setMotion(35)
      setAcousticEvent('COUGH')
      setAcousticConfidence(92)
    }
  }

  const handleReset = () => {
    onReset()
    setSpo2(98)
    setHr(72)
    setHrv(55)
    setPm25(16)
    setTemperature(36.6)
    setHumidity(45)
    setMotion(12)
    setAcousticEvent('BACKGROUND')
    setAcousticConfidence(95)
    setIsMicrophoneEnabled(false)
    setMicStatusMsg('Standby')
  }

  const handleAudioClassified = React.useCallback((event: AcousticEventType, confidence: number) => {
    setAcousticEvent(event)
    setAcousticConfidence(confidence)
  }, [])

  const toggleMicrophone = async () => {
    if (isMicrophoneEnabled) {
      setIsMicrophoneEnabled(false)
      setMicStatusMsg('Standby')
      setAcousticEvent('BACKGROUND')
      setAcousticConfidence(95)
    } else {
      try {
        setMicStatusMsg('Requesting permission...')
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        setIsMicrophoneEnabled(true)
        setMicStatusMsg('Local Processing Active')
        stream.getTracks().forEach((t) => t.stop())
      } catch (err) {
        console.warn('Microphone permission denied:', err)
        setIsMicrophoneEnabled(false)
        setMicStatusMsg('Permission denied · Fallback active')
      }
    }
  }

  const liveRiskResult = useMemo(() => {
    return calculateDeterministicRisk(
      {
        spo2,
        hr,
        hrv,
        pm25,
        temperature,
        humidity,
        motion,
      },
      acousticEvent,
      acousticConfidence
    )
  }, [spo2, hr, hrv, pm25, temperature, humidity, motion, acousticEvent, acousticConfidence])

  const currentLevelTone = riskColors[liveRiskResult.riskLevel]

  return (
    <section>
      {/* Title section matching SectionTitle design */}
      <div className="border-b border-slate-200 pb-7">
        <SectionTitle
          eyebrow="Demonstration mode"
          title="AeroVigil Simulation Lab"
          detail="Interactive Edge AI sandbox · Live signals & deterministic inference"
        />
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          Experiment directly with respiratory acoustic input and multimodal sensor sliders. Click the AeroVigil chest patch to inspect hardware modules and observe the 3-stage Edge AI pipeline respond deterministically.
        </p>
      </div>

      {/* Preset Scenario Selector Bar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Preset Scenarios:</span>
          {scenarios.map((item) => (
            <button
              key={item}
              onClick={() => handleApplyPreset(item)}
              className={`border px-4 py-2.5 text-xs font-semibold transition ${
                scenario === item
                  ? 'border-teal-600 bg-teal-50/60 text-slate-950'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-teal-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`size-2 rounded-full ${
                    item === 'NORMAL' ? 'bg-emerald-500' : item === 'EARLY DETERIORATION' ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                />
                {formatScenario(item)}
                <span className="text-[10px] font-normal text-slate-400">→ {scenarioExpectedRisk(item)}</span>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-teal-400"
        >
          <RotateCcw className="size-3.5" />
          Reset Defaults
        </button>
      </div>

      {/* Human Illustration & Patch Section */}
      <div className="mt-10 border border-slate-200 bg-white p-6 md:p-8">
        <div className="grid items-center gap-8 md:grid-cols-[280px_1fr] lg:grid-cols-[340px_1fr]">
          {/* Human Hotspot */}
          <div className="relative flex justify-center border-b border-slate-200 pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-8">
            <div className="relative inline-block select-none">
              <img
                src="/human.png"
                alt="Human illustration with AeroVigil chest patch"
                className="max-h-[300px] w-auto object-contain"
              />
              {/* Clickable Chest Hotspot */}
              <button
                onClick={() => setIsPatchOpen(true)}
                className="group absolute left-[47%] top-[34%] -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                aria-label="Click AeroVigil Patch to inspect hardware module"
              >
                <span className="absolute -inset-2.5 animate-ping rounded-full bg-teal-400/40 opacity-75 duration-1000" />
                <span className="absolute -inset-1.5 rounded-full bg-teal-500/20 group-hover:bg-teal-500/40" />
                <div className="relative flex size-6 items-center justify-center border border-white bg-teal-600 shadow-sm transition group-hover:scale-110">
                  <Zap className="size-3 text-white" />
                </div>
                <div className="absolute left-7 top-1/2 -translate-y-1/2 whitespace-nowrap border border-slate-200 bg-white px-2 py-0.5 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800">AeroVigil Patch</span>
                  <span className="block text-[8px] text-teal-700">Click to inspect</span>
                </div>
              </button>
            </div>
          </div>

          {/* Key Metrics and Overview */}
          <div className="space-y-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-700">Wearable Edge Unit</p>
              <h3 className="mt-1 text-base font-semibold text-slate-950">Chest Module Telemetry & Multi-sensor Stream</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Acoustic contact microphones and multimodal photoplethysmography process continuous respiratory bio-signals locally without internet dependency.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
              <Metric label="Current Risk" value={liveRiskResult.riskLevel} icon={ShieldCheck} tone={currentLevelTone} />
              <Metric label="Risk Score" value={liveRiskResult.riskScore} unit="/ 100" icon={Gauge} />
              <Metric label="Acoustic Event" value={acousticEvent} icon={Wind} sub={`${acousticConfidence}% confidence`} />
              <Metric label="Temporal Trend" value={liveRiskResult.stage3.trend} icon={LineChart} />
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsPatchOpen(true)}
                className="inline-flex items-center gap-2 border border-slate-900 bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-teal-700"
              >
                <Zap className="size-3.5" />
                Inspect Hardware Module Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace: 2-Column Grid */}
      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        {/* Left Column: Live Acoustic & Sensor Sliders (7 cols) */}
        <div className="space-y-8 lg:col-span-7">
          {/* SECTION 1: LIVE ACOUSTIC INPUT */}
          <div className="border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-700">Acoustic Input</p>
                <h3 className="mt-0.5 text-sm font-semibold text-slate-950">Live Microphone & Breath Sound Processing</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9px] font-bold uppercase text-slate-600">
                  Local Audio Processing
                </span>
                <span className="border border-teal-200 bg-teal-50 px-2 py-0.5 text-[9px] font-bold uppercase text-teal-800">
                  Simulation / Prototype
                </span>
              </div>
            </div>

            {/* Mic Button & Controls */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleMicrophone}
                  className={`inline-flex items-center gap-2 border px-3 py-2 text-xs font-semibold transition ${
                    isMicrophoneEnabled
                      ? 'border-rose-600 bg-rose-600 text-white hover:bg-rose-700'
                      : 'border-slate-900 bg-slate-950 text-white hover:bg-teal-700'
                  }`}
                >
                  <Radio className="size-3.5" />
                  {isMicrophoneEnabled ? 'Disable Microphone' : 'Enable Microphone'}
                </button>
                <span className="text-xs text-slate-600">Status: {micStatusMsg}</span>
              </div>

              {/* Quick event injection */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">Inject:</span>
                {(['BACKGROUND', 'WHEEZE', 'COUGH', 'CRACKLE'] as const).map((ev) => (
                  <button
                    key={ev}
                    onClick={() => {
                      setAcousticEvent(ev)
                      setAcousticConfidence(ev === 'BACKGROUND' ? 95 : 84)
                    }}
                    className={`border px-2 py-1 text-[10px] font-bold uppercase transition ${
                      acousticEvent === ev
                        ? 'border-teal-600 bg-teal-50 text-teal-900'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {ev}
                  </button>
                ))}
              </div>
            </div>

            {/* Waveform */}
            <div className="mt-4">
              <LiveAudioWaveform isMicActive={isMicrophoneEnabled} onAudioClassified={handleAudioClassified} />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 border-t border-slate-200 pt-3">
              <Metric label="Event" value={acousticEvent} icon={Wind} />
              <Metric label="Confidence" value={acousticConfidence} unit="%" icon={Gauge} />
              <Metric label="Signal Status" value={isMicrophoneEnabled ? 'Live Mic' : 'Simulated'} icon={Radio} />
            </div>

            <p className="mt-3 text-[10px] text-slate-400">
              * Prototype acoustic event classification running in-browser via Web Audio API. Audio is processed strictly in local memory.
            </p>
          </div>

          {/* SECTION 2: SENSOR SIMULATION SLIDERS */}
          <div className="border border-slate-200 bg-white p-5">
            <div className="border-b border-slate-200 pb-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-700">Multimodal Sliders</p>
              <h3 className="mt-0.5 text-sm font-semibold text-slate-950">Simulated Physiological & Environmental Inputs</h3>
              <p className="mt-1 text-xs text-slate-500">
                Adjust parameters to test deterministic Edge AI risk escalation in real-time.
              </p>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {/* SpO2 */}
              <div className="border border-slate-200 p-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-700">
                    <HeartPulse className="size-3.5 text-teal-600" /> SpO2
                  </span>
                  <span className="border border-slate-300 bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-900">
                    {spo2} %
                  </span>
                </div>
                <input
                  type="range"
                  min="85"
                  max="100"
                  step="1"
                  value={spo2}
                  onChange={(e) => setSpo2(Number(e.target.value))}
                  className="mt-3 w-full accent-teal-600 cursor-pointer"
                />
                <div className="mt-1 flex justify-between text-[9px] text-slate-400 font-mono">
                  <span>85 % (Critical)</span>
                  <span>100 % (Nominal)</span>
                </div>
              </div>

              {/* Heart Rate */}
              <div className="border border-slate-200 p-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-700">
                    <Activity className="size-3.5 text-rose-600" /> Heart Rate
                  </span>
                  <span className="border border-slate-300 bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-900">
                    {hr} BPM
                  </span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="140"
                  step="1"
                  value={hr}
                  onChange={(e) => setHr(Number(e.target.value))}
                  className="mt-3 w-full accent-teal-600 cursor-pointer"
                />
                <div className="mt-1 flex justify-between text-[9px] text-slate-400 font-mono">
                  <span>40 BPM</span>
                  <span>140 BPM</span>
                </div>
              </div>

              {/* HRV */}
              <div className="border border-slate-200 p-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-700">
                    <Gauge className="size-3.5 text-indigo-600" /> HRV (SDNN)
                  </span>
                  <span className="border border-slate-300 bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-900">
                    {hrv} ms
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="1"
                  value={hrv}
                  onChange={(e) => setHrv(Number(e.target.value))}
                  className="mt-3 w-full accent-teal-600 cursor-pointer"
                />
                <div className="mt-1 flex justify-between text-[9px] text-slate-400 font-mono">
                  <span>10 ms (Strain)</span>
                  <span>100 ms (Healthy)</span>
                </div>
              </div>

              {/* PM2.5 */}
              <div className="border border-slate-200 p-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-700">
                    <CloudOff className="size-3.5 text-slate-600" /> PM2.5 Exposure
                  </span>
                  <span className="border border-slate-300 bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-900">
                    {pm25} µg/m³
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="1"
                  value={pm25}
                  onChange={(e) => setPm25(Number(e.target.value))}
                  className="mt-3 w-full accent-teal-600 cursor-pointer"
                />
                <div className="mt-1 flex justify-between text-[9px] text-slate-400 font-mono">
                  <span>0 µg/m³ (Clean)</span>
                  <span>150 µg/m³ (Hazard)</span>
                </div>
              </div>

              {/* Temperature */}
              <div className="border border-slate-200 p-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-700">
                    <Thermometer className="size-3.5 text-amber-600" /> Body Temp
                  </span>
                  <span className="border border-slate-300 bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-900">
                    {temperature.toFixed(1)} °C
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="40"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="mt-3 w-full accent-teal-600 cursor-pointer"
                />
                <div className="mt-1 flex justify-between text-[9px] text-slate-400 font-mono">
                  <span>15 °C</span>
                  <span>40 °C</span>
                </div>
              </div>

              {/* Humidity & Motion */}
              <div className="space-y-3">
                <div className="border border-slate-200 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase text-slate-700">Humidity</span>
                    <span className="font-mono text-xs font-bold text-slate-900">{humidity} %</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="90"
                    step="1"
                    value={humidity}
                    onChange={(e) => setHumidity(Number(e.target.value))}
                    className="mt-1.5 w-full accent-teal-600 cursor-pointer"
                  />
                </div>

                <div className="border border-slate-200 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase text-slate-700">Motion Artifact</span>
                    <span className="font-mono text-xs font-bold text-slate-900">{motion} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={motion}
                    onChange={(e) => setMotion(Number(e.target.value))}
                    className="mt-1.5 w-full accent-teal-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 3-Stage Edge AI Pipeline & Final Risk (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          <div className="border border-slate-200 bg-white p-5">
            <div className="border-b border-slate-200 pb-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-700">Inference Runtime</p>
              <h3 className="mt-0.5 text-sm font-semibold text-slate-950">Three-Stage Edge AI Pipeline</h3>
              <p className="mt-1 text-xs text-slate-500">Cascaded on-device evaluation.</p>
            </div>

            <div className="mt-4 space-y-4">
              <PipelineStage
                label="Stage 1 — Respiratory Event Detection"
                status={liveRiskResult.stage1.status}
                detail={`Cough ${liveRiskResult.stage1.cough}% · Wheeze ${liveRiskResult.stage1.wheeze}% · Crackle ${liveRiskResult.stage1.crackle}%`}
              />

              <FlowArrow />

              <PipelineStage
                label="Stage 2 — Multimodal Fusion"
                status={liveRiskResult.stage2.status}
                detail={`Fused score ${liveRiskResult.stage2.fusedScore}/100 · Elevated groups: ${liveRiskResult.stage2.elevatedCount}`}
              />

              <FlowArrow />

              <PipelineStage
                label="Stage 3 — Temporal Risk Prediction"
                status={liveRiskResult.stage3.status}
                detail={`Trajectory: ${liveRiskResult.stage3.trend} pattern over time`}
              />

              <FlowArrow />

              {/* Final Risk Box */}
              <div className={`border p-5 ${riskBg[liveRiskResult.riskLevel]}`}>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Final Respiratory Risk</p>
                <p className={`mt-2 text-3xl font-semibold tracking-tight ${currentLevelTone}`}>
                  {liveRiskResult.riskLevel} — {liveRiskResult.riskScore}/100
                </p>
                <div className="mt-4 h-1.5 bg-white/70">
                  <div
                    className={`h-full ${
                      liveRiskResult.riskLevel === 'HIGH'
                        ? 'bg-rose-500'
                        : liveRiskResult.riskLevel === 'WATCH'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${liveRiskResult.riskScore}%` }}
                  />
                </div>
                <div className="mt-3 flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <span>LOW (0–39)</span>
                  <span>WATCH (40–69)</span>
                  <span>HIGH (70–100)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL / ZOOMED-IN VIEW OF AEROVIGIL PATCH */}
      {isPatchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-700">Hardware & Edge AI</p>
                <h3 className="mt-1 text-base font-semibold text-slate-950">AeroVigil Patch Architecture</h3>
              </div>
              <button
                onClick={() => setIsPatchOpen(false)}
                className="border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-400"
              >
                Close / Return
              </button>
            </div>

            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Metric label="SpO2" value={spo2} unit="%" icon={HeartPulse} />
                <Metric label="Heart Rate" value={hr} unit="BPM" icon={Activity} />
                <Metric label="PM2.5" value={pm25} unit="µg/m³" icon={CloudOff} />
                <Metric label="Risk" value={liveRiskResult.riskLevel} icon={ShieldCheck} tone={currentLevelTone} />
              </div>

              <div className="border border-slate-200 bg-slate-50/50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700">Integrated Edge Hardware Components</p>
                <ul className="mt-3 space-y-2 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-teal-600" />
                    <span><strong>Acoustic Auscultation Array:</strong> MEMS contact microphone for local breath sound and adventitious event classification.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-teal-600" />
                    <span><strong>Photoplethysmography (PPG):</strong> Multi-wavelength optical sensor computing continuous SpO2 and cardiac HRV.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-teal-600" />
                    <span><strong>Micro-climate & Gas Sensors:</strong> Ambient particulate exposure (PM2.5), skin temperature, and relative humidity.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-teal-600" />
                    <span><strong>Edge Inference Core:</strong> 3-Stage deterministic ML pipeline executing in-device with zero cloud latency.</span>
                  </li>
                </ul>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsPatchOpen(false)}
                  className="border border-slate-900 bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-teal-700"
                >
                  Return to Simulation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function AlertsPage({ data }: { data: SimulationSnapshot }) {
  return (
    <section>
      <SectionTitle
        eyebrow="Event stream"
        title="Alert center"
        detail={`${data.alerts.length} simulated event${data.alerts.length === 1 ? '' : 's'}`}
      />
      <p className="mb-6 max-w-2xl text-sm text-slate-600">{data.pipeline.stage3.alert}</p>
      <div className="flex flex-col gap-3">
        {data.alerts.map((alert) => (
          <div key={alert.title} className="flex gap-4 border-l-2 border-slate-300 bg-white px-4 py-4">
            <AlertTriangle
              className={`mt-0.5 size-4 shrink-0 ${
                alert.severity === 'high' ? 'text-rose-600' : alert.severity === 'watch' ? 'text-amber-600' : 'text-teal-600'
              }`}
            />
            <div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold text-slate-950">{alert.title}</p>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{alert.severity}</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-500">{alert.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function EdgeAIPage({ data, levelTone }: { data: SimulationSnapshot; levelTone: string }) {
  const { stage1, stage2, stage3 } = data.pipeline
  return (
    <>
      <section className="border-b border-slate-200 pb-7">
        <SectionTitle eyebrow="Inference runtime" title="Three-stage Edge AI pipeline" detail="Simulated on-device · no cloud inference" />
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          The local inference path runs entirely in-browser. Each stage exposes a replaceable interface so real ML models can be swapped in without changing the UI.
        </p>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="border-l-2 border-teal-500 bg-white px-4 py-5">
          <p className="text-xs font-semibold text-slate-950">Stage 1 · detectRespiratoryEvents()</p>
          <p className="mt-3 text-sm font-medium text-slate-800">{stage1.status}</p>
          <p className="mt-2 text-xs text-slate-500">
            Input: acoustic cough/wheeze/crackle patterns
            <br />
            Output: event severity · composite score {stage1.features.compositeAcousticScore}
          </p>
        </div>
        <div className="border-l-2 border-teal-500 bg-white px-4 py-5">
          <p className="text-xs font-semibold text-slate-950">Stage 2 · fuseMultimodalSignals()</p>
          <p className="mt-3 text-sm font-medium text-slate-800">{stage2.status}</p>
          <p className="mt-2 text-xs text-slate-500">
            Input: Stage 1 + SpO2/HR/HRV + environment + motion
            <br />
            Output: fused score {stage2.fusedScore}/100 · {stage2.elevatedGroups} groups elevated
          </p>
        </div>
        <div className="border-l-2 border-teal-500 bg-white px-4 py-5">
          <p className="text-xs font-semibold text-slate-950">Stage 3 · predictTemporalRisk()</p>
          <p className="mt-3 text-sm font-medium text-slate-800">{stage3.status}</p>
          <p className="mt-2 text-xs text-slate-500">
            Input: 7-day multimodal time-series
            <br />
            Output: {stage3.riskState} · {stage3.riskScore}/100
          </p>
        </div>
      </section>

      <section className="mt-8">
        <div className={`inline-block border px-4 py-3 ${riskBg[data.riskLevel]}`}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pipeline output</p>
          <p className={`mt-1 text-xl font-semibold ${levelTone}`}>
            {data.riskLevel} · {data.riskScore}/100
          </p>
        </div>
      </section>
    </>
  )
}

function ArchitecturePage({ data, levelTone }: { data: SimulationSnapshot; levelTone: string }) {
  const stages = [
    'Simulated sensors',
    'Local preprocessing',
    'Stage 1 · Respiratory detection',
    'Stage 2 · Multimodal fusion',
    'Stage 3 · Temporal prediction',
    'Risk state',
    'Alert',
  ]

  return (
    <>
      <section className="border-b border-slate-200 pb-7">
        <SectionTitle eyebrow="System diagram" title="Offline-first architecture" detail="Simulated chest-worn Edge AI concept" />
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          Simulated sensors feed local signal processing, then the three-stage Edge AI pipeline produces an interpretable risk state without cloud inference. Demo only — not clinically validated.
        </p>
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700">
          {stages.map((stage, i) => (
            <span key={stage} className="flex items-center gap-2">
              <span className="border border-slate-300 bg-white px-3 py-2">{stage}</span>
              {i < stages.length - 1 && <ChevronRight className="size-3 text-teal-600" />}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="border border-slate-200 bg-white p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700">Input channels</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>Respiratory acoustics — cough, wheeze, crackle</li>
            <li>Physiology — SpO2, heart rate, HRV</li>
            <li>Environment — PM2.5, temperature, humidity</li>
            <li>Motion / activity level</li>
          </ul>
        </div>
        <div className="border border-slate-200 bg-white p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700">Current output</p>
          <p className={`mt-4 text-2xl font-semibold ${levelTone}`}>
            {data.riskLevel} · {data.riskScore}/100
          </p>
          <p className="mt-2 text-sm text-slate-600">{data.pipeline.stage3.alert}</p>
          <p className="mt-4 text-xs text-slate-500">Scenario: {formatScenario(data.scenario)}</p>
        </div>
      </section>
    </>
  )
}
