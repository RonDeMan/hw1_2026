import { Request, Response } from 'express'
import * as notesService from '../services/notesService'

export const filterNotes = async (request: Request, response: Response) => {
  const query = request.query.query as string

  if (!query) {
    return response.status(400).json({ error: 'query is missing' })
  }

  try {
    const notes = await notesService.filterNotes(query)
    response.set('X-Total-Count', String(notes.length))
    response.json(notes)
  } catch (err) {
    response.status(500).json({ error: 'Internal server error' })
  }
}
