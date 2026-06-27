import { describe, it, expect, beforeEach, afterAll, spyOn } from "bun:test"
import type { AppData, SavedCity } from "../../src/types/City"
import * as inputModule from "../../src/presentation/input"
import { handleDeleteCity } from "../../src/actions/removeCity"

function makeData(overrides?: Partial<AppData>): AppData {
  return { defaultCity: null, cities: [], unit: "celsius", ...overrides }
}

const madrid: SavedCity = { name: "Madrid", latitude: 40.4168, longitude: -3.7038, country: "España", timezone: "Europe/Madrid" }
const london: SavedCity = { name: "Londres", latitude: 51.5074, longitude: -0.1278, country: "Reino Unido", timezone: "Europe/London" }

afterAll(() => {
  ;(inputModule.ask as any).mockRestore()
})

describe("handleDeleteCity", () => {
  beforeEach(() => {
    spyOn(inputModule, "ask").mockReset()
  })

  it("removes a city successfully", async () => {
    spyOn(inputModule, "ask").mockResolvedValue("1")
    const logSpy = spyOn(console, "log").mockImplementation(() => {})

    const data = makeData({ cities: [madrid, london] })
    await handleDeleteCity(data)

    expect(data.cities).toHaveLength(1)
    expect(data.cities[0]?.name).toBe("Londres")
    logSpy.mockRestore()
  })

  it("shows message when no cities", async () => {
    const logSpy = spyOn(console, "log").mockImplementation(() => {})
    const data = makeData()

    await handleDeleteCity(data)

    expect(inputModule.ask).not.toHaveBeenCalled()
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("No hay ciudades"))
    logSpy.mockRestore()
  })

  it("cancels when user selects 0", async () => {
    spyOn(inputModule, "ask").mockResolvedValue("0")
    const logSpy = spyOn(console, "log").mockImplementation(() => {})

    const data = makeData({ cities: [madrid, london] })
    await handleDeleteCity(data)

    expect(data.cities).toHaveLength(2)
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("cancelada"))
    logSpy.mockRestore()
  })

  it("cancels when selection is out of range", async () => {
    spyOn(inputModule, "ask").mockResolvedValue("99")
    const logSpy = spyOn(console, "log").mockImplementation(() => {})

    const data = makeData({ cities: [madrid, london] })
    await handleDeleteCity(data)

    expect(data.cities).toHaveLength(2)
    logSpy.mockRestore()
  })

  it("clears defaultCity when removing the default city", async () => {
    spyOn(inputModule, "ask").mockResolvedValue("1")
    const logSpy = spyOn(console, "log").mockImplementation(() => {})

    const data = makeData({ defaultCity: "Madrid", cities: [madrid, london] })
    await handleDeleteCity(data)

    expect(data.cities).toHaveLength(1)
    expect(data.defaultCity).toBeNull()
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("default fue removida"))
    logSpy.mockRestore()
  })
})
