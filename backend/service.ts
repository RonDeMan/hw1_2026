import { Request, Response, NextFunction } from 'express';
import * as model from './models/notes_model.ts'
const fs = require('fs')
const logStream = fs.createWriteStream('log.txt', { flags: 'a' })

export const getNote = (id: string) => {
  return model.getNote(id)
}

export const requestLogger  = ( request: Request, response: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString()
  const { method, url, headers } = request
  const logEntry = `${timestamp} - ${method} ${url} ${request.body ? "- " + request.body.content : ''}\n`
  logStream.write(logEntry)
  next()
}

export const deleteNote = (id: string) => {
  return model.deleteNote(id)
}

export const addNote = (request: Request, response: Response) => {
  const body = request.body
  if (!body.content) {
    response.status(400).json({
      error: 'content missing'
    })
    return null
  }
  const note: model.NoteType = {
    title: body.title || 'Untitled Note',
    content: body.content,
    author: body.author || null
  }

  console.log(note)
  return model.addNote(note)
}

export const getNotes = (queryParams: any) => {
  const page = parseInt(queryParams._page) || 1
  const perPage = parseInt(queryParams._per_page) || 10
  const skip = (page - 1) * perPage
  return model.getNotes({ skip, limit: perPage })
}

export const getithNote = (index: number) => {
  return model.getithNote(index)
}

export const updateithNote = (index: number, noteData: model.NoteType) => {
  return model.updateithNote(index, noteData)
}

export const deleteithNote = (index: number) => {
  return model.deleteithNote(index)
}

export const updateNote = (id: string, noteData: model.NoteType) => {
  return model.updateNote(id, noteData)
}