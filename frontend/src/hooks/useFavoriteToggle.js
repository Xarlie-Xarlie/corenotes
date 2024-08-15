import { useCallback } from 'react';

const url = process.env.API_URL || 'http://localhost'
const port = process.env.API_PORT || '3333'

const useFavoriteToggle = () => {
  const toggleFavorite = useCallback(async (noteId, favorite) => {
    try {
      const response = await fetch(`${url}:${port}/api/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ favorite: favorite })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit note');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to submit note');
    }
  }, []);

  return { toggleFavorite };
};

export default useFavoriteToggle;
