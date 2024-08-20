import Notes from '../models/notes.js'

const getAllNotes = async (searchTerm = null) => {
  if (searchTerm) {
    return await Notes.searchNotes(searchTerm)
  }

  return await Notes.findAll()
}

const getNoteById = async (id) => {
  return await Notes.findByPk(id)
}

const createNote = async (data) => {
  return await Notes.create(data)
}

const updateNote = async (id, data) => {
  const note = await Notes.findByPk(id)
  if (note) {
    note.title = data.title !== undefined ? data.title : note.title
    note.description =
      data.description !== undefined ? data.description : note.description
    note.favorite = data.favorite !== undefined ? data.favorite : note.favorite
    note.color = data.color !== undefined ? data.color : note.color
    await note.save()
    return note.dataValues
  }
  return null
}

const deleteNote = async (id) => {
  const note = await Notes.findByPk(id)
  if (note) {
    await note.destroy()
    return note
  }
  return null
}

export default { getAllNotes, getNoteById, createNote, updateNote, deleteNote }
