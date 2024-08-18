import { renderHook, waitFor } from '@testing-library/react';
import useUpdateNote from '../../hooks/useUpdateNote';

global.fetch = jest.fn();

describe('useUpdateNote', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should update notes successfully', async () => {
    const mockResponseData = { id: 1, title: 'Test', description: 'Description', color: 'color' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponseData
    });

    const { result } = renderHook(() => useUpdateNote());

    await waitFor(async () => {
      expect(
        await result.current.updateNote(1, 'Test', 'Description', 'color')
      ).toEqual(mockResponseData);
    });

    expect(fetch).toHaveBeenCalledWith('http://localhost:3333/api/notes/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'Test', description: 'Description', color: 'color' })
    });
  });

  it('should return an error message if the update request fails', async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Note not found' })
    });

    const { result } = renderHook(() => useUpdateNote());

    await waitFor(async () => {
      expect(await result.current.updateNote(1, 'Test', 'Description', 'color'))
        .toStrictEqual(['Note not found']);
    });

    expect(fetch).toHaveBeenCalledWith('http://localhost:3333/api/notes/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'Test', description: 'Description', color: 'color' })
    });
  });

  it('should return errors received from API if the update request fails', async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: ['Title is null', 'Description is greater than allowed'] })
    });

    const { result } = renderHook(() => useUpdateNote());

    await waitFor(async () => {
      expect(await result.current.updateNote(1, '', 'DESCRIPTION', 'color'))
        .toStrictEqual(['Title is null', 'Description is greater than allowed']);
    });

    expect(fetch).toHaveBeenCalledWith('http://localhost:3333/api/notes/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: '', description: 'DESCRIPTION', color: 'color' })
    });
  });

  it('should throw an error if the fetch call fails', async () => {
    fetch.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useUpdateNote());

    await expect(result.current.updateNote(1, 'Test', 'Description', 'color'))
      .rejects.toThrow('Network error');

    expect(fetch).toHaveBeenCalledWith('http://localhost:3333/api/notes/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'Test', description: 'Description', color: 'color' })
    });
  });

  it('should throw error with an default message if it could not get error.message', async () => {
    fetch.mockRejectedValue({});

    const { result } = renderHook(() => useUpdateNote());

    await expect(result.current.updateNote(1, 'Test', 'Description', 'color'))
      .rejects.toThrow('Failed to submit note');

    expect(fetch).toHaveBeenCalledWith('http://localhost:3333/api/notes/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'Test', description: 'Description', color: 'color' })
    });
  });
});
