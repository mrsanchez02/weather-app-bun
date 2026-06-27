import { describe, it, expect, beforeEach, afterAll, spyOn } from "bun:test"
import type { AppData, SavedCity } from "../../src/types/City"
import type { ForecastResponse } from "../../src/types/Weather"
import * as weatherModule from "../../src/api/weather"
import { handleDefaultCityWeather, handleAllCitiesWeather } from "../../src/actions/getWeather"

const mockForecast: ForecastResponse = {
  current: { time: "2024-03-04T14:00", temperature_2m: 22.5 },
  current_units: { temperature_2m: "°C" },
  daily: {
    time: ["2024-03-04", "2024-03-05"],
    temperature_2m_max: [25, 24],
    temperature_2m_min: [15, 14],
    weathercode: [0, 1],
  },
  daily_units: { temperature_2m_max: "°C", temperature_2m_min: "°C" },
}

function makeData(overrides?: Partial<AppData>): AppData {
  return { defaultCity: null, cities: [], unit: "celsius", ...overrides }
}

const madrid: SavedCity = { name: "Madrid", latitude: 40.4168, longitude: -3.7038, country: "España", timezone: "Europe/Madrid" }
const london: SavedCity = { name: "Londres", latitude: 51.5074, longitude: -0.1278, country: "Reino Unido", timezone: "Europe/London" }

afterAll(() => {
  ;(weatherModule.getForecast as any).mockRestore()
})

describe("handleDefaultCityWeather", () => {
  beforeEach(() => {
    spyOn(weatherModule, "getForecast").mockReset()
    spyOn(weatherModule, "getForecast").mockResolvedValue(mockForecast)
  })

  it("fetches and renders weather for default city", async () => {
    const logSpy = spyOn(console, "log").mockImplementation(() => {})
    const data = makeData({ defaultCity: "Madrid", cities: [madrid] })

    await handleDefaultCityWeather(data)

    expect(weatherModule.getForecast).toHaveBeenCalledWith(40.4168, -3.7038, "celsius")
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Madrid"))
    logSpy.mockRestore()
  })

  it("shows message when no default city configured", async () => {
    const logSpy = spyOn(console, "log").mockImplementation(() => {})
    const data = makeData()

    await handleDefaultCityWeather(data)

    expect(weatherModule.getForecast).not.toHaveBeenCalled()
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("No hay ciudad default"))
    logSpy.mockRestore()
  })

  it("shows message when default city not in list", async () => {
    const logSpy = spyOn(console, "log").mockImplementation(() => {})
    const data = makeData({ defaultCity: "Paris", cities: [madrid] })

    await handleDefaultCityWeather(data)

    expect(weatherModule.getForecast).not.toHaveBeenCalled()
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("no está en la lista"))
    logSpy.mockRestore()
  })

  it("handles API errors gracefully", async () => {
    spyOn(weatherModule, "getForecast").mockRejectedValue(new Error("API error"))
    const logSpy = spyOn(console, "log").mockImplementation(() => {})

    const data = makeData({ defaultCity: "Madrid", cities: [madrid] })
    await handleDefaultCityWeather(data)

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Error"))
    logSpy.mockRestore()
  })

  it("uses fahrenheit unit when configured", async () => {
    const logSpy = spyOn(console, "log").mockImplementation(() => {})
    const data = makeData({ defaultCity: "Madrid", cities: [madrid], unit: "fahrenheit" })

    await handleDefaultCityWeather(data)

    expect(weatherModule.getForecast).toHaveBeenCalledWith(40.4168, -3.7038, "fahrenheit")
    logSpy.mockRestore()
  })
})

describe("handleAllCitiesWeather", () => {
  beforeEach(() => {
    spyOn(weatherModule, "getForecast").mockReset()
    spyOn(weatherModule, "getForecast").mockResolvedValue(mockForecast)
  })

  it("fetches weather for all cities", async () => {
    const logSpy = spyOn(console, "log").mockImplementation(() => {})
    const data = makeData({ cities: [madrid, london] })

    await handleAllCitiesWeather(data)

    expect(weatherModule.getForecast).toHaveBeenCalledTimes(2)
    expect(weatherModule.getForecast).toHaveBeenCalledWith(40.4168, -3.7038, "celsius")
    expect(weatherModule.getForecast).toHaveBeenCalledWith(51.5074, -0.1278, "celsius")
    logSpy.mockRestore()
  })

  it("shows message when no cities", async () => {
    const logSpy = spyOn(console, "log").mockImplementation(() => {})
    const data = makeData()

    await handleAllCitiesWeather(data)

    expect(weatherModule.getForecast).not.toHaveBeenCalled()
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("No hay ciudades"))
    logSpy.mockRestore()
  })

  it("continues to next city when one fails", async () => {
    spyOn(weatherModule, "getForecast")
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValueOnce(mockForecast)
    const logSpy = spyOn(console, "log").mockImplementation(() => {})

    const data = makeData({ cities: [madrid, london] })
    await handleAllCitiesWeather(data)

    expect(weatherModule.getForecast).toHaveBeenCalledTimes(2)
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Error"))
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Madrid"))
    logSpy.mockRestore()
  })
})
