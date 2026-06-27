import { describe, it, expect } from "bun:test"
import { cyan, yellow, green, red, bold, dim } from "../../src/utils/colors"

describe("colors", () => {
  const RESET = "\x1b[0m"
  const CYAN = "\x1b[36m"
  const YELLOW = "\x1b[33m"
  const GREEN = "\x1b[32m"
  const RED = "\x1b[31m"
  const BOLD = "\x1b[1m"
  const DIM = "\x1b[2m"

  it("cyan wraps text", () => {
    expect(cyan("hello")).toBe(`${CYAN}hello${RESET}`)
  })

  it("yellow wraps text", () => {
    expect(yellow("hello")).toBe(`${YELLOW}hello${RESET}`)
  })

  it("green wraps text", () => {
    expect(green("hello")).toBe(`${GREEN}hello${RESET}`)
  })

  it("red wraps text", () => {
    expect(red("hello")).toBe(`${RED}hello${RESET}`)
  })

  it("bold wraps text", () => {
    expect(bold("hello")).toBe(`${BOLD}hello${RESET}`)
  })

  it("dim wraps text", () => {
    expect(dim("hello")).toBe(`${DIM}hello${RESET}`)
  })

  it("handles empty string", () => {
    expect(cyan("")).toBe(`${CYAN}${RESET}`)
  })
})
