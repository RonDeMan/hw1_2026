export interface NoteData {
  _id: string
  title: string
  content: string
  author: { name: string , email: string } | null
}

interface NoteProps {
  note: NoteData
}

function Note({ note }: NoteProps) {
  console.log('Rendering Note:', note)
  return (
    <div className="note" data-testid={`${note._id}`}>
      <h2>{note.title}</h2>
      {note.author && (
        <small>By {note.author.name}</small>
      )}
      <br />
      <p>{note.content}</p>
      <button data-testid={`delete-${note._id}`}>Delete</button>
      <button data-testid={`edit-${note._id}`}>Edit</button>
    </div>
  )
}

export default Note
