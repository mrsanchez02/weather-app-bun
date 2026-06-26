export interface GeocodingResult {
  name: string
  latitude: number
  longitude: number
  country: string
  timezone: string
}

export interface SavedCity {
  name: string
  latitude: number
  longitude: number
  country: string
  timezone: string
}

export interface AppData {
  defaultCity: string | null
  cities: SavedCity[]
  unit: 'celsius' | 'fahrenheit'
}

export interface ForecastCurrent {
  time: string
  temperature_2m: number
}

export interface ForecastCurrentUnits {
  temperature_2m: string
}

export interface ForecastResponse {
  current: ForecastCurrent
  current_units?: ForecastCurrentUnits
}
