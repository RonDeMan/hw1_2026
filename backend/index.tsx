import { Request, Response, NextFunction } from 'express';
import * as service from './service.tsx'
const express = require('express')
const app = express()



// Middleware
app.use(express.json())
app.use(service.requestLogger)
app.use(service.unknownEndpoint)

// Routes
app.get('/', (request: Request, response: Response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes/:id', (request: Request, response: Response) => {
  const id = request.params.id.toString()
  const note = service.getNote(id)
  if (!note) {
    return response.status(404).end()
  }
  response.json(note)
})

app.delete('/api/notes/:id', (request: Request, response: Response) => {
  const id = request.params.id.toString()
  service.deleteNote(id)
  response.status(204).end()
})

app.post('/api/notes', (request: Request, response: Response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  response.json(service.addNote(request, response))
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
