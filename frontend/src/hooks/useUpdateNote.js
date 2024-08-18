import { useCallback } from 'react';

const url = process.env.API_URL || 'http://localhost';
const port = process.env.API_PORT || '3333';

const useUpdateNote = () => {
  const updateNote = useCallback(async (noteId, title, description, color) => {
    try {
      const response = await fetch(`${url}:${port}/api/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, color }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        if (typeof error === 'string') {
          return [error];
        } else {
          return error;
        }
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to submit note');
    }
  }, []);

  return { updateNote };
};

export default useUpdateNote;
