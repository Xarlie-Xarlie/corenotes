import { renderHook, waitFor } from '@testing-library/react';
import useDeleteNote from '../../hooks/useDeleteNote';

describe('useDeleteNote', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    fetch.mockClear();
  });

  it('should delete a note successfully', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => null
    });

    const { result } = renderHook(() => useDeleteNote());

    await waitFor(async () => {
      expect(await result.current.deleteNote(1)).toStrictEqual(null);
    });

    expect(fetch).toHaveBeenCalledWith('http://localhost:3333/api/notes/1', {
      method: 'DELETE',
    });
  });

  it('should return a message if not does not exists', async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Note not found' })
    });

    const { result } = renderHook(() => useDeleteNote());

    await waitFor(async () => {
      expect(await result.current.deleteNote(1)).toStrictEqual('Note not found');
    })

    expect(fetch).toHaveBeenCalledWith('http://localhost:3333/api/notes/1', {
      method: 'DELETE',
    });
  });

  it('should throw an error if the delete request fails', async () => {
    fetch.mockRejectedValue({ ok: false, json: { error: 'Failed to update note' } });

    const { result } = renderHook(() => useDeleteNote());

    await expect(result.current.deleteNote(1)).rejects.toThrow('Failed to delete note');

    expect(fetch).toHaveBeenCalledWith('http://localhost:3333/api/notes/1', {
      method: 'DELETE',
    });
  });


  it('should throw an error if the fetch call fails', async () => {
    fetch.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useDeleteNote());

    await expect(result.current.deleteNote(1)).rejects.toThrow("Network error");

    expect(fetch).toHaveBeenCalledWith('http://localhost:3333/api/notes/1', {
      method: 'DELETE',
    });
  });
});
