import { strict as assert } from 'node:assert';
import { describe, it, beforeEach, mock } from 'node:test';
import noteService from '../../src/services/noteService.js';
import Note from '../../src/models/notes.js';

describe('Note Service', () => {
  let createContext;
  let findAllContext;
  let findByPkContext;
  let searchNotesContext;

  beforeEach(async () => {
    mock.restoreAll();
    createContext = mock.method(Note, 'create');
    findAllContext = mock.method(Note, 'findAll');
    findByPkContext = mock.method(Note, 'findByPk');
    searchNotesContext = mock.method(Note, 'searchNotes');
  });

  it('should create a note', async () => {
    createContext.mock.mockImplementation(async () => ({
      title: 'Service Note',
      description: 'Service layer test',
      favorite: false,
    }));

    const note = await noteService.createNote({
      title: 'Service Note',
      description: 'Service layer test',
      favorite: false,
    });

    assert.equal(note.title, 'Service Note');
    assert.equal(note.description, 'Service layer test');
    assert.equal(note.favorite, false);
    assert.equal(Note.create.mock.callCount(), 1);
  });

  it('shouldn\'t create an invalid note', async () => {
    createContext.mock.mockImplementation(async () => {
      throw "SequelizeValidationError"
    });

    assert.rejects(async () => {
      await noteService.createNote({
        title: 'Service Note',
        description: 'Service layer test',
        favorite: false,
      });
    }, /SequelizeValidationError/);

    assert.equal(Note.create.mock.callCount(), 1);
  });

  it('should retrieve all notes', async () => {
    const note1 = new Note({ title: "test1", description: "description1", favorite: true, id: -2 });
    const note2 = new Note({ title: "test2", description: "description2", favorite: false, id: -1 });

    findAllContext.mock.mockImplementation(async () => [note1, note2]);

    const notes = await noteService.getAllNotes();

    assert.equal(notes.length, 2);
    assert.ok(notes.every(n => n.id == note1.id || n.id == note2.id));
    assert.equal(Note.findAll.mock.callCount(), 1);
  });

  it('should be able to search notes', async () => {
    const note1 = new Note({ title: "test1", description: "description1", favorite: true, id: -2 });
    const note2 = new Note({ title: "test2", description: "description2", favorite: false, id: -1 });

    searchNotesContext.mock.mockImplementation(async () => [note1, note2]);

    const notes = await noteService.getAllNotes('test');

    assert.equal(notes.length, 2);
    assert.ok(notes.every(n => n.id == note1.id || n.id == note2.id));
    assert.equal(Note.searchNotes.mock.callCount(), 1);
    assert.deepEqual(Note.searchNotes.mock.calls[0].arguments[0], 'test');
  });

  it('should be able to find at least one note', async () => {
    const note1 = new Note({ title: "test1", description: "description1", favorite: true, id: -2 });

    searchNotesContext.mock.mockImplementation(async () => [note1]);

    const notes = await noteService.getAllNotes('test');

    assert.equal(notes.length, 1);
    assert.ok(notes.every(n => n.id == note1.id));
    assert.equal(Note.searchNotes.mock.callCount(), 1);
    assert.deepEqual(Note.searchNotes.mock.calls[0].arguments[0], 'test');
  });

  it('should be able to not find notes', async () => {
    searchNotesContext.mock.mockImplementation(async () => []);

    const notes = await noteService.getAllNotes('fdsa');

    assert.equal(notes.length, 0);
    assert.equal(Note.searchNotes.mock.callCount(), 1);
    assert.deepEqual(Note.searchNotes.mock.calls[0].arguments[0], 'fdsa');
  });

  it('should retrieve a single note', async () => {
    const note1 = new Note({ title: "test1", description: "description1", favorite: true, id: -2 });

    findByPkContext.mock.mockImplementation(async () => note1);

    const note = await noteService.getNoteById(note1.id);
    assert.equal(note, note1);
    assert.equal(Note.findByPk.mock.callCount(), 1);
  });

  it('should update a note', async () => {
    const save = mock.fn(async () => null);
    const note1 = { title: "test1", description: "description1", favorite: true, save: save };
    note1.dataValues = note1;

    findByPkContext.mock.mockImplementation(async () => note1);

    const note = await noteService.updateNote(1, {
      title: 'Delete Test',
      description: 'Delete me',
      favorite: false,
    });

    assert.deepStrictEqual(note1, note);
    assert.equal(note.title, 'Delete Test');
    assert.equal(Note.findByPk.mock.callCount(), 1);
    assert.equal(save.mock.callCount(), 1);
  });

  it('shouldn\'t update a note', async () => {
    findByPkContext.mock.mockImplementation(async () => null);

    const note = await noteService.updateNote(1, {
      title: 'Delete Test',
      description: 'Delete me',
      favorite: false,
    });

    assert.deepStrictEqual(null, note);
    assert.equal(Note.findByPk.mock.callCount(), 1);
  });

  it('should delete a note', async () => {
    const detroy = mock.fn(async () => null);
    const note1 = { title: "test1", description: "description1", favorite: true, destroy: detroy };

    findByPkContext.mock.mockImplementation(async () => note1);

    const note = await noteService.deleteNote(1);

    assert.deepStrictEqual(note1, note);
    assert.equal(note.title, 'test1');
    assert.equal(Note.findByPk.mock.callCount(), 1);
    assert.equal(detroy.mock.callCount(), 1);
  });

  it('shouldn\'t delete a note', async () => {
    findByPkContext.mock.mockImplementation(async () => null);

    const note = await noteService.deleteNote(1);

    assert.equal(note, null);
    assert.equal(Note.findByPk.mock.callCount(), 1);
  });
});
