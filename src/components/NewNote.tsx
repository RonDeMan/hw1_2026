import { useContext, useState } from 'react'
import { notes_context } from '../contexts/notes_context'

function NewNote({setIsAddingNote}: {setIsAddingNote: (isAddingNote: boolean) => void}) {
  const notesContext = useContext(notes_context)
  const [content, setContent] = useState('')

  if (!notesContext) {
    throw new Error('Note must be used within notes_context.Provider')
  }

  const handleCancel = async () => {
    setIsAddingNote(false)
  }

  const handleSave = async () => {
    const createdNote = await notesContext.addNote({
      title: 'New Note',
      content,
        author: { name: 'Unknown', email: 'unknown@example.com' }
    })
    notesContext.dispatchNotes({ type: 'ADD_NOTE', payload: createdNote })
    setIsAddingNote(false)
  }


  return (
    <div className="note" data-testid={`0`}>
        <textarea data-testid={`text_input-0`} value={content} onChange={(event) => setContent(event.target.value)}></textarea>
        <button data-testid={`text_input_save-0`} onClick={handleSave}>Save</button>
        <button data-testid={`text_input_cancel-0`} onClick={handleCancel}>Cancel</button>
    </div>
  )
}

export default NewNote
