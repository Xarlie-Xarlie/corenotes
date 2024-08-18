import React from 'react';
import useNoteForm from '../../hooks/useNoteForm';
import useValidation from '../../hooks/useValidation';
import useSubmitNote from '../../hooks/useSubmitNote';
import FavoriteIcon from './FavoriteIcon';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NoteForm({ onNoteCreated }) {
  const {
    title, description, favorite,
    handleTitleChange, handleDescriptionChange,
    handleFavoriteToggle, resetForm
  } = useNoteForm();

  const { validateFields } = useValidation();
  const { submitNote } = useSubmitNote();

  const handleSubmit = async (event) => {
    if (event.key !== 'Enter') return;

    event.preventDefault();
    const errors = validateFields(title, description);
    if (errors.length) {
      errors.forEach(e => toast.warn(e));
      return;
    }

    try {
      const response = await submitNote({ title, description, favorite });
      resetForm();

      if (response.errors) {
        response.errors.forEach(e => toast.error(e));
      } else {
        onNoteCreated(response);
        toast.success('Note submitted successfully!');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form className='flex justify-around mt-6 mb-10'>
      <div className='border border-[#D9D9D9] shadow-md bg-white rounded-[30px] md:rounded-md mx-4 md:mx-0 w-full md:w-1/3'>
        <label className='cursor-text flex justify-between py-4 px-6 border-b'>
          <input
            className='w-full focus:outline-none placeholder-black'
            type="text"
            value={title}
            onChange={handleTitleChange}
            onKeyDown={handleSubmit}
            placeholder="Título"
            required
          />
          <FavoriteIcon isFavorite={favorite} onClick={handleFavoriteToggle} />
        </label>
        <input
          className="w-full px-6 py-6 focus:outline-none rounded-[30px] md:rounded-md"
          type="text"
          value={description}
          onChange={handleDescriptionChange}
          onKeyDown={handleSubmit}
          placeholder="Criar nota..."
          required
        />
      </div>
    </form>
  );
}

export default NoteForm;
