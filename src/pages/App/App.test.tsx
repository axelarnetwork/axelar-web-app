import React from "react"
import { render, screen } from "@testing-library/react"
import Index from "./index"

test("renders learn react link", () => {
  render(<Index />)
  const linkElement = screen.getByText(/Click me!/i)
  expect(linkElement).toBeInTheDocument()
})
