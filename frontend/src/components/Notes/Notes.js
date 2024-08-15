import Note from './Note';

function Notes({ notes }) {
  const favoriteNotes = notes.filter(note => note.favorite);
  const otherNotes = notes.filter(note => !note.favorite);

  return (
    <div>
      {favoriteNotes.length > 0 && (
        <>
          <h2>Favoritas</h2>
          <ul className="flex">
            {favoriteNotes.map(note => (
              <li key={note.id}>
                <Note note={note} />
              </li>
            ))}
          </ul>
        </>
      )}
      {otherNotes.length > 0 && (
        <>
          <h2>Outras</h2>
          <ul className="flex">
            {otherNotes.map(note => (
              <li key={note.id}>
                <Note note={note} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Notes;
