import { cyan, yellow, dim } from '../utils/colors'
import type { AppData } from '../types/City'

export function handleListCities(data: AppData): void {
  if (data.cities.length === 0) {
    console.log(yellow('\n  No hay ciudades registradas.'))
    return
  }
  console.log(cyan('\n  Ciudades guardadas:'))
  data.cities.forEach((c, i) => {
    const isDefault = c.name === data.defaultCity ? dim(' (default)') : ''
    console.log(`  ${i + 1}. ${c.name}, ${c.country}${isDefault}`)
  })
}
