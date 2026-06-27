import { homedir } from 'os'
import { join } from 'path'

interface Settings {
  defaultCity: string | null
  unit: 'celsius' | 'fahrenheit'
}

const DATA_FILE = join(homedir(), '.weather-settings.json')

function defaultSettings(): Settings {
  return { defaultCity: null, unit: 'celsius' }
}

export async function loadSettings(): Promise<Settings> {
  try {
    const file = Bun.file(DATA_FILE)
    const exists = await file.exists()
    if (!exists) return defaultSettings()
    const content = await file.text()
    return JSON.parse(content) as Settings
  } catch {
    return defaultSettings()
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  await Bun.write(DATA_FILE, JSON.stringify(settings, null, 2))
}
