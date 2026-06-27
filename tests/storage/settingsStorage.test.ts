import { describe, it, expect, mock, beforeEach, afterAll, beforeAll } from "bun:test"

const mockExists = mock(() => Promise.resolve(true))
const mockText = mock(() => Promise.resolve('{"defaultCity":null,"unit":"celsius"}'))
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
  mockText.mockResolvedValue('{"defaultCity":null,"unit":"celsius"}')
})

afterAll(() => {
  Bun.file = origFile
  Bun.write = origWrite
})

const { loadSettings, saveSettings } = await import("../../src/storage/settingsStorage")

describe("loadSettings", () => {
  it("returns parsed settings when file exists", async () => {
    mockText.mockResolvedValue(JSON.stringify({ defaultCity: "Madrid", unit: "celsius" }))

    const result = await loadSettings()

    expect(result.defaultCity).toBe("Madrid")
    expect(result.unit).toBe("celsius")
  })

  it("returns default settings when file does not exist", async () => {
    mockExists.mockResolvedValue(false)

    const result = await loadSettings()

    expect(result.defaultCity).toBeNull()
    expect(result.unit).toBe("celsius")
  })

  it("returns default settings when JSON is invalid", async () => {
    mockText.mockResolvedValue("not json")

    const result = await loadSettings()

    expect(result.defaultCity).toBeNull()
    expect(result.unit).toBe("celsius")
  })

  it("returns default settings when text() throws", async () => {
    mockText.mockRejectedValue(new Error("read error"))

    const result = await loadSettings()

    expect(result.defaultCity).toBeNull()
    expect(result.unit).toBe("celsius")
  })

  it("supports fahrenheit unit", async () => {
    mockText.mockResolvedValue(JSON.stringify({ defaultCity: null, unit: "fahrenheit" }))

    const result = await loadSettings()

    expect(result.unit).toBe("fahrenheit")
  })
})

describe("saveSettings", () => {
  it("writes settings as JSON", async () => {
    const settings = { defaultCity: "Madrid", unit: "fahrenheit" }

    await saveSettings(settings)

    expect(mockBunWrite).toHaveBeenCalledTimes(1)
    const writeArg = mockBunWrite.mock.calls[0]?.[1] as string
    expect(JSON.parse(writeArg)).toEqual(settings)
  })
})
