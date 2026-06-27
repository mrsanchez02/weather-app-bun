import type { GeocodingResult } from '../types/City'

type FetchFn = typeof fetch

export async function searchCity(query: string, fetchFn?: FetchFn): Promise<GeocodingResult[]> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=es&format=json`
  const response = await (fetchFn ?? fetch)(url)
  if (!response.ok) throw new Error(`Error en geocoding: ${response.status}`)
  const data = await response.json() as { results?: GeocodingResult[] }
  return data.results ?? []
}
