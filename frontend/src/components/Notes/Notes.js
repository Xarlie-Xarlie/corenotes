import Note from './Note'

function Notes({ notes, onUpdateNote, onDeleteNote }) {
  const favoriteNotes = notes.filter((note) => note.favorite)
  const otherNotes = notes.filter((note) => !note.favorite)

  return (
    <div className='flex flex-col gap-8 mx-4 lg:mx-24 mt-10'>
      {favoriteNotes.length > 0 && (
        <div>
          <h2 className='mb-2 ml-6 font-normal text-xs'>Favoritas</h2>
          <ul className='flex flex-wrap gap-9'>
            {favoriteNotes.map((note) => (
              <li key={note.id} className='grow lg:grow-0'>
                <Note
                  note={note}
                  onUpdateNote={onUpdateNote}
                  onDeleteNote={onDeleteNote}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      {otherNotes.length > 0 && (
        <div>
          <h2 className='mb-2 ml-6 font-normal text-xs'>Outras</h2>
          <ul className='flex flex-wrap gap-9'>
            {otherNotes.map((note) => (
              <li key={note.id} className='grow lg:grow-0'>
                <Note
                  note={note}
                  onUpdateNote={onUpdateNote}
                  onDeleteNote={onDeleteNote}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Notes
