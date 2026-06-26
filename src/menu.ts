import * as readline from 'node:readline'
import type { AppData, SavedCity } from './types'
import { searchCity } from './geocoding'
import { getCurrentTemperature } from './forecast'
import { loadData, saveData } from './storage'

function ask(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close()
      resolve(answer)
    })
  })
}

function renderMenu(data: AppData): void {
  console.clear()
  const symbol = data.unit === 'celsius' ? '°C' : '°F'
  console.log('════════════════════════════════════════')
  console.log('         WEATHER CLI')
  console.log('════════════════════════════════════════')
  console.log(`  1. Clima de ciudad default`)
  console.log(`  2. Clima de todas las ciudades (${data.cities.length})`)
  console.log('  3. Buscar y agregar ciudad')
  console.log('  4. Eliminar ciudad')
  console.log('  5. Establecer ciudad default')
  console.log(`  8. Ajustes (${symbol})`)
  console.log('  9. Salir')
  console.log('════════════════════════════════════════')
}

function renderCityWeather(city: SavedCity, temp: number, unitSymbol: string, time?: string): void {
  const tempStr = Number.isInteger(temp) ? temp.toString() : temp.toFixed(1)
  console.log()
  console.log('════════════════════════════════════════')
  console.log(`  ${city.name}${city.country ? `, ${city.country}` : ''}`)
  console.log(`  Temperatura: ${tempStr}${unitSymbol}`)
  if (time) {
    const formattedTime = time.includes('T') ? (time.split('T')[1] ?? time) : time
    console.log(`  Hora: ${formattedTime}`)
  }
  console.log('════════════════════════════════════════')
}

// --- Option handlers ---

async function handleDefaultCityWeather(data: AppData): Promise<void> {
  if (!data.defaultCity) {
    console.log('\n  No hay ciudad default configurada.')
    return
  }
  const city = data.cities.find(c => c.name === data.defaultCity)
  if (!city) {
    console.log(`\n  La ciudad default "${data.defaultCity}" no está en la lista.`)
    return
  }
  try {
    const forecast = await getCurrentTemperature(city.latitude, city.longitude, data.unit)
    const unitSymbol = forecast.current_units?.temperature_2m ?? (data.unit === 'celsius' ? '°C' : '°F')
    renderCityWeather(city, forecast.current.temperature_2m, unitSymbol, forecast.current.time)
  } catch (error) {
    console.log(`\n  Error al obtener clima: ${error instanceof Error ? error.message : 'Error desconocido'}`)
  }
}

async function handleAllCitiesWeather(data: AppData): Promise<void> {
  if (data.cities.length === 0) {
    console.log('\n  No hay ciudades registradas.')
    return
  }
  for (const city of data.cities) {
    try {
      const forecast = await getCurrentTemperature(city.latitude, city.longitude, data.unit)
      const unitSymbol = forecast.current_units?.temperature_2m ?? (data.unit === 'celsius' ? '°C' : '°F')
      renderCityWeather(city, forecast.current.temperature_2m, unitSymbol, forecast.current.time)
    } catch (error) {
      console.log(`\n  Error al obtener clima de ${city.name}: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }
}

async function handleAddCity(data: AppData): Promise<void> {
  const query = await ask('  Nombre de la ciudad: ')
  if (!query.trim()) {
    console.log('\n  Nombre inválido.')
    return
  }
  try {
    const results = await searchCity(query.trim())
    if (results.length === 0) {
      console.log('\n  No se encontraron ciudades.')
      return
    }
    console.log('\n  Resultados:')
    results.forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.name}, ${r.country}`)
    })
    const choice = await ask('  Selecciona una ciudad (0 para cancelar): ')
    const index = parseInt(choice, 10) - 1
    if (index < 0 || index >= results.length) {
      console.log('\n  Operación cancelada.')
      return
    }
    const selected = results[index]
    if (!selected) {
      console.log('\n  Operación cancelada.')
      return
    }
    if (data.cities.some(c => c.name === selected.name && c.country === selected.country)) {
      console.log('\n  La ciudad ya está registrada.')
      return
    }
    data.cities.push({
      name: selected.name,
      latitude: selected.latitude,
      longitude: selected.longitude,
      country: selected.country,
      timezone: selected.timezone,
    })
    console.log(`\n  ${selected.name} agregada correctamente.`)
  } catch (error) {
    console.log(`\n  Error al buscar ciudad: ${error instanceof Error ? error.message : 'Error desconocido'}`)
  }
}

async function handleDeleteCity(data: AppData): Promise<void> {
  if (data.cities.length === 0) {
    console.log('\n  No hay ciudades registradas.')
    return
  }
  console.log('\n  Ciudades:')
  data.cities.forEach((c, i) => {
    console.log(`  ${i + 1}. ${c.name}, ${c.country}`)
  })
  const choice = await ask('  Selecciona una ciudad para eliminar (0 para cancelar): ')
  const index = parseInt(choice, 10) - 1
  if (index < 0 || index >= data.cities.length) {
    console.log('\n  Operación cancelada.')
    return
  }
  const removed = data.cities[index]
  if (!removed) {
    console.log('\n  Operación cancelada.')
    return
  }
  data.cities.splice(index, 1)
  if (data.defaultCity === removed.name) {
    data.defaultCity = null
    console.log(`\n  ${removed.name} eliminada. La ciudad default fue removida.`)
  } else {
    console.log(`\n  ${removed.name} eliminada.`)
  }
}

async function handleSetDefaultCity(data: AppData): Promise<void> {
  if (data.cities.length === 0) {
    console.log('\n  No hay ciudades registradas.')
    return
  }
  console.log('\n  Ciudades:')
  data.cities.forEach((c, i) => {
    const isDefault = c.name === data.defaultCity ? ' (default)' : ''
    console.log(`  ${i + 1}. ${c.name}, ${c.country}${isDefault}`)
  })
  const choice = await ask('  Selecciona la ciudad default (0 para cancelar): ')
  const index = parseInt(choice, 10) - 1
  if (index < 0 || index >= data.cities.length) {
    console.log('\n  Operación cancelada.')
    return
  }
  const selected = data.cities[index]
  if (!selected) {
    console.log('\n  Operación cancelada.')
    return
  }
  data.defaultCity = selected.name
  console.log(`\n  Ciudad default configurada: ${selected.name}, ${selected.country}`)
}

function handleToggleUnit(data: AppData): void {
  data.unit = data.unit === 'celsius' ? 'fahrenheit' : 'celsius'
  const symbol = data.unit === 'celsius' ? '°C' : '°F'
  console.log(`\n  Unidad cambiada a ${symbol}.`)
}

// --- Main menu loop ---

export async function startMenu(): Promise<void> {
  let data = await loadData()
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
      case '8': {
        handleToggleUnit(data)
        break
      }
      case '9': {
        running = false
        continue
      }
      default: {
        console.log('\n  Opción inválida.')
      }
    }

    if (running) {
      await saveData(data)
      await ask('\n  Presiona Enter para continuar...')
    }
  }

  console.log('\n  ¡Hasta luego!')
}
