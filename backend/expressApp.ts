import cors from 'cors'
import express from 'express'
import { requestLogger } from './middlewares/requestLogger'
import notesRouter from './routes/notesRoutes'
import aiRouter from './routes/aiRoutes'

const app = express()

app.use(cors({ exposedHeaders: ['X-Total-Count'] }))
app.use(express.json())
app.use(requestLogger)

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.use('/notes', notesRouter)
app.use('/ai', aiRouter)

export default app