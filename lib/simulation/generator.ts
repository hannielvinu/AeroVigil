import type { DailyAggregate, Scenario, TimeSeriesPoint } from './types'

const HOURS = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'] as const
const DAYS = 7

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function dayProgress(day: number): number {
  return (day - 1) / (DAYS - 1)
}

/** Correlated intra-day variation tied to time-of-day and scenario progression. */
function diurnal(index: number, amplitude: number): number {
  return Math.sin((index / HOURS.length) * Math.PI * 2) * amplitude
}

interface ScenarioProfile {
  spo2Start: number
  spo2End: number
  hrStart: number
  hrEnd: number
  hrvStart: number
  hrvEnd: number
  coughStart: number
  coughEnd: number
  wheezeStart: number
  wheezeEnd: number
  crackleStart: number
  crackleEnd: number
  pm25Start: number
  pm25End: number
  tempStart: number
  tempEnd: number
  humidityStart: number
  humidityEnd: number
  motionStart: number
  motionEnd: number
  /** How quickly signals worsen across the 7-day window (0 = flat, 1 = full arc). */
  progression: number
}

const profiles: Record<Scenario, ScenarioProfile> = {
  NORMAL: {
    spo2Start: 98.2,
    spo2End: 97.8,
    hrStart: 70,
    hrEnd: 74,
    hrvStart: 58,
    hrvEnd: 55,
    coughStart: 8,
    coughEnd: 10,
    wheezeStart: 3,
    wheezeEnd: 4,
    crackleStart: 1,
    crackleEnd: 2,
    pm25Start: 6,
    pm25End: 8,
    tempStart: 22.0,
    tempEnd: 22.8,
    humidityStart: 44,
    humidityEnd: 48,
    motionStart: 62,
    motionEnd: 58,
    progression: 0.15,
  },
  'EARLY DETERIORATION': {
    spo2Start: 97.0,
    spo2End: 93.5,
    hrStart: 74,
    hrEnd: 88,
    hrvStart: 52,
    hrvEnd: 36,
    coughStart: 12,
    coughEnd: 44,
    wheezeStart: 6,
    wheezeEnd: 30,
    crackleStart: 3,
    crackleEnd: 18,
    pm25Start: 10,
    pm25End: 28,
    tempStart: 22.5,
    tempEnd: 24.2,
    humidityStart: 48,
    humidityEnd: 60,
    motionStart: 58,
    motionEnd: 38,
    progression: 0.85,
  },
  'HIGH RISK': {
    spo2Start: 95.5,
    spo2End: 87.5,
    hrStart: 82,
    hrEnd: 112,
    hrvStart: 48,
    hrvEnd: 19,
    coughStart: 22,
    coughEnd: 82,
    wheezeStart: 14,
    wheezeEnd: 68,
    crackleStart: 8,
    crackleEnd: 54,
    pm25Start: 18,
    pm25End: 52,
    tempStart: 23.5,
    tempEnd: 26.2,
    humidityStart: 55,
    humidityEnd: 74,
    motionStart: 52,
    motionEnd: 14,
    progression: 1.0,
  },
}

function interpolateProfile(profile: ScenarioProfile, day: number): {
  physiology: PhysiologySample
  acoustic: AcousticSample
  environment: { pm25: number; temperature: number; humidity: number }
  motion: number
} {
  const t = dayProgress(day) * profile.progression + dayProgress(day) * (1 - profile.progression) * 0.5
  const progress = clamp(t, 0, 1)

  return {
    physiology: {
      spo2: lerp(profile.spo2Start, profile.spo2End, progress),
      hr: lerp(profile.hrStart, profile.hrEnd, progress),
      hrv: lerp(profile.hrvStart, profile.hrvEnd, progress),
    },
    acoustic: {
      cough: lerp(profile.coughStart, profile.coughEnd, progress),
      wheeze: lerp(profile.wheezeStart, profile.wheezeEnd, progress),
      crackle: lerp(profile.crackleStart, profile.crackleEnd, progress),
    },
    environment: {
      pm25: lerp(profile.pm25Start, profile.pm25End, progress),
      temperature: lerp(profile.tempStart, profile.tempEnd, progress),
      humidity: lerp(profile.humidityStart, profile.humidityEnd, progress),
    },
    motion: lerp(profile.motionStart, profile.motionEnd, progress),
  }
}

export function generateTimeSeries(scenario: Scenario): TimeSeriesPoint[] {
  const profile = profiles[scenario]
  const points: TimeSeriesPoint[] = []

  for (let day = 1; day <= DAYS; day++) {
    const base = interpolateProfile(profile, day)

    HOURS.forEach((hour, hourIndex) => {
      const dayDrift = diurnal(hourIndex, scenario === 'NORMAL' ? 0.4 : 0.8)
      const acousticCoupling = scenario === 'NORMAL' ? 0.3 : 0.6

      const cough = clamp(
        Math.round(base.acoustic.cough + dayDrift * 2 + base.acoustic.wheeze * 0.05 * acousticCoupling),
        0,
        100,
      )
      const wheeze = clamp(
        Math.round(base.acoustic.wheeze + dayDrift * 1.5 + cough * 0.08 * acousticCoupling),
        0,
        100,
      )
      const crackle = clamp(
        Math.round(base.acoustic.crackle + (wheeze > 30 ? wheeze * 0.12 : dayDrift)),
        0,
        100,
      )

      const spo2 = clamp(
        Math.round((base.physiology.spo2 - cough * 0.015 - wheeze * 0.01 + dayDrift * 0.2) * 10) / 10,
        82,
        100,
      )
      const hr = clamp(
        Math.round(base.physiology.hr + cough * 0.12 + (100 - spo2) * 0.8 + dayDrift),
        55,
        130,
      )
      const hrv = clamp(
        Math.round(base.physiology.hrv - cough * 0.08 - (hr - 70) * 0.15 + dayDrift * 0.5),
        12,
        80,
      )

      const pm25 = clamp(
        Math.round(base.environment.pm25 + cough * 0.04 + dayDrift * 1.2),
        2,
        80,
      )
      const temperature = Math.round((base.environment.temperature + dayDrift * 0.15) * 10) / 10
      const humidity = clamp(
        Math.round(base.environment.humidity + pm25 * 0.08 + dayDrift),
        30,
        90,
      )

      const motion = clamp(
        Math.round(base.motion - cough * 0.1 - wheeze * 0.08 + dayDrift * 2),
        5,
        95,
      )

      points.push({
        day,
        hour,
        label: `D${day} ${hour}`,
        acoustic: { cough, wheeze, crackle },
        physiology: { spo2, hr, hrv },
        environment: { pm25, temperature, humidity },
        motion: { activity: motion },
      })
    })
  }

  return points
}

export function aggregateDaily(timeSeries: TimeSeriesPoint[]): DailyAggregate[] {
  const byDay = new Map<number, TimeSeriesPoint[]>()
  for (const point of timeSeries) {
    const bucket = byDay.get(point.day) ?? []
    bucket.push(point)
    byDay.set(point.day, bucket)
  }

  const mean = (values: number[]) =>
    values.length === 0 ? 0 : Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10

  return Array.from(byDay.entries())
    .sort(([a], [b]) => a - b)
    .map(([day, points]) => ({
      day,
      label: `Day ${day}`,
      acoustic: {
        cough: mean(points.map((p) => p.acoustic.cough)),
        wheeze: mean(points.map((p) => p.acoustic.wheeze)),
        crackle: mean(points.map((p) => p.acoustic.crackle)),
      },
      physiology: {
        spo2: mean(points.map((p) => p.physiology.spo2)),
        hr: mean(points.map((p) => p.physiology.hr)),
        hrv: mean(points.map((p) => p.physiology.hrv)),
      },
      environment: {
        pm25: mean(points.map((p) => p.environment.pm25)),
        temperature: mean(points.map((p) => p.environment.temperature)),
        humidity: mean(points.map((p) => p.environment.humidity)),
      },
      motion: {
        activity: mean(points.map((p) => p.motion.activity)),
      },
    }))
}

export { HOURS, DAYS }
