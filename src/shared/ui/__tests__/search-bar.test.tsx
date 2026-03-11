import { SearchBar } from "@/shared/ui"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

describe("SearchBar", () => {
  it("renders input with placeholder", () => {
    render(<SearchBar value="" onChange={() => {}} />)
    expect(screen.getByPlaceholderText("Найти")).toBeInTheDocument()
  })

  it("displays the provided value", () => {
    render(<SearchBar value="test query" onChange={() => {}} />)
    expect(screen.getByDisplayValue("test query")).toBeInTheDocument()
  })

  it("calls onChange when user types", async () => {
    const handleChange = vi.fn()
    render(<SearchBar value="" onChange={handleChange} />)
    const input = screen.getByPlaceholderText("Найти")
    await userEvent.type(input, "abc")
    expect(handleChange).toHaveBeenCalledTimes(3)
    expect(handleChange).toHaveBeenCalledWith("a")
    expect(handleChange).toHaveBeenCalledWith("b")
    expect(handleChange).toHaveBeenCalledWith("c")
  })

  it("applies custom className", () => {
    render(<SearchBar value="" onChange={() => {}} className="custom-class" />)
    expect(screen.getByTestId("search-container")).toHaveClass("custom-class")
  })
})
