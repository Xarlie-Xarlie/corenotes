import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Note from './Note';
import favoriteIcon from '../../assets/favorite-on.png';

const mockOnFavoriteToggle = jest.fn();
const mockOnDelete = jest.fn();
const mockOnUpdate = jest.fn();

const mockNote = {
  id: 1,
  title: 'Sample Note',
  description: 'This is a sample note description.',
  favorite: true,
  color: '#FF5733'
};

const COLORS = ['#FF5733', '#FFBD33', '#DBFF33', '#75FF33', '#33FF57', '#33FFBD', '#33DBFF', '#3375FF', '#5733FF', '#BD33FF', '#FF33DB', '#FF3375'];

describe('Note Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the note with title, description, and correct favorite icon', () => {
    render(<Note note={mockNote} onFavoriteToggle={mockOnFavoriteToggle} onDelete={mockOnDelete} onUpdate={mockOnUpdate} />);

    expect(screen.getByText('Sample Note')).toBeInTheDocument();
    expect(screen.getByText('This is a sample note description.')).toBeInTheDocument();
    expect(screen.getByAltText('Favorite')).toHaveAttribute('src', favoriteIcon);
  });
});

describe('Note Component - Text updates', () => {
  test('Clicking the title or description does not activate edit mode', () => {
    render(<Note note={mockNote} onFavoriteToggle={mockOnFavoriteToggle} onDelete={mockOnDelete} onUpdate={mockOnUpdate} />);

    fireEvent.click(screen.getByText('Sample Note'));
    fireEvent.click(screen.getByText('This is a sample note description.'));

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  test('Clicking the edit button allows user to change title and description without triggering onUpdate', () => {
    render(<Note note={mockNote} onFavoriteToggle={mockOnFavoriteToggle} onDelete={mockOnDelete} onUpdate={mockOnUpdate} />);

    fireEvent.click(screen.getByAltText('Edit'));

    const titleInput = screen.getByDisplayValue('Sample Note');
    const descriptionInput = screen.getByDisplayValue('This is a sample note description.');

    fireEvent.change(titleInput, { target: { value: 'Updated Note Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Updated description' } });

    expect(titleInput.value).toBe('Updated Note Title');
    expect(descriptionInput.value).toBe('Updated description');
    expect(mockOnUpdate).not.toHaveBeenCalled();
  });

  test('Clicking edit, changing title/description, and pressing "Enter" triggers onUpdate with new title and description', () => {
    render(<Note note={mockNote} onFavoriteToggle={mockOnFavoriteToggle} onDelete={mockOnDelete} onUpdate={mockOnUpdate} />);

    fireEvent.click(screen.getByAltText('Edit'));

    const titleInput = screen.getByDisplayValue('Sample Note');
    const descriptionInput = screen.getByDisplayValue('This is a sample note description.');

    fireEvent.change(titleInput, { target: { value: 'Updated Note Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Updated description' } });

    fireEvent.keyDown(titleInput, { key: 'Enter' });

    expect(mockOnUpdate).toHaveBeenCalledWith(mockNote.id, 'Updated Note Title', 'Updated description', mockNote.color);
  });

  test('Clicking edit, changing title/description, and pressing "Enter" does not triggers onUpdate with new empty title or description', () => {
    render(<Note note={mockNote} onFavoriteToggle={mockOnFavoriteToggle} onDelete={mockOnDelete} onUpdate={mockOnUpdate} />);

    fireEvent.click(screen.getByAltText('Edit'));

    const titleInput = screen.getByDisplayValue('Sample Note');
    const descriptionInput = screen.getByDisplayValue('This is a sample note description.');

    fireEvent.change(titleInput, { target: { value: '' } });
    fireEvent.change(descriptionInput, { target: { value: '' } });

    fireEvent.keyDown(titleInput, { key: 'Enter' });

    expect(mockOnUpdate).not.toHaveBeenCalled();
  });

  test('Clicking edit, changing title/description, and clicking outside does not trigger onUpdate and does not persist changes', () => {
    render(<Note note={mockNote} onFavoriteToggle={mockOnFavoriteToggle} onDelete={mockOnDelete} onUpdate={mockOnUpdate} />);

    fireEvent.click(screen.getByAltText('Edit'));

    const titleInput = screen.getByDisplayValue('Sample Note');
    const descriptionInput = screen.getByDisplayValue('This is a sample note description.');

    fireEvent.change(titleInput, { target: { value: 'Updated Note Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Updated description' } });

    fireEvent.click(document.body);

    expect(mockOnUpdate).not.toHaveBeenCalled();
    expect(screen.getByText('Sample Note')).toBeInTheDocument();
    expect(screen.getByText('This is a sample note description.')).toBeInTheDocument();
  });
});

describe('Note Component - Favorite toggle', () => {
  test('Clicking the favorite button triggers onFavoriteToggle callback', () => {
    render(<Note note={mockNote} onFavoriteToggle={mockOnFavoriteToggle} onDelete={mockOnDelete} onUpdate={mockOnUpdate} />);

    fireEvent.click(screen.getByAltText('Favorite'));

    expect(mockOnFavoriteToggle).toHaveBeenCalledWith(mockNote.id);
  });
});

describe('Note Component - Change Color', () => {
  test('Clicking the changeColor button opens the color picker', () => {
    render(<Note note={mockNote} onFavoriteToggle={mockOnFavoriteToggle} onDelete={mockOnDelete} onUpdate={mockOnUpdate} />);

    fireEvent.click(screen.getByAltText('Change Color'));

    COLORS.forEach(color => {
      expect(screen.getByTestId(`color-${color}`)).toBeInTheDocument();
    });
  });

  test('Clicking the changeColor button and then a color triggers onUpdate callback with new color', () => {
    render(<Note note={mockNote} onFavoriteToggle={mockOnFavoriteToggle} onDelete={mockOnDelete} onUpdate={mockOnUpdate} />);

    fireEvent.click(screen.getByAltText('Change Color'));

    const newColor = COLORS[0];
    fireEvent.click(screen.getByTestId(`color-${newColor}`));

    expect(mockOnUpdate).toHaveBeenCalledWith(mockNote.id, mockNote.title, mockNote.description, newColor);
  });

  test('Clicking changeColor twice closes the color picker', () => {
    render(<Note note={mockNote} onFavoriteToggle={mockOnFavoriteToggle} onDelete={mockOnDelete} onUpdate={mockOnUpdate} />);

    fireEvent.click(screen.getByAltText('Change Color'));
    fireEvent.click(screen.getByAltText('Change Color'));

    COLORS.forEach(color => {
      expect(screen.queryByTestId(`color-${color}`)).not.toBeInTheDocument();
    });
  });

  test('Clicking changeColor and then clicking outside closes the color picker', () => {
    render(<Note note={mockNote} onFavoriteToggle={mockOnFavoriteToggle} onDelete={mockOnDelete} onUpdate={mockOnUpdate} />);

    fireEvent.click(screen.getByAltText('Change Color'));

    fireEvent.click(document.body);

    COLORS.forEach(color => {
      expect(screen.queryByTestId(`color-${color}`)).not.toBeInTheDocument();
    });
  });
});

describe('Note Component - Delete Note', () => {
  test('Clicking the delete button triggers onDelete callback', () => {
    render(<Note note={mockNote} onFavoriteToggle={mockOnFavoriteToggle} onDelete={mockOnDelete} onUpdate={mockOnUpdate} />);

    fireEvent.click(screen.getByAltText('Delete'));

    expect(mockOnDelete).toHaveBeenCalledWith(mockNote.id);
  });
});
