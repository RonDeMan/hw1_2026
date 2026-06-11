import { beforeAll, beforeEach, afterAll, describe, test, expect } from '@jest/globals'
import supertest from 'supertest'
import mongoose from 'mongoose'
import app from '../expressApp'
import User from '../models/user_model'
import { connectToDatabase } from '../config/mongo'

const api = supertest(app)

beforeAll(async () => {
  await connectToDatabase()
})

describe('auth endpoints', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('POST /users creates a new user', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'password123',
      email: 'test@example.com'
    }

    await api
      .post('/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await User.find({})
    expect(usersAtEnd).toHaveLength(1)
    expect(usersAtEnd[0].username).toBe('testuser')
  })

  test('POST /login returns a token', async () => {
    const newUser = {
      username: 'loginuser',
      name: 'Login User',
      password: 'password123'
    }

    await api.post('/users').send(newUser)

    const response = await api
      .post('/login')
      .send({ username: 'loginuser', password: 'password123' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.token).toBeDefined()
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})