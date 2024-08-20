import { useState } from 'react'

const useNoteForm = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [favorite, setFavorite] = useState(false)

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value)
  }

  const handleFavoriteToggle = () => {
    setFavorite((prevFavorite) => !prevFavorite)
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setFavorite(false)
  }

  return {
    title,
    description,
    favorite,
    handleTitleChange,
    handleDescriptionChange,
    handleFavoriteToggle,
    resetForm,
  }
}

export default useNoteForm
