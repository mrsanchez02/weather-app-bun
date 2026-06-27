import { describe, it, expect, mock, beforeEach, beforeAll, afterAll } from "bun:test"
import type { SavedCity } from "../../src/types/City"

const mockExists = mock(() => Promise.resolve(true))
const mockText = mock(() => Promise.resolve("[]"))
const mockBunFileObj = { exists: mockExists, text: mockText } as any
const mockBunFile = mock(() => mockBunFileObj)
const mockBunWrite = mock(() => Promise.resolve(0))

const origFile = Bun.file
const origWrite = Bun.write

beforeAll(() => {
  Bun.file = mockBunFile as any
  Bun.write = mockBunWrite as any
})

beforeEach(() => {
  mockBunFile.mockReset()
  mockBunWrite.mockReset()
  mockBunFile.mockReturnValue(mockBunFileObj)
  mockBunWrite.mockResolvedValue(0)
  mockExists.mockReset()
  mockText.mockReset()
  mockExists.mockResolvedValue(true)
})

afterAll(() => {
  Bun.file = origFile
  Bun.write = origWrite
})

const { loadCities, saveCities } = await import("../../src/storage/citiesStorage")

describe("loadCities", () => {
  it("returns parsed cities when file exists and is valid", async () => {
    const cities: SavedCity[] = [
      { name: "Madrid", latitude: 40.4168, longitude: -3.7038, country: "España", timezone: "Europe/Madrid" },
    ]
    mockText.mockResolvedValue(JSON.stringify(cities))

    const result = await loadCities()

    expect(result).toHaveLength(1)
    expect(result[0]?.name).toBe("Madrid")
  })

  it("returns empty array when file does not exist", async () => {
    mockExists.mockResolvedValue(false)

    const result = await loadCities()

    expect(result).toEqual([])
  })

  it("returns empty array when JSON is invalid", async () => {
    mockText.mockResolvedValue("not json")

    const result = await loadCities()

    expect(result).toEqual([])
  })

  it("returns empty array when text() throws", async () => {
    mockText.mockRejectedValue(new Error("read error"))

    const result = await loadCities()

    expect(result).toEqual([])
  })
})

describe("saveCities", () => {
  it("writes cities as JSON", async () => {
    const cities: SavedCity[] = [
      { name: "Madrid", latitude: 40.4168, longitude: -3.7038, country: "España", timezone: "Europe/Madrid" },
    ]

    await saveCities(cities)

    expect(mockBunWrite).toHaveBeenCalledTimes(1)
    const writeArg = mockBunWrite.mock.calls[0]?.[1] as string
    expect(JSON.parse(writeArg)).toEqual(cities)
  })

  it("writes empty array when no cities", async () => {
    await saveCities([])

    expect(mockBunWrite).toHaveBeenCalledTimes(1)
  })
})
