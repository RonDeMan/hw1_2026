import cors from 'cors'
import express from 'express'
import { requestLogger } from './middlewares/requestLogger.ts'
import notesRouter from './routes/notesRoutes.ts'

const app = express()

app.use(cors({ exposedHeaders: ['X-Total-Count'] }))
app.use(express.json())
app.use(requestLogger)

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.use('/notes', notesRouter)

export default app