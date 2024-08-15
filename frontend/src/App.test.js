import { render, screen } from '@testing-library/react';
import App from './App';
import useFetchNotes from './hooks/useFetchNotes';

jest.mock('./hooks/useFetchNotes.js');

describe('App Component', () => {
  test('renders SearchNotes Component', () => {
    useFetchNotes.mockReturnValue({
      notes: [], error: null
    });

    render(<App />);

    const linkElement = screen.getByText(/CoreNotes/i);
    expect(linkElement).toBeInTheDocument();
  });

  test('renders NoteForm Component', () => {
    useFetchNotes.mockReturnValue({
      notes: [], error: null
    });

    render(<App />);

    const titleInput = screen.getByPlaceholderText('Título');
    const descriptionInput = screen.getByPlaceholderText('Criar nota...');
    const favoriteIcon = screen.getByAltText('Not Favorite');

    expect(titleInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(favoriteIcon).toBeInTheDocument();
  });

  test('render Notes Component', () => {
    useFetchNotes.mockReturnValue({
      notes: [
        { id: 1, title: 'Note 1', description: 'Description 1', favorite: true },
        { id: 2, title: 'Note 2', description: 'Description 2', favorite: false }
      ],
      error: null
    });

    render(<App />);

    expect(screen.getByText('Favoritas')).toBeInTheDocument();

    expect(screen.getByText('Note 1')).toBeInTheDocument();
    expect(screen.getByText('Note 2')).toBeInTheDocument();

    expect(screen.queryByText('Outras')).toBeInTheDocument();
  });
});
