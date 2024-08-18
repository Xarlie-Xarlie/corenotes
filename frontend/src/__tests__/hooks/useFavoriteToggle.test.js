import { renderHook, waitFor } from '@testing-library/react';
import useFavoriteToggle from '../../hooks/useFavoriteToggle';

global.fetch = jest.fn();

describe('useFavoriteToggle', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should toggle favorite status successfully', async () => {
    const mockResponseData = { id: 1, title: 'Test', description: 'Description', favorite: false };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponseData
    });

    const { result } = renderHook(() => useFavoriteToggle());

    await waitFor(async () => {
      expect(await result.current.toggleFavorite(1, true)).toEqual(mockResponseData);
    });

    expect(fetch).toHaveBeenCalledWith('http://localhost:3333/api/notes/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ favorite: true }),
    });
  });

  it('should return an error message if the toggle request fails', async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Note not found' })
    });

    const { result } = renderHook(() => useFavoriteToggle());

    await waitFor(async () => {
      expect(await result.current.toggleFavorite(1, true)).toStrictEqual(['Note not found']);
    });

    expect(fetch).toHaveBeenCalledWith('http://localhost:3333/api/notes/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ favorite: true }),
    });
  });

  it('should return errors received from API if the toggle request fails', async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: ['Title is null', 'Description is greater than allowed'] })
    });

    const { result } = renderHook(() => useFavoriteToggle());

    await waitFor(async () => {
      expect(await result.current.toggleFavorite(1, true))
        .toStrictEqual(['Title is null', 'Description is greater than allowed']);
    });

    expect(fetch).toHaveBeenCalledWith('http://localhost:3333/api/notes/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ favorite: true }),
    });
  });

  it('should throw an error if the fetch call fails', async () => {
    fetch.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useFavoriteToggle());

    await expect(result.current.toggleFavorite(1, true)).rejects.toThrow('Network error');

    expect(fetch).toHaveBeenCalledWith('http://localhost:3333/api/notes/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ favorite: true }),
    });
  });

  it('should throw error with an default message if could not get error.message', async () => {
    fetch.mockRejectedValue({});

    const { result } = renderHook(() => useFavoriteToggle());

    await expect(result.current.toggleFavorite(1, true)).rejects.toThrow('Failed to submit note');

    expect(fetch).toHaveBeenCalledWith('http://localhost:3333/api/notes/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ favorite: true }),
    });
  });
});
