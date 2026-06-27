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
