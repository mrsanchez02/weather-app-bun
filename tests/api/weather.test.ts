import { describe, it, expect, mock } from "bun:test"
import { getForecast } from "../../src/api/weather"

const mockForecast = {
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

describe("getForecast", () => {
  it("returns forecast data on success", async () => {
    const mockFetch = mock(() => Promise.resolve(new Response(JSON.stringify(mockForecast), { status: 200 })))

    const result = await getForecast(40.4168, -3.7038, "celsius", mockFetch as any)

    expect(result.current.temperature_2m).toBe(22.5)
    expect(result.daily?.time).toHaveLength(2)
  })

  it("includes latitude and longitude in the url", async () => {
    const mockFetch = mock(() => Promise.resolve(new Response(JSON.stringify(mockForecast), { status: 200 })))

    await getForecast(40.4168, -3.7038, "celsius", mockFetch as any)

    const calledUrl = mockFetch.mock.calls[0]?.[0] as string
    expect(calledUrl).toContain("latitude=40.4168")
    expect(calledUrl).toContain("longitude=-3.7038")
  })

  it("throws on non-ok response", async () => {
    const mockFetch = mock(() => Promise.resolve(new Response("Bad Request", { status: 400 })))

    await expect(getForecast(0, 0, "celsius", mockFetch as any)).rejects.toThrow("Error en forecast: 400")
  })

  it("throws on network error", async () => {
    const mockFetch = mock(() => { throw new Error("Network error") })

    await expect(getForecast(0, 0, "celsius", mockFetch as any)).rejects.toThrow("Network error")
  })
})
