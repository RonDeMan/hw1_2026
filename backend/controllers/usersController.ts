import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import User from '../models/user_model'

export const createUser = async (request: Request, response: Response) => {
  const { username, name, email, password } = request.body

  if (!username || !password) {
    return response.status(400).json({ error: 'username and password are required' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    email,
    passwordHash,
  })

  try {
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    response.status(400).json({ error: 'expected `username` to be unique or other validation failed' })
  }
}
