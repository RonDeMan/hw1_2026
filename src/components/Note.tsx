export interface NoteData {
  id: number
  title: string
  content: string
  author: { name: string , email: string } | null
}

interface NoteProps {
  note: NoteData
}

function Note({ note }: NoteProps) {
  return (
    <div className="note" id={`${note.id}`}>
      <h2>{note.title}</h2>
      {note.author && (
        <small>By {note.author.name}</small>
      )}
      <br />
      <p>{note.content}</p>
    </div>
  )
}

export default Note
