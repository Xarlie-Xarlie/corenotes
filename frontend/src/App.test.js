import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders SearchNotes Component', () => {
    render(<App />);
    const linkElement = screen.getByText(/CoreNotes/i);
    expect(linkElement).toBeInTheDocument();
  });
});
