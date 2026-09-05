export type {
  Scenario,
  RiskLevel,
  TrendDirection,
  EventSeverity,
  SimulationSnapshot,
  SimulationAlert,
  PipelineResult,
  RespiratoryEventDetection,
  MultimodalFusion,
  TemporalRiskPrediction,
  TimeSeriesPoint,
  DailyAggregate,
  SignalSeriesPoint,
} from './types'

export { detectRespiratoryEvents, fuseMultimodalSignals, predictTemporalRisk } from './stages'
export { generateTimeSeries, aggregateDaily } from './generator'
export { runSimulationEngine, createSnapshot } from './engine'

export const scenarios = ['NORMAL', 'EARLY DETERIORATION', 'HIGH RISK'] as const

export const scenarioLabels: Record<import('./types').Scenario, string> = {
  NORMAL: 'Normal',
  'EARLY DETERIORATION': 'Early Deterioration',
  'HIGH RISK': 'High Risk',
}

export const riskColors: Record<import('./types').RiskLevel, string> = {
  LOW: 'text-emerald-600',
  WATCH: 'text-amber-600',
  HIGH: 'text-rose-600',
}

export const riskBg: Record<import('./types').RiskLevel, string> = {
  LOW: 'bg-emerald-50 border-emerald-200',
  WATCH: 'bg-amber-50 border-amber-200',
  HIGH: 'bg-rose-50 border-rose-200',
}

export function formatScenario(scenario: import('./types').Scenario): string {
  return scenarioLabels[scenario]
}

export function riskDescription(level: import('./types').RiskLevel): string {
  if (level === 'LOW') return 'Stable respiratory profile'
  if (level === 'WATCH') return 'Monitor for deterioration'
  return 'Immediate attention required'
}

export function scenarioExpectedRisk(scenario: import('./types').Scenario): import('./types').RiskLevel {
  if (scenario === 'NORMAL') return 'LOW'
  if (scenario === 'EARLY DETERIORATION') return 'WATCH'
  return 'HIGH'
}
