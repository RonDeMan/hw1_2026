import { useCallback, useEffect, useState, useReducer, useRef } from 'react'
import './App.css'
import Note from './components/Note'
import type { NewNoteData, NoteData } from './components/Note'
import Pagination, { getPageNumbers } from './components/Pagination'
import axios from 'axios'
import { notes_context , initialNotes, addNoteRequest, deleteNoteRequest, updateNoteRequest} from './contexts/notes_context'
import { notesReducer } from './reducer_functions/notes_reducer'
import NewNote from './components/NewNote'

const API_URL = 'http://localhost:3001/notes'
const PAGE_SIZE = 10

const fetchPageData = async (page: number) => {
  const pageUrl = `${API_URL}?_page=${page}&_per_page=${PAGE_SIZE}`
  const response = await axios.get(pageUrl)
  if (!response.data) {
    throw new Error(`Failed to fetch: ${response.status}`)
  }

  const payload = response.data
  const rawNotes = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.notes)
    ? payload.notes
    : Array.isArray(payload?.data)
    ? payload.data
    : []

  if (!Array.isArray(rawNotes)) {
    throw new Error('Unexpected notes response format')
  }

  let totalCountValue = Number(response.headers['x-total-count'])
  if (!totalCountValue && typeof payload === 'object' && 'items' in payload) {
    totalCountValue = payload.items
  }
  if (!totalCountValue) {
    totalCountValue = rawNotes.length
  }
  const calculatedTotal = Math.max(1, Math.ceil(totalCountValue / PAGE_SIZE))
  
  return {
      rawNotes,
      calculatedTotal,
      hasCount: !!(response.headers['x-total-count'] || (typeof payload === 'object' && 'items' in payload))
  }
}

function App() {
  const [notes, dispatchNotes] = useReducer(notesReducer, initialNotes)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [notification, setNotification] = useState('Notification area')

  const cacheRef = useRef<Record<number, NoteData[]>>({})
  const fetchingRef = useRef<Record<number, boolean>>({})

  const clearCache = () => {
    cacheRef.current = {}
  }

  const loadPage = useCallback(async (page: number) => {
    setError(null)
    
    let currentTotalPages = totalPages

    // 1. Load current page
    if (cacheRef.current[page]) {
      dispatchNotes({ type: 'SET_NOTES', payload: cacheRef.current[page] })
      setLoading(false)
    } else {
      setLoading(true)
      try {
        const { rawNotes, calculatedTotal, hasCount } = await fetchPageData(page)
        cacheRef.current[page] = rawNotes
        
        let newTotal = totalPages
        if (hasCount) {
          newTotal = calculatedTotal
        }
        if (rawNotes.length > 0 && rawNotes.length < PAGE_SIZE) {
          newTotal = page
        } else if (rawNotes.length === 0 && page > 1) {
          newTotal = page - 1
          setCurrentPage(page - 1)
        }
        
        if (newTotal !== totalPages) {
          setTotalPages(newTotal)
          currentTotalPages = newTotal
        }
        
        // Ensure we're still on the requested page before dispatching (prevents race conditions)
        if (page === currentPage) {
           dispatchNotes({ type: 'SET_NOTES', payload: rawNotes })
        }
      } catch (err) {
        if (page === currentPage) setError((err as Error).message)
      } finally {
        if (page === currentPage) setLoading(false)
      }
    }

    // 2. Determine visible pages based on current logic
    const expectedPages = getPageNumbers(page, currentTotalPages)

    // 3. Prune cache
    Object.keys(cacheRef.current).forEach(key => {
      const p = Number(key)
      if (!expectedPages.includes(p)) {
        delete cacheRef.current[p]
      }
    })

    // 4. Fetch missing pages in background
    expectedPages.forEach(async (p) => {
      if (!cacheRef.current[p] && !fetchingRef.current[p]) {
        fetchingRef.current[p] = true
        try {
          const { rawNotes } = await fetchPageData(p)
          cacheRef.current[p] = rawNotes
        } catch (e) {
          console.error("Background fetch failed for page", p, e)
        } finally {
          fetchingRef.current[p] = false
        }
      }
    })

  }, [currentPage, totalPages])

  // Load page when currentPage changes
  useEffect(() => {
      loadPage(currentPage)
  }, [currentPage, loadPage])

  const changeTo = (page: number) => {
    setCurrentPage(page)
  }

  const deleteNote = async (noteId: string) => {
    await deleteNoteRequest(noteId)
    dispatchNotes({ type: 'REMOVE_NOTE', payload: noteId })
    setNotification(`Deleted note ${noteId}`)
    clearCache()
    loadPage(currentPage)
  }

  const updateNote = async (note: NoteData) => {
    await updateNoteRequest(note)
    dispatchNotes({ type: 'UPDATE_NOTE', payload: note })
    setNotification(`Updated note ${note._id}`)
    clearCache()
  }

  const addNote = async (note: NewNoteData) => {
    const createdNote = await addNoteRequest(note)
    dispatchNotes({ type: 'ADD_NOTE', payload: createdNote })
    setNotification(`Added note ${createdNote._id || 'new note'}`)
    clearCache()
    return createdNote
  }

  return (
    <notes_context.Provider value={{ notes, dispatchNotes, deleteNote, updateNote, addNote }}>
    <main className="app-container">
      <header>
        <h1>Notes with Pagination</h1>
        <p>Server data is loaded per page (10 notes per page).</p>
      </header>
      <div className="notification-area" aria-live="polite">
        <h3>{notification}</h3>
      </div>
      <button onClick={() => setIsAddingNote(true)}>Add New Note</button>
      {isAddingNote && (
        <NewNote setIsAddingNote={setIsAddingNote} />
      )}
      <section className="list-area">
        {loading && <p>Loading notes…</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && notes.length === 0 && <p>No notes found.</p>}

        {notes.map((note) => (
          <Note key={note._id} note={note} />
        ))}
      </section>

      <Pagination currentPage={currentPage} totalPages={totalPages} onChange={changeTo} />

      <footer>
        <small>
          Showing page {currentPage} of {totalPages} ({PAGE_SIZE} notes per page)
        </small>
      </footer>
    </main>
     </notes_context.Provider>
  )
}

export default App
