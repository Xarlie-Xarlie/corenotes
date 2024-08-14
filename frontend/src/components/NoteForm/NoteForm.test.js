import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NoteForm from './NoteForm';
import useSubmitNote from '../../hooks/useSubmitNote';
import { toast } from 'react-toastify';

jest.mock('../../hooks/useSubmitNote');

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div />,
}));

describe('NoteForm Component', () => {
  let submitNote;

  beforeEach(() => {
    submitNote = jest.fn();
    useSubmitNote.mockReturnValue({ submitNote });
  })

  test('submits the form with title, description and favorite', async () => {
    render(<NoteForm />);

    const titleInput = screen.getByPlaceholderText('Título');
    const descriptionInput = screen.getByPlaceholderText('Criar nota...');
    const favoriteIcon = screen.getByAltText('Not Favorite');

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });

    fireEvent.click(favoriteIcon);

    fireEvent.keyDown(titleInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(useSubmitNote).toHaveBeenCalled();
      expect(submitNote).toHaveBeenCalledWith({
        title: 'Test Title',
        description: 'Test Description',
        favorite: true
      });

      expect(screen.getByAltText('Not Favorite')).toBeInTheDocument();
      expect(titleInput.value).toBe('');
      expect(descriptionInput.value).toBe('');
    });
  });

  test('toggles the favorite status when the icon is clicked', () => {
    render(<NoteForm />);

    const favoriteIcon = screen.getByAltText('Not Favorite');
    fireEvent.click(favoriteIcon);

    expect(screen.getByAltText('Favorite')).toBeInTheDocument();

    fireEvent.click(screen.getByAltText('Favorite'));
    expect(screen.getByAltText('Not Favorite')).toBeInTheDocument();
  });
});

describe('NoteForm Component with Toast Messages', () => {
  let submitNote;

  beforeEach(() => {
    submitNote = jest.fn().mockReturnValue({});
    useSubmitNote.mockReturnValue({ submitNote });
  })

  test('displays warn toast if title is missing', () => {
    render(<NoteForm />);

    const titleInput = screen.getByPlaceholderText('Título');

    fireEvent.keyDown(titleInput, { key: 'Enter', code: 'Enter' });

    expect(toast.warn).toHaveBeenCalledWith('Título não pode ser nulo!');
    expect(toast.warn).toHaveBeenCalledWith('Descrição não pode ser nulo!');
  });

  test('displays success toast on successful submission', async () => {
    render(<NoteForm />);

    const titleInput = screen.getByPlaceholderText('Título');
    const descriptionInput = screen.getByPlaceholderText('Criar nota...');

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });

    fireEvent.keyDown(titleInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Note submitted successfully!');
      expect(toast.warn).toHaveBeenCalledTimes(0);
      expect(toast.error).toHaveBeenCalledTimes(0);
    });
  });

  test('displays error toast on submission failure', async () => {
    submitNote = jest.fn().mockRejectedValue(new Error('Failed to submit the note'))
    useSubmitNote.mockReturnValue({ submitNote });

    render(<NoteForm />);

    const titleInput = screen.getByPlaceholderText('Título');
    const descriptionInput = screen.getByPlaceholderText('Criar nota...');

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Description Title' } });

    fireEvent.keyDown(titleInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledTimes(0);
      expect(toast.warn).toHaveBeenCalledTimes(0);
      expect(toast.error).toHaveBeenCalledWith('Failed to submit the note');
    });
  });

  test('displays error toast on submission failure', async () => {
    submitNote = jest.fn().mockRejectedValue(new Error('Failed to submit the note'))
    useSubmitNote.mockReturnValue({ submitNote });

    render(<NoteForm />);

    const titleInput = screen.getByPlaceholderText('Título');
    const descriptionInput = screen.getByPlaceholderText('Criar nota...');

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Description Title' } });

    fireEvent.keyDown(titleInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledTimes(0);
      expect(toast.warn).toHaveBeenCalledTimes(0);
      expect(toast.error).toHaveBeenCalledWith('Failed to submit the note');
    });
  });

  test('displays API error messages on submission', async () => {
    const errorMessage1 = 'Validation error: Title must be between 1 and 255 characters long';
    const errorMessage2 = 'Validation error: Description must be between 1 and 10000 characters long';

    submitNote = jest.fn().mockReturnValue({ errors: [errorMessage1, errorMessage2] })
    useSubmitNote.mockReturnValue({ submitNote });

    render(<NoteForm />);

    const titleInput = screen.getByPlaceholderText('Título');
    const descriptionInput = screen.getByPlaceholderText('Criar nota...');

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Description Title' } });

    fireEvent.keyDown(titleInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage1);
      expect(toast.error).toHaveBeenCalledWith(errorMessage2);
      expect(toast.success).toHaveBeenCalledTimes(0);
      expect(toast.warn).toHaveBeenCalledTimes(0);
    });
  });
});

