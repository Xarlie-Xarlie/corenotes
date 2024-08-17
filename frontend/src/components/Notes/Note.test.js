import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Note from './Note';
import favoriteIcon from '../../assets/favorite-on.png';
import { toast } from 'react-toastify';
import useUpdateNote from '../../hooks/useUpdateNote';
import useFavoriteToggle from '../../hooks/useFavoriteToggle';
import useDeleteNote from '../../hooks/useDeleteNote';

const mockNote = {
  id: 1,
  title: 'Sample Note',
  description: 'This is a sample note description.',
  favorite: true,
  color: '#FF5733'
};

jest.mock('../../hooks/useUpdateNote');
jest.mock('../../hooks/useFavoriteToggle');
jest.mock('../../hooks/useDeleteNote');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div />,
}));

const COLORS = [
  '#BAE2FF',
  '#B9FFDD',
  '#FFE8AC',
  '#FFCAB9',
  '#F99494',
  '#9DD6FF',
  '#ECA1FF',
  '#DAFF8B',
  '#FFA285',
  '#CDCDCD',
  '#979797',
  '#A99A7C'
];

describe('Note Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useUpdateNote.mockReturnValue({ updateNote: jest.fn() });
    useFavoriteToggle.mockReturnValue({ toggleFavorite: jest.fn() });
    useDeleteNote.mockReturnValue({ deleteNote: jest.fn() });
  });

  test('renders the note with title, description, and correct favorite icon', () => {
    render(<Note note={mockNote} />);

    expect(screen.getByText('Sample Note')).toBeInTheDocument();
    expect(screen.getByText('This is a sample note description.')).toBeInTheDocument();
    expect(screen.getByAltText('Favorite')).toHaveAttribute('src', favoriteIcon);
  });
});

describe('Note Component - Text updates', () => {
  let mockUpdateNote;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdateNote = jest.fn();
    useUpdateNote.mockReturnValue({ updateNote: mockUpdateNote });
    useFavoriteToggle.mockReturnValue({ toggleFavorite: jest.fn() });
    useDeleteNote.mockReturnValue({ deleteNote: jest.fn() });
  });

  test('Clicking the title or description does not activate edit mode', () => {
    render(<Note note={mockNote} />);

    fireEvent.click(screen.getByText('Sample Note'));
    fireEvent.click(screen.getByText('This is a sample note description.'));

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  test('Clicking the edit button allows user to change title and description without triggering onUpdate', () => {
    render(<Note note={mockNote} />);

    fireEvent.click(screen.getByAltText('Edit'));

    const titleInput = screen.getByDisplayValue('Sample Note');
    const descriptionInput = screen.getByDisplayValue('This is a sample note description.');

    fireEvent.change(titleInput, { target: { value: 'Updated Note Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Updated description' } });

    expect(titleInput.value).toBe('Updated Note Title');
    expect(descriptionInput.value).toBe('Updated description');
    expect(mockUpdateNote).not.toHaveBeenCalled();
  });

  test('Clicking edit, changing title/description, and pressing "Enter" triggers onUpdate with new title and description', () => {
    render(<Note note={mockNote} />);

    fireEvent.click(screen.getByAltText('Edit'));

    const titleInput = screen.getByDisplayValue('Sample Note');
    const descriptionInput = screen.getByDisplayValue('This is a sample note description.');

    fireEvent.change(titleInput, { target: { value: 'Updated Note Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Updated description' } });

    fireEvent.keyDown(titleInput, { key: 'Enter' });

    expect(mockUpdateNote).toHaveBeenCalledWith(mockNote.id, 'Updated Note Title', 'Updated description', mockNote.color);
  });

  test('Clicking edit, changing title/description, and pressing "Enter" does not triggers onUpdate with new empty title or description', () => {
    render(<Note note={mockNote} />);

    fireEvent.click(screen.getByAltText('Edit'));

    const titleInput = screen.getByDisplayValue('Sample Note');
    const descriptionInput = screen.getByDisplayValue('This is a sample note description.');

    fireEvent.change(titleInput, { target: { value: '' } });
    fireEvent.change(descriptionInput, { target: { value: '' } });

    fireEvent.keyDown(titleInput, { key: 'Enter' });

    expect(mockUpdateNote).not.toHaveBeenCalled();
  });

  test('Clicking edit, changing title/description, and clicking outside does not trigger onUpdate and does not persist changes', () => {
    render(<Note note={mockNote} />);

    fireEvent.click(screen.getByAltText('Edit'));

    const titleInput = screen.getByDisplayValue('Sample Note');
    const descriptionInput = screen.getByDisplayValue('This is a sample note description.');

    fireEvent.change(titleInput, { target: { value: 'Updated Note Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Updated description' } });

    fireEvent.click(document.body);

    expect(mockUpdateNote).not.toHaveBeenCalled();
    expect(screen.getByText('Sample Note')).toBeInTheDocument();
    expect(screen.getByText('This is a sample note description.')).toBeInTheDocument();
  });
});

describe('Note Component - Favorite toggle', () => {
  let mockFavoriteToggle;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFavoriteToggle = jest.fn();
    useUpdateNote.mockReturnValue({ updateNote: jest.fn() });
    useFavoriteToggle.mockReturnValue({ toggleFavorite: mockFavoriteToggle });
    useDeleteNote.mockReturnValue({ deleteNote: jest.fn() });
  });

  test('Clicking the favorite button triggers onFavoriteToggle callback', () => {
    render(<Note note={mockNote} />);

    fireEvent.click(screen.getByAltText('Favorite'));

    expect(mockFavoriteToggle).toHaveBeenCalledWith(mockNote.id, !mockNote.favorite);
  });
});

describe('Note Component - Change Color', () => {
  let mockUpdateNote;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdateNote = jest.fn();
    useUpdateNote.mockReturnValue({ updateNote: mockUpdateNote });
    useFavoriteToggle.mockReturnValue({ toggleFavorite: jest.fn() });
    useDeleteNote.mockReturnValue({ deleteNote: jest.fn() });
  });

  test('Clicking the changeColor button opens the color picker', () => {
    render(<Note note={mockNote} />);

    fireEvent.click(screen.getByAltText('Change Color'));

    COLORS.forEach(color => {
      expect(screen.getByTestId(`color-${color}`)).toBeInTheDocument();
    });
  });

  test('Clicking the changeColor button and then a color triggers onUpdate callback with new color', () => {
    render(<Note note={mockNote} />);

    fireEvent.click(screen.getByAltText('Change Color'));

    const newColor = COLORS[0];
    fireEvent.click(screen.getByTestId(`color-${newColor}`));

    expect(mockUpdateNote).toHaveBeenCalledWith(mockNote.id, mockNote.title, mockNote.description, newColor);
  });

  test('Clicking changeColor twice closes the color picker', () => {
    render(<Note note={mockNote} />);

    fireEvent.click(screen.getByAltText('Change Color'));
    fireEvent.click(screen.getByAltText('Change Color'));

    COLORS.forEach(color => {
      expect(screen.queryByTestId(`color-${color}`)).not.toBeInTheDocument();
    });
  });

  test('Clicking changeColor and then clicking outside closes the color picker', () => {
    render(<Note note={mockNote} />);

    fireEvent.click(screen.getByAltText('Change Color'));

    fireEvent.click(document.body);

    COLORS.forEach(color => {
      expect(screen.queryByTestId(`color-${color}`)).not.toBeInTheDocument();
    });
  });
});

describe('Note Component - Delete Note', () => {
  let mockDeleteNote;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDeleteNote = jest.fn();
    useUpdateNote.mockReturnValue({ updateNote: jest.fn() });
    useFavoriteToggle.mockReturnValue({ toggleFavorite: jest.fn() });
    useDeleteNote.mockReturnValue({ deleteNote: mockDeleteNote });
  });

  test('Clicking the delete button triggers onDelete callback', () => {
    render(<Note note={mockNote} />);

    fireEvent.click(screen.getByAltText('Delete'));

    expect(mockDeleteNote).toHaveBeenCalledWith(mockNote.id);
  });
});

describe('Note Component - Toast Messages', () => {
  let mockNote;
  let mockUpdateNote;
  let mockFavoriteToggle;
  let mockDeleteNote;

  beforeEach(() => {
    jest.clearAllMocks();
    mockNote = { id: 1, title: 'Sample Title', description: 'Sample Description', favorite: false, color: '#BAE2FF' };
    mockUpdateNote = jest.fn();
    mockFavoriteToggle = jest.fn();
    mockDeleteNote = jest.fn();

    useUpdateNote.mockReturnValue({ updateNote: mockUpdateNote });
    useFavoriteToggle.mockReturnValue({ toggleFavorite: mockFavoriteToggle });
    useDeleteNote.mockReturnValue({ deleteNote: mockDeleteNote });
  });

  test('If the user tries to change the title to empty and submit, it shows a warn toast', async () => {
    render(<Note note={mockNote} />);

    fireEvent.click(screen.getByAltText('Edit'));
    fireEvent.change(screen.getByDisplayValue('Sample Title'), { target: { value: '' } });
    fireEvent.keyDown(screen.getByDisplayValue(''), { key: 'Enter', code: 'Enter' });

    expect(toast.warn).toHaveBeenCalledWith('Título não pode ser nulo!');
    expect(mockUpdateNote).not.toHaveBeenCalled();
  });

  test('If the user tries to change the description to empty and submit, it shows a warn toast', async () => {
    render(<Note note={mockNote} />);

    fireEvent.click(screen.getByAltText('Edit'));
    fireEvent.change(screen.getByDisplayValue('Sample Description'), { target: { value: '' } });
    fireEvent.keyDown(screen.getByDisplayValue(''), { key: 'Enter', code: 'Enter' });

    expect(toast.warn).toHaveBeenCalledWith('Descrição não pode ser nulo!');
    expect(mockUpdateNote).not.toHaveBeenCalled();
  });

  test('If the user tries to change both title and description to empty and submit, it shows two warn toasts', async () => {
    render(<Note note={mockNote} />);

    fireEvent.click(screen.getByAltText('Edit'));
    const titleInput = screen.getByDisplayValue('Sample Title');
    fireEvent.change(titleInput, { target: { value: '' } });
    fireEvent.change(screen.getByDisplayValue('Sample Description'), { target: { value: '' } });
    fireEvent.keyDown(titleInput, { key: 'Enter', code: 'Enter' });

    expect(toast.warn).toHaveBeenCalledWith('Título não pode ser nulo!');
    expect(toast.warn).toHaveBeenCalledWith('Descrição não pode ser nulo!');
    expect(mockUpdateNote).not.toHaveBeenCalled();
  });

  test('If the onUpdate callback fails, it shows an error toast', async () => {
    mockUpdateNote.mockRejectedValueOnce(new Error('Failed to submit note'));

    render(<Note note={mockNote} />);

    fireEvent.click(screen.getByAltText('Edit'));
    fireEvent.keyDown(screen.getByDisplayValue('Sample Title'), { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to submit note');
    });
  });

  test('If the onFavoriteToggle callback fails, it shows an error toast', async () => {
    mockFavoriteToggle.mockRejectedValueOnce(new Error('Failed to submit note'));

    render(<Note note={mockNote} />);

    fireEvent.click(screen.getByAltText('Favorite'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to submit note');
    });
  });

  test('If the onDelete callback fails, it shows an error toast', async () => {
    mockDeleteNote.mockRejectedValueOnce(new Error('Failed to delete note'));

    render(<Note note={mockNote} />);

    fireEvent.click(screen.getByAltText('Delete'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to delete note');
    });
  });
});
