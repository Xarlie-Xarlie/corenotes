import React from 'react';
import useNoteForm from '../../hooks/useNoteForm';
import useValidation from '../../hooks/useValidation';
import useSubmitNote from '../../hooks/useSubmitNote';
import FavoriteIcon from './FavoriteIcon';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NoteForm() {
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
        toast.success('Note submitted successfully!');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form className='flex justify-around mt-6 mb-10'>
      <div className='rounded-md border border-[#D9D9D9] shadow-md bg-white w-1/3'>
        <div className='flex justify-between py-4 px-6 border-b'>
          <input
            className='w-full focus:outline-none placeholder-black'
            value={title}
            onChange={handleTitleChange}
            onKeyDown={handleSubmit}
            placeholder="Título"
            required
          />
          <FavoriteIcon isFavorite={favorite} onClick={handleFavoriteToggle} />
        </div>
        <div className='flex'>
          <input
            extraClasses={''}
            className="w-full px-4 py-6 focus:outline-none"
            value={description}
            onChange={handleDescriptionChange}
            onKeyDown={handleSubmit}
            placeholder="Criar nota..."
            required
          />
        </div>
        <ToastContainer />
      </div>
    </form>
  );
}

export default NoteForm;
