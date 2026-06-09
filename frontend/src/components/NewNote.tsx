import { useContext, useState } from 'react'
import { notes_context } from '../contexts/notes_context'
import { AuthContext } from '../contexts/AuthContext'

function NewNote({setIsAddingNote}: {setIsAddingNote: (isAddingNote: boolean) => void}) {
  const notesContext = useContext(notes_context)
  const authContext = useContext(AuthContext)
  const [content, setContent] = useState('')
  const [showAIPrompt, setShowAIPrompt] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')

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
        author: { name: authContext?.user?.name || 'Unknown', email: authContext?.user?.email || 'unknown@example.com' }
    })
    setIsAddingNote(false)
  }

  const handleAIAssist = async () => {
    if (!aiPrompt) return;

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (authContext?.user?.token) {
        headers['Authorization'] = `Bearer ${authContext.user.token}`
      }

      const response = await fetch('http://localhost:3001/ai/complete', {
        method: 'POST',
        headers,
        body: JSON.stringify({ prompt: aiPrompt })
      });
      if (!response.ok) {
        throw new Error(`AI request failed: ${response.status}`);
      }
      const data = await response.json();
      if (data.text) {
        setContent(prev => prev + (prev ? '\\n' : '') + data.text);
      }
      setShowAIPrompt(false);
      setAiPrompt('');
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
        <button data-testid="help_me_write" onClick={() => setShowAIPrompt(!showAIPrompt)} style={{ marginLeft: '10px' }} title="AI Assistant">★</button>

        {showAIPrompt && (
          <div style={{ marginTop: '10px' }}>
            <input 
              type="text" 
              data-testid="help_me_write_prompt" 
              value={aiPrompt} 
              onChange={(e) => setAiPrompt(e.target.value)} 
              placeholder="What do you want the AI to write?" 
            />
            <button data-testid="help_me_write_submit" onClick={handleAIAssist}>Generate</button>
          </div>
        )}
    </div>
  )
}

export default NewNote
