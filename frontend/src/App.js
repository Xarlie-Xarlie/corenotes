import React, { useState, useEffect } from 'react';
import SearchNotes from "./components/SearchNotes/SearchNotes";
import NoteForm from "./components/NoteForm/NoteForm";
import Notes from "./components/Notes/Notes";
import useFetchNotes from './hooks/useFetchNotes';
import { toast, ToastContainer } from 'react-toastify';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const { notes, setNotes, error } = useFetchNotes(searchTerm);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    if (error) {
      toast.error('Something went wrong while fetching notes.');
    }
  }, [error, searchTerm]);

  const handleNoteCreated = (newNote) => {
    setNotes(prevNotes => [newNote, ...prevNotes]);
  };

  const handleNoteDeleted = (deletedNote) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== deletedNote.id));
  };

  const handleFavoriteToggle = (updatedNote) => {
    setNotes(prevNotes =>
      prevNotes.map(note => note.id === updatedNote.id ? updatedNote : note)
    );
  };

  return (
    <div>
      <SearchNotes onSearch={handleSearch} />
      <NoteForm onNoteCreated={handleNoteCreated} />
      <Notes
        notes={notes}
        onFavoriteToggle={handleFavoriteToggle}
        onDeleteNote={handleNoteDeleted}
      />
      <ToastContainer />
    </div>
  );
}

export default App;
