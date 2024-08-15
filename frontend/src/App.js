import React, { useState, useEffect } from 'react';
import SearchNotes from "./components/SearchNotes/SearchNotes";
import NoteForm from "./components/NoteForm/NoteForm";
import Notes from "./components/Notes/Notes";
import useFetchNotes from './hooks/useFetchNotes';
import { toast, ToastContainer } from 'react-toastify';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const { notes, error } = useFetchNotes(searchTerm);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    if (error) {
      toast.error('Something went wrong while fetching notes.');
    }
  }, [error, searchTerm]);

  return (
    <div>
      <SearchNotes onSearch={handleSearch} />
      <NoteForm />
      <Notes notes={notes} />
      <ToastContainer />
    </div>
  );
}

export default App;
