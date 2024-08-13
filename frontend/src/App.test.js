import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders SearchNotes Component', () => {
    render(<App />);
    const linkElement = screen.getByText(/CoreNotes/i);
    expect(linkElement).toBeInTheDocument();
  });

  test('renders NoteForm Component', () => {
    render(<App />);
    const titleInput = screen.getByPlaceholderText('Título');
    const descriptionInput = screen.getByPlaceholderText('Criar nota...');
    const favoriteIcon = screen.getByAltText('Not Favorite');

    expect(titleInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(favoriteIcon).toBeInTheDocument();
  });
});
