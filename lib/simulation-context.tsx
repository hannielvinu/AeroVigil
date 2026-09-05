'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  createSnapshot,
  runSimulationEngine,
  type Scenario,
  type SimulationSnapshot,
} from '@/lib/simulation'

interface SimulationContextValue {
  scenario: Scenario
  setScenario: (scenario: Scenario) => void
  snapshot: SimulationSnapshot
  runSimulation: () => void
  resetSimulation: () => void
  isRunning: boolean
}

const SimulationContext = createContext<SimulationContextValue | null>(null)

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [scenario, setScenarioState] = useState<Scenario>('NORMAL')
  const [runCount, setRunCount] = useState(1)
  const [isRunning, setIsRunning] = useState(false)
  const [snapshot, setSnapshot] = useState<SimulationSnapshot>(() => createSnapshot('NORMAL'))

  const applyScenario = useCallback((next: Scenario, count: number) => {
    const result = runSimulationEngine(next, count)
    setSnapshot(result.snapshot)
  }, [])

  const setScenario = useCallback(
    (next: Scenario) => {
      setScenarioState(next)
      applyScenario(next, runCount)
    },
    [applyScenario, runCount],
  )

  const runSimulation = useCallback(() => {
    setIsRunning(true)
    const nextCount = runCount + 1
    setRunCount(nextCount)
    applyScenario(scenario, nextCount)
    setTimeout(() => setIsRunning(false), 400)
  }, [applyScenario, runCount, scenario])

  const resetSimulation = useCallback(() => {
    setScenarioState('NORMAL')
    setRunCount(1)
    setSnapshot(createSnapshot('NORMAL'))
    setIsRunning(false)
  }, [])

  const value = useMemo(
    () => ({
      scenario,
      setScenario,
      snapshot,
      runSimulation,
      resetSimulation,
      isRunning,
    }),
    [scenario, setScenario, snapshot, runSimulation, resetSimulation, isRunning],
  )

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>
}

export function useSimulation(): SimulationContextValue {
  const ctx = useContext(SimulationContext)
  if (!ctx) {
    throw new Error('useSimulation must be used within SimulationProvider')
  }
  return ctx
}
