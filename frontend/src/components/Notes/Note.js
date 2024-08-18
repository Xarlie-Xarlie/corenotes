import { useState, useEffect } from 'react';
import NoteButton from './NoteButton';
import favoriteIcon from '../../assets/favorite-on.png';
import notFavoriteIcon from '../../assets/favorite-off.png';
import crossIcon from '../../assets/cross.svg';
import changeColorIcon from '../../assets/paint-icon.png';
import editIcon from '../../assets/edit-icon.png';
import useUpdateNote from '../../hooks/useUpdateNote';
import useFavoriteToggle from '../../hooks/useFavoriteToggle';
import useDeleteNote from '../../hooks/useDeleteNote';
import useValidation from '../../hooks/useValidation';
import { toast } from 'react-toastify';

const COLORS = ['#BAE2FF', '#B9FFDD', '#FFE8AC', '#FFCAB9', '#F99494', '#9DD6FF', '#ECA1FF', '#DAFF8B', '#FFA285', '#CDCDCD', '#979797', '#A99A7C'];

function Note({ note, onUpdateNote, onDeleteNote }) {
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
      const response = await toggleFavorite(note.id, !note.favorite);
      if (response.length > 0) {
        response.forEach(e => toast.error(e));
      } else {
        onUpdateNote(response);
      }
    } catch {
      toast.error('Failed to submit note');
    }
  };

  const handleDelete = async () => {
    try {
      const error = await deleteNote(note.id);
      if (error) {
        toast.error(error)
      } else {
        onDeleteNote(note)
      }
    } catch {
      toast.error('Failed to delete note');
    }
  };

  const handleColorChange = async (color) => {
    setNoteColor(color);
    setShowColorSelector(false);
    try {
      const response = await updateNote(note.id, title, description, color);
      if (response.length > 0) {
        response.forEach(e => toast.error(e));
      } else {
        onUpdateNote(response);
      }
    } catch {
      toast.error('Failed to submit note');
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleEditKeyDown = async (event) => {
    if (event.key !== 'Enter' || event.shiftKey) return;

    event.preventDefault()
    const errors = validateFields(title, description);
    if (errors.length) {
      errors.forEach(e => toast.warn(e));
      return;
    }
    setIsEditing(false);
    try {
      const response = await updateNote(note.id, title, description, noteColor);
      if (response.length > 0) {
        response.forEach(e => toast.error(e));
      } else {
        onUpdateNote(response);
      }
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
    <div className="w-full">
      <div
        className="flex flex-col duration-500 note-container w-full lg:w-96 min-h-[450px] rounded-[36px] shadow-md border"
        style={{ backgroundColor: noteColor }}
      >
        <div className={`
        ${noteColor !== "#FFFFFF" ? 'border-white' : 'border-[#D9D9D9]'}
        flex justify-between items-center border-b px-6 pt-4 pb-2
      `}>
          {isEditing ? (
            <input
              className="focus:outline-none break-all text-lg w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleEditKeyDown}
              style={{ backgroundColor: noteColor }}
              autoFocus
            />
          ) : (
            <h3 className="text-sm font-bold break-all lg:truncate hover:text-wrap">{note.title}</h3>
          )}
          <NoteButton
            icon={note.favorite ? favoriteIcon : notFavoriteIcon}
            altText="Favorite"
            onClick={handleFavoriteToggle}
          />
        </div>
        <div className="pt-2 px-6 grow">
          {isEditing ? (
            <textarea
              className="focus:outline-none h-52 w-full resize-y border border-black"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleEditKeyDown}
              style={{ backgroundColor: noteColor }}
            />
          ) : (
            <p className="text-wrap overflow-hidden hover:max-h-full lg:max-h-72">{note.description}</p>
          )}
        </div>
        <div className="flex justify-between gap-2 px-6 py-4">
          <div className="flex gap-4">
            <NoteButton
              icon={editIcon}
              altText="Edit"
              onClick={handleEditToggle}
              isEditing={isEditing}
            />
            <NoteButton
              icon={changeColorIcon}
              altText="Change Color"
              isEditing={showColorSelector}
              onClick={handleColorClick}
            />
          </div>
          <NoteButton icon={crossIcon} altText="Delete" onClick={handleDelete} />
        </div>
      </div>
      {showColorSelector && (
        <div className={`
          absolute
          -mt-4
          ml-16
          flex
          flex-wrap
          rounded-xl
          gap-4
          p-2
          bg-white
          shadow-md
          border
          border-[#D9D9D9]
        `}>
          {COLORS.map(color => (
            <input
              key={color}
              className="cursor-pointer rounded-full size-10"
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
