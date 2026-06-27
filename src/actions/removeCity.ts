import { ask } from '../presentation/input'
import { cyan, yellow, green, red } from '../utils/colors'
import type { AppData } from '../types/City'

export async function handleDeleteCity(data: AppData): Promise<void> {
  if (data.cities.length === 0) {
    console.log(yellow('\n  No hay ciudades registradas.'))
    return
  }
  console.log(cyan('\n  Ciudades:'))
  data.cities.forEach((c, i) => {
    console.log(`  ${i + 1}. ${c.name}, ${c.country}`)
  })
  const choice = await ask('  Selecciona una ciudad para eliminar (0 para cancelar): ')
  const index = parseInt(choice, 10) - 1
  if (index < 0 || index >= data.cities.length) {
    console.log(yellow('\n  Operación cancelada.'))
    return
  }
  const removed = data.cities[index]
  if (!removed) {
    console.log(yellow('\n  Operación cancelada.'))
    return
  }
  data.cities.splice(index, 1)
  if (data.defaultCity === removed.name) {
    data.defaultCity = null
    console.log(yellow(`\n  ${removed.name} eliminada. La ciudad default fue removida.`))
  } else {
    console.log(green(`\n  ${removed.name} eliminada.`))
  }
}
