export type Scenario = 'NORMAL' | 'EARLY DETERIORATION' | 'HIGH RISK'
export type RiskLevel = 'LOW' | 'WATCH' | 'HIGH'
export type TrendDirection = 'stable' | 'worsening' | 'improving'
export type EventSeverity = 'minimal' | 'moderate' | 'elevated' | 'severe'

export interface AcousticSample {
  cough: number
  wheeze: number
  crackle: number
}

export interface PhysiologySample {
  spo2: number
  hr: number
  hrv: number
}

export interface EnvironmentSample {
  pm25: number
  temperature: number
  humidity: number
}

export interface MotionSample {
  activity: number
}

export interface TimeSeriesPoint {
  day: number
  hour: string
  label: string
  acoustic: AcousticSample
  physiology: PhysiologySample
  environment: EnvironmentSample
  motion: MotionSample
}

export interface DailyAggregate {
  day: number
  label: string
  acoustic: AcousticSample
  physiology: PhysiologySample
  environment: EnvironmentSample
  motion: MotionSample
}

export interface AcousticInput {
  current: AcousticSample
  history: AcousticSample[]
  dailyAggregates: DailyAggregate[]
}

export interface RespiratoryEventDetection {
  coughActivity: number
  wheezeActivity: number
  crackleActivity: number
  eventSeverity: EventSeverity
  acousticTrend: TrendDirection
  status: string
  features: {
    coughRate: number
    wheezeRate: number
    crackleRate: number
    compositeAcousticScore: number
  }
}

export interface MultimodalInput {
  respiratory: RespiratoryEventDetection
  physiology: PhysiologySample
  environment: EnvironmentSample
  motion: MotionSample
  dailyAggregates: DailyAggregate[]
}

export interface MultimodalFusion {
  respiratoryScore: number
  physiologyScore: number
  environmentScore: number
  motionScore: number
  fusedScore: number
  elevatedGroups: number
  status: string
  features: {
    respiratoryContribution: number
    physiologyContribution: number
    environmentContribution: number
    motionContribution: number
  }
}

export interface MultimodalTimeSeriesEntry {
  day: number
  label: string
  fusedScore: number
  respiratoryScore: number
  physiologyScore: number
  environmentScore: number
  motionScore: number
}

export interface TemporalRiskPrediction {
  riskScore: number
  riskState: RiskLevel
  riskFactors: string[]
  trend: TrendDirection
  alert: string
  status: string
  dailyScores: number[]
  slope: number
}

export interface SignalSeriesPoint {
  time: string
  spo2: number
  hr: number
  hrv: number
  cough: number
  wheeze: number
  pm25: number
  motion: number
}

export interface SimulationAlert {
  title: string
  detail: string
  severity: 'info' | 'watch' | 'high'
}

export interface PipelineResult {
  stage1: RespiratoryEventDetection
  stage2: MultimodalFusion
  stage3: TemporalRiskPrediction
}

export interface SimulationSnapshot {
  scenario: Scenario
  riskScore: number
  riskLevel: RiskLevel
  spo2: number
  hr: number
  hrv: number
  cough: number
  wheeze: number
  crackle: number
  pm25: number
  temperature: number
  humidity: number
  motion: number
  trend: number[]
  signalSeries: SignalSeriesPoint[]
  alerts: SimulationAlert[]
  pipeline: PipelineResult
  timeSeries: TimeSeriesPoint[]
  dailyAggregates: DailyAggregate[]
  riskAnalysis: string
  lastUpdated: number
  runCount: number
}

export interface SimulationEngineResult {
  snapshot: SimulationSnapshot
  timeSeries: TimeSeriesPoint[]
  dailyAggregates: DailyAggregate[]
  pipeline: PipelineResult
}
