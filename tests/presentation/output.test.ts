import { describe, it, expect, spyOn } from "bun:test"
import { renderCityWeather, renderDailyForecast } from "../../src/presentation/output"
import type { DailyForecast } from "../../src/types/Weather"

describe("renderCityWeather", () => {
  it("renders city name and temperature", () => {
    const logSpy = spyOn(console, "log").mockImplementation(() => {})

    renderCityWeather({ name: "Madrid", country: "España" }, 25, "°C", "2024-03-04T14:00")

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Madrid"))
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("España"))
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("25°C"))
    logSpy.mockRestore()
  })

  it("renders without country", () => {
    const logSpy = spyOn(console, "log").mockImplementation(() => {})

    renderCityWeather({ name: "Madrid", country: "" }, 25, "°C")

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Madrid"))
    logSpy.mockRestore()
  })

  it("renders without time", () => {
    const logSpy = spyOn(console, "log").mockImplementation(() => {})

    renderCityWeather({ name: "Madrid", country: "España" }, 25, "°C")

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("25°C"))
    logSpy.mockRestore()
  })

  it("renders fahrenheit symbol", () => {
    const logSpy = spyOn(console, "log").mockImplementation(() => {})

    renderCityWeather({ name: "Madrid", country: "España" }, 77, "°F")

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("77°F"))
    logSpy.mockRestore()
  })
})

describe("renderDailyForecast", () => {
  const daily: DailyForecast = {
    time: ["2024-03-04", "2024-03-05", "2024-03-06", "2024-03-07", "2024-03-08", "2024-03-09", "2024-03-10"],
    temperature_2m_max: [25, 24, 23, 22, 21, 20, 19],
    temperature_2m_min: [15, 14, 13, 12, 11, 10, 9],
    weathercode: [0, 1, 2, 45, 61, 95, 99],
  }

  it("renders 7 day forecast", () => {
    const logSpy = spyOn(console, "log").mockImplementation(() => {})

    renderDailyForecast(daily, "°C")

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("PRONÓSTICO 7 DÍAS"))
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("25°C"))
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Despejado"))
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Tormenta con granizo intenso"))
    logSpy.mockRestore()
  })

  it("renders all 7 days", () => {
    const logSpy = spyOn(console, "log").mockImplementation(() => {})

    renderDailyForecast(daily, "°C")

    const consoleCalls = logSpy.mock.calls.filter(c => c[0]?.includes?.("lun") || c[0]?.includes?.("mar") || c[0]?.includes?.("mié") || c[0]?.includes?.("jue") || c[0]?.includes?.("vie") || c[0]?.includes?.("sáb") || c[0]?.includes?.("dom"))
    expect(consoleCalls.length).toBe(7)
    logSpy.mockRestore()
  })
})
