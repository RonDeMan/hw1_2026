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
    await notesContext.addNote({
      title: 'New Note',
      content,
        author: { name: 'Unknown', email: 'unknown@example.com' }
    })
    setIsAddingNote(false)
  }

  const handleAIAssist = async () => {
    const promptText = window.prompt("What do you want the AI to write?");
    if (!promptText) return;
    
    try {
      const response = await fetch('http://localhost:3001/ai/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      });
      if (!response.ok) {
        throw new Error(`AI request failed: ${response.status}`);
      }
      const data = await response.json();
      if (data.text) {
        setContent(prev => prev + (prev ? '\\n' : '') + data.text);
      }
    } catch (err) {
      console.error("AI assistant failed", err);
      alert("Failed to get AI completion.");
    }
  }

  return (
    <div className="note" data-testid={`0`}>
        <textarea data-testid={`text_input-0`} value={content} onChange={(event) => setContent(event.target.value)}></textarea>
        <button data-testid={`text_input_save-0`} onClick={handleSave}>Save</button>
        <button data-testid={`text_input_cancel-0`} onClick={handleCancel}>Cancel</button>
        <button onClick={handleAIAssist} style={{ marginLeft: '10px' }} title="AI Assistant">★</button>
    </div>
  )
}

export default NewNote
