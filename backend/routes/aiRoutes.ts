import { Router } from 'express'
import { completeAi } from '../controllers/aiController'

const aiRouter = Router()

aiRouter.post('/complete', completeAi)

export default aiRouter
