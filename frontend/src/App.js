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

  notes.push({ id: 1, title: 'title 1', description: 'description 1', favorite: true })
  notes.push({ id: 2, title: 'title 2', description: 'description 2', favorite: false })
  notes.push({ id: 3, title: 'title 3', description: 'description 3', favorite: true })
  notes.push({ id: 4, title: 'title 4', description: 'description 4', favorite: false })
  notes.push({ id: 5, title: 'title 5', description: 'description 5', favorite: true })

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
