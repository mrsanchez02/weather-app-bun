import type { ForecastResponse } from '../types/Weather'

type FetchFn = typeof fetch

export async function getForecast(
  lat: number,
  lon: number,
  unit: 'celsius' | 'fahrenheit',
  fetchFn?: FetchFn,
): Promise<ForecastResponse> {
  const tempUnit = unit === 'celsius' ? 'celsius' : 'fahrenheit'
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&daily=temperature_2m_max,temperature_2m_min,weathercode&temperature_unit=${tempUnit}&timezone=auto&forecast_days=7`
  const response = await (fetchFn ?? fetch)(url)
  if (!response.ok) throw new Error(`Error en forecast: ${response.status}`)
  return await response.json() as ForecastResponse
}
