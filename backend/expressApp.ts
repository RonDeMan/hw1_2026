import cors from 'cors'
import express from 'express'
import { requestLogger } from './middlewares/requestLogger'
import { tokenExtractor, userExtractor } from './middlewares/authMiddleware'
import notesRouter from './routes/notesRoutes'
import aiRouter from './routes/aiRoutes'
import usersRouter from './routes/usersRoutes'
import loginRouter from './routes/loginRoutes'

const app = express()

app.use(cors({ exposedHeaders: ['X-Total-Count'] }))
app.use(express.json())
app.use(requestLogger)
app.use(tokenExtractor)
app.use(userExtractor)

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.use('/notes', notesRouter)
app.use('/ai', aiRouter)
app.use('/users', usersRouter)
app.use('/login', loginRouter)

export default app