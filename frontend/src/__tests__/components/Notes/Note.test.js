import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Note from '../../../components/Notes/Note'
import favoriteIcon from '../../../assets/favorite-on.png'
import { toast } from 'react-toastify'
import useUpdateNote from '../../../hooks/useUpdateNote'
import useFavoriteToggle from '../../../hooks/useFavoriteToggle'
import useDeleteNote from '../../../hooks/useDeleteNote'

const mockNote = {
  id: 1,
  title: 'Sample Note',
  description: 'This is a sample note description.',
  favorite: true,
  color: '#FF5733',
}

jest.mock('../../../hooks/useUpdateNote')
jest.mock('../../../hooks/useFavoriteToggle')
jest.mock('../../../hooks/useDeleteNote')
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div />,
}))

const COLORS = [
  '#BAE2FF',
  '#B9FFDD',
  '#FFE8AC',
  '#FFCAB9',
  '#F99494',
  '#9DD6FF',
  '#ECA1FF',
  '#DAFF8B',
  '#FFA285',
  '#CDCDCD',
  '#979797',
  '#A99A7C',
]

describe('Note Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    useUpdateNote.mockReturnValue({ updateNote: jest.fn() })
    useFavoriteToggle.mockReturnValue({ toggleFavorite: jest.fn() })
    useDeleteNote.mockReturnValue({ deleteNote: jest.fn() })
  })

  test('renders the note with title, description, and correct favorite icon', () => {
    render(<Note note={mockNote} />)

    expect(screen.getByText('Sample Note')).toBeInTheDocument()
    expect(
      screen.getByText('This is a sample note description.'),
    ).toBeInTheDocument()
    expect(screen.getByAltText('Favorite')).toHaveAttribute('src', favoriteIcon)
  })
})

describe('Note Component - Text updates', () => {
  let mockUpdateNote

  beforeEach(() => {
    jest.clearAllMocks()
    mockUpdateNote = jest.fn()
    useUpdateNote.mockReturnValue({ updateNote: mockUpdateNote })
    useFavoriteToggle.mockReturnValue({ toggleFavorite: jest.fn() })
    useDeleteNote.mockReturnValue({ deleteNote: jest.fn() })
  })

  test('Clicking the title or description does not activate edit mode', () => {
    render(<Note note={mockNote} />)

    fireEvent.click(screen.getByText('Sample Note'))
    fireEvent.click(screen.getByText('This is a sample note description.'))

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  test('Clicking the edit button allows user to change title and description without triggering onUpdate', () => {
    render(<Note note={mockNote} />)

    fireEvent.click(screen.getByAltText('Edit'))

    const titleInput = screen.getByDisplayValue('Sample Note')
    const descriptionInput = screen.getByDisplayValue(
      'This is a sample note description.',
    )

    fireEvent.change(titleInput, { target: { value: 'Updated Note Title' } })
    fireEvent.change(descriptionInput, {
      target: { value: 'Updated description' },
    })

    expect(titleInput.value).toBe('Updated Note Title')
    expect(descriptionInput.value).toBe('Updated description')
    expect(mockUpdateNote).not.toHaveBeenCalled()
  })

  test('Clicking edit, changing title/description, and pressing "Enter" triggers onUpdate with new title and description', () => {
    render(<Note note={mockNote} />)

    fireEvent.click(screen.getByAltText('Edit'))

    const titleInput = screen.getByDisplayValue('Sample Note')
    const descriptionInput = screen.getByDisplayValue(
      'This is a sample note description.',
    )

    fireEvent.change(titleInput, { target: { value: 'Updated Note Title' } })
    fireEvent.change(descriptionInput, {
      target: { value: 'Updated description' },
    })

    fireEvent.keyDown(titleInput, { key: 'Enter' })

    expect(mockUpdateNote).toHaveBeenCalledWith(
      mockNote.id,
      'Updated Note Title',
      'Updated description',
      mockNote.color,
    )
  })

  test('Clicking edit, changing title/description, and pressing "Enter" does not triggers onUpdate with new empty title or description', () => {
    render(<Note note={mockNote} />)

    fireEvent.click(screen.getByAltText('Edit'))

    const titleInput = screen.getByDisplayValue('Sample Note')
    const descriptionInput = screen.getByDisplayValue(
      'This is a sample note description.',
    )

    fireEvent.change(titleInput, { target: { value: '' } })
    fireEvent.change(descriptionInput, { target: { value: '' } })

    fireEvent.keyDown(titleInput, { key: 'Enter' })

    expect(mockUpdateNote).not.toHaveBeenCalled()
  })

  test('Clicking edit, changing title/description, and clicking outside does not trigger onUpdate and does not persist changes', () => {
    render(<Note note={mockNote} />)

    fireEvent.click(screen.getByAltText('Edit'))

    const titleInput = screen.getByDisplayValue('Sample Note')
    const descriptionInput = screen.getByDisplayValue(
      'This is a sample note description.',
    )

    fireEvent.change(titleInput, { target: { value: 'Updated Note Title' } })
    fireEvent.change(descriptionInput, {
      target: { value: 'Updated description' },
    })

    fireEvent.click(document.body)

    expect(mockUpdateNote).not.toHaveBeenCalled()
    expect(screen.getByText('Sample Note')).toBeInTheDocument()
    expect(
      screen.getByText('This is a sample note description.'),
    ).toBeInTheDocument()
  })

  test('Clicking edit, changing title/description, and pressing "shift + enter" does not trigger onUpdate', () => {
    render(<Note note={mockNote} />)

    fireEvent.click(screen.getByAltText('Edit'))

    const titleInput = screen.getByDisplayValue('Sample Note')

    fireEvent.change(titleInput, { target: { value: 'Updated Note Title' } })
    fireEvent.keyDown(titleInput, { key: 'Enter', shiftKey: true })

    expect(mockUpdateNote).not.toHaveBeenCalled()
    expect(titleInput.value).toBe('Updated Note Title')
  })
})

describe('Note Component - Favorite toggle', () => {
  let mockFavoriteToggle

  beforeEach(() => {
    jest.clearAllMocks()
    mockFavoriteToggle = jest.fn()
    useUpdateNote.mockReturnValue({ updateNote: jest.fn() })
    useFavoriteToggle.mockReturnValue({ toggleFavorite: mockFavoriteToggle })
    useDeleteNote.mockReturnValue({ deleteNote: jest.fn() })
  })

  test('Clicking the favorite button triggers onUpdateNote hook', () => {
    render(<Note note={mockNote} />)

    fireEvent.click(screen.getByAltText('Favorite'))

    expect(mockFavoriteToggle).toHaveBeenCalledWith(
      mockNote.id,
      !mockNote.favorite,
    )
  })

  test('Clicking the favorite button triggers onUpdateNote callback', async () => {
    const mockOnUpdateNote = jest.fn()
    mockFavoriteToggle.mockReturnValue({
      ...mockNote,
      favorite: !mockNote.favorite,
    })
    render(<Note note={mockNote} onUpdateNote={mockOnUpdateNote} />)

    fireEvent.click(screen.getByAltText('Favorite'))

    await waitFor(() => {
      expect(mockFavoriteToggle).toHaveBeenCalledWith(
        mockNote.id,
        !mockNote.favorite,
      )
      expect(mockOnUpdateNote).toHaveBeenCalledWith({
        ...mockNote,
        favorite: !mockNote.favorite,
      })
    })
  })
})

describe('Note Component - Change Color', () => {
  let mockUpdateNote

  beforeEach(() => {
    jest.clearAllMocks()
    mockUpdateNote = jest.fn()
    useUpdateNote.mockReturnValue({ updateNote: mockUpdateNote })
    useFavoriteToggle.mockReturnValue({ toggleFavorite: jest.fn() })
    useDeleteNote.mockReturnValue({ deleteNote: jest.fn() })
  })

  test('Clicking the changeColor button opens the color picker', () => {
    render(<Note note={mockNote} />)

    fireEvent.click(screen.getByAltText('Change Color'))

    COLORS.forEach((color) => {
      expect(screen.getByTestId(`color-${color}`)).toBeInTheDocument()
    })
  })

  test('Clicking the changeColor button and then a color triggers onUpdate hook with new color', () => {
    render(<Note note={mockNote} />)

    fireEvent.click(screen.getByAltText('Change Color'))

    const newColor = COLORS[0]
    fireEvent.click(screen.getByTestId(`color-${newColor}`))

    expect(mockUpdateNote).toHaveBeenCalledWith(
      mockNote.id,
      mockNote.title,
      mockNote.description,
      newColor,
    )
  })

  test('Clicking changeColor twice closes the color picker', () => {
    render(<Note note={mockNote} />)

    fireEvent.click(screen.getByAltText('Change Color'))
    fireEvent.click(screen.getByAltText('Change Color'))

    COLORS.forEach((color) => {
      expect(screen.queryByTestId(`color-${color}`)).not.toBeInTheDocument()
    })
  })

  test('Clicking changeColor and then clicking outside closes the color picker', () => {
    render(<Note note={mockNote} />)

    fireEvent.click(screen.getByAltText('Change Color'))

    fireEvent.click(document.body)

    COLORS.forEach((color) => {
      expect(screen.queryByTestId(`color-${color}`)).not.toBeInTheDocument()
    })
  })
})

describe('Note Component - Delete Note', () => {
  let mockDeleteNote

  beforeEach(() => {
    jest.clearAllMocks()
    mockDeleteNote = jest.fn()
    useUpdateNote.mockReturnValue({ updateNote: jest.fn() })
    useFavoriteToggle.mockReturnValue({ toggleFavorite: jest.fn() })
    useDeleteNote.mockReturnValue({ deleteNote: mockDeleteNote })
  })

  test('Clicking the delete button triggers onDelete hook', () => {
    render(<Note note={mockNote} />)

    fireEvent.click(screen.getByAltText('Delete'))

    expect(mockDeleteNote).toHaveBeenCalledWith(mockNote.id)
  })

  test('Clicking the delete button triggers onDeleteNote callback', async () => {
    const mockOnDeleteNote = jest.fn()
    mockDeleteNote.mockResolvedValue(null)
    render(<Note note={mockNote} onDeleteNote={mockOnDeleteNote} />)

    fireEvent.click(screen.getByAltText('Delete'))

    await waitFor(() => {
      expect(mockDeleteNote).toHaveBeenCalledWith(mockNote.id)
      expect(mockOnDeleteNote).toHaveBeenCalledWith(mockNote)
    })
  })
})

describe('Note Component - Toast Messages', () => {
  let mockNote
  let mockUpdateNote
  let mockFavoriteToggle
  let mockDeleteNote

  beforeEach(() => {
    jest.clearAllMocks()
    mockNote = {
      id: 1,
      title: 'Sample Title',
      description: 'Sample Description',
      favorite: false,
      color: '#FFFFFF',
    }
    mockUpdateNote = jest.fn()
    mockFavoriteToggle = jest.fn()
    mockDeleteNote = jest.fn()

    useUpdateNote.mockReturnValue({ updateNote: mockUpdateNote })
    useFavoriteToggle.mockReturnValue({ toggleFavorite: mockFavoriteToggle })
    useDeleteNote.mockReturnValue({ deleteNote: mockDeleteNote })
  })

  test('If the user tries to change the title to empty and submit, it shows a warn toast', async () => {
    render(<Note note={mockNote} />)

    fireEvent.click(screen.getByAltText('Edit'))
    fireEvent.change(screen.getByDisplayValue('Sample Title'), {
      target: { value: '' },
    })
    fireEvent.keyDown(screen.getByDisplayValue(''), {
      key: 'Enter',
      code: 'Enter',
    })

    expect(toast.warn).toHaveBeenCalledWith('Título não pode ser nulo!')
    expect(mockUpdateNote).not.toHaveBeenCalled()
  })

  test('If the user tries to change the description to empty and submit, it shows a warn toast', async () => {
    render(<Note note={mockNote} />)

    fireEvent.click(screen.getByAltText('Edit'))
    fireEvent.change(screen.getByDisplayValue('Sample Description'), {
      target: { value: '' },
    })
    fireEvent.keyDown(screen.getByDisplayValue(''), {
      key: 'Enter',
      code: 'Enter',
    })

    expect(toast.warn).toHaveBeenCalledWith('Descrição não pode ser nulo!')
    expect(mockUpdateNote).not.toHaveBeenCalled()
  })

  test('If the user tries to change both title and description to empty and submit, it shows two warn toasts', async () => {
    render(<Note note={mockNote} />)

    fireEvent.click(screen.getByAltText('Edit'))
    const titleInput = screen.getByDisplayValue('Sample Title')
    fireEvent.change(titleInput, { target: { value: '' } })
    fireEvent.change(screen.getByDisplayValue('Sample Description'), {
      target: { value: '' },
    })
    fireEvent.keyDown(titleInput, { key: 'Enter', code: 'Enter' })

    expect(toast.warn).toHaveBeenCalledWith('Título não pode ser nulo!')
    expect(toast.warn).toHaveBeenCalledWith('Descrição não pode ser nulo!')
    expect(mockUpdateNote).not.toHaveBeenCalled()
  })

  test('If the onUpdate hook fails, it shows an error toast', async () => {
    mockUpdateNote.mockRejectedValueOnce(new Error('Failed to submit note'))

    render(<Note note={mockNote} />)

    fireEvent.click(screen.getByAltText('Edit'))
    fireEvent.keyDown(screen.getByDisplayValue('Sample Title'), {
      key: 'Enter',
      code: 'Enter',
    })

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to submit note')
    })

    expect(mockUpdateNote).toHaveBeenCalled()
  })

  test('If the onUpdate hook fails, it shows returned errors in toast', async () => {
    mockUpdateNote.mockResolvedValue([
      'Title is null',
      'Description is greater than allowed',
    ])
    const mockOnUpdateNote = jest.fn()

    render(<Note note={mockNote} onUpdateNote={mockOnUpdateNote} />)

    fireEvent.click(screen.getByAltText('Edit'))
    fireEvent.keyDown(screen.getByDisplayValue('Sample Title'), {
      key: 'Enter',
      code: 'Enter',
    })

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Title is null')
      expect(toast.error).toHaveBeenCalledWith(
        'Description is greater than allowed',
      )
      expect(mockUpdateNote).toHaveBeenCalled()
      expect(mockOnUpdateNote).not.toHaveBeenCalled()
    })
  })

  test('If the onUpdate hook did not fail, toasts are not rendered', async () => {
    mockUpdateNote.mockResolvedValue({ ...mockNote, title: 'Updated title' })
    const mockOnUpdateNote = jest.fn()

    render(<Note note={mockNote} onUpdateNote={mockOnUpdateNote} />)

    fireEvent.click(screen.getByAltText('Edit'))
    fireEvent.keyDown(screen.getByDisplayValue('Sample Title'), {
      key: 'Enter',
      code: 'Enter',
    })

    await waitFor(() => {
      expect(toast.error).not.toHaveBeenCalled()
      expect(mockUpdateNote).toHaveBeenCalledWith(
        mockNote.id,
        mockNote.title,
        mockNote.description,
        mockNote.color,
      )
      expect(mockOnUpdateNote).toHaveBeenCalledWith({
        ...mockNote,
        title: 'Updated title',
      })
    })
  })

  test('If changeColor hook fails, it shows all toast messages', async () => {
    mockUpdateNote.mockResolvedValue([
      'Color is null',
      'This color is not allowed',
    ])
    const mockOnUpdateNote = jest.fn()

    render(<Note note={mockNote} onUpdateNote={mockOnUpdateNote} />)

    fireEvent.click(screen.getByAltText('Change Color'))

    const newColor = COLORS[0]
    fireEvent.click(screen.getByTestId(`color-${newColor}`))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Color is null')
      expect(toast.error).toHaveBeenCalledWith('This color is not allowed')
      expect(mockUpdateNote).toHaveBeenCalledWith(
        mockNote.id,
        mockNote.title,
        mockNote.description,
        newColor,
      )
      expect(mockOnUpdateNote).not.toHaveBeenCalled()
    })
  })

  test('If changeColor hook did not fail, toast messages are not rendered', async () => {
    const newColor = COLORS[3]
    mockUpdateNote.mockResolvedValue({ ...mockNote, color: newColor })
    const mockOnUpdateNote = jest.fn()

    render(<Note note={mockNote} onUpdateNote={mockOnUpdateNote} />)

    fireEvent.click(screen.getByAltText('Change Color'))
    fireEvent.click(screen.getByTestId(`color-${newColor}`))

    await waitFor(() => {
      expect(toast.error).not.toHaveBeenCalled()
      expect(mockUpdateNote).toHaveBeenCalledWith(
        mockNote.id,
        mockNote.title,
        mockNote.description,
        newColor,
      )
      expect(mockOnUpdateNote).toHaveBeenCalledWith({
        ...mockNote,
        color: newColor,
      })
    })
  })

  test('If the toggleFavorite hook fails, it shows all toast error messages', async () => {
    mockFavoriteToggle.mockResolvedValue([
      'Title is null',
      'Description is greater than allowed',
    ])
    const mockOnUpdateNote = jest.fn()

    render(<Note note={mockNote} onUpdateNote={mockOnUpdateNote} />)

    fireEvent.click(screen.getByAltText('Favorite'))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Title is null')
      expect(toast.error).toHaveBeenCalledWith(
        'Description is greater than allowed',
      )
      expect(mockFavoriteToggle).toHaveBeenCalledWith(1, true)
      expect(mockOnUpdateNote).not.toHaveBeenCalled()
    })
  })

  test('If the toggleFavorite hook fails, it shows a default error toast', async () => {
    mockFavoriteToggle.mockRejectedValueOnce(new Error('Failed to submit note'))
    const mockOnUpdateNote = jest.fn()

    render(<Note note={mockNote} onUpdateNote={mockOnUpdateNote} />)

    fireEvent.click(screen.getByAltText('Favorite'))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to submit note')
      expect(mockFavoriteToggle).toHaveBeenCalledWith(1, true)
      expect(mockOnUpdateNote).not.toHaveBeenCalled()
    })
  })

  test('If the onDelete hook fails, it shows an error toast', async () => {
    mockDeleteNote.mockRejectedValueOnce(new Error('Failed to delete note'))

    render(<Note note={mockNote} />)

    fireEvent.click(screen.getByAltText('Delete'))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to delete note')
    })
  })

  test('If the onDelete hook fails, it shows an error toast', async () => {
    mockDeleteNote.mockRejectedValueOnce(new Error('Failed to delete note'))

    render(<Note note={mockNote} />)

    fireEvent.click(screen.getByAltText('Delete'))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to delete note')
    })
  })

  test('If the onDelete hook returns an error message, it shows an error toast', async () => {
    mockDeleteNote.mockReturnValueOnce('Note not found')

    render(<Note note={mockNote} />)

    fireEvent.click(screen.getByAltText('Delete'))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Note not found')
    })
  })
})
