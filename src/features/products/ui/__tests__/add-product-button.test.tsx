import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { AddProductButton } from "../add-product-button"

describe("AddProductButton", () => {
  it("renders button with plus icon and text", () => {
    render(<AddProductButton onClick={() => {}} />)
    const button = screen.getByRole("button", { name: /Добавить/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent("Добавить")
  })

  it("calls onClick when clicked", async () => {
    const handleClick = vi.fn()
    render(<AddProductButton onClick={handleClick} />)
    await userEvent.click(screen.getByRole("button"))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("has correct styling classes", () => {
    render(<AddProductButton onClick={() => {}} />)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("bg-primary")
    expect(button).toHaveClass("hover:bg-primary-dark")
    expect(button).toHaveClass("text-white")
  })
})
