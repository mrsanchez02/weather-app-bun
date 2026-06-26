import type { ForecastResponse } from './types'

export async function getCurrentTemperature(
  lat: number,
  lon: number,
  unit: 'celsius' | 'fahrenheit',
): Promise<ForecastResponse> {
  const tempUnit = unit === 'celsius' ? 'celsius' : 'fahrenheit'
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&temperature_unit=${tempUnit}&timezone=auto`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Error en forecast: ${response.status}`)
  return await response.json() as ForecastResponse
}
