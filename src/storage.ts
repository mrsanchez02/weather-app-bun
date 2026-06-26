import { homedir } from 'os'
import { join } from 'path'
import type { AppData } from './types'

const DATA_FILE = join(homedir(), '.weather-data.json')

function defaultData(): AppData {
  return { defaultCity: null, cities: [], unit: 'celsius' }
}

export async function loadData(): Promise<AppData> {
  try {
    const file = Bun.file(DATA_FILE)
    const exists = await file.exists()
    if (!exists) return defaultData()
    const content = await file.text()
    return JSON.parse(content) as AppData
  } catch {
    return defaultData()
  }
}

export async function saveData(data: AppData): Promise<void> {
  await Bun.write(DATA_FILE, JSON.stringify(data, null, 2))
}
