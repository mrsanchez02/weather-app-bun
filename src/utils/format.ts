const dayNames = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  const dayName = dayNames[date.getDay()] ?? '???'
  const parts = dateStr.split('-')
  return `${dayName} ${parts[2]}/${parts[1]}`
}

export function formatTemperature(temp: number | null | undefined): string {
  if (temp == null) return '--'
  return Number.isInteger(temp) ? temp.toString() : temp.toFixed(1)
}

export function formatTime(time: string): string {
  return time.includes('T') ? (time.split('T')[1] ?? time) : time
}
