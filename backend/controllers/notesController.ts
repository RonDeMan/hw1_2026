import { Request, Response } from 'express'
import * as notesService from '../services/notesService'
import { UserRequest } from '../middlewares/authMiddleware'

export const getNotes = async (request: Request, response: Response) => {
  const queryParams = request.query
  const [notes, totalCount] = await notesService.getNotes(queryParams)
  response.set('X-Total-Count', String(totalCount))
  response.json(notes)
}

export const getNoteById = async (request: Request, response: Response) => {
  const id = request.params.id.toString()
  const note = await notesService.getNote(id)
  if (!note) {
    return response.status(404).end()
  }
  response.json(note)
}

export const deleteNoteById = async (request: Request, response: Response) => {
  const userReq = request as UserRequest
  if (!userReq.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const id = request.params.id.toString()
  await notesService.deleteNote(id)
  response.status(204).end()
}

export const createNote = async (request: Request, response: Response) => {
  const userReq = request as UserRequest
  if (!userReq.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing',
    })
  }

  body.author = { name: userReq.user.name, email: userReq.user.email }
  body.user = userReq.user._id

  response.json(await notesService.addNote(body))
}

export const getNoteByIndex = async (request: Request, response: Response) => {
  const index = parseInt(String(request.params.i))
  const note = await notesService.getithNote(index)
  if (!note) {
    return response.status(404).end()
  }
  response.json(note)
}

export const updateNoteByIndex = async (request: Request, response: Response) => {
  const userReq = request as UserRequest
  if (!userReq.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const index = parseInt(String(request.params.i))
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing',
    })
  }

  const updatedNote = await notesService.updateithNote(index, body)
  if (!updatedNote) {
    return response.status(404).end()
  }
  response.json(updatedNote)
}

export const deleteNoteByIndex = async (request: Request, response: Response) => {
  const userReq = request as UserRequest
  if (!userReq.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const index = parseInt(String(request.params.i))
  const deletedNote = await notesService.deleteithNote(index)
  if (!deletedNote) {
    return response.status(404).end()
  }
  response.status(204).end()
}

export const updateNoteById = async (request: Request, response: Response) => {
  const userReq = request as UserRequest
  if (!userReq.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const id = request.params.id.toString()
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing',
    })
  }

  const updatedNote = await notesService.updateNote(id, body)
  if (!updatedNote) {
    return response.status(404).end()
  }
  response.json(updatedNote)
}