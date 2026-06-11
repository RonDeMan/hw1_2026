import { beforeAll, beforeEach, afterAll, describe, test, expect } from '@jest/globals'
import supertest from 'supertest'
import mongoose from 'mongoose'
import app from '../expressApp'
import { connectToDatabase } from '../config/mongo'
import { addNote } from '../models/notes_model'

const api = supertest(app)

beforeAll(async () => {
  await connectToDatabase()
})

describe('notes filter endpoints', () => {
  beforeEach(async () => {
    const Note = mongoose.model('Note')
    await Note.deleteMany({})
  })

  test('GET /notes/filter returns note with distinctive keyword', async () => {
    const keyword = 'SUPER_DISTINCTIVE_KEYWORD_FOR_FILTER_TEST'
    
    await addNote({
      title: 'Filter test note',
      content: `This note contains the ${keyword} inside it.`,
      author: { name: 'Test', email: 'test@example.com' }
    })

    const response = await api
      .get(`/notes/filter?query=${keyword}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(1)
    expect(response.body[0].content).toContain(keyword)
  })

  test('GET /notes/filter returns 400 when query is missing', async () => {
    await api
      .get('/notes/filter')
      .expect(400)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})