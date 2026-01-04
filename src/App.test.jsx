import { render, screen } from "@testing-library/react"
import App from "./App.jsx"

test("renders app title", () => {
  render(<App />)
  expect(screen.getByTestId("app-title")).toBeInTheDocument()
})
