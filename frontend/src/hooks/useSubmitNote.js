const useSubmitNote = () => {
  const url = process.env.API_URL || 'http://localhost'
  const port = process.env.API_PORT || '3333'
  const submitNote = async ({ title, description, favorite }) => {
    try {
      const response = await fetch(`${url}:${port}/api/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, favorite }),
      })
      const result = await response.json()

      if (result.errors) {
        return result
      } else if (!response.ok) {
        throw new Error('Failed to submit the note')
      }
      return result
    } catch (err) {
      throw err
    }
  }

  return { submitNote }
}

export default useSubmitNote
