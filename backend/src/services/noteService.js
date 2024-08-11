import Note from '../models/notes.js';

const getAllNotes = async () => {
  return await Note.findAll();
};

const getNoteById = async (id) => {
  return await Note.findByPk(id);
};

const createNote = async (data) => {
  return await Note.create(data);
};

const updateNote = async (id, data) => {
  const note = await Note.findByPk(id);
  if (note) {
    note.title = data.title ? data.title : note.title;
    note.description = data.description ? data.description : note.description;
    note.favorite = data.favorite ? data.favorite : note.favorite;
    await note.save();
    return note;
  }
  return null;
};

const deleteNote = async (id) => {
  const note = await Note.findByPk(id);
  if (note) {
    await note.destroy();
    return note;
  }
  return null;
};

export default { getAllNotes, getNoteById, createNote, updateNote, deleteNote } 
