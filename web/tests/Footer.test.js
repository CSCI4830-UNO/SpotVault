import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Footer from '@/components/Footer'

// Mock data to use in our tests
const mockSpot = {
  id: '1',
  name: 'Test Spot',
  latitude: 41.2565,
  longitude: -95.9345,
  description: 'A test description',
  tags: ['park', 'nature'],
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
}

describe('Footer Component', () => {
  
  // Test 1: The "Empty" State
  it('renders instructions when no spot is selected or pending', () => {
    render(
      <Footer 
        selectedSpot={null} 
        pendingSpot={null} 
        onDeleteSpot={jest.fn()} 
      />
    )

    const instructionText = screen.getByText(/Select a spot or click the map/i)
    expect(instructionText).toBeInTheDocument()
  })

  // Test 2: The "Pending" State
  it('renders the "New spot" message when a spot is pending', () => {
    render(
      <Footer 
        selectedSpot={null} 
        pendingSpot={{ lat: 40.0, lng: -90.0 }} 
        onDeleteSpot={jest.fn()} 
      />
    )

    const pendingText = screen.getByText(/New spot selected/i)
    expect(pendingText).toBeInTheDocument()
  })

  // Test 3: The "Selected" State (Data Display)
  it('displays spot details (coords, description, tags) when a spot is selected', () => {
    render(
      <Footer 
        selectedSpot={mockSpot} 
        pendingSpot={null} 
        onDeleteSpot={jest.fn()} 
      />
    )

    expect(screen.getByText('41.2565')).toBeInTheDocument()
    
    expect(screen.getByText('A test description')).toBeInTheDocument()

    expect(screen.getByText('park')).toBeInTheDocument()
    expect(screen.getByText('nature')).toBeInTheDocument()
  })

  // Test 4: Interaction (Delete Button)
  it('calls the onDeleteSpot function when the delete button is clicked', () => {
    // Create a mock function to track clicks
    const mockDeleteHandler = jest.fn()

    render(
      <Footer 
        selectedSpot={mockSpot} 
        pendingSpot={null} 
        onDeleteSpot={mockDeleteHandler} 
      />
    )

    const deleteButton = screen.getByRole('button', { name: /DELETE SPOT/i })
    fireEvent.click(deleteButton)

    expect(mockDeleteHandler).toHaveBeenCalledTimes(1)
  })
})