import { useState, useEffect } from 'react';

const api = process.env.API_URL || 'http://localhost'
const port = process.env.API_PORT || '3333'

const useFetchNotes = (searchTerm) => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`${api}:${port}/api/notes?search=${searchTerm}`);

        if (!response.ok) {
          throw new Error('Failed to fetch notes');
        }

        const data = await response.json();

        if (data.notes) {
          setNotes(data.notes);
        } else if (data.error) {
          throw new Error(data.error);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    // Fetch notes only if searchTerm is not empty
    if (searchTerm) {
      fetchNotes();
    }
  }, [searchTerm]);

  return { notes, error };
};

export default useFetchNotes;
