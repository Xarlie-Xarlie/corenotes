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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete note');
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to delete note');
    }
  }, []);

  return { deleteNote };
};

export default useDeleteNote;
