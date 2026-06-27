import type { DailyForecast } from '../types/Weather'
import { cyan, yellow, dim } from '../utils/colors'
import { getWeatherDescription } from '../utils/constants'
import { formatDate, formatTemperature, formatTime } from '../utils/format'

export function renderCityWeather(
  city: { name: string; country: string },
  temp: number,
  unitSymbol: string,
  time?: string,
): void {
  console.log()
  console.log(cyan('════════════════════════════════════════'))
  console.log(cyan(`  ${city.name}${city.country ? `, ${city.country}` : ''}`))
  console.log(`  Temperatura: ${yellow(`${formatTemperature(temp)}${unitSymbol}`)}`)
  if (time) {
    console.log(`  Hora: ${dim(formatTime(time))}`)
  }
  console.log(cyan('════════════════════════════════════════'))
}

export function renderDailyForecast(daily: DailyForecast, unitSymbol: string): void {
  console.log()
  console.log(dim('  PRONÓSTICO 7 DÍAS:'))
  console.log(dim('  ─────────────────────────────────────────────'))
  for (let i = 0; i < daily.time.length; i++) {
    const dateStr = daily.time[i] ?? ''
    const formattedDate = formatDate(dateStr)
    const maxT = daily.temperature_2m_max[i]
    const minT = daily.temperature_2m_min[i]
    const code = daily.weathercode[i] ?? 0
    const desc = getWeatherDescription(code)
    console.log(`  ${cyan(formattedDate.padEnd(12))} ${yellow(`${formatTemperature(maxT)}${unitSymbol}`)} / ${dim(`${formatTemperature(minT)}${unitSymbol}`)}    ${desc}`)
  }
  console.log(dim('  ─────────────────────────────────────────────'))
}
