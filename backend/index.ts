import { Request, Response, NextFunction } from 'express';
const mongoose: typeof import('mongoose') = require('mongoose')
import cors from 'cors'
import * as service from './service.ts'
import dotenv from 'dotenv'
const express = require('express')
const app = express()

const PORT = 3001

const connectToDatabase = async () => {
  dotenv.config()
  if (!process.env.MONGODB_CONNECTION_URL) {
    console.error('MONGODB_CONNECTION_URL environment variable is not set')
    process.exit(1)
  }
  const url = process.env.MONGODB_CONNECTION_URL
  mongoose.set('strictQuery',false)
  mongoose.connect(url, { family: 4 })

}


// Middleware
app.use(cors({ exposedHeaders: ['X-Total-Count'] }))
app.use(express.json())
app.use(service.requestLogger)

// Routes
app.get('/', (request: Request, response: Response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/notes', async (request: Request, response: Response) => {
  const queryParams = request.query
  const [notes, totalCount] = await service.getNotes(queryParams)
  response.set('X-Total-Count', String(totalCount))
  response.json(notes)
})

app.get('/notes/:id', async (request: Request, response: Response) => {
  const id = request.params.id.toString()
  const note = await service.getNote(id)
  if (!note) {
    return response.status(404).end()
  }
  response.json(note)
})

app.delete('/notes/:id', async (request: Request, response: Response) => {
  const id = request.params.id.toString()
  await service.deleteNote(id)
  response.status(204).end()
})

app.post('/notes', async (request: Request, response: Response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  response.json(await service.addNote(request, response))
})

app.get('/notes/by-index/:i', async (request: Request, response: Response) => {
  const index = parseInt(String(request.params.i))
  const note = await service.getithNote(index)
  if (!note) {
    return response.status(404).end()
  }
  response.json(note)
})

app.put('/notes/by-index/:i', async (request: Request, response: Response) => {
  const index = parseInt(String(request.params.i))
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }
  
  const updatedNote = await service.updateithNote(index, body)
  if (!updatedNote) {
    return response.status(404).end()
  }
  response.json(updatedNote)
})

app.delete('/notes/by-index/:i', async (request: Request, response: Response) => {
  const index = parseInt(String(request.params.i))
  const deletedNote = await service.deleteithNote(index)
  if (!deletedNote) {
    return response.status(404).end()
  }
  response.status(204).end()
})

app.put('/notes/:id', async (request: Request, response: Response) => {
  const id = request.params.id.toString()
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }
  
  const updatedNote = await service.updateNote(id, body)
  if (!updatedNote) {
    return response.status(404).end()
  }
  response.json(updatedNote)
})


const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
