export interface NoteData {
  id: number
  title: string
  content: string
  author: string
}

interface NoteProps {
  note: NoteData
}

function Note({ note }: NoteProps) {
  return (
    <div className="note" id={`${note.id}`}>
      <h2>{note.title}</h2>
      <small>By {note.author}</small>
      <br />
      <p>{note.content}</p>
    </div>
  )
}

export default Note
