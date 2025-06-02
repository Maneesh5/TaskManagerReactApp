import { render } from '@testing-library/react'
import { ThemeContext } from '../context/ThemeContext'
import { vi } from 'vitest'

// Custom render function with providers
export const renderWithProviders = (
  ui,
  {
    isDark = false,
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => {
    return (
      <ThemeContext.Provider value={{ isDark, setIsDark: vi.fn() }}>
        {children}
      </ThemeContext.Provider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Create mock data generators
export const createMockTask = (overrides = {}) => ({
  id: Math.floor(Math.random() * 1000),
  title: 'Mock Task',
  priority: 'medium',
  category: 'personal',
  completed: false,
  createdAt: new Date().toISOString(),
  ...overrides
})

export const createMockTasks = (count = 3) => {
  return Array.from({ length: count }, (_, index) =>
    createMockTask({
      id: index + 1,
      title: `Task ${index + 1}`,
      priority: ['low', 'medium', 'high'][index % 3],
      category: ['personal', 'work', 'shopping'][index % 3],
    })
  )
}