import { ask } from '../presentation/input'
import { cyan, yellow, green } from '../utils/colors'
import type { AppData } from '../types/City'

export async function handleSetDefaultCity(data: AppData): Promise<void> {
  if (data.cities.length === 0) {
    console.log(yellow('\n  No hay ciudades registradas.'))
    return
  }
  console.log(cyan('\n  Ciudades:'))
  data.cities.forEach((c, i) => {
    const isDefault = c.name === data.defaultCity ? yellow(' (default)') : ''
    console.log(`  ${i + 1}. ${c.name}, ${c.country}${isDefault}`)
  })
  const choice = await ask('  Selecciona la ciudad default (0 para cancelar): ')
  const index = parseInt(choice, 10) - 1
  if (index < 0 || index >= data.cities.length) {
    console.log(yellow('\n  Operación cancelada.'))
    return
  }
  const selected = data.cities[index]
  if (!selected) {
    console.log(yellow('\n  Operación cancelada.'))
    return
  }
  data.defaultCity = selected.name
  console.log(green(`\n  Ciudad default configurada: ${selected.name}, ${selected.country}`))
}
