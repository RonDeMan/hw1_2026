import { useContext, useState } from 'react'
import { notes_context } from '../contexts/notes_context'

export interface NoteData {
  _id: string 
  title: string
  content: string
  author: { name: string , email: string } | null
}

export type NewNoteData = Omit<NoteData, '_id'>

interface NoteProps {
  note: NoteData
}

function Note({ note }: NoteProps) {
  const notesContext = useContext(notes_context)
  const [isEditing, setIsEditing] = useState(false)

  if (!notesContext) {
    throw new Error('Note must be used within notes_context.Provider')
  }

  const { deleteNote, updateNote } = notesContext

  console.log('Rendering Note:', note)

  const handleDelete = async () => {
    await deleteNote(note._id)
  }

  const handleChangeEditStatus = async () => {
    setIsEditing(isEditing => !isEditing)
  }

  const handleSave = async () => {
    const textarea = document.querySelector(`textarea[data-testid="text_input-${note._id}"]`) as HTMLTextAreaElement
    if (textarea) {
      const updatedContent = textarea.value
      await updateNote({
        ...note,
        content: updatedContent,
      })
    }
    handleChangeEditStatus()
  }

  return (
    <div className="note" data-testid={`${note._id}`}>
      <h2>{note.title}</h2>
      {note.author && (
        <small>By {note.author.name}</small>
      )}
      <br />
      <p>{note.content}</p>
      <button data-testid={`delete-${note._id}`} onClick={handleDelete}>Delete</button>
      {!isEditing ? (
        <button data-testid={`edit-${note._id}`} onClick={handleChangeEditStatus}>Edit</button>
      ) : <div>
        <textarea data-testid={`text_input-${note._id}`}>{note.content}</textarea>
        <button data-testid={`text_input_save-${note._id}`} onClick={handleSave}>Save</button>
        <button data-testid={`text_input_cancel-${note._id}`} onClick={handleChangeEditStatus}>Cancel</button>
      </div>}
    </div>
  )
}

export default Note
