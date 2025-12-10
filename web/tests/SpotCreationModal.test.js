import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import SpotCreationModal from '@/components/SpotCreationModal'

describe('SpotCreationModal Component', () => {
  
  // Test 1: Modal Renders
  it('renders the modal with title and buttons', () => {
    const mockOnSave = jest.fn()
    const mockOnCancel = jest.fn()

    render(
      <SpotCreationModal 
        onSave={mockOnSave} 
        onCancel={mockOnCancel} 
      />
    )

    expect(screen.getByText('Create New Spot')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Save Spot/i })).toBeInTheDocument()
  })

  // Test 2: Cancel Button Works
  it('calls onCancel when cancel button is clicked', () => {
    const mockOnSave = jest.fn()
    const mockOnCancel = jest.fn()

    render(
      <SpotCreationModal 
        onSave={mockOnSave} 
        onCancel={mockOnCancel} 
      />
    )

    const cancelButton = screen.getByRole('button', { name: /Cancel/i })
    fireEvent.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalledTimes(1)
  })

  // Test 3: Save Button Works
  it('calls onSave when save button is clicked with name filled', () => {
    const mockOnSave = jest.fn()
    const mockOnCancel = jest.fn()

    window.alert = jest.fn()

    render(
      <SpotCreationModal 
        onSave={mockOnSave} 
        onCancel={mockOnCancel} 
      />
    )

    // Fill in name field
    const spotNameLabel = screen.getByText(/Spot Name/i)
    const nameInput = spotNameLabel.parentElement.querySelector('input')
    fireEvent.change(nameInput, { target: { value: 'Test Spot' } })

    // Click save button
    const saveButton = screen.getByRole('button', { name: /Save Spot/i })
    fireEvent.click(saveButton)

    expect(mockOnSave).toHaveBeenCalledTimes(1)
  })
})
