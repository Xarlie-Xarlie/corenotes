import { renderHook, waitFor } from '@testing-library/react'
import useFetchNotes from '../../hooks/useFetchNotes'

global.fetch = jest.fn()

describe('useFetchNotes', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('should fetch notes successfully without searchTerm', async () => {
    const mockNotes = [
      { id: 1, title: 'Test Note', description: 'Description' },
    ]
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ notes: mockNotes }),
    })

    const { result } = renderHook(() => useFetchNotes(''))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:3333/api/notes')
      expect(result.current.notes).toEqual(mockNotes)
      expect(result.current.error).toBeNull()
    })
  })

  it('should fetch notes successfully with searchTerm', async () => {
    const mockNotes = [
      { id: 2, title: 'Search Note', description: 'Description' },
    ]
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ notes: mockNotes }),
    })

    const { result } = renderHook(() => useFetchNotes('Search'))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3333/api/notes?search=Search',
      )
      expect(result.current.notes).toEqual(mockNotes)
      expect(result.current.error).toBeNull()
    })
  })

  it('should handle error when fetching notes fails', async () => {
    fetch.mockResolvedValueOnce({ ok: false })

    const { result } = renderHook(() => useFetchNotes(''))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:3333/api/notes')
      expect(result.current.notes).toEqual([])
      expect(result.current.error).toBe('Failed to fetch notes')
    })
  })

  it('should be able to return empty notes from API', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ notes: [] }),
    })

    const { result } = renderHook(() => useFetchNotes(''))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:3333/api/notes')
      expect(result.current.notes).toEqual([])
      expect(result.current.error).toBeNull()
    })
  })

  it('should be able to return empty notes from API', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ error: 'Test error' }),
    })

    const { result } = renderHook(() => useFetchNotes(''))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:3333/api/notes')
      expect(result.current.notes).toEqual([])
      expect(result.current.error).toBeNull()
    })
  })
})
