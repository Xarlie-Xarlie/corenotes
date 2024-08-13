import React, { useState } from 'react';
import favoriteIcon from '../../assets/favorite-on.png';
import notFavoriteIcon from '../../assets/favorite-off.png';

function NoteForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [error, setError] = useState('');

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleFavoriteToggle = () => {
    setFavorite(prevFavorite => !prevFavorite);
  };

  const handleSubmit = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!title.trim()) {
        setError('Título não pode ser nulo');
        return;
      }
      setError('');
      try {
        await onSubmit({ title, description, favorite });
        setTitle('');
        setDescription('');
        setFavorite(false);
      } catch (e) {
        setError('Failed to submit the form');
      }
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
        {error && <div className="text-red-500 flex-0">{error}</div>}
      </div>
    </form>
  );
}

export default NoteForm;
