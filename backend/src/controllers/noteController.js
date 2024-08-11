import noteService from '../services/noteService.js';
import { ValidationError } from 'sequelize';

// Get all notes
export const getAllNotes = async (_req, res) => {
  try {
    const notes = await noteService.getAllNotes();
    res.status(200).json({ notes: notes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve notes' });
  }
};

// Get a single note by ID
export const getNoteById = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await noteService.getNoteById(id);
    if (note) {
      res.status(200).json(note);
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve the note' });
  }
};

// Create a new note
export const createNote = async (req, res) => {
  try {
    const { title, description, favorite } = req.body;
    const note = await noteService.createNote({ title, description, favorite });
    res.status(201).json(note);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.errors.map(e => e.message) });
    } else {
      res.status(500).json({ error: 'Failed to create note' });
    }
  }
};

// Update an existing note
export const updateNote = async (req, res) => {
  const { id } = req.params;
  try {
    const { title, description, favorite } = req.body;
    const note = await noteService.updateNote(id, { title, description, favorite });
    if (note) {
      res.status(200).json(note);
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.errors.map(e => e.message) });
    } else {
      res.status(500).json({ error: 'Failed to update note' });
    }
  }
};

// Delete a note
export const deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    const success = await noteService.deleteNote(id);
    if (success) {
      res.status(204).json({ message: 'Note deleted' });
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
};
