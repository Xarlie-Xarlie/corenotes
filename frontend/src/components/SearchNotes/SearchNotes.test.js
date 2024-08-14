import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchNotes from './SearchNotes.js';
import noteIcon from '../../assets/note-icon.png';
import searchIcon from '../../assets/search-icon.png';
import cross from '../../assets/cross.svg';

describe('SearchNotes Component', () => {
  test('renders CoreNotes heading', () => {
    render(<SearchNotes />);
    const headingElement = screen.getByText(/CoreNotes/i);
    expect(headingElement).toBeInTheDocument();
  });

  test('renders note icon', () => {
    render(<SearchNotes />);
    const noteIconElement = screen.getByAltText('NoteIcon');
    expect(noteIconElement).toHaveAttribute('src', noteIcon);
  });

  test('renders search input', () => {
    render(<SearchNotes />);
    const searchInputElement = screen.getByPlaceholderText('Pesquisar notas');
    expect(searchInputElement).toBeInTheDocument();
  });

  test('renders search icon', () => {
    render(<SearchNotes />);
    const searchIconElement = screen.getByAltText('SearchIcon');
    expect(searchIconElement).toHaveAttribute('src', searchIcon);
  });

  test('renders cross icon', () => {
    render(<SearchNotes />);
    const crossIconElement = screen.getByAltText('CrossIcon');
    expect(crossIconElement).toHaveAttribute('src', cross);
  });
});

describe('SearchNotes Component - User Interactions', () => {
  test('allows user to type in the search input', () => {
    render(<SearchNotes />);

    const searchInputElement = screen.getByPlaceholderText('Pesquisar notas');

    fireEvent.change(searchInputElement, { target: { value: 'New Note' } });

    expect(searchInputElement.value).toBe('New Note');
  });

  test('allows user to click to search based in the search input', () => {
    const onSearch = jest.fn();
    render(<SearchNotes onSearch={onSearch} />);

    const searchInputElement = screen.getByPlaceholderText('Pesquisar notas');

    fireEvent.change(searchInputElement, { target: { value: 'New Note' } });

    fireEvent.keyDown(searchInputElement, { key: 'Enter', code: 'Enter' });

    expect(searchInputElement.value).toBe('New Note');
    expect(onSearch).toHaveBeenCalledWith('New Note');
  });

  test('allows user to click in the search icon and perform a search', () => {
    const onSearch = jest.fn();
    render(<SearchNotes onSearch={onSearch} />);

    const searchInputElement = screen.getByPlaceholderText('Pesquisar notas');

    fireEvent.change(searchInputElement, { target: { value: 'New Note' } });

    const searchButtonElement = screen.getByAltText('SearchIcon');
    fireEvent.click(searchButtonElement);

    expect(searchInputElement.value).toBe('New Note');
    expect(onSearch).toHaveBeenCalledWith('New Note');
  });

  test('clears the search input when the cross button is clicked', () => {
    const onSearch = jest.fn();
    render(<SearchNotes onSearch={onSearch} />);

    const searchInputElement = screen.getByPlaceholderText('Pesquisar notas');
    fireEvent.change(searchInputElement, { target: { value: 'New Note' } });
    expect(searchInputElement.value).toBe('New Note');

    const crossButtonElement = screen.getByAltText('CrossIcon');
    fireEvent.click(crossButtonElement);

    expect(searchInputElement.value).toBe('');
    expect(onSearch).toHaveBeenCalledWith('');
  });
});
