import { describe, it, expect, beforeEach, afterAll, spyOn } from "bun:test"
import type { AppData, SavedCity } from "../../src/types/City"
import * as geocodingModule from "../../src/api/geocoding"
import * as inputModule from "../../src/presentation/input"
import { handleAddCity } from "../../src/actions/addCity"

function makeData(overrides?: Partial<AppData>): AppData {
  return { defaultCity: null, cities: [], unit: "celsius", ...overrides }
}

afterAll(() => {
  ;(geocodingModule.searchCity as any).mockRestore()
  ;(inputModule.ask as any).mockRestore()
})

describe("handleAddCity", () => {
  beforeEach(() => {
    spyOn(geocodingModule, "searchCity").mockReset()
    spyOn(inputModule, "ask").mockReset()
  })

  it("adds a city successfully", async () => {
    spyOn(inputModule, "ask")
      .mockReturnValueOnce(Promise.resolve("Madrid"))
      .mockReturnValueOnce(Promise.resolve("1"))
    spyOn(geocodingModule, "searchCity")
      .mockResolvedValue([
        { name: "Madrid", latitude: 40.4168, longitude: -3.7038, country: "España", timezone: "Europe/Madrid" },
      ])

    const data = makeData()
    await handleAddCity(data)

    expect(data.cities).toHaveLength(1)
    expect(data.cities[0]?.name).toBe("Madrid")
    expect(data.cities[0]?.country).toBe("España")
  })

  it("shows error for empty city name", async () => {
    spyOn(inputModule, "ask").mockResolvedValue("")
    const logSpy = spyOn(console, "log").mockImplementation(() => {})

    const data = makeData()
    await handleAddCity(data)

    expect(data.cities).toHaveLength(0)
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("inválido"))
    logSpy.mockRestore()
  })

  it("shows message when no search results", async () => {
    spyOn(inputModule, "ask").mockResolvedValue("Atlantis")
    spyOn(geocodingModule, "searchCity").mockResolvedValue([])
    const logSpy = spyOn(console, "log").mockImplementation(() => {})

    const data = makeData()
    await handleAddCity(data)

    expect(data.cities).toHaveLength(0)
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("No se encontraron"))
    logSpy.mockRestore()
  })

  it("cancels when user selects 0", async () => {
    spyOn(inputModule, "ask")
      .mockReturnValueOnce(Promise.resolve("Madrid"))
      .mockReturnValueOnce(Promise.resolve("0"))
    spyOn(geocodingModule, "searchCity")
      .mockResolvedValue([
        { name: "Madrid", latitude: 40.4168, longitude: -3.7038, country: "España", timezone: "Europe/Madrid" },
      ])
    const logSpy = spyOn(console, "log").mockImplementation(() => {})

    const data = makeData()
    await handleAddCity(data)

    expect(data.cities).toHaveLength(0)
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("cancelada"))
    logSpy.mockRestore()
  })

  it("cancels when selection is out of range", async () => {
    spyOn(inputModule, "ask")
      .mockReturnValueOnce(Promise.resolve("Madrid"))
      .mockReturnValueOnce(Promise.resolve("99"))
    spyOn(geocodingModule, "searchCity")
      .mockResolvedValue([
        { name: "Madrid", latitude: 40.4168, longitude: -3.7038, country: "España", timezone: "Europe/Madrid" },
      ])
    const logSpy = spyOn(console, "log").mockImplementation(() => {})

    const data = makeData()
    await handleAddCity(data)

    expect(data.cities).toHaveLength(0)
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("cancelada"))
    logSpy.mockRestore()
  })

  it("shows message when city already exists", async () => {
    const existing: SavedCity = { name: "Madrid", latitude: 40.4168, longitude: -3.7038, country: "España", timezone: "Europe/Madrid" }
    spyOn(inputModule, "ask")
      .mockReturnValueOnce(Promise.resolve("Madrid"))
      .mockReturnValueOnce(Promise.resolve("1"))
    spyOn(geocodingModule, "searchCity")
      .mockResolvedValue([existing])
    const logSpy = spyOn(console, "log").mockImplementation(() => {})

    const data = makeData({ cities: [existing] })
    await handleAddCity(data)

    expect(data.cities).toHaveLength(1)
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("ya está registrada"))
    logSpy.mockRestore()
  })

  it("handles API errors gracefully", async () => {
    spyOn(inputModule, "ask").mockResolvedValue("Madrid")
    spyOn(geocodingModule, "searchCity").mockRejectedValue(new Error("API timeout"))
    const logSpy = spyOn(console, "log").mockImplementation(() => {})

    const data = makeData()
    await handleAddCity(data)

    expect(data.cities).toHaveLength(0)
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Error"))
    logSpy.mockRestore()
  })

  it("selects second city from results", async () => {
    spyOn(inputModule, "ask")
      .mockReturnValueOnce(Promise.resolve("Madrid"))
      .mockReturnValueOnce(Promise.resolve("2"))
    spyOn(geocodingModule, "searchCity")
      .mockResolvedValue([
        { name: "Madrid", latitude: 40.4168, longitude: -3.7038, country: "España", timezone: "Europe/Madrid" },
        { name: "Madrid", latitude: 41.6488, longitude: -4.7488, country: "España", timezone: "Europe/Madrid" },
      ])

    const data = makeData()
    await handleAddCity(data)

    expect(data.cities).toHaveLength(1)
    expect(data.cities[0]?.name).toBe("Madrid")
  })
})
