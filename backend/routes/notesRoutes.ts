import { Router } from 'express'
import {
  createNote,
  deleteNoteById,
  deleteNoteByIndex,
  getNoteById,
  getNoteByIndex,
  getNotes,
  updateNoteById,
  updateNoteByIndex,
} from '../controllers/notesController'

const notesRouter = Router()

notesRouter.get('/', getNotes)
notesRouter.get('/:id', getNoteById)
notesRouter.delete('/:id', deleteNoteById)
notesRouter.post('/', createNote)
notesRouter.get('/by-index/:i', getNoteByIndex)
notesRouter.put('/by-index/:i', updateNoteByIndex)
notesRouter.delete('/by-index/:i', deleteNoteByIndex)
notesRouter.put('/:id', updateNoteById)

export default notesRouter