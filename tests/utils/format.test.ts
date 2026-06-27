import { describe, it, expect } from "bun:test"
import { formatDate, formatTemperature, formatTime } from "../../src/utils/format"

describe("formatDate", () => {
  it("formats a date string correctly", () => {
    const result = formatDate("2024-12-25")
    expect(result).toMatch(/^\S{3} 25\/12$/)
  })

  it("uses day names in spanish", () => {
    expect(formatDate("2024-03-04")).toMatch(/^lun/)
    expect(formatDate("2024-03-05")).toMatch(/^mar/)
    expect(formatDate("2024-03-06")).toMatch(/^mié/)
    expect(formatDate("2024-03-07")).toMatch(/^jue/)
    expect(formatDate("2024-03-08")).toMatch(/^vie/)
    expect(formatDate("2024-03-09")).toMatch(/^sáb/)
    expect(formatDate("2024-03-10")).toMatch(/^dom/)
  })

  it("handles single digit day and month", () => {
    const result = formatDate("2024-01-05")
    expect(result).toMatch(/^\w{3} 05\/01$/)
  })
})

describe("formatTemperature", () => {
  it("formats integer without decimals", () => {
    expect(formatTemperature(25)).toBe("25")
  })

  it("formats float with one decimal", () => {
    expect(formatTemperature(25.5)).toBe("25.5")
  })

  it("returns '--' for null", () => {
    expect(formatTemperature(null)).toBe("--")
  })

  it("returns '--' for undefined", () => {
    expect(formatTemperature(undefined)).toBe("--")
  })

  it("formats zero as '0'", () => {
    expect(formatTemperature(0)).toBe("0")
  })

  it("formats negative temperatures", () => {
    expect(formatTemperature(-5)).toBe("-5")
  })
})

describe("formatTime", () => {
  it("extracts time from ISO string", () => {
    expect(formatTime("2024-03-04T14:30:00")).toBe("14:30:00")
  })

  it("returns string unchanged if no T separator", () => {
    expect(formatTime("14:30:00")).toBe("14:30:00")
  })

  it("handles empty string", () => {
    expect(formatTime("")).toBe("")
  })
})
