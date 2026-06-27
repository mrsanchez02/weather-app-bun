import { homedir } from 'os'
import { join } from 'path'
import type { SavedCity } from '../types/City'

const DATA_FILE = join(homedir(), '.weather-cities.json')

export async function loadCities(): Promise<SavedCity[]> {
  try {
    const file = Bun.file(DATA_FILE)
    const exists = await file.exists()
    if (!exists) return []
    const content = await file.text()
    return JSON.parse(content) as SavedCity[]
  } catch {
    return []
  }
}

export async function saveCities(cities: SavedCity[]): Promise<void> {
  await Bun.write(DATA_FILE, JSON.stringify(cities, null, 2))
}
