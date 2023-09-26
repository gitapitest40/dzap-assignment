import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Disperse from './Disperse'; // Replace with the correct path

// Mock the utils module
jest.mock('../utils', () => ({
  findDuplicateIndexes: jest.fn(),
  validateInputAddresses: jest.fn(),
}));

describe('Disperse', () => {
  beforeEach(() => {
    // Reset the mock function calls before each test
    jest.clearAllMocks();
  });

  it('renders the component without errors', () => {
    render(<Disperse />);
    expect(screen.getByText('Address with Amounts')).toBeInTheDocument();
    expect(screen.getByText('Separated by \',\' or \'\' or \'=\'')).toBeInTheDocument();
  });

  it('handles textarea input change', () => {
    render(<Disperse />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Input text' } });
    expect(textarea).toHaveValue('Input text');
  });
  
  // Add more test cases as needed
});
