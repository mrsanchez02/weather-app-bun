const Reset = '\x1b[0m'
const Cyan = '\x1b[36m'
const Yellow = '\x1b[33m'
const Green = '\x1b[32m'
const Red = '\x1b[31m'
const Bold = '\x1b[1m'
const Dim = '\x1b[2m'

export function cyan(text: string): string {
  return `${Cyan}${text}${Reset}`
}

export function yellow(text: string): string {
  return `${Yellow}${text}${Reset}`
}

export function green(text: string): string {
  return `${Green}${text}${Reset}`
}

export function red(text: string): string {
  return `${Red}${text}${Reset}`
}

export function bold(text: string): string {
  return `${Bold}${text}${Reset}`
}

export function dim(text: string): string {
  return `${Dim}${text}${Reset}`
}
