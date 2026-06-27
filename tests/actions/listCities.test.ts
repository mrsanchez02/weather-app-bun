import { describe, it, expect, spyOn } from "bun:test"
import type { AppData, SavedCity } from "../../src/types/City"
const { handleListCities } = await import("../../src/actions/listCities")

function makeData(overrides?: Partial<AppData>): AppData {
  return { defaultCity: null, cities: [], unit: "celsius", ...overrides }
}

describe("handleListCities", () => {
  it("lists all saved cities", () => {
    const madrid: SavedCity = { name: "Madrid", latitude: 40.4168, longitude: -3.7038, country: "España", timezone: "Europe/Madrid" }
    const london: SavedCity = { name: "Londres", latitude: 51.5074, longitude: -0.1278, country: "Reino Unido", timezone: "Europe/London" }
    const logSpy = spyOn(console, "log").mockImplementation(() => {})
    const data = makeData({ cities: [madrid, london] })

    handleListCities(data)

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Madrid"))
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Londres"))
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Ciudades guardadas"))
    logSpy.mockRestore()
  })

  it("marks default city indicator", () => {
    const madrid: SavedCity = { name: "Madrid", latitude: 40.4168, longitude: -3.7038, country: "España", timezone: "Europe/Madrid" }
    const london: SavedCity = { name: "Londres", latitude: 51.5074, longitude: -0.1278, country: "Reino Unido", timezone: "Europe/London" }
    const logSpy = spyOn(console, "log").mockImplementation(() => {})
    const data = makeData({ defaultCity: "Madrid", cities: [madrid, london] })

    handleListCities(data)

    const calls = logSpy.mock.calls.map(c => c[0] as string)
    const madridLine = calls.find(c => c.includes("Madrid"))
    expect(madridLine).toContain("(default)")
    const londonLine = calls.find(c => c.includes("Londres"))
    expect(londonLine).not.toContain("(default)")
    logSpy.mockRestore()
  })

  it("shows message when no cities", () => {
    const logSpy = spyOn(console, "log").mockImplementation(() => {})
    const data = makeData()

    handleListCities(data)

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("No hay ciudades"))
    logSpy.mockRestore()
  })
})
