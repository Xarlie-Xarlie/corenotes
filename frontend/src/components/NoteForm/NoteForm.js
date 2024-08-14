import React, { useState } from 'react';
import favoriteIcon from '../../assets/favorite-on.png';
import notFavoriteIcon from '../../assets/favorite-off.png';
import submitNoteHook from '../../hooks/SubmitNoteHook';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NoteForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [favorite, setFavorite] = useState(false);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleFavoriteToggle = () => {
    setFavorite(prevFavorite => !prevFavorite);
  };

  const validateFields = (title, description) => {
    const errors = [];
    if (!title.trim()) errors.push('Título não pode ser nulo!');
    if (!description.trim()) errors.push('Descrição não pode ser nulo!');
    return errors;
  };

  const handleSubmit = async (event) => {
    if (event.key !== 'Enter') return;

    event.preventDefault();
    const errors = validateFields(title, description);
    if (errors.length) {
      errors.forEach(e => toast.warn(e));
      return;
    }

    try {
      const response = await submitNoteHook({ title, description, favorite });
      setTitle('');
      setDescription('');
      setFavorite(false);

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
            type="text"
            placeholder="Título"
            value={title}
            onChange={handleTitleChange}
            onKeyDown={handleSubmit}
            required
          />
          <img
            className="cursor-pointer size-6"
            src={favorite ? favoriteIcon : notFavoriteIcon}
            alt={favorite ? 'Favorite' : 'Not Favorite'}
            onClick={handleFavoriteToggle}
          />
        </div>
        <div className='flex'>
          <input
            type="text"
            className='py-4 px-6 w-full focus:outline-none'
            placeholder="Criar nota..."
            value={description}
            onChange={handleDescriptionChange}
            onKeyDown={handleSubmit}
          />
        </div>
        <ToastContainer />
      </div>
    </form>
  );
}

export default NoteForm;
