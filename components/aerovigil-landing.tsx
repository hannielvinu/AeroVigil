'use client'

import Link from 'next/link'
import { Activity, ArrowRight, BrainCircuit, CloudOff, Gauge, HeartPulse, LockKeyhole, Radio, ShieldCheck, WifiOff } from 'lucide-react'

const signals = [
  { label: 'SpO₂', value: '97.8%', note: 'stable baseline', tone: 'text-teal-700' },
  { label: 'HRV', value: '48 ms', note: 'within range', tone: 'text-slate-900' },
  { label: 'Acoustic events', value: 'Low', note: 'no escalation', tone: 'text-slate-900' },
]

export default function AeroVigilLanding() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f8fafb] text-slate-950">
      <header className="border-b border-slate-200 bg-[#fbfcfc]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="AeroVigil home">
            <img src="/logo.png" alt="AeroVigil logo" className="h-9 w-auto" />
          </Link>
          <nav className="hidden items-center gap-7 text-xs font-semibold text-slate-500 md:flex"><a href="#approach" className="transition hover:text-slate-950">Approach</a><a href="#signals" className="transition hover:text-slate-950">Signals</a><a href="#privacy" className="transition hover:text-slate-950">Privacy</a></nav>
          <Link href="/dashboard" className="group inline-flex items-center gap-2 border border-slate-900 bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-teal-700">Open console <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" /></Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-16 md:px-8 md:pb-28 md:pt-24 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 border border-teal-200 bg-teal-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-teal-800"><span className="size-1.5 rounded-full bg-teal-500" /> Simulation mode · prototype</div>
          <h1 className="max-w-3xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-slate-950 md:text-7xl">Respiratory insight, <span className="text-teal-700">closer to the signal.</span></h1>
          <p className="mt-7 max-w-xl text-pretty text-base leading-7 text-slate-600 md:text-lg">AeroVigil turns multimodal respiratory signals into an interpretable risk state — with an offline-first Edge AI approach designed for clarity, continuity, and trust.</p>
          <div className="mt-9 flex flex-wrap items-center gap-3"><Link href="/dashboard" className="group inline-flex items-center gap-3 bg-teal-700 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-800">Explore the console <ArrowRight className="size-4 transition group-hover:translate-x-1" /></Link><a href="#approach" className="inline-flex items-center px-5 py-3.5 text-sm font-semibold text-slate-600 transition hover:text-slate-950">See how it works</a></div>
          <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500"><span className="inline-flex items-center gap-2"><BrainCircuit className="size-3.5 text-teal-700" /> On-device Edge AI</span><span className="inline-flex items-center gap-2"><CloudOff className="size-3.5 text-teal-700" /> No cloud inference</span><span className="inline-flex items-center gap-2"><WifiOff className="size-3.5 text-teal-700" /> Offline-first</span></div>
        </div>
        <div className="relative lg:pl-8"><div className="absolute -inset-6 -z-10 bg-[linear-gradient(135deg,rgba(13,148,136,0.08),transparent_55%)]" /><div className="border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]"><div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-teal-700">Live local telemetry</p><p className="mt-1 text-xs font-semibold text-slate-950">Patient 001 · respiratory profile</p></div><span className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-slate-500"><span className="size-1.5 rounded-full bg-emerald-500" /> active</span></div><div className="grid grid-cols-3 divide-x divide-slate-200 border-b border-slate-200">{signals.map((signal) => <div key={signal.label} className="p-4"><p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{signal.label}</p><p className={`mt-2 text-xl font-semibold tracking-tight ${signal.tone}`}>{signal.value}</p><p className="mt-1 text-[10px] text-slate-500">{signal.note}</p></div>)}</div><div className="p-5"><div className="flex items-center justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">Current risk state</p><p className="mt-1 text-3xl font-semibold tracking-tight text-emerald-700">LOW</p></div><div className="flex size-12 items-center justify-center rounded-full border-[6px] border-teal-100 text-teal-700"><ShieldCheck className="size-5" /></div></div><div className="mt-7 h-2 bg-slate-100"><div className="h-full w-[18%] bg-emerald-500" /></div><div className="mt-2 flex justify-between text-[9px] font-bold uppercase tracking-wider text-slate-400"><span>Risk score</span><span>18 / 100</span></div></div><div className="flex items-center gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500"><LockKeyhole className="size-3.5 text-teal-700" /> Processed locally · simulation engine active</div></div></div>
      </section>

      <section className="border-y border-slate-200 bg-white" id="approach"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-[0.75fr_1.25fr]"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-700">A different proximity</p><h2 className="mt-3 max-w-md text-3xl font-semibold leading-tight tracking-[-0.035em] text-slate-950 md:text-4xl">The useful signal is the one you can understand.</h2></div><div className="grid gap-8 sm:grid-cols-3"><Feature icon={Radio} title="Multimodal" body="Respiratory, cardiac, acoustic, environmental, and motion signals in one view." /><Feature icon={Gauge} title="Interpretable" body="A transparent risk score becomes LOW, WATCH, or HIGH — not a black box." /><Feature icon={HeartPulse} title="Continuous" body="Local processing keeps the monitoring loop resilient when connectivity is limited." /></div></div></section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24" id="signals"><div className="grid items-end gap-8 lg:grid-cols-[1fr_0.8fr]"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-700">Inside the prototype</p><h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.035em] md:text-5xl">See the engine respond before you trust the output.</h2></div><p className="max-w-md text-sm leading-6 text-slate-600">Change the scenario in the console and watch the same local state propagate across metrics, charts, signal streams, and alerts.</p></div><div className="mt-10 flex flex-wrap gap-3 border-y border-slate-200 py-5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500"><span className="bg-teal-50 px-3 py-2 text-teal-800">Normal → Low</span><span className="bg-amber-50 px-3 py-2 text-amber-800">Early deterioration → Watch</span><span className="bg-rose-50 px-3 py-2 text-rose-800">High risk → High</span></div></section>

      <section className="border-t border-slate-200 bg-slate-950 text-white" id="privacy"><div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-14 md:flex-row md:items-center md:justify-between md:px-8 md:py-20"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-300">Built for the edge</p><h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.035em] md:text-4xl">A focused prototype for a more resilient monitoring layer.</h2><p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">No cloud inference. No distractions. Just a clear simulation of what local, privacy-conscious respiratory intelligence can feel like.</p></div><Link href="/dashboard" className="group inline-flex shrink-0 items-center gap-3 self-start bg-teal-500 px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-teal-300 md:self-center">Enter AeroVigil <ArrowRight className="size-4 transition group-hover:translate-x-1" /></Link></div></section>
      <footer className="bg-slate-950 px-5 pb-8 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 md:px-8"><div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 border-t border-slate-800 pt-5"><span>Simulation mode · v0.1</span><span>On-device Edge AI · Offline-first</span></div></footer>
    </main>
  )
}

function Feature({ icon: Icon, title, body }: { icon: typeof Activity; title: string; body: string }) { return <div><Icon className="size-5 text-teal-700" /><h3 className="mt-4 text-sm font-semibold text-slate-950">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{body}</p></div> }
