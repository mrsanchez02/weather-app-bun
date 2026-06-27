import { getForecast } from '../api/weather'
import { renderCityWeather, renderDailyForecast } from '../presentation/output'
import { yellow, red } from '../utils/colors'
import type { AppData } from '../types/City'

export async function handleDefaultCityWeather(data: AppData): Promise<void> {
  if (!data.defaultCity) {
    console.log(yellow('\n  No hay ciudad default configurada.'))
    return
  }
  const city = data.cities.find(c => c.name === data.defaultCity)
  if (!city) {
    console.log(yellow(`\n  La ciudad default "${data.defaultCity}" no está en la lista.`))
    return
  }
  try {
    const forecast = await getForecast(city.latitude, city.longitude, data.unit)
    const unitSymbol = forecast.current_units?.temperature_2m ?? (data.unit === 'celsius' ? '°C' : '°F')
    renderCityWeather(city, forecast.current.temperature_2m, unitSymbol, forecast.current.time)
    if (forecast.daily) renderDailyForecast(forecast.daily, unitSymbol)
  } catch (error) {
    console.log(red(`\n  Error al obtener clima: ${error instanceof Error ? error.message : 'Error desconocido'}`))
  }
}

export async function handleAllCitiesWeather(data: AppData): Promise<void> {
  if (data.cities.length === 0) {
    console.log(yellow('\n  No hay ciudades registradas.'))
    return
  }
  for (const city of data.cities) {
    try {
      const forecast = await getForecast(city.latitude, city.longitude, data.unit)
      const unitSymbol = forecast.current_units?.temperature_2m ?? (data.unit === 'celsius' ? '°C' : '°F')
      renderCityWeather(city, forecast.current.temperature_2m, unitSymbol, forecast.current.time)
      if (forecast.daily) renderDailyForecast(forecast.daily, unitSymbol)
    } catch (error) {
      console.log(red(`\n  Error al obtener clima de ${city.name}: ${error instanceof Error ? error.message : 'Error desconocido'}`))
    }
  }
}
