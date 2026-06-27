export interface ForecastCurrent {
  time: string
  temperature_2m: number
}

export interface ForecastCurrentUnits {
  temperature_2m: string
}

export interface DailyForecast {
  time: string[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  weathercode: number[]
}

export interface DailyUnits {
  temperature_2m_max: string
  temperature_2m_min: string
}

export interface ForecastResponse {
  current: ForecastCurrent
  current_units?: ForecastCurrentUnits
  daily?: DailyForecast
  daily_units?: DailyUnits
}
