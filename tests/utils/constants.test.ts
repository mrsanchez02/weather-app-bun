import { describe, it, expect } from "bun:test"
import { getWeatherDescription } from "../../src/utils/constants"

describe("getWeatherDescription", () => {
  it("returns 'Despejado' for code 0", () => {
    expect(getWeatherDescription(0)).toBe("Despejado")
  })

  it("returns 'Mayormente despejado' for code 1", () => {
    expect(getWeatherDescription(1)).toBe("Mayormente despejado")
  })

  it("returns 'Tormenta con granizo intenso' for code 99", () => {
    expect(getWeatherDescription(99)).toBe("Tormenta con granizo intenso")
  })

  it("returns 'Desconocido' for unknown code", () => {
    expect(getWeatherDescription(999)).toBe("Desconocido")
  })

  it("returns 'Desconocido' for negative code", () => {
    expect(getWeatherDescription(-1)).toBe("Desconocido")
  })

  it("returns 'Niebla' for code 45", () => {
    expect(getWeatherDescription(45)).toBe("Niebla")
  })

  it("returns 'Tormenta' for code 95", () => {
    expect(getWeatherDescription(95)).toBe("Tormenta")
  })
})
