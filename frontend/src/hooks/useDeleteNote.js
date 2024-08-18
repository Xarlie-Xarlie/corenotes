import { useCallback } from 'react';

const url = process.env.API_URL || 'http://localhost'
const port = process.env.API_PORT || '3333'

const useDeleteNote = () => {
  const deleteNote = useCallback(async (noteId) => {
    try {
      const response = await fetch(`${url}:${port}/api/notes/${noteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const { error } = await response.json();
        return error;
      }
      return null;
    } catch (error) {
      throw new Error(error.message || 'Failed to delete note');
    }
  }, []);

  return { deleteNote };
};

export default useDeleteNote;
