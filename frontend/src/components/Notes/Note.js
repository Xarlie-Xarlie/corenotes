import { useState, useEffect } from 'react';
import NoteButton from './NoteButton';
import favoriteIcon from '../../assets/favorite-on.png';
import notFavoriteIcon from '../../assets/favorite-off.png';
import crossIcon from '../../assets/cross.svg';
import changeColorIcon from '../../assets/paint-icon.png';
import editIcon from '../../assets/pencil.svg';
import useUpdateNote from '../../hooks/useUpdateNote'; // New hooks for API requests
import useFavoriteToggle from '../../hooks/useFavoriteToggle';
import useDeleteNote from '../../hooks/useDeleteNote';
import useValidation from '../../hooks/useValidation';
import { toast } from 'react-toastify';

const COLORS = ['#FF5733', '#FFBD33', '#DBFF33', '#75FF33', '#33FF57', '#33FFBD', '#33DBFF', '#3375FF', '#5733FF', '#BD33FF', '#FF33DB', '#FF3375'];

function Note({ note }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(note.description);
  const [showColorSelector, setShowColorSelector] = useState(false);
  const [noteColor, setNoteColor] = useState(note.color);

  const { updateNote } = useUpdateNote();
  const { toggleFavorite } = useFavoriteToggle();
  const { deleteNote } = useDeleteNote();
  const { validateFields } = useValidation();

  const handleFavoriteToggle = async () => {
    try {
      await toggleFavorite(note.id, !note.favorite);
    } catch {
      toast.error('Failed to submit note');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNote(note.id);
    } catch {
      toast.error('Failed to delete note');
    }
  };

  const handleColorChange = async (color) => {
    setNoteColor(color);
    setShowColorSelector(false);
    try {
      await updateNote(note.id, title, description, color);
    } catch {
      toast.error('Failed to submit note');
    }
  };

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  const handleEditKeyDown = async (event) => {
    if (event.key !== 'Enter') return;

    event.preventDefault()
    const errors = validateFields(title, description);
    if (errors.length) {
      errors.forEach(e => toast.warn(e));
      return;
    }
    setIsEditing(false);
    try {
      await updateNote(note.id, title, description, noteColor);
    } catch {
      toast.error('Failed to submit note');
    }
  };

  const handleOutsideClick = (event) => {
    if (event.target.closest('.note-container') !== null) return;
    setIsEditing(false);
    setShowColorSelector(false);
  };

  const handleColorClick = () => {
    setShowColorSelector(!showColorSelector);
  };

  useEffect(() => {
    if (isEditing || showColorSelector) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isEditing, showColorSelector]);

  return (
    <div className="note-container p-4 shadow-md border rounded-md">
      <div className="flex justify-between">
        {isEditing ? (
          <input
            className="focus:outline-none text-lg w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleEditKeyDown}
            autoFocus
          />
        ) : (
          <h3 className="text-lg">{note.title}</h3>
        )}
        <NoteButton
          icon={note.favorite ? favoriteIcon : notFavoriteIcon}
          altText="Favorite"
          onClick={handleFavoriteToggle}
        />
      </div>
      <div className="mt-2">
        {isEditing ? (
          <textarea
            className="focus:outline-none w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleEditKeyDown}
          />
        ) : (
          <p>{note.description}</p>
        )}
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <NoteButton icon={crossIcon} altText="Delete" onClick={handleDelete} />
        <NoteButton icon={changeColorIcon} altText="Change Color" onClick={handleColorClick} />
        <NoteButton icon={editIcon} altText="Edit" onClick={handleEditToggle} />
      </div>
      {showColorSelector && (
        <div className="mt-4 flex gap-4">
          {COLORS.map(color => (
            <div
              key={color}
              className="w-8 h-8"
              style={{ backgroundColor: color }}
              onClick={() => handleColorChange(color)}
              data-testid={`color-${color}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Note;
