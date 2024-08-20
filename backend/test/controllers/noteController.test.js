import { strict as assert } from 'node:assert'
import { describe, it, beforeEach, mock } from 'node:test'
import noteService from '../../src/services/noteService.js'
import * as noteController from '../../src/controllers/noteController.js'
import { ValidationError } from 'sequelize'

describe('Note Controller', () => {
  let getAllNotesContext
  let getNoteByIdContext
  let createNoteContext
  let updateNoteContext
  let deleteNoteContext

  let mockRequest
  let mockResponse

  let mockJson
  let mockStatus

  beforeEach(() => {
    mock.restoreAll()
    getAllNotesContext = mock.method(noteService, 'getAllNotes')
    getNoteByIdContext = mock.method(noteService, 'getNoteById')
    createNoteContext = mock.method(noteService, 'createNote')
    updateNoteContext = mock.method(noteService, 'updateNote')
    deleteNoteContext = mock.method(noteService, 'deleteNote')
    mockJson = mock.fn((json) => {
      return json
    })
    mockStatus = mock.fn(() => {
      return { json: mockJson }
    })
    mockResponse = { status: mockStatus }
  })

  it('should create a note successfully', async () => {
    const note = {
      title: 'Test Note',
      description: 'Test Description',
      favorite: true,
    }

    mockRequest = { params: {}, body: note, query: {} }

    createNoteContext.mock.mockImplementation(async () => note)

    await noteController.createNote(mockRequest, mockResponse)

    assert.equal(noteService.createNote.mock.callCount(), 1)
    assert.equal(mockStatus.mock.callCount(), 1)
    assert.equal(mockJson.mock.callCount(), 1)
    assert.deepEqual(mockStatus.mock.calls[0].arguments[0], 201)
    assert.deepEqual(mockJson.mock.calls[0].arguments[0], note)
  })

  it('should not create invalid notes', async () => {
    const note = {
      title: 'Test Note',
      description: 'Test Description',
      favorite: true,
    }
    const errorMessage =
      'Validation error: Validation notEmpty on title failed,' +
      '\nValidation error: Title must be between 1 and 255 characters long'

    mockRequest = { params: {}, body: note, query: {} }

    createNoteContext.mock.mockImplementation(async () => {
      throw new ValidationError('Not valid fields', [{ message: errorMessage }])
    })

    await noteController.createNote(mockRequest, mockResponse)

    assert.equal(noteService.createNote.mock.callCount(), 1)
    assert.equal(mockStatus.mock.callCount(), 1)
    assert.equal(mockJson.mock.callCount(), 1)
    assert.deepEqual(mockStatus.mock.calls[0].arguments[0], 400)
    assert.deepEqual(mockJson.mock.calls[0].arguments[0], {
      errors: [errorMessage],
    })
  })

  it('should handle errors when creating a note', async () => {
    const note = {
      title: 'Test Note',
      description: 'Test Description',
      favorite: true,
    }

    mockRequest = { params: {}, body: note, query: {} }

    createNoteContext.mock.mockImplementation(async () => {
      throw Error('SequelizeValidationError')
    })

    await noteController.createNote(mockRequest, mockResponse)

    assert.equal(noteService.createNote.mock.callCount(), 1)
    assert.equal(mockStatus.mock.callCount(), 1)
    assert.equal(mockJson.mock.callCount(), 1)
    assert.deepEqual(mockStatus.mock.calls[0].arguments[0], 500)
    assert.deepEqual(mockJson.mock.calls[0].arguments[0], {
      error: 'Failed to create note',
    })
  })

  it('should retrieve all notes successfully', async () => {
    const notes = [{ title: 'Test Note 1' }, { title: 'Test Note 2' }]
    getAllNotesContext.mock.mockImplementation(async () => notes)

    await noteController.getAllNotes(mockRequest, mockResponse)

    assert.equal(noteService.getAllNotes.mock.callCount(), 1)
    assert.equal(mockStatus.mock.callCount(), 1)
    assert.equal(mockJson.mock.callCount(), 1)
    assert.deepEqual(mockStatus.mock.calls[0].arguments[0], 200)
    assert.deepEqual(mockJson.mock.calls[0].arguments[0], { notes: notes })
  })

  it('should be able to search for notes', async () => {
    const notes = [{ title: 'Test Note 1' }, { title: 'Test Note 2' }]
    getAllNotesContext.mock.mockImplementation(async () => notes)

    mockRequest.query = { search: 'Test' }

    await noteController.getAllNotes(mockRequest, mockResponse)

    assert.equal(noteService.getAllNotes.mock.callCount(), 1)
    assert.deepEqual(noteService.getAllNotes.mock.calls[0].arguments[0], 'Test')
    assert.equal(mockStatus.mock.callCount(), 1)
    assert.equal(mockJson.mock.callCount(), 1)
    assert.deepEqual(mockStatus.mock.calls[0].arguments[0], 200)
    assert.deepEqual(mockJson.mock.calls[0].arguments[0], { notes: notes })
  })

  it('should be able to find at least one notes', async () => {
    const notes = [{ title: 'ASDF' }]
    getAllNotesContext.mock.mockImplementation(async () => notes)

    mockRequest.query = { search: 'ASDF' }

    await noteController.getAllNotes(mockRequest, mockResponse)

    assert.equal(noteService.getAllNotes.mock.callCount(), 1)
    assert.deepEqual(noteService.getAllNotes.mock.calls[0].arguments[0], 'ASDF')
    assert.equal(mockStatus.mock.callCount(), 1)
    assert.equal(mockJson.mock.callCount(), 1)
    assert.deepEqual(mockStatus.mock.calls[0].arguments[0], 200)
    assert.deepEqual(mockJson.mock.calls[0].arguments[0], { notes: notes })
  })

  it('should handle errors when retrieving all notes', async () => {
    getAllNotesContext.mock.mockImplementation(async () => {
      throw Error('SequelizeValidationError')
    })

    await noteController.getAllNotes(mockRequest, mockResponse)

    assert.equal(noteService.getAllNotes.mock.callCount(), 1)
    assert.equal(mockStatus.mock.callCount(), 1)
    assert.equal(mockJson.mock.callCount(), 1)
    assert.deepEqual(mockStatus.mock.calls[0].arguments[0], 500)
    assert.deepEqual(mockJson.mock.calls[0].arguments[0], {
      error: 'Failed to retrieve notes',
    })
  })

  it('should retrieve a single note successfully', async () => {
    const note = { id: 1, title: 'Test Note' }
    mockRequest = { params: { id: 1 } }

    getNoteByIdContext.mock.mockImplementation(async () => note)

    await noteController.getNoteById(mockRequest, mockResponse)

    assert.equal(noteService.getNoteById.mock.callCount(), 1)
    assert.equal(mockStatus.mock.callCount(), 1)
    assert.equal(mockJson.mock.callCount(), 1)
    assert.deepEqual(mockStatus.mock.calls[0].arguments[0], 200)
    assert.deepEqual(mockJson.mock.calls[0].arguments[0], note)
  })

  it('should handle when it does not find the note', async () => {
    mockRequest = { params: { id: 1 } }

    getNoteByIdContext.mock.mockImplementation(async () => null)

    await noteController.getNoteById(mockRequest, mockResponse)

    assert.equal(noteService.getNoteById.mock.callCount(), 1)
    assert.equal(mockStatus.mock.callCount(), 1)
    assert.equal(mockJson.mock.callCount(), 1)
    assert.deepEqual(mockStatus.mock.calls[0].arguments[0], 404)
    assert.deepEqual(mockJson.mock.calls[0].arguments[0], {
      error: 'Note not found',
    })
  })

  it('should handle errors when retrieving a single note', async () => {
    mockRequest = { params: { id: 1 } }

    getNoteByIdContext.mock.mockImplementation(async () => {
      throw Error('SequelizeValidationError')
    })

    await noteController.getNoteById(mockRequest, mockResponse)

    assert.equal(noteService.getNoteById.mock.callCount(), 1)
    assert.equal(mockStatus.mock.callCount(), 1)
    assert.equal(mockJson.mock.callCount(), 1)
    assert.deepEqual(mockStatus.mock.calls[0].arguments[0], 500)
    assert.deepEqual(mockJson.mock.calls[0].arguments[0], {
      error: 'Failed to retrieve the note',
    })
  })

  it('should update a note successfully', async () => {
    const note = {
      id: 1,
      title: 'Updated Note',
      description: 'Updated Description',
      favorite: false,
    }
    mockRequest = { params: { id: 1 }, body: note }

    updateNoteContext.mock.mockImplementation(async () => note)

    await noteController.updateNote(mockRequest, mockResponse)

    assert.equal(noteService.updateNote.mock.callCount(), 1)
    assert.equal(mockStatus.mock.callCount(), 1)
    assert.equal(mockJson.mock.callCount(), 1)
    assert.deepEqual(mockStatus.mock.calls[0].arguments[0], 200)
    assert.deepEqual(mockJson.mock.calls[0].arguments[0], note)
  })

  it('should not update when it does not found the note', async () => {
    mockRequest = { params: { id: 1 }, body: {} }

    updateNoteContext.mock.mockImplementation(async () => null)

    await noteController.updateNote(mockRequest, mockResponse)

    assert.equal(noteService.updateNote.mock.callCount(), 1)
    assert.equal(mockStatus.mock.callCount(), 1)
    assert.equal(mockJson.mock.callCount(), 1)
    assert.deepEqual(mockStatus.mock.calls[0].arguments[0], 404)
    assert.deepEqual(mockJson.mock.calls[0].arguments[0], {
      error: 'Note not found',
    })
  })

  it('should not update for invalid data', async () => {
    const note = {
      title: 'Test Note',
      description: 'Test Description',
      favorite: true,
    }
    const errorMessage =
      'Validation error: Validation notEmpty on title failed,' +
      '\nValidation error: Title must be between 1 and 255 characters long'

    mockRequest = { params: { id: 1 }, body: note, query: {} }

    updateNoteContext.mock.mockImplementation(async () => {
      throw new ValidationError('Not valid fields', [{ message: errorMessage }])
    })

    await noteController.updateNote(mockRequest, mockResponse)

    assert.equal(noteService.updateNote.mock.callCount(), 1)
    assert.equal(mockStatus.mock.callCount(), 1)
    assert.equal(mockJson.mock.callCount(), 1)
    assert.deepEqual(mockStatus.mock.calls[0].arguments[0], 400)
    assert.deepEqual(mockJson.mock.calls[0].arguments[0], {
      error: [errorMessage],
    })
  })

  it('should handle errors when updating a note', async () => {
    const note = {
      title: 'Test Note',
      description: 'Test Description',
      favorite: true,
    }
    mockRequest = { params: { id: 1 }, body: note, query: {} }

    updateNoteContext.mock.mockImplementation(async () => {
      throw new Error('Test error')
    })

    await noteController.updateNote(mockRequest, mockResponse)

    assert.equal(noteService.updateNote.mock.callCount(), 1)
    assert.equal(mockStatus.mock.callCount(), 1)
    assert.equal(mockJson.mock.callCount(), 1)
    assert.deepEqual(mockStatus.mock.calls[0].arguments[0], 500)
    assert.deepEqual(mockJson.mock.calls[0].arguments[0], {
      error: 'Failed to update note',
    })
  })

  it('should delete a note successfully', async () => {
    const note = { id: 1, title: 'Test Note' }
    mockRequest = { params: { id: 1 } }

    deleteNoteContext.mock.mockImplementation(async () => note)

    await noteController.deleteNote(mockRequest, mockResponse)

    assert.equal(noteService.deleteNote.mock.callCount(), 1)
    assert.equal(mockStatus.mock.callCount(), 1)
    assert.equal(mockJson.mock.callCount(), 1)
    assert.equal(mockJson.mock.calls[0].arguments[0], undefined)
    assert.deepEqual(mockStatus.mock.calls[0].arguments[0], 204)
  })

  it('should not delete a note that does not exists', async () => {
    mockRequest = { params: { id: 1 } }

    deleteNoteContext.mock.mockImplementation(async () => null)

    await noteController.deleteNote(mockRequest, mockResponse)

    assert.equal(noteService.deleteNote.mock.callCount(), 1)
    assert.equal(mockStatus.mock.callCount(), 1)
    assert.equal(mockJson.mock.callCount(), 1)
    assert.deepEqual(mockStatus.mock.calls[0].arguments[0], 404)
    assert.deepEqual(mockJson.mock.calls[0].arguments[0], {
      error: 'Note not found',
    })
  })

  it('should handle errors when deleting a note', async () => {
    mockRequest = { params: { id: 1 } }

    deleteNoteContext.mock.mockImplementation(async () => {
      throw Error('Error Deleting')
    })

    await noteController.deleteNote(mockRequest, mockResponse)

    assert.equal(noteService.deleteNote.mock.callCount(), 1)
    assert.equal(mockStatus.mock.callCount(), 1)
    assert.equal(mockJson.mock.callCount(), 1)
    assert.deepEqual(mockStatus.mock.calls[0].arguments[0], 500)
    assert.deepEqual(mockJson.mock.calls[0].arguments[0], {
      error: 'Failed to delete note',
    })
  })
})
