/**
 * Unit Tests for spotStorage.ts
 * 
 * Testing Framework: Jest
 * 
 * These tests follow the six principles of good unit testing:
 * 1. Automatic - Tests run without manual intervention
 * 2. Atomic - Each test verifies one specific behavior
 * 3. Single Responsibility - Each test has one clear purpose
 * 4. Independent - Tests don't depend on execution order or shared state
 * 5. Repeatable - Same results every time they run
 * 6. Self-Verifying - Clear pass/fail without manual inspection
 */

import {
  getAllSpots,
  saveSpot,
  deleteSpot,
  getSpotById,
  generateSpotId,
} from './spotStorage';
import { Spot } from '@/types/spot';

// Mock localStorage before each test to ensure independence
beforeEach(() => {
  // Clear localStorage before each test (ensures Independent principle)
  localStorage.clear();
  // Reset all mocks
  jest.clearAllMocks();
});

describe('getAllSpots', () => {
  test('should return empty array when localStorage is empty', () => {
    // Arrange: localStorage is empty (cleared in beforeEach)
    
    // Act
    const result = getAllSpots();
    
    // Assert: Atomic - tests one specific behavior
    expect(result).toEqual([]);
  });

  test('should return all spots from localStorage', () => {
    // Arrange: Set up test data
    const testSpots: Spot[] = [
      {
        id: 'spot_1',
        name: 'Test Spot 1',
        description: 'Description 1',
        latitude: 41.2565,
        longitude: -95.9345,
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
      },
      {
        id: 'spot_2',
        name: 'Test Spot 2',
        description: 'Description 2',
        createdAt: '2025-01-02',
        updatedAt: '2025-01-02',
      },
    ];
    localStorage.setItem('spotvault_spots', JSON.stringify(testSpots));
    
    // Act
    const result = getAllSpots();
    
    // Assert: Single Responsibility - verifies retrieval of all spots
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(testSpots[0]);
    expect(result[1]).toEqual(testSpots[1]);
  });

  test('should return empty array when localStorage has invalid JSON', () => {
    // Arrange: Set invalid JSON
    localStorage.setItem('spotvault_spots', 'invalid-json{');
    
    // Act
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const result = getAllSpots();
    
    // Assert: Atomic - tests error handling
    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

describe('saveSpot', () => {
  test('should save a new spot to localStorage', () => {
    // Arrange: Create a new spot
    const newSpot: Spot = {
      id: 'spot_new',
      name: 'New Spot',
      description: 'A new location',
      latitude: 40.7128,
      longitude: -74.0060,
      createdAt: '2025-01-15',
      updatedAt: '2025-01-15',
    };
    
    // Act: Save the spot
    saveSpot(newSpot);
    
    // Assert: Single Responsibility - verifies new spot is saved
    const savedSpots = getAllSpots();
    expect(savedSpots).toHaveLength(1);
    expect(savedSpots[0]).toEqual(newSpot);
  });

  test('should update an existing spot when spot with same ID already exists', () => {
    // Arrange: Create and save initial spot
    const initialSpot: Spot = {
      id: 'spot_existing',
      name: 'Original Name',
      description: 'Original description',
      createdAt: '2025-01-10',
      updatedAt: '2025-01-10',
    };
    saveSpot(initialSpot);
    
    // Arrange: Create updated spot with same ID
    const updatedSpot: Spot = {
      id: 'spot_existing',
      name: 'Updated Name',
      description: 'Updated description',
      latitude: 41.2565,
      longitude: -95.9345,
      createdAt: '2025-01-10',
      updatedAt: '2025-01-15',
    };
    
    // Act: Save updated spot
    saveSpot(updatedSpot);
    
    // Assert: Atomic - verifies update behavior only
    const savedSpots = getAllSpots();
    expect(savedSpots).toHaveLength(1); // Still only one spot
    expect(savedSpots[0]).toEqual(updatedSpot); // But updated
  });

  test('should handle multiple spots correctly', () => {
    // Arrange: Save multiple spots
    const spot1: Spot = {
      id: 'spot_1',
      name: 'Spot 1',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
    };
    const spot2: Spot = {
      id: 'spot_2',
      name: 'Spot 2',
      createdAt: '2025-01-02',
      updatedAt: '2025-01-02',
    };
    
    // Act
    saveSpot(spot1);
    saveSpot(spot2);
    
    // Assert: Independent - works regardless of other tests
    const savedSpots = getAllSpots();
    expect(savedSpots).toHaveLength(2);
    expect(savedSpots.map(s => s.id)).toContain('spot_1');
    expect(savedSpots.map(s => s.id)).toContain('spot_2');
  });
});

describe('deleteSpot', () => {
  test('should delete a spot by ID from localStorage', () => {
    // Arrange: Save a spot first
    const spotToDelete: Spot = {
      id: 'spot_to_delete',
      name: 'Spot to Delete',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
    };
    const spotToKeep: Spot = {
      id: 'spot_to_keep',
      name: 'Spot to Keep',
      createdAt: '2025-01-02',
      updatedAt: '2025-01-02',
    };
    saveSpot(spotToDelete);
    saveSpot(spotToKeep);
    
    // Act: Delete one spot
    deleteSpot('spot_to_delete');
    
    // Assert: Single Responsibility - verifies deletion
    const remainingSpots = getAllSpots();
    expect(remainingSpots).toHaveLength(1);
    expect(remainingSpots[0].id).toBe('spot_to_keep');
    expect(remainingSpots[0].id).not.toBe('spot_to_delete');
  });

  test('should not throw error when deleting non-existent spot', () => {
    // Arrange: localStorage is empty
    
    // Act & Assert: Atomic - tests error handling for non-existent spot
    expect(() => deleteSpot('non_existent_id')).not.toThrow();
    const spots = getAllSpots();
    expect(spots).toEqual([]);
  });

  test('should handle deleting from empty storage', () => {
    // Arrange: Ensure localStorage is empty
    expect(getAllSpots()).toEqual([]);
    
    // Act
    deleteSpot('any_id');
    
    // Assert: Repeatable - same result every time
    const spots = getAllSpots();
    expect(spots).toEqual([]);
  });
});

describe('getSpotById', () => {
  test('should return spot when spot with given ID exists', () => {
    // Arrange: Save a spot
    const targetSpot: Spot = {
      id: 'spot_target',
      name: 'Target Spot',
      description: 'This is the target',
      latitude: 40.7580,
      longitude: -73.9855,
      tags: ['test', 'target'],
      createdAt: '2025-01-15',
      updatedAt: '2025-01-15',
    };
    saveSpot(targetSpot);
    
    // Act
    const result = getSpotById('spot_target');
    
    // Assert: Self-Verifying - clear pass/fail
    expect(result).not.toBeNull();
    expect(result).toEqual(targetSpot);
    expect(result?.id).toBe('spot_target');
  });

  test('should return null when spot with given ID does not exist', () => {
    // Arrange: Save a different spot
    const otherSpot: Spot = {
      id: 'spot_other',
      name: 'Other Spot',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
    };
    saveSpot(otherSpot);
    
    // Act
    const result = getSpotById('spot_nonexistent');
    
    // Assert: Atomic - tests one specific case
    expect(result).toBeNull();
  });

  test('should return null when storage is empty', () => {
    // Arrange: Ensure storage is empty
    expect(getAllSpots()).toEqual([]);
    
    // Act
    const result = getSpotById('any_id');
    
    // Assert: Independent - doesn't depend on other tests
    expect(result).toBeNull();
  });
});

describe('generateSpotId', () => {
  test('should generate a unique ID string', () => {
    // Act
    const id1 = generateSpotId();
    const id2 = generateSpotId();
    
    // Assert: Single Responsibility - verifies ID format
    expect(typeof id1).toBe('string');
    expect(id1).toMatch(/^spot_\d+_[a-z0-9]+$/); // Format: spot_timestamp_randomstring
    expect(id2).toMatch(/^spot_\d+_[a-z0-9]+$/);
  });

  test('should generate different IDs on each call', () => {
    // Act: Generate multiple IDs
    const ids = Array.from({ length: 10 }, () => generateSpotId());
    
    // Assert: Atomic - verifies uniqueness
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(10); // All IDs should be unique
  });

  test('should generate ID with correct prefix', () => {
    // Act
    const id = generateSpotId();
    
    // Assert: Self-Verifying - clear expectation
    expect(id.startsWith('spot_')).toBe(true);
  });

  test('should be repeatable in structure (format consistency)', () => {
    // Act: Generate multiple IDs and check their structure
    const ids = Array.from({ length: 5 }, () => generateSpotId());
    
    // Assert: Repeatable - structure is consistent
    ids.forEach(id => {
      expect(id).toMatch(/^spot_\d+_[a-z0-9]+$/);
    });
  });
});


