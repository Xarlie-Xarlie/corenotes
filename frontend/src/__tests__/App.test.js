import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App'
import useFetchNotes from '../hooks/useFetchNotes'
import useSubmitNote from '../hooks/useSubmitNote'
import useDeleteNote from '../hooks/useDeleteNote'
import useUpdateNote from '../hooks/useUpdateNote'
import { toast } from 'react-toastify'

jest.mock('../hooks/useFetchNotes')
jest.mock('../hooks/useSubmitNote')
jest.mock('../hooks/useDeleteNote')
jest.mock('../hooks/useUpdateNote')

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
  ToastContainer: () => <div />,
}))

describe('App Component', () => {
  let submitNote
  let deleteNote
  let updateNote

  beforeEach(() => {
    jest.clearAllMocks()

    submitNote = jest.fn()
    useSubmitNote.mockReturnValue({ submitNote })

    deleteNote = jest.fn()
    useDeleteNote.mockReturnValue({ deleteNote })

    updateNote = jest.fn()
    useUpdateNote.mockReturnValue({ updateNote })

    useFetchNotes.mockReturnValue({
      notes: [],
      setNotes: jest.fn(),
      error: null,
    })
  })

  test('renders SearchNotes Component', () => {
    render(<App />)

    const linkElement = screen.getByText(/CoreNotes/i)
    expect(linkElement).toBeInTheDocument()
  })

  test('renders NoteForm Component', () => {
    render(<App />)

    const titleInput = screen.getByPlaceholderText('Título')
    const descriptionInput = screen.getByPlaceholderText('Criar nota...')
    const favoriteIcon = screen.getByAltText('Not Favorite')

    expect(titleInput).toBeInTheDocument()
    expect(descriptionInput).toBeInTheDocument()
    expect(favoriteIcon).toBeInTheDocument()
  })

  test('render Notes Component', () => {
    useFetchNotes.mockReturnValue({
      notes: [
        {
          id: 1,
          title: 'Note 1',
          description: 'Description 1',
          favorite: true,
        },
        {
          id: 2,
          title: 'Note 2',
          description: 'Description 2',
          favorite: false,
        },
      ],
      error: null,
    })

    render(<App />)

    expect(screen.getByText('Favoritas')).toBeInTheDocument()

    expect(screen.getByText('Note 1')).toBeInTheDocument()
    expect(screen.getByText('Note 2')).toBeInTheDocument()

    expect(screen.queryByText('Outras')).toBeInTheDocument()
  })
})

describe('App Component Functions', () => {
  let mockSubmitNote
  let mockDeleteNote
  let mockUpdateNote
  let setNotes

  beforeEach(() => {
    jest.clearAllMocks()

    mockSubmitNote = jest.fn()
    useSubmitNote.mockReturnValue({ submitNote: mockSubmitNote })

    mockDeleteNote = jest.fn()
    useDeleteNote.mockReturnValue({ deleteNote: mockDeleteNote })

    mockUpdateNote = jest.fn()
    useUpdateNote.mockReturnValue({ updateNote: mockUpdateNote })

    setNotes = jest.fn()
    useFetchNotes.mockReturnValue({
      notes: [],
      setNotes: setNotes,
      error: null,
    })
  })

  test('handleSearch updates searchTerm state', () => {
    render(<App />)

    const searchInput = screen.getByPlaceholderText('Pesquisar notas')
    fireEvent.change(searchInput, { target: { value: 'Test search' } })
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' })

    expect(searchInput.value).toBe('Test search')
  })

  test('handleNoteCreated updates notes state', async () => {
    const newNote = {
      id: 1,
      title: 'Test Title',
      description: 'Test Description',
      favorite: false,
    }

    mockSubmitNote.mockReturnValue(newNote)

    render(<App />)

    const titleInput = screen.getByPlaceholderText('Título')
    const descriptionInput = screen.getByPlaceholderText('Criar nota...')

    fireEvent.change(titleInput, { target: { value: 'Test Title' } })
    fireEvent.change(descriptionInput, {
      target: { value: 'Test Description' },
    })
    fireEvent.keyDown(titleInput, { key: 'Enter', code: 'Enter' })

    await waitFor(() => {
      expect(mockSubmitNote).toHaveBeenCalledWith({
        title: 'Test Title',
        description: 'Test Description',
        favorite: false,
      })
      expect(setNotes).toHaveBeenCalledWith(expect.any(Function))
      expect(setNotes).toHaveBeenCalledWith(expect.arrayContaining([]))
    })
  })

  test('handleNoteDeleted updates notes state', async () => {
    setNotes = jest.fn()
    useFetchNotes.mockReturnValue({
      notes: [
        {
          id: 1,
          title: 'Note 1',
          description: 'Description 1',
          favorite: true,
        },
      ],
      setNotes,
      error: null,
    })

    render(<App />)

    const noteToDelete = {
      id: 1,
      title: 'Note 1',
      description: 'Description 1',
      favorite: true,
    }

    fireEvent.click(screen.getByAltText('Delete'))

    await waitFor(() => {
      expect(mockDeleteNote).toHaveBeenCalledWith(noteToDelete.id)
      expect(setNotes).toHaveBeenCalledWith(expect.any(Function))
      expect(setNotes).toHaveBeenCalledWith(expect.arrayContaining([]))
    })
  })

  test('handleUpdatedNote updates notes state', async () => {
    const initialNotes = [
      { id: 1, title: 'Note 1', description: 'Description 1', color: 'color' },
      { id: 2, title: 'Note 2', description: 'Description 2', color: 'color2' },
    ]

    setNotes = jest.fn()

    useFetchNotes.mockReturnValue({
      notes: initialNotes,
      setNotes,
      error: null,
    })

    const updatedNote = {
      id: 1,
      title: 'Updated Note Title',
      description: 'Updated description',
      color: 'color',
    }

    mockUpdateNote.mockReturnValue(updatedNote)

    render(<App />)

    fireEvent.click(screen.getAllByAltText('Edit')[0])

    const titleInput = screen.getByDisplayValue('Note 1')
    const descriptionInput = screen.getByDisplayValue('Description 1')

    fireEvent.change(titleInput, { target: { value: 'Updated Note Title' } })
    fireEvent.change(descriptionInput, {
      target: { value: 'Updated description' },
    })

    fireEvent.keyDown(titleInput, { key: 'Enter' })

    await waitFor(() => {
      expect(toast.error).not.toHaveBeenCalled()
      expect(toast.error).not.toHaveBeenCalledWith('Failed to submit note')
      expect(mockUpdateNote).toHaveBeenCalledWith(
        1,
        'Updated Note Title',
        'Updated description',
        'color',
      )
      expect(setNotes).toHaveBeenCalledWith(expect.any(Function))
      expect(setNotes).toHaveBeenCalledWith(expect.arrayContaining([]))

      const updateNoteHandler = setNotes.mock.calls[0][0]
      const updatedNotes = updateNoteHandler(initialNotes)

      expect(updatedNotes).toEqual(expect.arrayContaining([updatedNote]))
    })
  })

  test('displays error toast when fetch notes fails', async () => {
    useFetchNotes.mockReturnValue({
      notes: [],
      setNotes: jest.fn(),
      error: 'Failed to fetch notes',
    })

    render(<App />)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Something went wrong while fetching notes.',
      )
    })
  })
})
