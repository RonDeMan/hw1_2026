import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user_model'

export interface UserRequest extends Request {
  user?: any
}

export const tokenExtractor = (request: Request, response: Response, next: NextFunction) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    (request as any).token = authorization.replace('Bearer ', '')
  }
  next()
}

export const userExtractor = async (request: Request, response: Response, next: NextFunction) => {
  const token = (request as any).token
  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET || 'secret') as jwt.JwtPayload
      if (decodedToken.id) {
        (request as UserRequest).user = await User.findById(decodedToken.id)
      }
    } catch (error) {
      // invalid token
    }
  }
  next()
}