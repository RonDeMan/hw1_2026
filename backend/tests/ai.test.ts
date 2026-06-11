import { beforeAll, beforeEach, afterAll, describe, test, expect, jest } from '@jest/globals'
import supertest from 'supertest'
import mongoose from 'mongoose'
import app from '../expressApp'
import { connectToDatabase } from '../config/mongo'
import { addNote } from '../models/notes_model'
import User from '../models/user_model'

const api = supertest(app)

beforeAll(async () => {
  await connectToDatabase()
})

describe('ai complete endpoints', () => {
  let token: string

  beforeEach(async () => {
    const Note = mongoose.model('Note')
    await Note.deleteMany({})
    await User.deleteMany({})

    const newUser = {
      username: 'aiuser',
      name: 'AI User',
      password: 'password123'
    }
    await api.post('/users').send(newUser)
    const loginResponse = await api.post('/login').send({ username: 'aiuser', password: 'password123' })
    token = loginResponse.body.token
  })

  test('POST /ai/complete fetches note and returns keyword', async () => {    
    const keyword = 'SUPER_DISTINCTIVE_KEYWORD_FOR_AI_TEST'
    const searchKey = 'BANANA_SECRET'
    
    await addNote({
      title: 'AI Test Note',
      content: `The ${searchKey} password for the AI test is ${keyword}.`,
      author: { name: 'Test', email: 'test@example.com' }
    })

    const response = await api
      .post('/ai/complete')
      .set('Authorization', `Bearer ${token}`)
      .send({ prompt: `Search my notes for the keyword '${searchKey}' using the filter_notes tool and tell me what the password is.` })
      .expect(200)

    expect(response.body.text).toContain(keyword)
  }, 60000)
})

afterAll(async () => {
  await mongoose.connection.close()
})