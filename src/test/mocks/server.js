// - Mock Service Worker server setup
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)

// Component-specific test utilities
// src/components/__tests__/utils/taskTestUtils.js
import { screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

export const addTask = async (title, priority = 'medium', category = 'personal') => {
  const user = userEvent.setup()

  const titleInput = screen.getByPlaceholderText('Enter task title...')
  const prioritySelect = screen.getByDisplayValue('Medium Priority')
  const categorySelect = screen.getByDisplayValue('Personal')
  const addButton = screen.getByRole('button', { name: /add task/i })

  await user.type(titleInput, title)
  if (priority !== 'medium') {
    await user.selectOptions(prioritySelect, priority)
  }
  if (category !== 'personal') {
    await user.selectOptions(categorySelect, category)
  }
  await user.click(addButton)
}

export const toggleTask = async (taskTitle) => {
  const taskElement = screen.getByText(taskTitle)
  const taskContainer = taskElement.closest('div')
  const toggleButton = taskContainer.querySelector('[role="button"]')

  await userEvent.click(toggleButton)
}

export const deleteTask = async (taskTitle) => {
  const taskElement = screen.getByText(taskTitle)
  const taskContainer = taskElement.closest('div')
  const deleteButton = taskContainer.querySelector('[data-testid="delete-button"]')

  await userEvent.click(deleteButton)
}

export const editTask = async (currentTitle, newTitle) => {
  const taskElement = screen.getByText(currentTitle)
  const taskContainer = taskElement.closest('div')
  const editButton = taskContainer.querySelector('[data-testid="edit-button"]')

  await userEvent.click(editButton)

  const input = screen.getByDisplayValue(currentTitle)
  await userEvent.clear(input)
  await userEvent.type(input, newTitle)

  const saveButton = taskContainer.querySelector('[data-testid="save-button"]')
  await userEvent.click(saveButton)
}