import Notes from '../models/notes.js';

const getAllNotes = async (searchTerm = null) => {
  if (searchTerm) {
    return await Notes.searchNotes(searchTerm);
  }

  return await Notes.findAll();
};

const getNoteById = async (id) => {
  return await Notes.findByPk(id);
};

const createNote = async (data) => {
  return await Notes.create(data);
};

const updateNote = async (id, data) => {
  const note = await Notes.findByPk(id);
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
  const note = await Notes.findByPk(id);
  if (note) {
    await note.destroy();
    return note;
  }
  return null;
};

export default { getAllNotes, getNoteById, createNote, updateNote, deleteNote } 
