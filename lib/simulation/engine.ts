import { aggregateDaily, generateTimeSeries } from './generator'
import { buildMultimodalTimeSeries, detectRespiratoryEvents, fuseMultimodalSignals, predictTemporalRisk } from './stages'
import type {
  PipelineResult,
  Scenario,
  SimulationAlert,
  SimulationEngineResult,
  SimulationSnapshot,
  SignalSeriesPoint,
} from './types'

function buildAlerts(scenario: Scenario, pipeline: PipelineResult): SimulationAlert[] {
  const { stage1, stage3 } = pipeline

  if (scenario === 'NORMAL') {
    return [
      {
        title: 'All signals nominal',
        detail: 'No action required. Baseline pattern maintained across acoustic, physiology, and environment channels.',
        severity: 'info',
      },
    ]
  }

  if (scenario === 'EARLY DETERIORATION') {
    return [
      {
        title: 'Early deterioration pattern',
        detail: stage3.status + '. ' + stage3.alert,
        severity: 'watch',
      },
      {
        title: 'Cough activity elevated',
        detail: `Acoustic events above baseline — cough ${stage1.coughActivity}%, wheeze ${stage1.wheezeActivity}%.`,
        severity: 'watch',
      },
      {
        title: 'HRV reduction detected',
        detail: 'Cardiac variability declining in sync with respiratory acoustic changes.',
        severity: 'watch',
      },
    ]
  }

  return [
    {
      title: 'High risk detected',
      detail: stage3.alert,
      severity: 'high',
    },
    {
      title: 'Oxygen saturation low',
      detail: 'Simulated SpO2 below configured safety threshold with converging multimodal signals.',
      severity: 'high',
    },
    {
      title: 'Persistent wheeze and cough',
      detail: `${stage1.status}. Severity: ${stage1.eventSeverity}.`,
      severity: 'high',
    },
  ]
}

function buildRiskAnalysis(pipeline: PipelineResult): string {
  const { stage1, stage2, stage3 } = pipeline
  const factors = stage3.riskFactors.slice(0, 4).join('; ')
  return `${stage1.status}. ${stage2.status}. ${stage3.status}. Key drivers: ${factors}.`
}

function toSignalSeries(timeSeries: ReturnType<typeof generateTimeSeries>): SignalSeriesPoint[] {
  const recent = timeSeries.slice(-16)
  return recent.map((point) => ({
    time: point.label.replace('D', 'Day '),
    spo2: point.physiology.spo2,
    hr: point.physiology.hr,
    hrv: point.physiology.hrv,
    cough: point.acoustic.cough,
    wheeze: point.acoustic.wheeze,
    pm25: point.environment.pm25,
    motion: point.motion.activity,
  }))
}

export function runSimulationEngine(scenario: Scenario, runCount = 1): SimulationEngineResult {
  const timeSeries = generateTimeSeries(scenario)
  const dailyAggregates = aggregateDaily(timeSeries)
  const latestDay = dailyAggregates[dailyAggregates.length - 1]
  const latestPoints = timeSeries.filter((p) => p.day === latestDay.day)
  const latestPoint = latestPoints[latestPoints.length - 1]

  const acousticHistory = timeSeries.slice(0, -1).map((p) => p.acoustic)

  const stage1 = detectRespiratoryEvents({
    current: latestPoint.acoustic,
    history: acousticHistory,
    dailyAggregates,
  })

  const stage2 = fuseMultimodalSignals({
    respiratory: stage1,
    physiology: latestPoint.physiology,
    environment: latestPoint.environment,
    motion: latestPoint.motion,
    dailyAggregates,
  })

  const multimodalTimeSeries = buildMultimodalTimeSeries(dailyAggregates)
  const stage3 = predictTemporalRisk(multimodalTimeSeries, stage2, stage1, scenario)

  const pipeline: PipelineResult = { stage1, stage2, stage3 }

  const snapshot: SimulationSnapshot = {
    scenario,
    riskScore: stage3.riskScore,
    riskLevel: stage3.riskState,
    spo2: Math.round(latestPoint.physiology.spo2 * 10) / 10,
    hr: Math.round(latestPoint.physiology.hr),
    hrv: Math.round(latestPoint.physiology.hrv),
    cough: stage1.coughActivity,
    wheeze: stage1.wheezeActivity,
    crackle: stage1.crackleActivity,
    pm25: Math.round(latestPoint.environment.pm25),
    temperature: latestPoint.environment.temperature,
    humidity: Math.round(latestPoint.environment.humidity),
    motion: Math.round(latestPoint.motion.activity),
    trend: stage3.dailyScores,
    signalSeries: toSignalSeries(timeSeries),
    alerts: buildAlerts(scenario, pipeline),
    pipeline,
    timeSeries,
    dailyAggregates,
    riskAnalysis: buildRiskAnalysis(pipeline),
    lastUpdated: Date.now(),
    runCount,
  }

  return { snapshot, timeSeries, dailyAggregates, pipeline }
}

export function createSnapshot(scenario: Scenario): SimulationSnapshot {
  return runSimulationEngine(scenario).snapshot
}
