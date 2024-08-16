import Note from './Note';

function Notes({ notes, onFavoriteToggle, onDeleteNote }) {
  const favoriteNotes = notes.filter(note => note.favorite);
  const otherNotes = notes.filter(note => !note.favorite);

  return (
    <div className="flex flex-col gap-8 ml-28 mt-10">
      {favoriteNotes.length > 0 && (
        <div>
          <h2 className="mb-2 ml-6 font-normal text-xs">Favoritas</h2>
          <ul className="flex flex-wrap gap-9">
            {favoriteNotes.map(note => (
              <li key={note.id}>
                <Note
                  note={note}
                  onFavoriteToggle={onFavoriteToggle}
                  onDeleteNote={onDeleteNote}
                />
              </li>
            ))}
          </ul>
        </div >
      )}
      {otherNotes.length > 0 && (
        <div>
          <h2 className="mb-2 ml-6 font-normal text-xs">Outras</h2>
          <ul className="flex flex-wrap gap-9">
            {otherNotes.map(note => (
              <li key={note.id}>
                <Note
                  note={note}
                  onFavoriteToggle={onFavoriteToggle}
                  onDeleteNote={onDeleteNote}
                />
              </li>
            ))}
          </ul>
        </div >
      )}
    </div >
  );
}

export default Notes;
