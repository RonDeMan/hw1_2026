import { useCallback, useEffect, useState, useRef } from 'react'
import './App.css'
import Note from './components/Note'
import type { NoteData } from './components/Note'
import Pagination from './components/Pagination'

const API_URL = 'http://localhost:3001/notes'
const PAGE_SIZE = 10

function App() {
  const [notes, setNotes] = useState<NoteData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPage = useCallback(async (page: number) => {
    setLoading(true)
    setError(null)

    try {
      const pageUrl = `${API_URL}?_page=${page}&_per_page=${PAGE_SIZE}`
      const response = await fetch(pageUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`)
      }

      const payload = await response.json()
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

      let totalCountValue = Number(response.headers.get('X-Total-Count'))
      if (!totalCountValue && typeof payload === 'object' && 'items' in payload) {
        totalCountValue = payload.items
      }
      if (!totalCountValue) {
        totalCountValue = rawNotes.length
      }
      const calculatedTotal = Math.max(1, Math.ceil(totalCountValue / PAGE_SIZE))

      setNotes(rawNotes)

      // Only update totalPages if we have a reliable count from header or items
      if (response.headers.get('X-Total-Count') || (typeof payload === 'object' && 'items' in payload)) {
        setTotalPages(calculatedTotal)
      }

      // Adjust totalPages based on actual data received
      if (rawNotes.length > 0 && rawNotes.length < PAGE_SIZE) {
        setTotalPages(page)
      } else if (rawNotes.length === 0 && page > 1) {
        setTotalPages(page - 1)
        setCurrentPage(page - 1)
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [PAGE_SIZE])



  // Load page when currentPage changes
  useEffect(() => {
      loadPage(currentPage)
    
  }, [currentPage, loadPage])

  const changeTo = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <main className="app-container">
      <header>
        <h1>Notes with Pagination</h1>
        <p>Server data is loaded per page from JSON Server (10 notes per page).</p>
      </header>

      <section className="list-area">
        {loading && <p>Loading notes…</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && notes.length === 0 && <p>No notes found.</p>}

        {notes.map((note) => (
          <Note key={note.id} note={note} />
        ))}
      </section>

      <Pagination currentPage={currentPage} totalPages={totalPages} onChange={changeTo} />

      <footer>
        <small>
          Showing page {currentPage} of {totalPages} ({PAGE_SIZE} notes per page)
        </small>
      </footer>
    </main>
  )
}

export default App
