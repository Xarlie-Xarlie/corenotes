import { renderHook, waitFor } from '@testing-library/react'
import useSubmitNote from '../../hooks/useSubmitNote'

global.fetch = jest.fn()

describe('useSubmitNote', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('should create notes successfully', async () => {
    const mockResponseData = {
      title: 'Test',
      description: 'Description',
      favorite: false,
    }
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponseData,
    })

    const { result } = renderHook(() => useSubmitNote())

    await waitFor(async () => {
      expect(await result.current.submitNote(mockResponseData)).toEqual(
        mockResponseData,
      )
    })

    expect(fetch).toHaveBeenCalledWith('http://localhost:3333/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockResponseData),
    })
  })

  it('should return an error message if the create request fails', async () => {
    const mockResponseData = {
      title: 'Test',
      description: 'Description',
      favorite: false,
    }
    fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Failed to create note' }),
    })

    const { result } = renderHook(() => useSubmitNote())

    await expect(result.current.submitNote(mockResponseData)).rejects.toThrow(
      'Failed to submit the note',
    )

    expect(fetch).toHaveBeenCalledWith('http://localhost:3333/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockResponseData),
    })
  })

  it('should return errors received from API if the create request fails', async () => {
    const mockResponseData = {
      title: '',
      description: 'Description',
      favorite: true,
    }
    fetch.mockResolvedValue({
      ok: false,
      json: async () => ({
        errors: ['Title is null', 'Description is greater than allowed'],
      }),
    })

    const { result } = renderHook(() => useSubmitNote())

    await waitFor(async () => {
      expect(await result.current.submitNote(mockResponseData)).toStrictEqual({
        errors: ['Title is null', 'Description is greater than allowed'],
      })
    })

    expect(fetch).toHaveBeenCalledWith('http://localhost:3333/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockResponseData),
    })
  })

  it('should throw error with if it could not perform request', async () => {
    const mockResponseData = {
      title: '',
      description: 'Description',
      favorite: true,
    }
    fetch.mockRejectedValue(new Error('Test error'))

    const { result } = renderHook(() => useSubmitNote())

    await expect(result.current.submitNote(mockResponseData)).rejects.toThrow(
      'Test error',
    )

    expect(fetch).toHaveBeenCalledWith('http://localhost:3333/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockResponseData),
    })
  })
})
