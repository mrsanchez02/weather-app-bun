import { ask } from './input'
import { handleDefaultCityWeather, handleAllCitiesWeather } from '../actions/getWeather'
import { handleAddCity } from '../actions/addCity'
import { handleDeleteCity } from '../actions/removeCity'
import { handleSetDefaultCity } from '../actions/setDefaultCity'
import { handleListCities } from '../actions/listCities'
import { loadCities, saveCities } from '../storage/citiesStorage'
import { loadSettings, saveSettings } from '../storage/settingsStorage'
import { cyan, yellow, green, red, bold } from '../utils/colors'
import type { AppData } from '../types/City'

function renderMenu(data: AppData): void {
  console.clear()
  const symbol = data.unit === 'celsius' ? '°C' : '°F'
  console.log(cyan('════════════════════════════════════════'))
  console.log(cyan(bold('         WEATHER CLI')))
  console.log(cyan('════════════════════════════════════════'))
  console.log(cyan('  1. Clima + 7 días (ciudad default)'))
  console.log(cyan(`  2. Clima + 7 días (todas las ciudades) (${data.cities.length})`))
  console.log(cyan('  3. Buscar y agregar ciudad'))
  console.log(cyan('  4. Eliminar ciudad'))
  console.log(cyan('  5. Establecer ciudad default'))
  console.log(cyan('  6. Listar ciudades guardadas'))
  console.log(cyan(`  8. Ajustes (${symbol})`))
  console.log(cyan('  9. Salir'))
  console.log(cyan('════════════════════════════════════════'))
}

function handleToggleUnit(data: AppData): void {
  data.unit = data.unit === 'celsius' ? 'fahrenheit' : 'celsius'
  const symbol = data.unit === 'celsius' ? '°C' : '°F'
  console.log(green(`\n  Unidad cambiada a ${symbol}.`))
}

export async function startMenu(): Promise<void> {
  const [cities, settings] = await Promise.all([loadCities(), loadSettings()])
  const data: AppData = {
    defaultCity: settings.defaultCity,
    cities,
    unit: settings.unit,
  }
  let running = true

  while (running) {
    renderMenu(data)
    const option = await ask('  Selecciona una opción: ')

    switch (option.trim()) {
      case '1': {
        await handleDefaultCityWeather(data)
        break
      }
      case '2': {
        await handleAllCitiesWeather(data)
        break
      }
      case '3': {
        await handleAddCity(data)
        break
      }
      case '4': {
        await handleDeleteCity(data)
        break
      }
      case '5': {
        await handleSetDefaultCity(data)
        break
      }
      case '6': {
        handleListCities(data)
        break
      }
      case '8': {
        handleToggleUnit(data)
        break
      }
      case '9': {
        running = false
        continue
      }
      default: {
        console.log(red('\n  Opción inválida.'))
      }
    }

    if (running) {
      await Promise.all([saveCities(data.cities), saveSettings({ defaultCity: data.defaultCity, unit: data.unit })])
      await ask('\n  Presiona Enter para continuar...')
    }
  }

  console.log(cyan('\n  ¡Hasta luego!'))
}
