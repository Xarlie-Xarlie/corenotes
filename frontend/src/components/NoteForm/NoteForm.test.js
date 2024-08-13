import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NoteForm from './NoteForm';

describe('NoteForm Component', () => {
  test('shows an error if the title is empty and Enter is pressed', () => {
    render(<NoteForm onSubmit={jest.fn()} />);

    const titleInput = screen.getByPlaceholderText('Título');
    fireEvent.keyDown(titleInput, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText('Título não pode ser nulo')).toBeInTheDocument();
  });

  test('submits the form with title and description', async () => {
    const mockSubmit = jest.fn().mockResolvedValue({});
    render(<NoteForm onSubmit={mockSubmit} />);

    // Simulate typing a title and description
    const titleInput = screen.getByPlaceholderText('Título');
    const descriptionInput = screen.getByPlaceholderText('Criar nota...');
    const favoriteIcon = screen.getByAltText('Not Favorite');

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.click(favoriteIcon);

    // Simulate pressing Enter to submit the form
    fireEvent.keyDown(titleInput, { key: 'Enter', code: 'Enter' });

    // Wait for the mockSubmit to be called
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        title: 'Test Title',
        description: 'Test Description',
        favorite: true
      });

      // Ensure the inputs are cleared after submission
      expect(screen.getByAltText('Not Favorite')).toBeInTheDocument();
      expect(titleInput.value).toBe('');
      expect(descriptionInput.value).toBe('');
    });
  });

  test('handles submit failure gracefully', async () => {
    const mockSubmit = jest.fn().mockRejectedValue(new Error('Submission failed'));
    render(<NoteForm onSubmit={mockSubmit} />);

    // Simulate typing a title
    const titleInput = screen.getByPlaceholderText('Título');
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });

    // Simulate pressing Enter to submit the form
    fireEvent.keyDown(titleInput, { key: 'Enter', code: 'Enter' });

    // Expect the error message to be displayed
    const errorMessage = await screen.findByText('Failed to submit the form');
    expect(errorMessage).toBeInTheDocument();
  });

  test('toggles the favorite status when the icon is clicked', () => {
    render(<NoteForm onSubmit={jest.fn()} />);

    // Find the favorite icon and click it
    const favoriteIcon = screen.getByAltText('Not Favorite');
    fireEvent.click(favoriteIcon);

    // Expect the icon to change to the "Favorite" icon
    expect(screen.getByAltText('Favorite')).toBeInTheDocument();

    // Click again to toggle back to not favorite
    fireEvent.click(screen.getByAltText('Favorite'));
    expect(screen.getByAltText('Not Favorite')).toBeInTheDocument();
  });
});
