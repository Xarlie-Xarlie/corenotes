import { useState, useEffect } from 'react';

const url = process.env.API_URL || 'http://localhost'
const port = process.env.API_PORT || '3333'

const useFetchNotes = (searchTerm) => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const getUrl = searchTerm === '' ?
          `${url}:${port}/api/notes`
          : `${url}:${port}/api/notes?search=${searchTerm}`;

        const response = await fetch(getUrl);
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

    fetchNotes();
  }, [searchTerm]);

  return { notes, error };
};

export default useFetchNotes;
