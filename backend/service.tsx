import { Request, Response, NextFunction } from 'express';
const fs = require('fs')
const logStream = fs.createWriteStream('log.txt', { flags: 'a' })

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

export const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

export const getNote = (id: string) => {
  return notes.find(note => note.id === id)
}

export const requestLogger  = ( request: Request, response: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString()
  const { method, url, headers } = request
  const logEntry = `${timestamp} - ${method} ${url} ${request.body ? "- " + request.body.content : ''}\n`
  logStream.write(logEntry)
  next()
}

export const deleteNote = (id: string) => {
  notes = notes.filter(note => note.id !== id)
}

export const addNote = (request: Request, response: Response) => {
    const body = request.body
    const note = {
    content: body.content,
    important: body.important || false,
    id: generateId()
  }

  console.log(note)
  notes = notes.concat(note)
  return note
}

export const unknownEndpoint = (request: Request, response: Response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}