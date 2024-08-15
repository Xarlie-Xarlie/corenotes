import { render, screen } from '@testing-library/react';
import Notes from './Notes';

describe('Notes Component', () => {
  test('renders only favorite notes and displays "Favoritas"', () => {
    const favoriteNotes = [
      { id: 1, title: 'Favorite Note 1', description: 'Description 1', favorite: true },
      { id: 2, title: 'Favorite Note 2', description: 'Description 2', favorite: true }
    ];

    render(<Notes notes={favoriteNotes} />);

    expect(screen.getByText('Favoritas')).toBeInTheDocument();

    expect(screen.getByText('Favorite Note 1')).toBeInTheDocument();
    expect(screen.getByText('Favorite Note 2')).toBeInTheDocument();

    expect(screen.queryByText('Outras')).not.toBeInTheDocument();
  });

  test('renders only non-favorite notes and displays "Outras"', () => {
    const nonFavoriteNotes = [
      { id: 1, title: 'Non-Favorite Note 1', description: 'Description 1', favorite: false },
      { id: 2, title: 'Non-Favorite Note 2', description: 'Description 2', favorite: false }
    ];

    render(<Notes notes={nonFavoriteNotes} />);

    expect(screen.getByText('Outras')).toBeInTheDocument();

    expect(screen.getByText('Non-Favorite Note 1')).toBeInTheDocument();
    expect(screen.getByText('Non-Favorite Note 2')).toBeInTheDocument();

    expect(screen.queryByText('Favoritas')).not.toBeInTheDocument();
  });

  test('renders favorite and non-favorite notes', () => {
    const nonFavoriteNotes = [
      { id: 1, title: 'Favorite Note 1', description: 'Description 1', favorite: true },
      { id: 2, title: 'Non-Favorite Note 2', description: 'Description 2', favorite: false }
    ];

    render(<Notes notes={nonFavoriteNotes} />);

    expect(screen.getByText('Outras')).toBeInTheDocument();
    expect(screen.getByText('Favoritas')).toBeInTheDocument();

    expect(screen.getByText('Favorite Note 1')).toBeInTheDocument();
    expect(screen.getByText('Non-Favorite Note 2')).toBeInTheDocument();

  });

  test('renders empty state with no notes', () => {
    render(<Notes notes={[]} />);

    expect(screen.queryByText('Favoritas')).not.toBeInTheDocument();
    expect(screen.queryByText('Outras')).not.toBeInTheDocument();
  });
});
