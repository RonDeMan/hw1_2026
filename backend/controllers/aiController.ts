import { Request, Response } from 'express'
import { runAgent } from '../services/agentService'
import { UserRequest } from '../middlewares/authMiddleware'

export const completeAi = async (request: Request, response: Response) => {
  const userReq = request as UserRequest
  if (!userReq.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const { prompt } = request.body

  if (!prompt || typeof prompt !== 'string') {
    return response.status(400).json({ error: 'invalid body' })
  }

  try {
    const result = await runAgent({ prompt })
    response.json(result)
  } catch (err: any) {
    if (err.status) {
      return response.status(err.status).json({ error: err.message })
    }
    console.error('Agent error:', err)
    response.status(500).json({ error: 'Internal server error' })
  }
}

