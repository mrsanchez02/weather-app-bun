import { searchCity } from '../api/geocoding'
import { ask } from '../presentation/input'
import { cyan, yellow, green, red } from '../utils/colors'
import type { AppData } from '../types/City'

export async function handleAddCity(data: AppData): Promise<void> {
  const query = await ask('  Nombre de la ciudad: ')
  if (!query.trim()) {
    console.log(red('\n  Nombre inválido.'))
    return
  }
  try {
    const results = await searchCity(query.trim())
    if (results.length === 0) {
      console.log(yellow('\n  No se encontraron ciudades.'))
      return
    }
    console.log(cyan('\n  Resultados:'))
    results.forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.name}, ${r.country}`)
    })
    const choice = await ask('  Selecciona una ciudad (0 para cancelar): ')
    const index = parseInt(choice, 10) - 1
    if (index < 0 || index >= results.length) {
      console.log(yellow('\n  Operación cancelada.'))
      return
    }
    const selected = results[index]
    if (!selected) {
      console.log(yellow('\n  Operación cancelada.'))
      return
    }
    if (data.cities.some(c => c.name === selected.name && c.country === selected.country)) {
      console.log(yellow('\n  La ciudad ya está registrada.'))
      return
    }
    data.cities.push({
      name: selected.name,
      latitude: selected.latitude,
      longitude: selected.longitude,
      country: selected.country,
      timezone: selected.timezone,
    })
    console.log(green(`\n  ${selected.name} agregada correctamente.`))
  } catch (error) {
    console.log(red(`\n  Error al buscar ciudad: ${error instanceof Error ? error.message : 'Error desconocido'}`))
  }
}
