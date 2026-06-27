import { describe, it, expect, mock } from "bun:test"
import { searchCity } from "../../src/api/geocoding"

describe("searchCity", () => {
  it("returns parsed results on success", async () => {
    const results = [
      { name: "Madrid", latitude: 40.4168, longitude: -3.7038, country: "España", timezone: "Europe/Madrid" },
    ]
    const mockFetch = mock(() => Promise.resolve(new Response(JSON.stringify({ results }), { status: 200 })))

    const data = await searchCity("Madrid", mockFetch as any)

    expect(data).toHaveLength(1)
    expect(data[0]?.name).toBe("Madrid")
    expect(data[0]?.country).toBe("España")
  })

  it("returns empty array when no results", async () => {
    const mockFetch = mock(() => Promise.resolve(new Response(JSON.stringify({ results: null }), { status: 200 })))

    const data = await searchCity("UnknownCity", mockFetch as any)
    expect(data).toEqual([])
  })

  it("returns empty array when results is empty", async () => {
    const mockFetch = mock(() => Promise.resolve(new Response(JSON.stringify({ results: [] }), { status: 200 })))

    const data = await searchCity("", mockFetch as any)
    expect(data).toEqual([])
  })

  it("throws on non-ok response", async () => {
    const mockFetch = mock(() => Promise.resolve(new Response("Not Found", { status: 404 })))

    await expect(searchCity("Madrid", mockFetch as any)).rejects.toThrow("Error en geocoding: 404")
  })

  it("throws on network error", async () => {
    const mockFetch = mock(() => { throw new Error("Network error") })

    await expect(searchCity("Madrid", mockFetch as any)).rejects.toThrow("Network error")
  })

  it("encodes the query parameter", async () => {
    const mockFetch = mock(() => Promise.resolve(new Response(JSON.stringify({ results: [] }), { status: 200 })))

    await searchCity("San José", mockFetch as any)

    const calledUrl = mockFetch.mock.calls[0]?.[0] as string
    expect(calledUrl).toContain(encodeURIComponent("San José"))
    expect(calledUrl).not.toContain("San José")
  })
})
